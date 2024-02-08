package commands

import (
    "encoding/json"
  "fmt"
    "log/slog"
  "math"
  "strings"
  "time"

  "github.com/elastic/go-elasticsearch/v8"
  "github.com/spf13/cobra"

  "signalsight-elt/models"
  "signalsight-elt/util"
)

func init() {
  PredictLocationsCmd.Flags().IntSliceP(
    "forecast-periods",
    "p",
    []int { 1 },
    "A list of one or more periods in the future to forecast the position of assets (in whole numbers hours)",
  )

  PredictLocationsCmd.Flags().IntP("max-predictions", "n", 100, "The maximum number of data points to produce a prediction for")

  PredictLocationsCmd.Flags().StringP("source-index", "i", "sat-detections", "The ElasticSearch index to generate predictions from")
  PredictLocationsCmd.Flags().StringP("dest-index", "o", "predictions", "The ElasticSearch index to write predictions to")

  PredictLocationsCmd.Flags().BoolP("create-index", "c", false, "Create the index in ElasticSearch")
}

const PredictionSchemaOverrides = `
{
  "properties": {
    "probabilities": {
      "type": "[float]"
    }
  }
}
`;

// PredictLocationsCmd predict-location is a temporary hack where we use a naive model to generate
// fake "predictions" historically.
// Future state will be a predictive model trained on historical data and then run in real time as
// new data becomes available
var PredictLocationsCmd = &cobra.Command{
  Use: "predict-locations [--forecast-periods|-p <hour,hours...>] [--max-predictions|-n number]",
  Short: "Generate example satellite detection data",
  Run: func(cmd *cobra.Command, args []string) {
    slog.Info("Running predict-locations command")

    baseCmd := BaseCommand{cmd}

    periods := baseCmd.IntSliceFlagVal("forecast-periods")
    maxPredictions := baseCmd.IntFlagVal("max-predictions")

    sourceIndex := baseCmd.StringFlagVal("source-index")
    destIndex := baseCmd.StringFlagVal("dest-index")

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

    createIndex := baseCmd.BoolFlagVal("create-index")
    if createIndex {
      _, err := esClient.Indices.Create(destIndex)
      if err != nil {
        slog.Warn("Error creating index: " + err.Error())
      }
    }

    _, err = esClient.Indices.PutMapping([]string { destIndex }, strings.NewReader(PredictionSchemaOverrides))
    if err != nil {
      slog.Warn("Error updating detections index schema: " + err.Error())
    }

    allEntityIds, err := getAllEntityIds(esClient, sourceIndex)

    for _, entityId := range allEntityIds {
      // fetch the movement history for this entity (sort by timestamp descending)
      locationHistory, err := getLocationHistory(esClient, sourceIndex, maxPredictions, entityId)
      if err != nil {
        slog.Error("Error Querying entity location history: " + err.Error())
        return
      }

      for ix := 0; ix < maxPredictions && ix + lookbackCount < len(locationHistory); ix++ {
        for _, period := range periods {
          vectors := make([][2]float64, 0)
          for offset := 0; offset < lookbackCount; offset++ {
            t0, err := time.Parse(time.RFC3339, locationHistory[ix + offset].Timestamp)
            if err != nil {
              slog.Error("Error parsing location timestamp: " + err.Error())
            }
            t1, err := time.Parse(time.RFC3339, locationHistory[ix + offset + 1].Timestamp)
            if err != nil {
              slog.Error("Error parsing location timestamp: " + err.Error())
            }
            deltaT := t0.Sub(t1)
            // calculate velocity in degrees per hour (note: this ignores distortion due to the changing size of a degree)
            vectors = append(vectors, [2]float64 {
              (locationHistory[ix + offset].Location.Lon - locationHistory[ix + offset + 1].Location.Lon) / (float64(deltaT) / float64(time.Hour)),
              (locationHistory[ix + offset].Location.Lat - locationHistory[ix + offset + 1].Location.Lat) / (float64(deltaT) / float64(time.Hour)),
            })
          }

          avgVelocity := average(vectors)
          mag := math.Sqrt(math.Pow(avgVelocity[0], 2) + math.Pow(avgVelocity[1], 2))
          area := mag * float64(period) * 0.1
          step := area / 20
          theta := math.Atan2(avgVelocity[1], avgVelocity[0])

          prediction := [2]float64{ avgVelocity[0] * float64(period), avgVelocity[1] * float64(period) }
          predictionValues := make([][3]float64, 0)
          for lonOff := -10; lonOff <= 10; lonOff++ {
            for latOff := -10; latOff <= 10; latOff++ {
              lonLatOff := rotate(theta, [2]float64{float64(lonOff) * step, float64(latOff) * step})
              // normalize x and y to -5 .. 5
              x := lonLatOff[0] / area * 2 * 5
              y := lonLatOff[1] / area * 2 * 5
              value := 1.0 /
                math.Pow(
                  2,
                  math.Pow(x / 2, 2) + math.Pow(y, 2),
                )

              predictionValues = append(predictionValues, [3]float64 {
                prediction[0] + lonLatOff[0],
                prediction[1] + lonLatOff[1],
                value,
              })
            }
          }

          ts, err := time.Parse(time.RFC3339, locationHistory[ix].Timestamp)
          if err != nil {
             slog.Error("Error parsing timestamp: " + err.Error())
             continue
          }
          doc := Prediction{
            entityId,
            ts,
            period,
            predictionValues,
          }
          //data, _ := json.Marshal(doc)
          //log.Print(string(data))
          id := fmt.Sprintf("%s_%s_%d", entityId, locationHistory[ix].Timestamp, period)
          err = util.IndexDocument(esClient, destIndex, toPredictionJson(doc), id)
          if err != nil {
             slog.Error("Error indexing document: " + err.Error())
          }
        }
      }
    }
  },
}

