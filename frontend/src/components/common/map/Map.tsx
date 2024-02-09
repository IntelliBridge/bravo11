import React, { useRef, useEffect, useState, useCallback } from "react";
import moment, { Moment } from "moment";
import { Timeline, TimelineOptions, DataItemCollectionType } from "vis-timeline";
import { throttle } from "throttle-debounce";
import {
	Tabs,
	Tab,
	MenuDivider,
	Radio,
	RadioGroup,
	Slider,
	Button,
	Card,
	H5,
	H6,
	Checkbox,
} from "@blueprintjs/core";
import Map, { MapRef } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { AnySourceData } from "mapbox-gl";
import { OutlinedInput } from "@mui/material";

import { BaseLayer, DataLayer, Terrain } from "../../../types/map";
import Chat from "components/ui/cards/Chat";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/table/lib/css/table.css";
import "vis-timeline/dist/vis-timeline-graph2d.min.css";
import "./Map.css";
interface CopProps {
	baseLayers: BaseLayer[];
	dataLayers: DataLayer[];
	terrain: Terrain;
}

const DATA_POINTS = 100;
const INITIAL_LAT = 14.628;
const INITIAL_LONG = 115.834;

function randomIntFromInterval(min: number, max: number) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}
const generateCoordinates = () => {
	var latitude = INITIAL_LAT;
	var longitude = INITIAL_LONG;
	var coords = [];
	for (var i = 0; i < DATA_POINTS; i++) {
		var latDiff = 0.01 * randomIntFromInterval(-5, 25);
		var longDiff = 0.01 * randomIntFromInterval(-5, 25);
		latitude = latitude + latDiff;
		longitude = longitude + longDiff;
		coords.push([longitude, latitude]);
	}
	return coords;
};

const generateCI = (lat: number, long: number) => {
	var v1: [number, number] = [long, lat];
	var v2: [number, number] = [long + 15, lat];
	var v3: [number, number] = [long, lat + 15];
	return [v1, v2, v3, v1];
};

var shipCoords = generateCoordinates();
var planeCoords = generateCoordinates();
var shipCiCone = generateCI(shipCoords.pop()![1], shipCoords.pop()![0]);
var planeCiCone = generateCI(planeCoords.pop()![1], planeCoords.pop()![0]);

const shipLayer: DataLayer = {
	name: "Ships",
	group: "OSINT",
	type: "geojson",
	timeWindow: 2592000000,
	timeField: "",
	locationField: "location",
	url: "api endpoint for fetching plane data here",
	layer: {
		id: "shipRoute",
		type: "line",
		source: "shipRoute",
		layout: {
			"line-join": "round",
			"line-cap": "round",
		},
		paint: {
			"line-color": "#66ff00",
			"line-width": 4,
		},
	},
};

const shipCiLayer: DataLayer = {
	name: "Ship Ci Layer",
	group: "OSINT",
	type: "geojson",
	timeWindow: 2592000000,
	timeField: "",
	locationField: "location",
	url: "api endpoint for fetching plane ci verts here",
	layer: {
		id: "shipCi",
		type: "fill",
		source: "shipRoute",
		paint: {
			"fill-color": "#66ff00",
			"fill-opacity": 0.4,
		},
		filter: ["==", "$type", "Polygon"],
	},
};

const planeLayer: DataLayer = {
	name: "Planes",
	group: "OSINT",
	type: "geojson",
	timeWindow: 2592000000,
	timeField: "",
	locationField: "location",
	url: "api endpoint for fetching plane data here",
	layer: {
		id: "planeRoute",
		type: "line",
		source: "planeRoute",
		layout: {
			"line-join": "round",
			"line-cap": "round",
		},
		paint: {
			"line-color": "#FF007F",
			"line-width": 4,
		},
		filter: ["==", "$type", "LineString"],
	},
};

const planeCiLayer: DataLayer = {
	name: "Plane Ci Layer",
	group: "OSINT",
	type: "geojson",
	timeWindow: 2592000000,
	timeField: "",
	locationField: "location",
	url: "api endpoint for fetching plane ci verts here",
	layer: {
		id: "planeCi",
		type: "fill",
		source: "planeRoute",
		paint: {
			"fill-color": "#FF007F",
			"fill-opacity": 0.4,
		},
		filter: ["==", "$type", "Polygon"],
	},
};

const shipSourceData: AnySourceData = {
	type: "geojson",
	data: {
		type: "FeatureCollection",
		features: [
			{
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: shipCoords,
				},
			},
			{
				type: "Feature",
				properties: {},
				geometry: {
					type: "Polygon",
					coordinates: [shipCiCone],
				},
			},
		],
	},
};

