var express = require("express");
const { parseVesselCSV } = require("../helpers/parseVesselCSV.js");

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

router.get("/getfeatures", function (req, res, next) {
	parseVesselCSV(
		"1",
		"/Users/anthonyhoang/Developer/Bravo11/bravo11BESPIN/frontend-api/express/tempDatabase/synthetic_bas_10k_bravo11.csv"
	);
});

router.get("/getfeatures/:dateToGrab", function (req, res, next) {
	const dateToGrab = req.params.dateToGrab;
	const featureCollection = parseVesselCSV(
		dateToGrab,
		"/Users/anthonyhoang/Developer/Bravo11/bravo11BESPIN/frontend-api/express/tempDatabase/synthetic_bas_10k_bravo11.csv"
	);

	res.status(200).json(featureCollection);
});

module.exports = router;
