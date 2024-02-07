package main

import (
	"fmt"
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

func TestInsertGdeltExportCSVs(t *testing.T) {
	inputFolder := "../../data/gdelt/export"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	InsertCSVDataToElastic(client, "gdelt-exports", GDELT_EXPORT_MAPPING, inputFolder)
}

func TestInsertGdeltMentionCSVs(t *testing.T) {
	inputFolder := "../../data/gdelt/mentions"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	InsertCSVDataToElastic(client, "gdelt-mentions", "", inputFolder)
}

func TestInsertSatelliteCSVs(t *testing.T) {
	inputFolder := "../../data/satellite_accesses"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	InsertCSVDataToElastic(client, "satellite", SATELLITE_MAPPING, inputFolder)
}

func TestInsertAcledCSVs(t *testing.T) {
	inputFolder := "../../data/acled"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	InsertCSVDataToElastic(client, "acled", ACLED_MAPPING, inputFolder)
}

func TestInsertInfraData(t *testing.T) {
	inputFolder := "../../data/infra"
	client := CreateClient([]string{"http://localhost:9200"}, "elastic", "changeme")
	InsertCSVDataToElastic(client, "infra", INFRA_MAPPING, inputFolder)
}

//func TestRetrieveData(t *testing.T) {
//	//https://elastic:UGr00p!@udp-stage-api.ugroup.io
//	client := CreateClient([]string{"https://udp-stage-api.ugroup.io"}, "elastic", "UGr00p!")
//	resp, err := esapi.CatIndicesRequest{Format: "json"}.Do(context.Background(), client)
//	if err != nil {
//		t.Fatal(err)
//	}
//	defer resp.Body.Close()
//	dsp, err := client.Search(client.Search.WithIndex("nato_infrastructure_logistics_092622"))
//	if err != nil {
//		t.Fatal(err)
//	}
//	fmt.Println(resp.String())
//}
