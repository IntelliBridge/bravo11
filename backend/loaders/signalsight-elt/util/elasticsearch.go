package util

import (
  "bytes"
  "encoding/json"
  "errors"
  "fmt"
  "log/slog"

  "github.com/elastic/go-elasticsearch/v8"
)

func IndexDocument[T any](client *elasticsearch.Client, index string, doc T, id string) error {
  data, err := json.Marshal(doc)
  if err != nil {
     return err
  }
  res, err := client.Index(
    index,
    bytes.NewReader(data),
    client.Index.WithDocumentID(id),
  )
  if err != nil {
     return err
  }
  if res != nil {
    if res.StatusCode >= 400 {
      return errors.New(fmt.Sprintf("Non Success Response [%d]: %s", res.StatusCode, ReadToEnd(res.Body)))
    } else {
      slog.Debug(fmt.Sprintf("Prediction %s Index Status: %d", id, res.StatusCode))
    }
  } else if err == nil {
    slog.Warn(fmt.Sprintf("Response was nil for %s", id))
  }

  return nil
}

func SafeSerialize(value float64) json.RawMessage {
  return []byte(fmt.Sprintf("%.5f", value))
}
