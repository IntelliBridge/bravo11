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
	gdeltExportFolder := filepath.Join(dataDir, "gdelt", "export")
	log.Printf("Loading gdelt exports data from %s\n", gdeltExportFolder)
	InsertCSVDataToElastic(client, "gdelt-exports", GDELT_EXPORT_MAPPING, gdeltExportFolder)
	satelliteFolder := filepath.Join(dataDir, "satellite_access")
	log.Printf("Loading satellite data from %s\n", satelliteFolder)
	InsertCSVDataToElastic(client, "satellite-access", SATELLITE_MAPPING, satelliteFolder)
}
