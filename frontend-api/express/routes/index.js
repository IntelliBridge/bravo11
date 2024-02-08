var express = require("express");
const { default: parseVesselCSV } = require("../helpers/parseVesselCSV");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

router.get("/getFeatures/:dateToGrab", function (req, res, next) {
	const dateToGrab = req.params.dateToGrab;
	const featureCollection = parseVesselCSV(
		dateToGrab,
		"../tempDatabase/synthetic_bas_10k_bravo11.csv"
	);

	console.log(featureCollection);

	res.status(200).json(featureCollection);
});

module.exports = router;
