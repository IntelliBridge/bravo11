package main

import (
	"bytes"
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"github.com/cenkalti/backoff/v4"
	"github.com/dustin/go-humanize"
	"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/esapi"
	"github.com/elastic/go-elasticsearch/v8/esutil"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync/atomic"
	"time"
)

func CreateClient(clusterURLs []string, username string, password string) *elasticsearch.Client {
	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	//
	// Use a third-party package for implementing the backoff function
	//
	retryBackoff := backoff.NewExponentialBackOff()
	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	//
	// Create the Elasticsearch client
	//
	// NOTE: For optimal performance, consider using a third-party HTTP transport package.
	//       See an example in the "benchmarks" folder.
	//
	es, err := elasticsearch.NewClient(elasticsearch.Config{
		Addresses: clusterURLs,
		Username:  username,
		Password:  password,
		// Retry on 429 TooManyRequests statuses
		//
		RetryOnStatus: []int{502, 503, 504, 429},

		// Configure the backoff function
		//
		RetryBackoff: func(i int) time.Duration {
			if i == 1 {
				retryBackoff.Reset()
			}
			return retryBackoff.NextBackOff()
		},

		// Retry up to 5 attempts
		//
		MaxRetries: 5,
	})
	if err != nil {
		log.Fatalf("Error creating the client: %s", err)
	}
	return es
}

func InsertCSVDataToElastic(es *elasticsearch.Client, indexName string, mapping string, inputFolder string) {
	items, err := os.ReadDir(inputFolder)
	if err != nil {
		log.Println(err)
		return
	}
	dataset := make([]interface{}, 0)
	for _, item := range items {
		if !item.IsDir() {
			info, err := item.Info()
			if err != nil {
				log.Fatal(err)
			}
			log.Println(info.Name())
			data := ConvertGdeltCsvToJson(filepath.Join(inputFolder, info.Name()))
			dataset = append(dataset, data...)
		}
	}
	InsertDataToElastic(es, indexName, mapping, dataset)
}

func InsertDataToElastic(es *elasticsearch.Client, indexName string, mapping string, articles []interface{}) {
	var (
		res             *esapi.Response
		err             error
		countSuccessful uint64
	)

	//Create BulkIndexer
	bi, err := esutil.NewBulkIndexer(esutil.BulkIndexerConfig{
		Index:         indexName,        // The default index name
		Client:        es,               // The Elasticsearch client
		NumWorkers:    numWorkers,       // The number of worker goroutines
		FlushBytes:    int(flushBytes),  // The flush threshold in bytes
		FlushInterval: 30 * time.Second, // The periodic flush interval
	})
	if err != nil {
		log.Fatalf("Error creating the indexer: %s", err)
	}
	// Re-create the index
	//
	if res, err = es.Indices.Delete([]string{indexName}, es.Indices.Delete.WithIgnoreUnavailable(true)); err != nil || res.IsError() {
		log.Fatalf("Cannot delete index: %s", err)
	}
	res.Body.Close()
	res, err = es.Indices.Create(indexName)
	if err != nil {
		log.Fatalf("Cannot create index: %s", err)
	}
	if res.IsError() {
		log.Fatalf("Cannot create index: %s", res)
	}
	res.Body.Close()

	if mapping != "" {
		res, err = es.Indices.PutMapping([]string{indexName}, strings.NewReader(mapping))
		if err != nil {
			log.Fatalf("Cannot update mapping: %s", err)
		}
		if res.IsError() {
			log.Fatalf("Cannot update mapping: %s", res)
		}
		res.Body.Close()
	}

	start := time.Now().UTC()

	// Loop over the collection
	//
	for _, a := range articles {
		// Prepare the data payload: encode article to JSON
		//
		data, err := json.Marshal(a)
		if err != nil {
			log.Fatalf("Cannot encode article: %s", err)
		}

		// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		//
		// Add an item to the BulkIndexer
		//
		err = bi.Add(
			context.Background(),
			esutil.BulkIndexerItem{
				// Action field configures the operation to perform (index, create, delete, update)
				Action: "index",

				// DocumentID is the (optional) document GetID
				//DocumentID: strconv.Itoa(a.GetID()),

				// Body is an `io.Reader` with the payload
				Body: bytes.NewReader(data),

				// OnSuccess is called for each successful operation
				OnSuccess: func(ctx context.Context, item esutil.BulkIndexerItem, res esutil.BulkIndexerResponseItem) {
					atomic.AddUint64(&countSuccessful, 1)
				},

				// OnFailure is called for each failed operation
				OnFailure: func(ctx context.Context, item esutil.BulkIndexerItem, res esutil.BulkIndexerResponseItem, err error) {
					if err != nil {
						log.Printf("ERROR: %s", err)
					} else {
						log.Printf("ERROR: %s: %s", res.Error.Type, res.Error.Reason)
					}
				},
			},
		)
		if err != nil {
			log.Fatalf("Unexpected error: %s", err)
		}
		// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	}

	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	// Close the indexer
	//
	if err := bi.Close(context.Background()); err != nil {
		log.Fatalf("Unexpected error: %s", err)
	}
	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	biStats := bi.Stats()

	// Report the results: number of indexed docs, number of errors, duration, indexing rate
	//
	log.Println(strings.Repeat("▔", 65))

	dur := time.Since(start)

	if biStats.NumFailed > 0 {
		log.Fatalf(
			"Indexed [%s] documents with [%s] errors in %s (%s docs/sec)",
			humanize.Comma(int64(biStats.NumFlushed)),
			humanize.Comma(int64(biStats.NumFailed)),
			dur.Truncate(time.Millisecond),
			humanize.Comma(int64(1000.0/float64(dur/time.Millisecond)*float64(biStats.NumFlushed))),
		)
	} else {
		log.Printf(
			"Sucessfuly indexed [%s] documents in %s (%s docs/sec)",
			humanize.Comma(int64(biStats.NumFlushed)),
			dur.Truncate(time.Millisecond),
			humanize.Comma(int64(1000.0/float64(dur/time.Millisecond)*float64(biStats.NumFlushed))),
		)
	}
}

func AddHeaderForAllCSVsEntireFolder(inputFolder string, outputFolder string, header []string) {
	items, err := os.ReadDir(inputFolder)
	if err != nil {
		log.Fatal(err)
	}
	for _, item := range items {
		if !item.IsDir() {
			info, err := item.Info()
			if err != nil {
				log.Fatal(err)
			}
			log.Println(info.Name())
			AddHeaderToCsv(filepath.Join(inputFolder, info.Name()), filepath.Join(outputFolder, info.Name()), header)
		}
	}
}
func AddHeaderToCsv(inputFilePath string, outputFilePath string, header []string) {
	file, err := os.Open(inputFilePath)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.FieldsPerRecord = -1
	reader.Comma = '\t'
	data, err := reader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}
	for i, row := range data {
		fmt.Printf("%d: ", i)
		for _, col := range row {
			fmt.Printf("%s, ", col)
		}
		fmt.Println()
	}

	file2, err := os.Create(outputFilePath)
	if err != nil {
		panic(err)
	}
	defer file2.Close()

	writer := csv.NewWriter(file2)
	defer writer.Flush()
	writer.Write(header)
	for _, row := range data {
		writer.Write(row)
	}
}