func toPredictionJson(doc Prediction) PredictionJson {
  probabilities := make([][3]json.RawMessage, len(doc.Probabilities))
  for ix, tuple := range doc.Probabilities {
    probabilities[ix] = [3]json.RawMessage {
      util.SafeSerialize(tuple[0]),
      util.SafeSerialize(tuple[1]),
      util.SafeSerialize(tuple[2]),
    }
  }

  return PredictionJson{
    doc.EntityId,
    doc.GenerationTimestamp,
    doc.ForecastDuration,
    probabilities,
  }
}

type Prediction struct {
  EntityId string `json:"entityId"`
  GenerationTimestamp time.Time `json:"generationTimestamp"`
  ForecastDuration int `json:"forecastDuration"`
  Probabilities [][3]float64 `json:"probabilities"`
}

type PredictionJson struct {
  EntityId string  `json:"entityId"`
  GenerationTimestamp time.Time `json:"generationTimestamp"`
  ForecastDuration int `json:"forecastDuration"`
  Probabilities [][3]json.RawMessage  `json:"probabilities"`
}

func rotate(theta float64, vector [2]float64) [2]float64 {
  cosTheta := math.Cos(theta)
  sinTheta := math.Sin(theta)
  return [2]float64{
    vector[0] * cosTheta - vector[1] * sinTheta,
    vector[0] * sinTheta + vector[1] * cosTheta,
  }
}

func average(vectors [][2]float64) [2]float64 {
  // Overflow risk be damned
  var sum [2]float64
  for _, v := range vectors {
    sum[0] += v[0]
    sum[1] += v[1]
  }

  return [2]float64 { sum[0] / float64(len(vectors)), sum[1] / float64(len(vectors)) }
}

