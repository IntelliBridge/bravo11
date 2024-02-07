package commands

import (
  "context"
  "crypto/tls"
  "encoding/csv"
  "io"
  "log/slog"
  "net/http"
  "os"
  "strconv"
  "strings"
  "time"

  "github.com/spf13/cobra"
  "github.com/opensearch-project/opensearch-go/v3"
  "github.com/opensearch-project/opensearch-go/v3/opensearchapi"
  "github.com/opensearch-project/opensearch-go/v3/opensearchutil"

  "load-data/models"
  "load-data/util"
)

func init() {
  LoadSatDetectionsCmd.Flags().StringP("file", "f", "-", "A file path to load detections from")

  LoadSatDetectionsCmd.Flags().Bool("skip-header", false, "Skip the first row of input")

  LoadSatDetectionsCmd.Flags().StringP("index", "i", "sat-detections", "The ElasticSearch index to load data into")

  LoadSatDetectionsCmd.Flags().BoolP("create-index", "c", false, "Create the index in ElasticSearch")
}

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

    osClient, err := opensearchapi.NewClient(
      opensearchapi.Config{
         Client: opensearch.Config{
           Transport: &http.Transport{
            TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
           },
           Addresses: []string{
             util.GetEnv("OPENSEARCH_URL", "http://localhost:9200"),
           },
           Username:  "admin", // For testing only. Don't store credentials in code.
           Password:  "admin",
         },
      },
    )
    if err != nil {
      slog.Error("Unable to instantiate ElasticSearch client " + err.Error())
    }

    ctx := context.Background()

    indexName := baseCmd.StringFlagVal("index")
    createIndex := baseCmd.BoolFlagVal("create-index")
    if createIndex {
      settings := strings.NewReader(`{
        "settings": {
          "index": {
            "number_of_shards": 1,
            "number_of_replicas": 0
          }
        }
      }`)
      _, err := osClient.Indices.Create(ctx, opensearchapi.IndicesCreateReq{
        Index: indexName,
        Body: settings,
        Params: opensearchapi.IndicesCreateParams{},
      })
      if err != nil {
        slog.Warn("Error creating index: " + err.Error())
      }
    }

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
        continue;
      }

      uuids, err := util.ParseArray[string](row[20])
      if err != nil {
        slog.Error("Error reading uuids: " + err.Error())
        continue;
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

      _, err = osClient.Index(
        ctx,
        opensearchapi.IndexReq{
          Index: indexName,
          DocumentID: id,
          Body: opensearchutil.NewJSONReader(&document),
      })
      if err != nil {
        slog.Error("Error indexing Detection: " + err.Error())
      }
    }
  },
}
