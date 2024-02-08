package main

import (
	"log"
	"math/rand"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

const (
	flushBytes int = 5e+6 //Flush threshold in bytes
	assetIndex     = "assets"
)

var (
	numWorkers int = runtime.NumCPU()
)

func init() {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Fatal("No .env file found")
	}
	rand.Seed(time.Now().UnixNano())
}

func main() {
	log.SetFlags(0)

	var (
		//Example: "https://es1:9200,https://es2:9200,https://es3:9200"
		clusterURLs = os.Getenv("ELASTIC_CLUSTER_URLS") //comma separated
		username    = os.Getenv("ELASTIC_USERNAME")
		password    = os.Getenv("ELASTIC_PASSWORD")
		dataDir     = os.Getenv("DATA_DIR")
	)

	clusters := strings.Split(clusterURLs, ",")
	client := CreateClient(clusters, username, password)

	acledFolder := filepath.Join(dataDir, "acled")
	log.Printf("Loading ACLED data from %s\n", acledFolder)
	ResetDataForElasticIndex(client, SourceTypeACLED, "acled", ACLED_MAPPING, acledFolder)

	adsbFolder := filepath.Join(dataDir, "adsb")
	log.Printf("Loading ADSB data from %s\n", acledFolder)
	ResetDataForElasticIndex(client, SourceTypeADSB, assetIndex, ASSET_MAPPING, adsbFolder)

	aisFolder := filepath.Join(dataDir, "ais")
	log.Printf("Loading AIS data from %s\n", acledFolder)
	AppendDataForElasticIndex(client, SourceTypeAIS, assetIndex, aisFolder)

	countryFolder := filepath.Join(dataDir, "country_assessment")
	log.Printf("Loading country data from %s\n", acledFolder)
	ResetDataForElasticIndex(client, SourceTypeCountryAssessment, "country-assessment", "", countryFolder)

	gdeltExportFolder := filepath.Join(dataDir, "gdelt", "export")
	log.Printf("Loading GDELT exports data from %s\n", gdeltExportFolder)
	ResetDataForElasticIndex(client, SourceTypeGDELTExport, "gdelt-exports", GDELT_EXPORT_MAPPING, gdeltExportFolder)

	gdeltMentionsFolder := filepath.Join(dataDir, "gdelt", "mentions")
	log.Printf("Loading GDELT mentions data from %s\n", gdeltMentionsFolder)
	ResetDataForElasticIndex(client, SourceTypeGDELTMention, "gdelt-mentions", "", gdeltMentionsFolder)

	infraFolder := filepath.Join(dataDir, "infra")
	log.Printf("Loading infra data from %s\n", infraFolder)
	ResetDataForElasticIndex(client, SourceTypeInfra, "infra", INFRA_MAPPING, infraFolder)

	natoRedBlueFolder := filepath.Join(dataDir, "nato_red_blue")
	log.Printf("Loading nato red blue data from %s\n", natoRedBlueFolder)
	ResetDataForElasticIndex(client, SourceTypeNatoRedBlue, "nato-red-blue", NATO_RED_BLUE_MAPPING, natoRedBlueFolder)

	satelliteFolder := filepath.Join(dataDir, "satellite_access")
	log.Printf("Loading satellite data from %s\n", satelliteFolder)
	AppendDataForElasticIndex(client, SourceTypeSatelliteAccess, assetIndex, satelliteFolder)
	log.Printf("Done\n")
}
