package models

import "time"

type LocationSourceType string

const (
  SatelliteDetection LocationSourceType = "SatDetection"
  AIS LocationSourceType = "AIS"
  ADSdashB LocationSourceType = "ADS-B"
)

type AssetLocation struct {
  _id string
  asset_type string
  source_type LocationSourceType
  location ElasticGeoPoint
  timestamp time.Time
}
