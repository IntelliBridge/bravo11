package commands

import (
  "bytes"
  "context"
  "encoding/csv"
  "encoding/json"
  "io"
  "log"
  "log/slog"
  "os"
  "runtime"
  "strconv"
  "strings"
  "sync/atomic"
  "time"

  "github.com/elastic/go-elasticsearch/v8"
  "github.com/elastic/go-elasticsearch/v8/esutil"
  "github.com/spf13/cobra"

  "signalsight-elt/models"
  "signalsight-elt/util"
)

func init() {
  LoadSatDetectionsCmd.Flags().StringP("file", "f", "-", "A file path to load detections from")

  LoadSatDetectionsCmd.Flags().Bool("skip-header", false, "Skip the first row of input")

  LoadSatDetectionsCmd.Flags().StringP("index", "i", "sat-detections", "The ElasticSearch index to load data into")

  LoadSatDetectionsCmd.Flags().String("asset-index", "", "The index to write asset documents to")

  LoadSatDetectionsCmd.Flags().BoolP("create-index", "c", false, "Create the index in ElasticSearch")

  LoadSatDetectionsCmd.Flags().Bool("bulk", false, "Use the ElasticSearch bulk indexer")
}

const (
	flushBytes int = 5e+6 //Flush threshold in bytes
)