const planeSourceData: AnySourceData = {
	type: "geojson",
	data: {
		type: "FeatureCollection",
		features: [
			{
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: planeCoords,
				},
			},
			{
				type: "Feature",
				properties: {},
				geometry: {
					type: "Polygon",
					coordinates: [planeCiCone],
				},
			},
		],
	},
};

interface SourceDataLookup {
	key: string;
	data: AnySourceData;
}

function Cop(props: CopProps) {
	const timelineContainer = useRef(null);

	const map = useRef<MapRef | null>(null);
	const timeline = useRef<Timeline | null>(null);
	const currentTime = useRef<Moment | null>(null);
	const playInterval = useRef<number | null>(null);

	const [baseLayer, setBaseLayer] = useState<string>(props.baseLayers[0].url);
	const [baseLoading, setBaseLoading] = useState(false);
	const [layers, setLayers] = useState<string[]>([]);
	const [playing, setPlaying] = useState(false);
	const [time, setTime] = useState("2023-01-01T12:58:09.673Z");
	const [rate, setRate] = useState(1);
	const [earthquakeData, setEarthquakeData] = useState({} as string);
	const [AISData, setAISData] = useState({} as string);

	const earthquakeLayer: DataLayer = {
		name: "Model Prediction Heatmap",
		group: "OSINT",
		type: "geojson",
		timeWindow: 2592000000,
		timeField: "",
		locationField: "location",
		url: "api endpoint for fetching earthquake data here",
		layer: {
			id: "earthquakes",
			type: "heatmap",
			source: "earthquakes",
			maxzoom: 9,
			paint: {
				// Increase the heatmap weight based on frequency and property magnitude
				"heatmap-weight": ["interpolate", ["linear"], ["get", "probability"], 0, 0, 6, 4],
				// Increase the heatmap color weight weight by zoom level
				// heatmap-intensity is a multiplier on top of heatmap-weight
				"heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
				// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
				// Begin color ramp at 0-stop with a 0-transparancy color
				// to create a blur-like effect.
				"heatmap-color": [
					"interpolate",
					["linear"],
					["heatmap-density"],
					0,
					"rgba(33,102,172,0)",
					0.2,
					"rgb(103,169,207)",
					0.4,
					"rgb(209,229,240)",
					0.6,
					"rgb(253,219,199)",
					0.8,
					"rgb(239,138,98)",
					1,
					"rgb(178,24,43)",
				],
				// Adjust the heatmap radius by zoom level
				"heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
				// Transition from heatmap to circle layer by zoom level
				"heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
			},
		},
	};

	const AISLayer: DataLayer = {
		name: "BAS Synthetic Data",
		group: "OSINT",
		type: "geojson",
		timeWindow: 2592000000,
		timeField: "",
		locationField: "location",
		url: "api endpoint for fetching AIS data here",
		layer: {
			id: "AISData",
			type: "circle",
			source: "AISData",
			paint: {
				"circle-radius": 2.5,
				"circle-color": "#FF007F",
			},
		},
	};

	useEffect(() => {
		const jsonifyFile = async (jsonSource: string, setter: any) => {
			const file = await fetch(jsonSource);
			const json = await file.json();

			setter(json);
		};

		const date = time.slice(0, 10);
		const AISURL = `http://localhost:3001/getBAS/${date}`;
		const modelURL = `http://localhost:3001/getModelPrediction/${date}`;

		jsonifyFile(modelURL, setEarthquakeData);
		// jsonifyFile("/conf/2023_12_14.geojson", setAISData);
		jsonifyFile(AISURL, setAISData);
	}, [time]);

	let earthquakeSourceData: AnySourceData = {
		type: "geojson",
		data: earthquakeData,
	};

	let AISSourceData: AnySourceData = {
		type: "geojson",
		data: AISData,
	};

	const dataLayers: DataLayer[] = [shipLayer, planeLayer, earthquakeLayer, AISLayer];
	const ciConeLayers: DataLayer[] = [shipCiLayer, planeCiLayer];
	const dataSources: SourceDataLookup[] = [
		{
			key: shipLayer.layer.id,
			data: shipSourceData,
		},
		{
			key: planeLayer.layer.id,
			data: planeSourceData,
		},
		{
			key: earthquakeLayer.layer.id,
			data: earthquakeSourceData,
		},
		{
			key: AISLayer.layer.id,
			data: AISSourceData,
		},
	];

	// const [selectedTab, setSelectedTab] = useState("data");  // todo(myles) uncomment this
	const [selectedTab, setSelectedTab] = useState("filter");
	const [modalOpen, setModalOpen] = useState(true);

	const loadLayer = async (dataLayer: DataLayer, t: Moment) => {
		if (dataLayer.type === "geojson") {
			// const response = await fetch(getGeojsonURL(dataLayer, t));
			// const features = await response.json();
			// console.log(features);
			// @ts-ignore
			// map.current?.getMap().getSource(dataLayer.name).setData(features);
			map.current?.getMap().getSource(dataLayer.name).setData(geoJson);
		}
	};

	useEffect(() => {
		dataLayers.forEach((layer: DataLayer) => {
			const layerOnMap = map.current?.getMap().getLayer(layer.layer.id) !== undefined;
			var ciLayer = ciConeLayers.find((s) => s.layer.source === layer.layer.id);
			if (layerOnMap && !layers.includes(layer.layer.id)) {
				map.current?.getMap().removeLayer(layer.layer.id);
				if (ciLayer) {
					map.current?.getMap().removeLayer(ciLayer.layer.id);
				}
				map.current?.getMap().removeSource(layer.layer.id);
			}

			var data = dataSources.find((s) => s.key === layer.layer.id);
			if (!layerOnMap && layers.includes(layer.layer.id) && data !== undefined) {
				map.current?.getMap().addSource(layer.layer.id, data.data);
				map.current?.getMap().addLayer(layer.layer);
				// get ci data
				if (ciLayer) {
					map.current?.getMap().addLayer(ciLayer.layer);
				}

				map.current
					?.getMap()
					.flyTo({ center: [INITIAL_LONG + 5, INITIAL_LAT + 5], zoom: 4 });
			}
		});
	}, [layers, baseLoading]);

	// useEffect(() => {
	//   props.dataLayers.forEach((dataLayer: DataLayer) => {
	//     const layerOnMap =
	//       map.current?.getMap().getLayer(dataLayer.name) !== undefined;
	//
	//     if (layerOnMap && !layers.includes(dataLayer.name)) {
	//       map.current?.getMap().removeLayer(dataLayer.name);
	//       map.current?.getMap().removeSource(dataLayer.name);
	//     }
	//
	//     if (!layerOnMap && layers.includes(dataLayer.name)) {
	//       if (currentTime.current === null) {
	//         return;
	//       }
	//
	//       if (dataLayer.type === "vector") {
	//         map.current?.getMap().addSource(dataLayer.name, {
	//           type: "vector",
	//           tiles: [getVectorURL(dataLayer, currentTime.current)],
	//           minzoom: 0,
	//           maxzoom: 24,
	//           promoteId: "_id",
	//         });
	//       } else if (dataLayer.type === "geojson") {
	//         map.current?.getMap().addSource(dataLayer.name, {
	//           type: "geojson",
	//           data: getGeojsonURL(dataLayer, currentTime.current),
	//           promoteId: "_id",
	//         });
	//       }
	//
	//       map.current?.getMap().addLayer(dataLayer.layer);
	//
	//       if (dataLayer.type === "vector") {
	//         map.current?.on("mousemove", dataLayer.name, (event) => {
	//           if (map.current == null) return;
	//
	//           map.current.getCanvas().style.cursor = "pointer";
	//
	//           // Check whether features exist
	//           if (event.features === undefined || event.features.length === 0)
	//             return;
	//
	//           if (hover.current !== null && hoverLayer.current !== null) {
	//             map.current.removeFeatureState({
	//               source: hoverLayer.current,
	//               id: hover.current,
	//               sourceLayer: "hits",
	//             });
	//           }
	//
	//           const id = event.features[0].id;
	//
	//           if (id !== undefined) {
	//             hover.current = id as number;
	//             hoverLayer.current = dataLayer.name;
	//
	//             map.current.setFeatureState(
	//               {
	//                 source: hoverLayer.current,
	//                 id: hover.current,
	//                 sourceLayer: "hits",
	//               },
	//               {
	//                 hover: true,
	//               }
	//             );
	//           }
	//         });
	//
	//         map.current?.on("mouseleave", dataLayer.name, function () {
	//           if (map.current == null) return;
	//
	//           map.current.getCanvas().style.cursor = "";
	//
	//           if (hover.current !== null && hoverLayer.current !== null) {
	//             map.current.setFeatureState(
	//               {
	//                 source: hoverLayer.current,
	//                 id: hover.current,
	//                 sourceLayer: "hits",
	//               },
	//               { hover: false }
	//             );
	//           }
	//           hover.current = null;
	//         });
	//       }
	//
	//       map.current?.on("click", dataLayer.name, async (event) => {
	//         if (map.current == null) return;
	//
	//         // Check whether features exist
	//         if (event.features === undefined || event.features.length === 0)
	//           return;
	//
	//         const f = event.features[0];
	//         if (f.properties !== null) {
	//           const response = await fetch(
	//             `/api/info/${f.properties._index}/_doc/${f.properties._id}`
	//           );
	//           const feature = await response.json();
	//           setFeature(feature);
	//         }
	//       });
	//     }
	//   });
	// }, [layers, baseLoading, props.dataLayers]);

	const throttleFunc = throttle(1000, (t) => {
		currentTime.current = moment(t.time);
		setTime(t.time.toISOString());

		const currentLayers = map.current?.getMap().getStyle().layers;
		currentLayers?.forEach((layer) => {
			const dataLayer = props.dataLayers.find((d: DataLayer) => d.name === layer.id);

			if (dataLayer) {
				loadLayer(dataLayer, t.time);
			}
		});
	});

	const goLive = () => {
		const live = moment();
		timeline.current?.setCustomTime(live.toDate(), "cursor");
		throttleFunc({ time: live });
	};

	const playCustom = useCallback(() => {
		setPlaying(true);
		playInterval.current = window.setInterval(() => {
			if (currentTime.current !== null) {
				const newTime = currentTime.current.add(100 * rate, "milliseconds");
				timeline.current?.setCustomTime(newTime.toDate(), "cursor");
				throttleFunc({ time: newTime });
			}
		}, 100);
	}, [rate, throttleFunc]);

	const pauseCustom = useCallback(() => {
		setPlaying(false);
		if (playInterval.current !== null) {
			clearInterval(playInterval.current);
		}
	}, []);

	useEffect(() => {
		if (timelineContainer.current !== null && timeline.current == null) {
			const options: TimelineOptions = {
				showCurrentTime: true,
				snap: null,
				height: 48,
			};

			const dataset: DataItemCollectionType = [];

			timeline.current = new Timeline(timelineContainer.current, dataset, options);

			currentTime.current = moment("2023-01-01T12:58:09.673Z");

			timeline.current.addCustomTime(currentTime.current.toDate(), "cursor");
			timeline.current.on("timechange", (t) => {
				pauseCustom();
				throttleFunc(t);
			});
		}
	}, [throttleFunc, pauseCustom]);

	const radioButtons: JSX.Element[] = [];
	props.baseLayers.forEach((l: BaseLayer) => {
		radioButtons.push(<Radio key={l.name} label={l.name} value={l.url} />);
	});

	const baseLayerTab = (
		<>
			<H5 style={{ marginBottom: 20 }}>Base Layers</H5>
			<RadioGroup
				selectedValue={baseLayer}
				onChange={(e: React.FormEvent<HTMLInputElement>) => {
					setBaseLayer(e.currentTarget.value);
					setBaseLoading(false);
				}}>
				{radioButtons}
			</RadioGroup>
			<div style={{ marginTop: 20 }}>
				<MenuDivider />
			</div>
			<H5 style={{ marginBottom: 20, marginTop: 20 }}>Terrain</H5>
			<Checkbox
				label={"Terrain"}
				defaultChecked={false}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					if (map.current == null) return;

					if (e.target.checked) {
						map.current.getMap().addSource("terrain", {
							type: "raster-dem",
							url: props.terrain.url,
						});
						map.current.getMap().setTerrain({
							source: "terrain",
						});
					} else {
						map.current.getMap().setTerrain();
						map.current.getMap().removeSource("terrain");
					}
				}}
			/>
		</>
	);

	const checkboxes: JSX.Element[] = [];
	let previousGroup = "";
	dataLayers.forEach((l: DataLayer) => {
		if (l.group !== previousGroup) {
			previousGroup = l.group;
			checkboxes.push(
				<H6 key={l.group} style={{ marginTop: 20 }}>
					{l.group}
				</H6>
			);
		}

		checkboxes.push(
			<Checkbox
				key={l.name}
				label={l.name}
				checked={layers.includes(l.layer.id)}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					if (e.target.checked) {
						setLayers([...layers, l.layer.id]);
					} else {
						let tmpLayers = layers.slice(0);
						tmpLayers = tmpLayers.filter((layer) => layer !== l.layer.id);
						setLayers(tmpLayers);
					}
				}}
			/>
		);
	});

	const dataLayerTab = (
		<>
			<H5 style={{ marginBottom: 20 }}>Data Layers</H5>
			{checkboxes}
		</>
	);

	const [filterId, setFilterId] = useState("");
	const [filterPort, setFilterPort] = useState("");
	const handleFilter = useCallback(() => {
		console.log("do something :)");
		console.log(filterId, filterPort);
	}, [filterId, filterPort]);

	const filterLayerTab = (
		<>
			<H5 style={{ marginBottom: 20 }}>Filter</H5>
			<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
				<div>
					<H6>Entity ID</H6>
					<OutlinedInput
						id="filter-id"
						fullWidth
						value={filterId}
						onChange={(e) => setFilterId(e.target.value)}
						aria-describedby="filter-id-text"
						inputProps={{ "aria-label": "weight" }}
					/>
				</div>
				<div>
					<H6>Port o' origin</H6>
					<OutlinedInput
						id="filter-port"
						fullWidth
						value={filterPort}
						onChange={(e) => setFilterPort(e.target.value)}
						aria-describedby="filter-port-text"
						inputProps={{ "aria-label": "weight" }}
					/>
				</div>
				<Button large onClick={handleFilter}>
					<span style={{ fontWeight: 600 }}>Filter</span>
				</Button>
			</div>
		</>
	);

	const chatTab = <Chat />;

	const timebar = (
		<div
			style={{
				position: "absolute",
				width: "100%",
				bottom: 0,
				padding: 20,
				display: "flex",
			}}>
			<Card
				elevation={4}
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					padding: 0,
					maxWidth: 800,
					margin: "auto",
				}}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
					}}>
					<div
						style={{
							display: "flex",
							flex: 1,
							marginLeft: 10,
							alignItems: "center",
						}}>
						{playing ? (
							<Button icon="pause" large minimal onClick={() => pauseCustom()} />
						) : (
							<Button icon="play" large minimal onClick={() => playCustom()} />
						)}
						<Button
							icon="dashboard"
							large
							minimal
							onClick={() => {
								pauseCustom();
								setRate(1);
							}}
						/>
						<div style={{ width: 150, marginLeft: 20 }}>
							<Slider
								min={1}
								max={60}
								stepSize={1}
								labelRenderer={false}
								onChange={(e) => {
									pauseCustom();
									setRate(e);
								}}
								value={rate}
							/>
						</div>
						<H5 style={{ margin: 0, marginLeft: 20, textAlign: "center" }}>{rate}X</H5>
					</div>
					<div
						style={{
							flex: 1,
							display: "flex",
							justifyContent: "end",
							alignItems: "center",
							marginRight: 10,
						}}>
						<H5 style={{ margin: 0, marginRight: 10, textAlign: "center" }}>{time}</H5>
						<Button icon="record" intent="danger" onClick={() => goLive()}>
							Live
						</Button>
					</div>
				</div>
				<div ref={timelineContainer}></div>
			</Card>
		</div>
	);

	return (
		<div
			className={"bp4-dark"}
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				position: "relative",
			}}>
			<Map
				ref={map}
				// @ts-ignore
				mapLib={maplibregl}
				mapStyle={baseLayer}
				antialias={true}
				onLoad={() => {
					setBaseLoading(true);
				}}
				children={null}
			/>
			{timebar}
			<div
				style={{
					width: 375,
					position: "absolute",
					margin: 20,
					right: 0,
					top: 0,
					maxHeight: "calc(100% - 40px)",
				}}>
				<Card elevation={4} style={{ overflow: "hidden" }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
						}}>
						<Tabs
							selectedTabId={selectedTab}
							onChange={(tab) => {
								setModalOpen(true);
								setSelectedTab(tab as string);
							}}>
							<Tab id="data" title="Data" />
							<Tab id="base" title="Base" />
							<Tab id="filter" title="Filter" />
							<Tab id="chat" title="Chat" />
						</Tabs>
						<div style={{ flex: 1 }} />
						<Button
							icon={modalOpen ? "minus" : "plus"}
							large
							minimal
							onClick={() => setModalOpen(!modalOpen)}
						/>
					</div>
					<div
						style={{
							maxHeight: modalOpen ? 10000 : 0,
							transition: modalOpen
								? "max-height 1s ease-in-out"
								: "max-height 0.5s cubic-bezier(0, 1, 0, 1)",
						}}>
						<div style={{ height: 20 }} />
						{
							{
								data: dataLayerTab,
								base: baseLayerTab,
								filter: filterLayerTab,
								chat: chatTab,
							}[selectedTab]
						}
					</div>
				</Card>
			</div>
		</div>
	);
}

export default Cop;
