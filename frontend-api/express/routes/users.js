var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
const filePath = "/Users/nathanwibowo/Desktop/maven_ais_FEB2023_FEB2024/"; // Replace with the actual directory path

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/earthquake", (req, res) => {
	try {
		// Read files from the directory
		const earthquakeFile = fs.readFileSync(path.join(__dirname,'../../..','/backend/data/earthquakes.geojson'), "utf-8");
    if (earthquakeFile) {
      const earthquakeData =  JSON.parse(earthquakeFile);
			res.status(200).json(earthquakeData);
		} else {
			res.status(404).json({ error: `GeoJSON file '${earthquakeFile}' not found` });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/:month', (req, res) => {
  const month = req.params.month;
  try {
      // Read files from the directory
      const files = fs.readdirSync(filePath);

      // Filter files based on the provided month
      const matchingFiles = files.filter(file => {
          // Extract year and month from the file name
          const [year, fileMonth] = file.split('_');
          return fileMonth === month;
      });

      if (matchingFiles.length > 0) {
          // Read the content of each matching file
          const geojsonFeatures = {};
          matchingFiles.forEach(matchingFile => {
              const fileContent = fs.readFileSync(path.join(filePath, matchingFile), 'utf-8');
              const geojsonData = JSON.parse(fileContent);
              geojsonFeatures[matchingFile] = geojsonData
          });
          // Return GeoJSON data
          res.status(200).json(geojsonFeatures);
      } else {
          // No files found for the provided month
          res.status(404).json({ error: `No GeoJSON files found for the month '${month}'` });
      }
  } catch (error) {
      // Handle errors
      res.status(500).json({ error: error.message });
  }
});


module.exports = router;
