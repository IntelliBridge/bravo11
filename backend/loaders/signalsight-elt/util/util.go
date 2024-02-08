package util

import (

"bytes"
"encoding/json"
"errors"
"io"
"os"
"signalsight-elt/models"
"strings"
)

type Utf8StringWriter struct {
  strings.Builder
}

func (w *Utf8StringWriter) Write(p []byte) (n int, err error) {
  return w.WriteString(string(p))
}

func ParseArray[T any](jsonString string) ([]T, error) {
  reader := strings.NewReader(jsonString)
  decoder := json.NewDecoder(reader)

  res := make([]T, 0)
  t, err := decoder.Token()
  if err != nil {
    return nil, err
  } else if t != json.Delim('[') {
    return nil, errors.New("Unexepected token")
  }

  for decoder.More() {
    var elem T
    err := decoder.Decode(&elem)
    if err != nil {
      return nil, err
    }

    res = append(res, elem)
  }

  t, err = decoder.Token()
  if err != nil {
    return nil, err
  } else if t != json.Delim(']') {
    return nil, errors.New("Unexepected token")
  }

  return res, nil
}

func ParseDetectionPoints(jsonString string) ([]models.DetectionPolygonVertex, error) {
  return ParseArray[models.DetectionPolygonVertex](jsonString)
}

func GetEnv(key, fallback string) string {
  value, found := os.LookupEnv(key)
  if found {
    return value
  }

  return fallback
}

func ReadToEnd(reader io.Reader) string {
  buf := new(bytes.Buffer)

  _, err := buf.ReadFrom(reader)
  if err != nil {
    panic(err)
  }

  return buf.String()
}
