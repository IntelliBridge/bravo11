const fs = require("fs");

module.exports = {
	parseVesselCSV: function (dateToGrab, csvRoute) {
		// Read the CSV file
		const data = fs.readFileSync(csvRoute, "utf8");

		let featureCollection = {};

		const output = [];

		// Split the data into lines
		const lines = data.split("\n");

		// Loop through each line and split it into fields
		lines.forEach((line) => {
			const fields = line.split(",");
			output.push(fields);
		});

		const dateIndex = output[0].findIndex((element) => element === "detection_timestamp");
		const lonIndex = output[0].findIndex((element) => element === "detection_longitude");
		const latIndex = output[0].findIndex((element) => element === "detection_latitude");

		const onlySpecifiedDaysArray = [];

		output.forEach((line) => {
			const fullDate = line[dateIndex];

			if (fullDate && fullDate.includes(" ")) {
				const date = fullDate.split(" ")[0];

				if (date === dateToGrab) {
					onlySpecifiedDaysArray.push(line);
				}
			}
		});

		const formattedGeoJSONFeaturesArray = [];

		onlySpecifiedDaysArray?.forEach((line) => {
			const featureObject = {
				type: "Feature",
			};

			const lineLon = Number(line[lonIndex]);
			const lineLat = Number(line[latIndex]);

			featureObject.geometry = {
				type: "Point",
				coordinates: [lineLon, lineLat],
				properties: {},
			};

			formattedGeoJSONFeaturesArray.push(featureObject);
		});

		featureCollection = {
			type: "FeatureCollection",
			features: formattedGeoJSONFeaturesArray,
		};

		return featureCollection;
	},
};
