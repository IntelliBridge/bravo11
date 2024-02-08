package commands

import (
  "encoding/csv"
  "encoding/json"
  "errors"
  "fmt"
  "log/slog"
  "math"
  "math/rand"
  "os"
  "strconv"
  "strings"
  "time"

  "github.com/google/uuid"
  "github.com/spf13/cobra"

  "signalsight-elt/models"
)

func init() {
  GenerateSatDetectionsCmd.Flags().StringP(
    "bounding-box",
    "b",
    "90,-180,-90,180",
    "A bounding box to constrain the generated data to in to format lat,lon,lat,lon")

  GenerateSatDetectionsCmd.Flags().String(
    "start",
    "1970-01-01T00:00:00Z",
    "The minimum timestamp value to use for generated data")

  GenerateSatDetectionsCmd.Flags().String(
    "end",
    "2024-01-31T23:59:59Z",
    "The maximum timestamp value to use for generated data")

  GenerateSatDetectionsCmd.Flags().Int32P("number", "n", 100, "The number of rows of data to generate")

  GenerateSatDetectionsCmd.Flags().Bool("no-header", false, "Skip the header row")
}

var GenerateSatDetectionsCmd = &cobra.Command{
  Use: "generate-sat-detections [--bounding-box|-b <lat1,lon1,lat2,lon2>] [--start yyyy-MM-ddTHH:mm:ssZ] [--end yyyy-MM-ddTHH:mm:ssZ] [--number|-n number]",
  Short: "Generate example satellite detection data",
  Run: func(cmd *cobra.Command, args []string) {
    baseCmd := BaseCommand{cmd}

    writer := csv.NewWriter(os.Stdout)

    if !baseCmd.BoolFlagVal("no-header") {
      err := writer.Write([]string{
        "entity_id",
        "detection_lat",
        "detection_lon",
        "detection_timestamp",
        "detection_ontology",
        "detection_ontology_category",
        "detection_ontology_subcategory",
        "detection_confidence",
        "detection_classification_string",
        "detection_algorithm_name",
        "detection_algorithm_version",
        "detection_polygon",
        "bas_confidence_label",
        "detection_source_image_id",
        "bas_source_vendor",
        "bas_source_product_type",
        "bas_source_sensor_type",
        "bas_source_gsd",
        "bas_source_off_nadir_angle",
        "bas_source_niirs",
        "nai_uuids",
        "ispy_link",
        "junk",
      })

      if err != nil {
        slog.Error("Error writing CSV header: " + err.Error())
        return
      }
    }

    num := baseCmd.IntFlagVal("number")

    if num < 1 {
      slog.Error("The number of rows to generate must be >= 1")
      return
    }

    start, err := time.Parse(time.RFC3339, cmd.Flag(`start`).Value.String())
    if err != nil {
      slog.Error("Invalid start argument: " + err.Error())
      return
    }

    end, err := time.Parse(time.RFC3339, cmd.Flag(`end`).Value.String())
    if err != nil {
      slog.Error("Invalid start argument: " + err.Error())
      return
    }

    bounds, err := ParseBounds(cmd.Flag("bounding-box").Value.String())
    latRange := bounds[1][0] - bounds[0][0]
    lonRange := bounds[1][1] - bounds[0][1]

    existing := make(map[string]models.Detection)
    existingIds := make([]string,0)

    for i := 0; i < num; i++ {
      var entityId string
      var ts time.Time
      var lat, lon float64
      var ont string
      useExisting := rand.Float64() <= 0.9 && len(existing) > num / 20

      if useExisting {
        entityId = existingIds[rand.Intn(len(existing))]
        data := existing[entityId]
        deltaT := int64(20 + rand.Intn(40))
        ts = data.DetectionTimestamp.Add(time.Duration(deltaT * int64(time.Minute)))

        vel := 5 + rand.Float64() * 10
        dir := rand.Float64() * 2 * math.Pi

        lat = data.DetectionLat + vel * float64(deltaT) * 60 * 0.00001 * math.Sin(dir)
        lon = data.DetectionLon + vel * float64(deltaT) * 60 * 0.00001 * math.Cos(dir)

        ont = data.DetectionOntology
      } else {
        entityId = uuid.NewString()
        ts = start.Add(time.Duration(int64(end.Sub(start).Seconds() * rand.Float64() * float64(time.Second))))
        lat = bounds[0][0] + rand.Float64() * latRange
        lon = bounds[0][1] + rand.Float64() * lonRange

        ont = models.Ontologies[rand.Intn(len(models.Ontologies))]
      }

      poly := []models.DetectionPolygonVertex {
        { lat - 0.0005, lon - 0.0005, 0, 0 },
        { lat - 0.0005, lon + 0.0005, 0, 0 },
        { lat + 0.0005, lon + 0.0005, 0, 0 },
        { lat + 0.0005, lon - 0.0005, 0, 0 },
      }

      det := models.Detection{
        entityId,
        lat,
        lon,
        ts,
        ont,
        "Vehicle",
        "Vehicle",
        float32(rand.Float64()),
        models.ClassificationStrings[rand.Intn(len(models.ClassificationStrings))],
        "_",
        "_",
        poly,
        models.ConfidenceLabels[rand.Intn(len(models.ConfidenceLabels))],
        "_",
        models.SourceVendor[rand.Intn(len(models.SourceVendor))],
        "_",
        "EO",
        strconv.FormatFloat(rand.Float64(), 'f', 5, 64),
        strconv.FormatFloat(rand.Float64(), 'f', 5, 64),
        strconv.FormatFloat(rand.Float64(), 'f', 5, 64),
        []string { uuid.NewString() },
        fmt.Sprintf("https://images.host.local/prefix/%s", uuid.NewString()),
      }

      polyJson, err := json.Marshal(poly)
      if err != nil {
        slog.Error(err.Error())
        return
      }

      err = writer.Write([]string {
        det.EntityId,
        strconv.FormatFloat(det.DetectionLat, 'f', -1, 64),
        strconv.FormatFloat(det.DetectionLon, 'f', -1, 64),
        det.DetectionTimestamp.Format(time.RFC3339),
        det.DetectionOntology,
        det.DetectionOntologyCategory,
        det.DetectionOntologySubcategory,
        strconv.FormatFloat(float64(det.DetectionConfidence), 'f', 5, 64),
        det.DetectionClassificationString,
        det.DetectionAlgorithmName,
        det.DetectionAlgorithmVersion,
        string(polyJson),
        det.BasConfidenceLabel,
        det.DetectionSourceImageId,
        det.BasSourceVendor,
        det.BasSourceProductType,
        det.BasSourceSensorType,
        det.BasSourceGsd,
        det.BasSourceOffNadirAngle,
        det.BasSourceNiirs,
        fmt.Sprintf("[\"%s\"]", strings.Join(det.NaiUuids, "\",\"")),
        det.ImageUrl,
        uuid.NewString(),
      })
      writer.Flush()

      if err != nil {
        slog.Error(err.Error())
        return
      }

      existing[entityId] = det
      if !useExisting {
        existingIds = append(existingIds, entityId)
      }
    }
  },
}

func ParseBounds(str string) ([][2]float64, error) {
  parts := strings.Split(str, ",")
  if len(parts) != 4 {
    return nil, errors.New("Bounding box must consist of 4 values")
  }

  values := make([]float64, 4)
  for ix, str := range parts {
    v, err := strconv.ParseFloat(str, 64);
    if err != nil {
      return nil, err
    }

    values[ix] = v
  }

  res := [][2]float64 {
    { values[0], values[1] },
    { values[2], values[3] },
  }

  return res, nil
}
