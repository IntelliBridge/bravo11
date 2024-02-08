import React, { useRef, useEffect, useState, useCallback } from "react";
import moment, { Moment } from "moment";
import {
  Timeline,
  TimelineOptions,
  DataItemCollectionType,
} from "vis-timeline";
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

import { BaseLayer, DataLayer, Terrain } from "../../../types/map";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/table/lib/css/table.css";
import "vis-timeline/dist/vis-timeline-graph2d.min.css";
import "./Map.css";
import { getLineStringByAsset } from "../../../utils/dataHelper";

interface CopProps {
  baseLayers: BaseLayer[];
  dataLayers: DataLayer[];
  terrain: Terrain;
}

// const DATA_POINTS = 100;
const INITIAL_LAT = 14.628;
const INITIAL_LONG = 115.834
//
// function randomIntFromInterval(min: number, max: number) { // min and max included
//   return Math.floor(Math.random() * (max - min + 1) + min)
// }
// const generateCoordinates = () => {
//   var latitude = INITIAL_LAT;
//   var longitude = INITIAL_LONG;
//   var coords = [];
//   for (var i = 0; i < DATA_POINTS; i++) {
//     var latDiff = .01 * randomIntFromInterval(-5, 25);
//     var longDiff = .01 * randomIntFromInterval(-5, 25);
//     latitude = latitude + latDiff;
//     longitude = longitude + longDiff;
//     coords.push([longitude, latitude])
//   }
//   return coords;
// }
//
// const generateCI = (lat: number, long: number) => {
//   var v1: [number, number] = [long, lat];
//   var v2: [number, number] = [long + 15, lat];
//   var v3: [number, number] = [long, lat + 15];
//   return [v1, v2, v3, v1];
// }
//
// var shipCoords = generateCoordinates();
// var planeCoords = generateCoordinates();
// var shipCiCone = generateCI(shipCoords.pop()![1], shipCoords.pop()![0]);
// var planeCiCone = generateCI(planeCoords.pop()![1], planeCoords.pop()![0]);

const shipLayer: DataLayer = {
  "name": "Ships",
  "group": "OSINT",
  "type": "geojson",
  "timeWindow": 2592000000,
  "timeField": "",
  "locationField": "location",
  "url": "api endpoint for fetching ship data here",
  "layer": {
    "id": "ships",
    "type": "line",
    "source": "ships",
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "#66ff00",
      "line-width": 3
    }
  }
};

// const shipCiLayer: DataLayer = {
//   "name": "Ship Ci Layer",
//   "group": "OSINT",
//   "type": "geojson",
//   "timeWindow": 2592000000,
//   "timeField": "",
//   "locationField": "location",
//   "url": "api endpoint for fetching plane ci verts here",
//   "layer": {
//     'id': 'shipCi',
//     'type': 'fill',
//     'source': 'shipRoute',
//     'paint': {
//       'fill-color': '#66ff00',
//       'fill-opacity': 0.4
//     },
//     'filter': ['==', '$type', 'Polygon']
//   }
// };

const planeLayer: DataLayer = {
  "name": "Planes",
  "group": "OSINT",
  "type": "geojson",
  "timeWindow": 2592000000,
  "timeField": "",
  "locationField": "location",
  "url": "api endpoint for fetching plane data here",
  "layer": {
    'id': 'planes',
    'type': 'line',
    'source': 'planes',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': '#FF007F',
      'line-width': 3
    },
    'filter': ['==', '$type', 'LineString']
  }
};

const satLayer: DataLayer = {
  "name": "Satellites",
  "group": "OSINT",
  "type": "geojson",
  "timeWindow": 2592000000,
  "timeField": "",
  "locationField": "location",
  "url": "api endpoint for fetching sats data here",
  "layer": {
    'id': 'sats',
    'type': 'line',
    'source': 'sats',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': '#800080',
      'line-width': 3
    },
    'filter': ['==', '$type', 'LineString']
  }
};
// const planeCiLayer: DataLayer = {
//   "name": "Plane Ci Layer",
//   "group": "OSINT",
//   "type": "geojson",
//   "timeWindow": 2592000000,
//   "timeField": "",
//   "locationField": "location",
//   "url": "api endpoint for fetching plane ci verts here",
//   "layer": {
//     'id': 'planeCi',
//     'type': 'fill',
//     'source': 'planeRoute',
//     'paint': {
//       'fill-color': '#FF007F',
//       'fill-opacity': 0.4
//     },
//     'filter': ['==', '$type', 'Polygon']
//   }
// };

// const shipSourceData: AnySourceData = {
//   'type': 'geojson',
//   'data': {
//     'type': 'FeatureCollection',
//     'features': [
//       {
//         'type': 'Feature',
//         'properties': {},
//         'geometry': {
//           'type': 'LineString',
//           'coordinates': shipCoords
//         }
//       },
//       {
//         'type': 'Feature',
//         'properties': {},
//         'geometry': {
//           'type': 'Polygon',
//           "coordinates": [shipCiCone]
//         }
//       }
//     ]
//   }
// };

// const planeSourceData: AnySourceData = {
//   'type': 'geojson',
//   'data': {
//     'type': 'FeatureCollection',
//     'features': [
//       {
//         'type': 'Feature',
//         'properties': {},
//         'geometry': {
//           'type': 'LineString',
//           'coordinates': planeCoords
//         }
//       },
//       {
//         'type': 'Feature',
//         'properties': {},
//         'geometry': {
//           'type': 'Polygon',
//           "coordinates": [planeCiCone]
//         }
//       }
//     ]
//   }
// };

