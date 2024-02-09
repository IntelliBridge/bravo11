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
	"io"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync/atomic"
	"time"
	"unicode"
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

func ResetDataForElasticIndex(es *elasticsearch.Client, sourceType SourceType, indexName string, mapping string, inputFolder string) {
	InsertCSVDataToElastic(es, sourceType, indexName, mapping, inputFolder, false)
}

func AppendDataForElasticIndex(es *elasticsearch.Client, sourceType SourceType, indexName string, inputFolder string) {
	InsertCSVDataToElastic(es, sourceType, indexName, "", inputFolder, true)
}

func InsertCSVDataToElastic(es *elasticsearch.Client, sourceType SourceType, indexName string, mapping string, inputFolder string, appendMode bool) {
	items, err := os.ReadDir(inputFolder)
	if err != nil {
		log.Println(err)
	}
	dataset := make([]interface{}, 0)
	itemsToMatch := make(map[string]bool)

	if sourceType == SourceTypeAIS && len(items) > 0 {
		csvFile, err := os.Open(filepath.Join(inputFolder, items[0].Name()))
		if err != nil {
			fmt.Println(err)
		}

		reader := csv.NewReader(csvFile)
		reader.FieldsPerRecord = -1
		reader.LazyQuotes = true

		for {
			r, err := reader.Read()
			if err == io.EOF {
				break
			}
			if len(itemsToMatch) < 5000 {
				itemsToMatch[r[0]] = true
			} else {
				break
			}
		}
		csvFile.Close()
	}
	for _, item := range items {
		if !item.IsDir() {
			info, err := item.Info()
			if err != nil {
				log.Fatal(err)
			}
			log.Println(info.Name())
			rawData := ConvertCsvToJson(filepath.Join(inputFolder, info.Name()), sourceType, itemsToMatch)
			dataset = append(dataset, rawData...)
		}
	}

	if len(dataset) != 0 {
		InsertDataToElastic(es, indexName, mapping, dataset, appendMode)
	}
}

