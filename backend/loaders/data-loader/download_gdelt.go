package main

import (
	"archive/zip"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

var (
	currBatchDir string = "data2"
)

//func main() {
//
//	nextTimeExportURLGenerator := generateNextTime("20240101000000", "20060102150405")
//
//	// Example: Iterate until no more URLs are available
//	for {
//		exportURL, mentionsURL, ok := nextTimeExportURLGenerator()
//		if !ok {
//			break // Stop if there are no more times available
//		}
//		fmt.Println(exportURL)
//		err := downloadFile(exportURL)
//		if err != nil {
//			panic(err)
//		}
//		err = downloadFile(mentionsURL)
//		if err != nil {
//			panic(err)
//		}
//	}
//}

// generateNextTime returns a function that each time it's called, returns the next time incremented by 15 minutes in the specified URL format.
// Once it reaches the current time, it returns an empty string to indicate there are no more times available.
func generateNextTime(start string, format string) func() (string, string, bool) {
	baseExport := "http://data.gdeltproject.org/gdeltv2/%s.export.CSV.zip"
	baseMention := "http://data.gdeltproject.org/gdeltv2/%s.mentions.CSV.zip"
	// Parse the start time
	startTime, err := time.Parse(format, start)
	if err != nil {
		fmt.Println("Error parsing start time:", err)
		return nil
	}

	// Closure that encapsulates the startTime
	return func() (string, string, bool) {
		// Check if the current startTime has surpassed the current time
		if startTime.After(time.Now()) {
			return "", "", false // Indicate that no more times are available
		}

		// Generate the URL with the current startTime
		exportURL := fmt.Sprintf(baseExport, startTime.Format(format))
		mentionsURL := fmt.Sprintf(baseMention, startTime.Format(format))

		// Increment startTime by 15 minutes for the next call
		startTime = startTime.Add(15 * time.Minute)

		return exportURL, mentionsURL, true
	}
}

// downloadFile downloads and unzips a single zip "line" from the ziplist into
// the current batch directory (currBatchDir)
func downloadFile(url string) error {
	// Download zip file to currZip.zip.
	//	url := strings.Fields(zipLine)[2]
	csvZipHTTP, err := http.Get(url)
	if err != nil {
		return err
	}
	defer csvZipHTTP.Body.Close()

	out, err := os.Create("currZip.zip")
	if err != nil {
		return err
	}
	defer out.Close()
	io.Copy(out, csvZipHTTP.Body)

	// Unzip currZip.zip to current batch directory.
	err = unzip("currZip.zip", currBatchDir)
	if err != nil {
		return err
	}

	// Delete currZip.zip.
	return os.Remove("currZip.zip")
}

func unzip(src, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer func() {
		if err := r.Close(); err != nil {
			panic(err)
		}
	}()

	os.MkdirAll(dest, 0755)

	// Closure to address file descriptors issue with all the deferred .Close() methods
	extractAndWriteFile := func(f *zip.File) error {
		rc, err := f.Open()
		if err != nil {
			return err
		}
		defer func() {
			if err := rc.Close(); err != nil {
				panic(err)
			}
		}()

		path := filepath.Join(dest, f.Name)

		// Check for ZipSlip (Directory traversal)
		if !strings.HasPrefix(path, filepath.Clean(dest)+string(os.PathSeparator)) {
			return fmt.Errorf("illegal file path: %s", path)
		}

		if f.FileInfo().IsDir() {
			os.MkdirAll(path, f.Mode())
		} else {
			os.MkdirAll(filepath.Dir(path), f.Mode())
			f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
			if err != nil {
				return err
			}
			defer func() {
				if err := f.Close(); err != nil {
					panic(err)
				}
			}()

			_, err = io.Copy(f, rc)
			if err != nil {
				return err
			}
		}
		return nil
	}

	for _, f := range r.File {
		err := extractAndWriteFile(f)
		if err != nil {
			return err
		}
	}

	return nil
}
