package models

import (
  "fmt"
  "time"
)

type DetectionPolygonVertex struct {
  Lat float64 `json:"lat"`
  Lon float64 `json:"lon"`
  Col int32 `json:"col"`
  Row int32 `json:"row"`
}

// This is a subset, just for data generation purposes
var Ontologies = []string {
  "Airplane",
  "Bomber Aircraft",
  "Ground Motor Vehicle",
  "Surface Vessel",
  "Tank",
}

var ClassificationStrings = []string { "CUI", "U" }

var ConfidenceLabels = []string { "VERY LOW", "LOW", "MEDIUM", "HIGH" }

var SourceVendor = []string { "SatConst1", "SatConst2", "SatConst3" }

type Detection struct {
  EntityId string;
  DetectionLat float64;
  DetectionLon float64;
  DetectionTimestamp time.Time;
  DetectionOntology string;
  DetectionOntologyCategory string;
  DetectionOntologySubcategory string;
  DetectionConfidence float32;
  DetectionClassificationString string;
  DetectionAlgorithmName string;
  DetectionAlgorithmVersion string;
  DetectionPolygon []DetectionPolygonVertex;
  BasConfidenceLabel string;
  DetectionSourceImageId string;
  BasSourceVendor string;
  BasSourceProductType string;
  BasSourceSensorType string;
  BasSourceGsd string;
  BasSourceOffNadirAngle string;
  BasSourceNiirs string;
  NaiUuids []string;
  ImageUrl string;
}

func (d Detection) ToDocument() (string, DetectionDocument) {
  return d.EntityId, DetectionDocument {
    fmt.Sprintf("%s_%s", d.EntityId, d.DetectionTimestamp.Format(time.RFC3339)),
    ElasticGeoPoint{
      Lat: d.DetectionLat,
      Lon: d.DetectionLon,
    },
    d.DetectionTimestamp,
    d.DetectionOntology,
    d.DetectionOntologyCategory,
    d.DetectionOntologySubcategory,
    d.DetectionConfidence,
    d.DetectionClassificationString,
    d.DetectionAlgorithmName,
    d.DetectionAlgorithmName,
    ElasticGeoShape{
      ShapeType: "polygon",
      Coordinates: [1][][2]float64 { ToCoordinates(d.DetectionPolygon) },
    },
    d.BasConfidenceLabel,
    d.DetectionSourceImageId,
    d.BasSourceVendor,
    d.BasSourceProductType,
    d.BasSourceSensorType,
    d.BasSourceGsd,
    d.BasSourceOffNadirAngle,
    d.BasSourceNiirs,
    d.NaiUuids,
    d.ImageUrl,
  }
}

func ToCoordinates(polygon []DetectionPolygonVertex) [][2]float64 {
  res := make([][2]float64, len(polygon))
  for ix, v := range polygon {
    // NOTE: GeoJson expects coordinates in Longitude, Latitude order!
    res[ix] = [2]float64 { v.Lon, v.Lat }
  }
  // NOTE: GeoJson requires polygons to be "closed" meaning the first and last vertices must be identical (WHY?!)
  if !VertexEqual(res[0], res[len(res) - 1]) {
    res = append(res, res[0])
  }

  return res
}

func VertexEqual(v1 [2]float64, v2 [2]float64) bool {
  return v1[0] == v2[0] && v1[1] == v2[1]
}

type ElasticGeoPoint struct {
  Lat float64 `json:"lat"`
  Lon float64 `json:"lon"`
}

type ElasticGeoShape struct {
  ShapeType string `json:"type"`
  Coordinates [1][][2]float64 `json:"coordinates"`
}

type DetectionDocument struct {
  EntityId string `json:"entityId"`
  Location ElasticGeoPoint `json:"location"`
  Timestamp time.Time `json:"timestamp"`
  Ontology string `json:"ontology"`
  OntologyCategory string `json:"ontologyCategory"`
  OntologySubcategory string `json:"ontologySubcategory"`
  Confidence float32 `json:"confidence"`
  ClassificationString string `json:"classificationString"`
  AlgorithmName string `json:"algorithmName"`
  AlgorithmVersion string `json:"algorithmVersion"`
  Polygon ElasticGeoShape `json:"polygon"`
  BasConfidenceLabel string `json:"basConfidenceLabel"`
  SourceImageId string `json:"sourceImageId"`
  BasSourceVendor string `json:"basSourceVendor"`
  BasSourceProductType string `json:"basSourceProductType"`
  BasSourceSensorType string `json:"basSourceSensorType"`
  BasSourceGsd string `json:"basSourceGsd"`
  BasSourceOffNadirAngle string `json:"basSourceOffNadirAngle"`
  BasSourceNiirs string `json:"basSourceNiirs"`
  NaiUuids []string `json:"naiUuids"`
  ImageUrl string `json:"imageUrl"`
}

const DetectionSchemaOverrides = `
{
  "properties": {
    "location": {
      "type": "geo_point"
    },
    "polygon": {
      "type": "geo_shape"
    }
  }
}
`