func InsertDataToElastic(es *elasticsearch.Client, indexName string, mapping string, articles []interface{}, appendMode bool) {
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

	if !appendMode {
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

func ConvertCsvToJson(csvFilePath string, sourceType SourceType, itemsToMatch map[string]bool) []interface{} {
	csvFile, err := os.Open(csvFilePath)
	if err != nil {
		fmt.Println(err)
	}
	defer csvFile.Close()

	reader := csv.NewReader(csvFile)
	reader.FieldsPerRecord = -1
	reader.LazyQuotes = true
	data := make([]interface{}, 0)

	headers, err := reader.Read()
	if err == io.EOF {
		return nil
	}
	for {
		r, err := reader.Read()
		if err == io.EOF {
			break
		}
		if sourceType == SourceTypeAIS {
			if _, exist := itemsToMatch[r[0]]; !exist {
				continue
			}
		}

		row := make(map[string]string)

		for i, header := range headers {
			row[header] = r[i]
		}

		var raw map[string]interface{}
		switch sourceType {
		case SourceTypeSatelliteAccess:
			raw = transformSatelliteDataToAsset(row)
		case SourceTypeADSB:
			raw = transformADSBData(row)
		case SourceTypeACLED:
			raw = transformAcledData(row)
		case SourceTypeGDELTExport:
			raw = transformGdeltExportData(row)
		case SourceTypeAIS:
			raw = transformAISDataToAsset(row)
		case SourceTypeBAS:
			raw = transformBASDataToAsset(row)
		default:
			raw = make(map[string]interface{})
			for k, v := range row {
				raw[k] = v
			}
		}
		//transform all row header to lower case and snake case
		if raw != nil {
			newMap := make(map[string]interface{})
			for k, v := range raw {
				fieldName := formatFieldName(k)
				newMap[fieldName] = v
			}
			data = append(data, newMap)
		}
	}

	//if ADSB data, we only have one day worth of data, copy and expand data to 30 days
	if sourceType == SourceTypeADSB {
		additionalData := make([]interface{}, 0)
		for i := 1; i < 30; i++ {
			for _, d := range data {
				row := d.(map[string]interface{})
				newData := make(map[string]interface{})
				for k, v := range row {
					newData[k] = v
				}
				t := newData["timestamp"].(time.Time)
				newData["timestamp"] = t.AddDate(0, 0, i)
				additionalData = append(additionalData, newData)
			}
		}
		data = append(data, additionalData...)
	}
	return data
}

func formatFieldName(input string) string {
	formattedString := strings.ReplaceAll(input, " ", "_")
	formattedString = strings.ReplaceAll(formattedString, "-", "_")
	r := []rune(formattedString)
	r[0] = unicode.ToLower(r[0])
	return string(r)
}

func transformGdeltExportData(data map[string]string) map[string]interface{} {
	var location *Location
	output := make(map[string]interface{})
	for k, v := range data {
		output[k] = v
	}

	latStr, ok1 := data["Actor1Geo_Lat"]
	lonStr, ok2 := data["Actor1Geo_Long"]
	if ok1 && ok2 && latStr != "" && lonStr != "" {
		lat, err := strconv.ParseFloat(latStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		lon, err := strconv.ParseFloat(lonStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		location = &Location{
			Lat: lat,
			Lon: lon,
		}
		output["actor1_location"] = location
	}

	latStr, ok1 = data["Actor2Geo_Lat"]
	lonStr, ok2 = data["Actor2Geo_Long"]
	if ok1 && ok2 && latStr != "" && lonStr != "" {
		lat, err := strconv.ParseFloat(latStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		lon, err := strconv.ParseFloat(lonStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		location = &Location{
			Lat: lat,
			Lon: lon,
		}
		output["actor2_location"] = location
	}

	latStr, ok1 = data["ActionGeo_Lat"]
	lonStr, ok2 = data["ActionGeo_Long"]
	if ok1 && ok2 && latStr != "" && lonStr != "" {
		lat, err := strconv.ParseFloat(latStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		lon, err := strconv.ParseFloat(lonStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		location = &Location{
			Lat: lat,
			Lon: lon,
		}
		output["action_location"] = location
	}

	return output
}

func transformAcledData(data map[string]string) map[string]interface{} {
	var location *Location
	output := make(map[string]interface{})
	for k, v := range data {
		output[k] = v
	}

	if startTime, ok := data["timestamp"]; ok {
		epochInt, err := strconv.ParseInt(startTime, 10, 64)
		if err != nil {
			log.Println("Error converting string to int64:", err)
		} else {
			// Convert int64 to time.Time
			t := time.Unix(epochInt, 0) // The second argument is nanoseconds, set to 0
			output["timestamp"] = t
		}
	}

	latStr, ok1 := data["latitude"]
	lonStr, ok2 := data["longitude"]
	if ok1 && ok2 {
		lat, err := strconv.ParseFloat(latStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		lon, err := strconv.ParseFloat(lonStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		location = &Location{
			Lat: lat,
			Lon: lon,
		}
		output["location"] = location
	}

	return output
}

func transformADSBData(data map[string]string) map[string]interface{} {
	var location *Location
	var timestamp *time.Time
	output := make(map[string]interface{})
	for k, v := range data {
		output[k] = v
	}

	if startTime, ok := data["Time"]; ok {
		// Parse the time in UTC
		parsedTime, err := time.Parse(time.RFC3339, startTime)
		if err != nil {
			log.Printf("error parsing Time as time: %v\n", err)
		} else {
			delete(output, "Time")
			timestamp = &parsedTime
		}
	}

	latStr, ok1 := data["Latitude"]
	lonStr, ok2 := data["Longitude"]
	if ok1 && ok2 {
		lat, err := strconv.ParseFloat(latStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		lon, err := strconv.ParseFloat(lonStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		location = &Location{
			Lat: lat,
			Lon: lon,
		}
		output["location"] = location
	}

	if location != nil && timestamp != nil {
		assetLocation := AssetLocation{
			EntityID:   data["Hex"],
			AssetType:  AssetTypeAircraft,
			SourceType: SourceTypeADSB,
			Location:   *location,
			Timestamp:  *timestamp,
		}
		addAssetLocationFields(assetLocation, output)
	}
	return output
}

func transformSatelliteDataToAsset(data map[string]string) map[string]interface{} {
	var location *Location
	var timestamp *time.Time
	output := make(map[string]interface{})
	for k, v := range data {
		output[k] = v
	}

	layout := "2006-01-02 15:04:05" // Defines the format
	if startTime, ok := data["ACCESS_START"]; ok {
		// Parse the time in UTC
		parsedTime, err := time.ParseInLocation(layout, startTime, time.UTC)
		if err != nil {
			log.Printf("error parsing ACCESS_START as time: %v\n", err)
		} else {
			t := parsedTime.AddDate(0, 11, 0)
			output["ACCESS_START"] = t
			timestamp = &t
		}
	}
	if endTime, ok := data["ACCESS_END"]; ok {
		// Parse the time in UTC
		parsedTime, err := time.ParseInLocation(layout, endTime, time.UTC)
		if err != nil {
			log.Printf("error parsing ACCESS_END as time: %v\n", err)
		} else {
			output["ACCESS_END"] = parsedTime.AddDate(0, 11, 0)
		}
	}
	latStr, ok1 := data["LAT"]
	lonStr, ok2 := data["LON"]
	if ok1 && ok2 {
		lat, err := strconv.ParseFloat(latStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		lon, err := strconv.ParseFloat(lonStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		location = &Location{
			//shifting data to southern china sea area
			Lat: lat,
			Lon: lon + 277,
		}
		output["location"] = location
	}

	if location != nil && timestamp != nil {
		assetLocation := AssetLocation{
			EntityID:   data["SAT_NAME"],
			AssetType:  AssetTypeSatellite,
			SourceType: SourceTypeSatelliteAccess,
			Location:   *location,
			Timestamp:  *timestamp,
		}
		addAssetLocationFields(assetLocation, output)
	}
	return output
}

func transformAISDataToAsset(data map[string]string) map[string]interface{} {
	var location *Location
	var timestamp *time.Time
	output := make(map[string]interface{})
	for k, v := range data {
		output[k] = v
	}

	if startTime, ok := data["timestamp"]; ok {
		// Parse the given time string assuming it's in UTC
		parsedTime, err := time.Parse("20060102T150405.000Z", startTime)
		if err != nil {
			log.Printf("error parsing Time as time: %v\n", err)
		}

		t := parsedTime.UTC()
		//output["BaseDateTime"] = t
		timestamp = &t
	}

	latStr, ok1 := data["lat"]
	lonStr, ok2 := data["lon"]
	if ok1 && ok2 {
		lat, err := strconv.ParseFloat(latStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		lon, err := strconv.ParseFloat(lonStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}

		location = &Location{
			//shifting data to southern china sea area
			Lat: lat,
			Lon: lon,
		}
	}

	if location != nil && timestamp != nil {
		assetLocation := AssetLocation{
			EntityID:   data["mmsi"],
			AssetType:  AssetTypeVessel,
			SourceType: SourceTypeAIS,
			Location:   *location,
			Timestamp:  *timestamp,
		}
		addAssetLocationFields(assetLocation, output)
	}
	return output
}

func transformBASDataToAsset(data map[string]string) map[string]interface{} {
	var location *Location
	var timestamp *time.Time
	output := make(map[string]interface{})
	for k, v := range data {
		output[k] = v
	}

	if startTime, ok := data["timestamp"]; ok {
		// Parse the given time string assuming it's in UTC
		parsedTime, err := time.Parse(time.RFC3339, startTime)
		if err != nil {
			log.Printf("error parsing Time as time: %v\n", err)
		}

		t := parsedTime.UTC()
		//output["BaseDateTime"] = t
		timestamp = &t
	}

	latStr, ok1 := data["latitude"]
	lonStr, ok2 := data["longitude"]
	if ok1 && ok2 {
		lat, err := strconv.ParseFloat(latStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}
		lon, err := strconv.ParseFloat(lonStr, 32)
		if err != nil {
			log.Printf("%v\n", err)
			return nil
		}

		location = &Location{
			//shifting data to southern china sea area
			Lat: lat,
			Lon: lon,
		}
	}

	if location != nil && timestamp != nil {
		assetLocation := AssetLocation{
			EntityID:   data["entityId"],
			AssetType:  AssetTypeSatellite,
			SourceType: SourceTypeBAS,
			Location:   *location,
			Timestamp:  *timestamp,
		}
		addAssetLocationFields(assetLocation, output)
	}
	return output
}

func inSouthChinaArea(lat float64, lon float64) bool {
	return lat > 10 && lat < 20 && lon > 105 && lon < 135
}

func addAssetLocationFields(location AssetLocation, data map[string]interface{}) {
	data["entityId"] = location.EntityID
	data["assetType"] = location.AssetType
	data["sourceType"] = location.SourceType
	data["location"] = location.Location
	data["timestamp"] = location.Timestamp
}