// interface SourceDataLookup {
//   key: string,
//   data: AnySourceData
// }

const dataLayers: DataLayer[] = [shipLayer, planeLayer, satLayer];
// const ciConeLayers: DataLayer[] = [shipCiLayer, planeCiLayer];
// const dataSources: SourceDataLookup[] = [
//   {
//     key: shipLayer.layer.id,
//     data: shipSourceData
//   },
//   {
//     key: planeLayer.layer.id,
//     data: planeSourceData
//   },
// ]

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
  const [time, setTime] = useState(moment().toISOString());
  const [rate, setRate] = useState(1);
  const [selectedTab, setSelectedTab] = useState("data");
  const [modalOpen, setModalOpen] = useState(true);

  const loadLayer = async (dataLayer: DataLayer, t: Moment) => {
    // var features: any[] = [];
    // console.log("data")
    // console.log(data);
    // data.data.features.forEach((f: any) => {
    //   var upperBoundTime = t.toDate();
    //   var truncateIndex = f.properties.timestamp.findIndex((e: any) => {
    //     console.log(new Date(e))
    //     console.log(upperBoundTime);
    //     return new Date(e) > upperBoundTime;
    //
    //   });
    //
    //   var length = f.geometry.coordinates;
    //   var truncatedCoords = f.geometry.coordinates.slice(truncateIndex, length);
    //   let feature: any = {
    //     id: f.id,
    //     properties: {
    //       timestamp: f.properties.timestamp
    //     },
    //     type: "LineString",
    //     geometry: {
    //       type: "LineString",
    //       coordinates: truncatedCoords
    //     }
    //   };
    //   features.push(feature);
    // });
    // const assetSourceData: AnySourceData = {
    //   type: 'geojson',
    //   data: {
    //     type: 'FeatureCollection',
    //     features: features
    //   }
    // };
    // console.log("new data")
    // console.log(assetSourceData);
    // // @ts-ignore
    // map.current?.getMap().getSource(dataLayer.layer.id).setData(assetSourceData);

  };

  useEffect(() => {
    dataLayers.forEach((layer: DataLayer) => {
      const layerId = layer.layer.id;
      const layerOnMap = map.current?.getMap().getLayer(layer.layer.id) !== undefined;
      // var ciLayer = ciConeLayers.find(s => s.layer.source === layer.layer.id);
      if (layerOnMap && !layers.includes(layerId)) {
        map.current?.getMap().removeLayer(layerId);
        // if (ciLayer) {
        //   map.current?.getMap().removeLayer(ciLayer.layer.id);
        // }
        map.current?.getMap().removeSource(layerId);
      }

      if (!layerOnMap && layers.includes(layerId)) {
        // async api call
        var assetSourceData = getLineStringByAsset(layerId);
        map.current?.getMap().addSource(layerId, assetSourceData);
        // assetSourceData.data.featu
        map.current?.getMap().addLayer(layer.layer);
        // get ci data
        // if (ciLayer) {
        //   map.current?.getMap().addLayer(ciLayer.layer);
        // }

        map.current
            ?.getMap()
            .flyTo({ center: [INITIAL_LONG + 5, INITIAL_LAT + 5], zoom: 4 });
      }
    })
  }, [layers, baseLoading]);



  const throttleFunc = throttle(1000, (t) => {
    currentTime.current = moment(t.time);
    setTime(t.time.toISOString());

    const currentLayers = map.current?.getMap().getStyle().layers;
    currentLayers?.forEach((layer) => {
      const dataLayer = dataLayers.find(
        (d: DataLayer) => d.layer.id === layer.id
      );
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

      timeline.current = new Timeline(
        timelineContainer.current,
        dataset,
        options
      );

      currentTime.current = moment();
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
        }}
      >
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


  const chatTab = (
    <iframe
      style={{ width: "100%", height: 600, border: "none" }}
      src={`./chat/channel/general?layout=embedded`}
      title="Chat"
    ></iframe>
  );

  const timebar = (
    <div
      style={{
        position: "absolute",
        width: "100%",
        bottom: 0,
        padding: 20,
        display: "flex",
      }}
    >
      <Card
        elevation={4}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: 0,
          maxWidth: 800,
          margin: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              marginLeft: 10,
              alignItems: "center",
            }}
          >
            {playing ? (
              <Button
                icon="pause"
                large
                minimal
                onClick={() => pauseCustom()}
              />
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
            <H5 style={{ margin: 0, marginLeft: 20, textAlign: "center" }}>
              {rate}X
            </H5>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <H5 style={{ margin: 0, marginRight: 10, textAlign: "center" }}>
              {time}
            </H5>
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
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Map
        ref={map}
        // @ts-ignore
        mapLib={maplibregl}
        mapStyle={baseLayer}
        antialias={true}
        onLoad={() => {
          setBaseLoading(true);
        }}
      >
      </Map>
      {timebar}
      <div
          style={{
            width: 375,
            position: "absolute",
            margin: 20,
            right: 0,
          }}
      >
        <Card elevation={4} style={{ overflow: "hidden" }}>
          <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
          >
            <Tabs
                selectedTabId={selectedTab}
                onChange={(tab) => {
                  setModalOpen(true);
                  setSelectedTab(tab as string);
                }}
            >
              <Tab id="data" title="Data" />
              <Tab id="base" title="Base" />
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
              }}
          >
            <div style={{ height: 20 }} />
            {
              {
                data: dataLayerTab,
                base: baseLayerTab,
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