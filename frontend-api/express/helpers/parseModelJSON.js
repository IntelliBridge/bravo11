const fs = require("fs");

module.exports = {
	parseModelJSON: function (dateToGrab, jsonRoute) {
		const data = fs.readFileSync(jsonRoute, "utf8");
		const geoJSONReturn = {
			type: "FeatureCollection",
			features: [],
		};

		const dataArray = JSON.parse(data);

		dataArray.forEach((element) => {
			const date = element.timestamp[0].split(" ")[0];
			if (date === dateToGrab) {
				element["geo heatmap"].forEach((element) => {
					const coordinates = [element["lon"], element["lat"]];

					const feature = {
						type: "Feature",
						properties: {
							probability: Number(element["probability"]),
						},
						geometry: {
							type: "Point",
							coordinates: coordinates,
						},
					};

					geoJSONReturn.features.push(feature);
				});
			}
		});

		return geoJSONReturn;
	},
};
