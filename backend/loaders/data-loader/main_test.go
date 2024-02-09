package main

import (
	"fmt"
	"log"
	"testing"
)

//func TestInsert(t *testing.T) {
//	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
//	data := genData(2000)
//	InsertDataToElastic(client, "test-bulk-example", "", data)
//}

func TestInjectGdeltExportCsvHeader(t *testing.T) {
	inputFolder := "./data/gdelt/export/withoutheader"
	outputFolder := "./data/gdelt/export/withheader"
	AddHeaderForAllCSVsEntireFolder(inputFolder, outputFolder, GDELT_EXPORT_HEADER)
}

func TestInjectGdeltMentionsCsvHeader(t *testing.T) {
	inputFolder := "./data/gdelt/mentions/withoutheader"
	outputFolder := "./data/gdelt/mentions/withheader"
	AddHeaderForAllCSVsEntireFolder(inputFolder, outputFolder, GDELT_MENTION_HEADER)
}

func TestDownloadGdelt(t *testing.T) {
	nextTimeExportURLGenerator := generateNextTime("20240101000000", "20060102150405")

	// Example: Iterate until no more URLs are available
	for {
		exportURL, mentionsURL, ok := nextTimeExportURLGenerator()
		if !ok {
			break // Stop if there are no more times available
		}
		fmt.Println(exportURL)
		err := downloadFile(exportURL)
		if err != nil {
			panic(err)
		}
		err = downloadFile(mentionsURL)
		if err != nil {
			panic(err)
		}
	}
}

func TestDeleteIndex(t *testing.T) {
	es := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	res, err := es.Indices.Delete([]string{"ais"}, es.Indices.Delete.WithIgnoreUnavailable(true))
	if err != nil || res.IsError() {
		log.Fatalf("Cannot delete index: %s", err)
	}
	res.Body.Close()
}

func TestInsertGdeltExportCSVs(t *testing.T) {
	inputFolder := "../../data/test"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	ResetDataForElasticIndex(client, SourceTypeGDELTExport, "gdelt-exports", GDELT_EXPORT_MAPPING, inputFolder)
}

func TestInsertGdeltMentionCSVs(t *testing.T) {
	inputFolder := "../../data/test"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	ResetDataForElasticIndex(client, SourceTypeGDELTMention, "gdelt-mentions", "", inputFolder)
}

func TestInsertSatelliteCSVs(t *testing.T) {
	inputFolder := "../../data/satellite_accesses"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	ResetDataForElasticIndex(client, SourceTypeSatelliteAccess, "satellite-assets", ASSET_MAPPING, inputFolder)
}

func TestInsertAISCSVs(t *testing.T) {
	inputFolder := "../../data/aisFeb23_Feb24csv"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	ResetDataForElasticIndex(client, SourceTypeAIS, "ais-assets", ASSET_MAPPING, inputFolder)
}

func TestInsertBASCSVs(t *testing.T) {
	inputFolder := "../../data/bas"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	ResetDataForElasticIndex(client, SourceTypeBAS, "bas-assets", ASSET_MAPPING, inputFolder)
}

func TestInsertAdsbCSVs(t *testing.T) {
	inputFolder := "../../data/test"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	ResetDataForElasticIndex(client, SourceTypeADSB, "adsb-assets", ASSET_MAPPING, inputFolder)
}

func TestInsertAcledCSVs(t *testing.T) {
	inputFolder := "../../data/acled"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	ResetDataForElasticIndex(client, SourceTypeACLED, "acled", ACLED_MAPPING, inputFolder)
}

func TestInsertInfraData(t *testing.T) {
	inputFolder := "../../data/infra"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	ResetDataForElasticIndex(client, SourceTypeInfra, "infra", INFRA_MAPPING, inputFolder)
}

func TestInsertNatoRedBlueData(t *testing.T) {
	inputFolder := "../../data/nato_red_blue"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	ResetDataForElasticIndex(client, SourceTypeNatoRedBlue, "nato-red-blue", NATO_RED_BLUE_MAPPING, inputFolder)
}
func TestInsertCountryAssessmentData(t *testing.T) {
	inputFolder := "../../data/country_assessment"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	ResetDataForElasticIndex(client, SourceTypeCountryAssessment, "country-assessment", COUNTRY_ASSESSMENT_MAPPING, inputFolder)
}