var LoadSatDetectionsCmd = &cobra.Command{
  Use: "load-sat-detections [--file|-f <path>|-] [--index|-i <index_name>] [--create-index] [--skip-header]",
  Short: "Generate example satellite detection data",
  Run: func(cmd *cobra.Command, args []string) {
    baseCmd := BaseCommand{cmd}
    path := cmd.Flag("file").Value.String()

    var input io.Reader
    if path == "-" {
      input = os.Stdin
    } else {
      file, err := os.Open(path)
      if err != nil {
        slog.Error("Unable to open input: " + err.Error())
      }

      input = file
    }

    reader := csv.NewReader(input)

    skipHeader := baseCmd.BoolFlagVal("skip-header")

    if skipHeader {
      _, err := reader.Read()
      if err != nil {
        slog.Error("Error reading header row: " + err.Error())
        return
      }
    }

    var (
      clusterURLs = util.GetEnv("ELASTIC_CLUSTER_URLS", "http://localhost:9200") //comma separated
      username = util.GetEnv("ELASTIC_USERNAME", "admin")
      password = util.GetEnv("ELASTIC_PASSWORD", "admin")
    )

    esClient, err := elasticsearch.NewClient(elasticsearch.Config{
       Addresses: strings.Split(clusterURLs, ","),
       Username: username,
       Password: password,
    })
    if err != nil {
      slog.Error("Unable to instantiate ElasticSearch client " + err.Error())
      return
    }

    ctx := context.Background()

    indexName := baseCmd.StringFlagVal("index")
    assetIndexName := baseCmd.StringFlagVal("asset-index")
    writeAssetIndex := len(assetIndexName) > 0
    createIndex := baseCmd.BoolFlagVal("create-index")
    if createIndex {
      _, err := esClient.Indices.Create(indexName)
      if err != nil {
        slog.Warn("Error creating index: " + err.Error())
      }

      if writeAssetIndex {
        _, err := esClient.Indices.Create(assetIndexName)
        if err != nil {
          slog.Warn("Error creating index: " + err.Error())
        }
      }
    }

    _, err = esClient.Indices.PutMapping([]string { indexName }, strings.NewReader(models.DetectionSchemaOverrides))
    if err != nil {
      slog.Warn("Error updating detections index schema: " + err.Error())
    }

    if writeAssetIndex {
      _, err = esClient.Indices.PutMapping([]string { assetIndexName }, strings.NewReader(models.AssetLocationSchemaOverrides))
      if err != nil {
        slog.Warn("Error updating asset location index schema: " + err.Error())
      }
    }

    bulk := baseCmd.BoolFlagVal("bulk")
    var detectionIndexer esutil.BulkIndexer = nil
    var assetIndexer esutil.BulkIndexer = nil
    if bulk {
      detectionIndexer, err = esutil.NewBulkIndexer(esutil.BulkIndexerConfig{
        Index: indexName, // The default index name
        Client: esClient, // The Elasticsearch client
        NumWorkers: runtime.NumCPU(), // The number of worker goroutines
        FlushBytes: int(flushBytes), // The flush threshold in bytes
        FlushInterval: 30 * time.Second, // The periodic flush interval
      })
      if err != nil {
        log.Fatalf("Error creating the indexer: %s", err)
      }

      if writeAssetIndex {
        assetIndexer, err = esutil.NewBulkIndexer(esutil.BulkIndexerConfig{
          Index: assetIndexName, // The default index name
          Client: esClient, // The Elasticsearch client
          NumWorkers: runtime.NumCPU(), // The number of worker goroutines
          FlushBytes: int(flushBytes), // The flush threshold in bytes
          FlushInterval: 30 * time.Second, // The periodic flush interval
        })
      }
    }

    var countSuccessful uint64
    var countSuccessfulAssets uint64

    for {
      row, err := reader.Read()
      if err != nil {
        if err == io.EOF {
          slog.Debug("Done processing input")
          break
        }
        slog.Error("Error reading data: " + err.Error())
        return
      }

      if row == nil {
        slog.Warn("Reader returned nil")
        break
      }

      poly, err := util.ParseDetectionPoints(row[11])
      if err != nil {
        slog.Error("Error reading polygon: " + err.Error())
        continue
      }

      uuids, err := util.ParseArray[string](row[20])
      if err != nil {
        slog.Error("Error reading uuids: " + err.Error())
        continue
      }

      lat, err := strconv.ParseFloat(row[1], 64)
      if err != nil {
        slog.Error("Error reading latitude: " + err.Error())
      }

      lon, err := strconv.ParseFloat(row[2], 64)
      if err != nil {
        slog.Error("Error reading longitude: " + err.Error())
      }

      ts, err := time.Parse(time.RFC3339, row[3])
      if err != nil {
        slog.Error("Error reading timestamp: " + err.Error())
      }

      conf, err := strconv.ParseFloat(row[7], 64)
      if err != nil {
        slog.Error("Error reading confidence: " + err.Error())
      }

      record := models.Detection {
        EntityId: row[0],
        DetectionLat: lat,
        DetectionLon: lon,
        DetectionTimestamp: ts,
        DetectionOntology: row[4],
        DetectionOntologyCategory: row[5],
        DetectionOntologySubcategory: row[6],
        DetectionConfidence: float32(conf),
        DetectionClassificationString: row[8],
        DetectionAlgorithmName: row[9],
        DetectionAlgorithmVersion: row[10],
        DetectionPolygon: poly,
        BasConfidenceLabel: row[12],
        DetectionSourceImageId: row[13],
        BasSourceVendor: row[14],
        BasSourceProductType: row[15],
        BasSourceSensorType: row[16],
        BasSourceGsd: row[17],
        BasSourceOffNadirAngle: row[18],
        BasSourceNiirs: row[19],
        NaiUuids: uuids,
        ImageUrl: row[21],
      }

      id, document := record.ToDocument()

      data, err := json.Marshal(document)
      if err != nil {
         slog.Error("Error serializing document: " + err.Error())
         continue
      }

      if bulk {
        err = detectionIndexer.Add(
          ctx,
          esutil.BulkIndexerItem{
				    Action: "index",
            DocumentID: id,
            Body: bytes.NewReader(data),

            OnSuccess: func(ctx context.Context, item esutil.BulkIndexerItem, res esutil.BulkIndexerResponseItem) {
              atomic.AddUint64(&countSuccessful, 1)
            },

            OnFailure: func(ctx context.Context, item esutil.BulkIndexerItem, res esutil.BulkIndexerResponseItem, err error) {
              if err != nil {
                 slog.Error("Error indexing Detection:" + err.Error())
              } else {
                 slog.Error("Error indexing Detection", "ErrorType", res.Error.Type, "ErrorReason", res.Error.Reason)
              }
            },
        })
      } else {
        err = util.IndexDocument(esClient, indexName, document, id)
      }
      if err != nil {
        slog.Error("Error indexing Detection: " + err.Error())
        continue
      }

      if writeAssetIndex {
        asset := models.AssetLocation{
          EntityId: document.EntityId,
          Location: document.Location,
          LonLatArray: [2]float64 { document.Location.Lon, document.Location.Lat },
          AssetType: document.Ontology,
          SourceType: models.SatelliteDetection,
          Timestamp: document.Timestamp,
        }
        data, err = json.Marshal(asset)
        if err != nil {
           slog.Error("Error serializing asset document: " + err.Error())
           continue
        }
        if bulk {
          err = assetIndexer.Add(
            ctx,
            esutil.BulkIndexerItem{
              Action: "index",
              DocumentID: id,
              Body: bytes.NewReader(data),

              OnSuccess: func(ctx context.Context, item esutil.BulkIndexerItem, res esutil.BulkIndexerResponseItem) {
                atomic.AddUint64(&countSuccessfulAssets, 1)
              },

              OnFailure: func(ctx context.Context, item esutil.BulkIndexerItem, res esutil.BulkIndexerResponseItem, err error) {
                if err != nil {
                   slog.Error("Error indexing asset:" + err.Error())
                } else {
                   slog.Error("Error indexing asset", "ErrorType", res.Error.Type, "ErrorReason", res.Error.Reason)
                }
              },
          })
        } else {
          err = util.IndexDocument(esClient, assetIndexName, asset, id)
        }

        if err != nil {
          slog.Error("Error indexing asset: " + err.Error())
        }
      }
    }

    if bulk {
      err = detectionIndexer.Close(ctx)
      if err != nil {
        slog.Warn("Unexpected error closing indexer: " + err.Error())
      }

      if writeAssetIndex {
        err = assetIndexer.Close(ctx)
        if err != nil {
          slog.Warn("Unexpected error closing indexer: " + err.Error())
        }
      }

      stats := detectionIndexer.Stats()
      if stats.NumFailed > 0 {
    		log.Fatalf(
    			"Indexed [%d] documents with [%d] errors",
    			int32(stats.NumFlushed),
    			int32(stats.NumFailed),
    		)
    	} else {
    		log.Printf(
    			"Sucessfuly indexed [%d] documents",
    			int32(stats.NumFlushed),
    		)
    	}
    }
  },
}
