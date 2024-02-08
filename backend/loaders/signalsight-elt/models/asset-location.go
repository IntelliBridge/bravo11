package models

import "time"

type LocationSourceType string

const (
  SatelliteDetection LocationSourceType = "SatDetection"
  AIS LocationSourceType = "AIS"
  ADSdashB LocationSourceType = "ADS-B"
)

type AssetLocation struct {
  EntityId string `json:"entityId"`
  AssetType string `json:"assetType"`
  SourceType LocationSourceType `json:"sourceType"`
  Location ElasticGeoPoint `json:"location"`
  LonLatArray [2]float64 `json:"lonLatArray"`
  Timestamp time.Time `json:"timestamp"`
}

const AssetLocationSchemaOverrides = `
{
  "properties": {
    "location": {
      "type": "geo_point"
    }
  }
}
`