func ConvertGdeltCsvToJson(csvFilePath string) []interface{} {
	layout := "2006-01-02 15:04:05" // Defines the format
	csvFile, err := os.Open(csvFilePath)
	if err != nil {
		fmt.Println(err)
	}
	defer csvFile.Close()

	reader := csv.NewReader(csvFile)
	csvData, err := reader.ReadAll()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	data := make([]interface{}, 0)

	for _, eachRow := range csvData[1:] {
		row := make(map[string]interface{})

		var actionLocation *GeoLocation
		var actor1Location *GeoLocation
		var actor2Location *GeoLocation
		var location *GeoLocation
		for i, header := range csvData[0] {
			switch header {
			case "LAT":
				location = &GeoLocation{
					Lat: eachRow[i],
				}
			case "LON":
				location.Lon = eachRow[i]
			case "latitude":
				location = &GeoLocation{
					Lat: eachRow[i],
				}
			case "longitude":
				location.Lon = eachRow[i]
			case "Actor1Geo_Lat":
				actor1Location = &GeoLocation{
					Lat: eachRow[i],
				}
			case "Actor1Geo_Long":
				actor1Location.Lon = eachRow[i]
			case "Actor2Geo_Lat":
				actor2Location = &GeoLocation{
					Lat: eachRow[i],
				}
			case "Actor2Geo_Long":
				actor2Location.Lon = eachRow[i]
			case "ActionGeo_Lat":
				actionLocation = &GeoLocation{
					Lat: eachRow[i],
				}
			case "ActionGeo_Long":
				actionLocation.Lon = eachRow[i]
			case "ACCESS_START", "ACCESS_END":
				// Parse the time in UTC
				parsedTime, err := time.ParseInLocation(layout, eachRow[i], time.UTC)
				if err != nil {
					continue
				}
				row[header] = parsedTime.AddDate(0, 11, 0)
			case "timestamp":
				epochInt, err := strconv.ParseInt(eachRow[i], 10, 64)
				if err != nil {
					log.Println("Error converting string to int64:", err)
					continue
				}

				// Convert int64 to time.Time
				t := time.Unix(epochInt, 0) // The second argument is nanoseconds, set to 0
				row[header] = t
			default:
				row[header] = eachRow[i]
			}
		}
		if location != nil && location.isValid() {
			row["Lat_Lon"] = location.ToGeoPointStr()
		}
		if actionLocation != nil && actionLocation.isValid() {
			row["ActionGeo_Location"] = actionLocation.ToGeoPointStr()
		}
		if actor1Location != nil && actor1Location.isValid() {
			row["Actor1Geo_Location"] = actor1Location.ToGeoPointStr()
		}
		if actor2Location != nil && actor2Location.isValid() {
			row["Actor2Geo_Location"] = actor2Location.ToGeoPointStr()
		}
		data = append(data, row)
	}
	return data
}