func getAllEntityIds(esClient *elasticsearch.Client, sourceIndex string) ([]string, error) {
  // List all entityIds
  response, err := esClient.Search(
    esClient.Search.WithIndex(sourceIndex),
    esClient.Search.WithSize(0),
    esClient.Search.WithBody(strings.NewReader(`{
      "aggs": {
        "distinctEntityIds": {
          "composite": {
            "size": 1000,
            "sources": [
              {
                "entityId": {
                  "terms": {
                    "field": "entityId.keyword"
                  }
                }
              }
            ]
          }
        }
      }
    }`)),
  )

  if err != nil {
    return nil, err
  }

  decoder := json.NewDecoder(response.Body)
  var firstDistinctIdPage DistinctEntityIdsResponse
  err = decoder.Decode(&firstDistinctIdPage)
  if err != nil {
    return nil, err
  }

  allEntityIds, after := HandleDistinctEntityIdsPage(firstDistinctIdPage)

  for after != "" {
    response, err = esClient.Search(
      esClient.Search.WithIndex(sourceIndex),
      esClient.Search.WithSize(0),
      esClient.Search.WithBody(strings.NewReader(
        fmt.Sprintf(`{
            "aggs": {
              "distinctEntityIds": {
                "composite": {
                  "size": 1000,
                  "sources": [
                    {
                      "entityId": {
                        "terms": {
                          "field": "entityId.keyword"
                        }
                      }
                    }
                  ],
                  "after": {
                    "entityId": "%s"
                  }
                }
              }
            }
          }`,
          after,
        ),
      )),
    )
    if err != nil {
      return nil, err
    }

    decoder := json.NewDecoder(response.Body)
    var nextDistinctIdPage DistinctEntityIdsResponse
    err = decoder.Decode(&nextDistinctIdPage)
    if err != nil {
      return nil, err
    }

    var additionalEntityIds []string
    additionalEntityIds, after = HandleDistinctEntityIdsPage(nextDistinctIdPage)

    allEntityIds = append(allEntityIds, additionalEntityIds...)
  }

  return allEntityIds, nil
}

func HandleDistinctEntityIdsPage(page DistinctEntityIdsResponse) ([]string, string) {
  res := make([]string, len(page.Aggregations.DistinctEntityIds.Buckets))
  for ix, val := range page.Aggregations.DistinctEntityIds.Buckets {
    res[ix] = val.Key.EntityId
  }

  if page.Aggregations.DistinctEntityIds.AfterKey != nil {
    return res, page.Aggregations.DistinctEntityIds.AfterKey.EntityId
  } else {
    return res, ""
  }
}

type DistinctEntityIdsResponse struct {
  Aggregations DistinctEntityIdsAggregations `json:"aggregations"`
}

type DistinctEntityIdsAggregations struct {
  DistinctEntityIds DistinctEntityIds `json:"distinctEntityIds"`
}

type DistinctEntityIds struct {
  AfterKey *EntityIdValue `json:"after_key"`
  Buckets []EntityIdBucket `json:"buckets"`
}

type EntityIdBucket struct {
  Key EntityIdValue `json:"key"`
  DocumentCount int `json:"doc_count"`
}

type EntityIdValue struct {
  EntityId string `json:"entityId"`
}

// The number of previous locations to consider when calculating the trajectory
const lookbackCount = 2

func getLocationHistory(esClient *elasticsearch.Client, sourceIndex string, maxPredictions int, entityId string) ([]LocationHistoryData, error) {
  res, err := esClient.Search(
    esClient.Search.WithIndex(sourceIndex),
    esClient.Search.WithSourceIncludes("location", "timestamp"),
    esClient.Search.WithSort("timestamp:desc"),
    esClient.Search.WithSize(maxPredictions + lookbackCount),
    esClient.Search.WithBody(strings.NewReader(fmt.Sprintf(`{ "query": { "match": { "entityId": "%s" } } }`, entityId))),
  );

  if err != nil {
    return nil, err
  }

  decoder := json.NewDecoder(res.Body)

  var results QueryResults[LocationHistoryData]
  err = decoder.Decode(&results)
  if err != nil {
    return nil, err
  } else {
    history := make([]LocationHistoryData, len(results.Hits.Hits))
    for ix, hit := range results.Hits.Hits {
      history[ix] = hit.Source
    }

    return history, nil
  }
}

type QueryResults[TSource any] struct {
  Hits QueryHitsContainer[TSource] `json:"hits"`
}

type QueryHitsContainer[TSource any] struct {
  Hits []QueryHit[TSource] `json:"hits"`
}

type QueryHit[TSource any] struct {
  Source TSource `json:"_source"`
}

type LocationHistoryData struct {
  Location models.ElasticGeoPoint `json:"location"`
  Timestamp string `json:"timestamp"`
}
