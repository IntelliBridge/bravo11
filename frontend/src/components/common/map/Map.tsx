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
import { Cell, Column, Table } from "@blueprintjs/table";
import { Tile3DLayer } from "@deck.gl/geo-layers/typed";
import { MapboxOverlay } from "@deck.gl/mapbox/typed";
import { CesiumIonLoader } from "@loaders.gl/3d-tiles";
import Map, { MapRef, Marker } from "react-map-gl";
import maplibregl from "maplibre-gl";

import { BaseLayer, DataLayer, Terrain } from "../../../types/map";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/table/lib/css/table.css";
import "vis-timeline/dist/vis-timeline-graph2d.min.css";
import "./Map.css";
import { Ship } from "types/ship";

interface CopProps {
  baseLayers: BaseLayer[];
  dataLayers: DataLayer[];
  terrain: Terrain;
  shipData: Ship[]
}

function Cop(props: CopProps) {
  const timelineContainer = useRef(null);

  const map = useRef<MapRef | null>(null);
  const timeline = useRef<Timeline | null>(null);
  const currentTime = useRef<Moment | null>(null);
  const hover = useRef<number | null>(null);
  const hoverLayer = useRef<string | null>(null);
  const overlay = useRef<MapboxOverlay | null>(null);
  const playInterval = useRef<number | null>(null);

  const [feature, setFeature] = useState<any | null>(null);
  const [table, setTable] = useState<any | null>(null);
  const [baseLayer, setBaseLayer] = useState<string>(props.baseLayers[0].url);
  const [baseLoading, setBaseLoading] = useState(false);
  const [layers, setLayers] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(moment().toISOString());
  const [rate, setRate] = useState(1);
  const [selectedTab, setSelectedTab] = useState("data");
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  const getGeojsonURL = (dataLayer: DataLayer, t: Moment) => {
    let url = "";
    const bounds = map.current?.getBounds();

    if (bounds !== undefined) {
      //@ts-ignore
      const bottom = Math.max(bounds._sw.lat, -90);
      //@ts-ignore
      const left = Math.max(bounds._sw.lng, -180);
      //@ts-ignore
      const top = Math.min(bounds._ne.lat, 90);
      //@ts-ignore
      const right = Math.min(bounds._ne.lng, 180);

      const boundsquery = `${bottom},${left},${top},${right}`;
      url = `${dataLayer.url}?startTime=${
        t.valueOf() - dataLayer.timeWindow
      }&endTime=${t.valueOf()}&bbox=${boundsquery}&timeField=${
        dataLayer.timeField
      }&locationField=${dataLayer.locationField}`;
    }

    return url;
  };

  const getVectorURL = (dataLayer: DataLayer, t: Moment) => {
    const url = `${dataLayer.url}?startTime=${
      t.valueOf() - dataLayer.timeWindow
    }&endTime=${t.valueOf()}&timeField=${dataLayer.timeField}`;

    return url;
  };

  const loadLayer = async (dataLayer: DataLayer, t: Moment) => {
    if (dataLayer.type === "vector") {
      map.current
        ?.getMap()
        .getSource(dataLayer.name)
        //@ts-ignore
        .setTiles([getVectorURL(dataLayer, t)]);
    } else if (dataLayer.type === "geojson") {
      const response = await fetch(getGeojsonURL(dataLayer, t));
      const features = await response.json();

      // @ts-ignore
      map.current?.getMap().getSource(dataLayer.name).setData(features);
    }
  };

  useEffect(() => {
    props.dataLayers.forEach((dataLayer: DataLayer) => {
      const layerOnMap =
        map.current?.getMap().getLayer(dataLayer.name) !== undefined;

      if (layerOnMap && !layers.includes(dataLayer.name)) {
        map.current?.getMap().removeLayer(dataLayer.name);
        map.current?.getMap().removeSource(dataLayer.name);
      }

      if (!layerOnMap && layers.includes(dataLayer.name)) {
        if (currentTime.current === null) {
          return;
        }

        if (dataLayer.type === "vector") {
          map.current?.getMap().addSource(dataLayer.name, {
            type: "vector",
            tiles: [getVectorURL(dataLayer, currentTime.current)],
            minzoom: 0,
            maxzoom: 24,
            promoteId: "_id",
          });
        } else if (dataLayer.type === "geojson") {
          map.current?.getMap().addSource(dataLayer.name, {
            type: "geojson",
            data: getGeojsonURL(dataLayer, currentTime.current),
            promoteId: "_id",
          });
        }

        map.current?.getMap().addLayer(dataLayer.layer);

        if (dataLayer.type === "vector") {
          map.current?.on("mousemove", dataLayer.name, (event) => {
            if (map.current == null) return;

            map.current.getCanvas().style.cursor = "pointer";

            // Check whether features exist
            if (event.features === undefined || event.features.length === 0)
              return;

            if (hover.current !== null && hoverLayer.current !== null) {
              map.current.removeFeatureState({
                source: hoverLayer.current,
                id: hover.current,
                sourceLayer: "hits",
              });
            }

            const id = event.features[0].id;

            if (id !== undefined) {
              hover.current = id as number;
              hoverLayer.current = dataLayer.name;

              map.current.setFeatureState(
                {
                  source: hoverLayer.current,
                  id: hover.current,
                  sourceLayer: "hits",
                },
                {
                  hover: true,
                }
              );
            }
          });

          map.current?.on("mouseleave", dataLayer.name, function () {
            if (map.current == null) return;

            map.current.getCanvas().style.cursor = "";

            if (hover.current !== null && hoverLayer.current !== null) {
              map.current.setFeatureState(
                {
                  source: hoverLayer.current,
                  id: hover.current,
                  sourceLayer: "hits",
                },
                { hover: false }
              );
            }
            hover.current = null;
          });
        }

        map.current?.on("click", dataLayer.name, async (event) => {
          if (map.current == null) return;

          // Check whether features exist
          if (event.features === undefined || event.features.length === 0)
            return;

          const f = event.features[0];
          if (f.properties !== null) {
            const response = await fetch(
              `/api/info/${f.properties._index}/_doc/${f.properties._id}`
            );
            const feature = await response.json();
            setFeature(feature);
          }
        });
      }
    });
  }, [layers, baseLoading, props.dataLayers]);

  const loadTable = async (country: string) => {
    const response = await fetch(
      `/api/info/nato_readiness_092822/_search?q=${country}`
    );
    const features = await response.json();
    setTable(features.hits.hits);
  };

  const loadModel = async () => {
    if (overlay.current === null) {
      return;
    }

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNWZlN2RkYS01YTdhLTRkN2UtOTZhNi1kNzA2YTY3MTVhYWIiLCJpZCI6MTA5NzI2LCJpYXQiOjE2NjQ1MTUyOTJ9.s_cMv49fe6kenOmRCoAeutULmJNPSrJTXZi-dQ3uB1Y";
    const tile3DLayer = new Tile3DLayer({
      id: "tile-3d-layer",
      pointSize: 2,
      data: "https://assets.cesium.com/1338288/tileset.json",
      loader: CesiumIonLoader,
      loadOptions: { "cesium-ion": { accessToken: token } },
    });

    overlay.current.setProps({
      layers: [tile3DLayer],
    });

    map.current
      ?.getMap()
      .flyTo({ center: [31.295135035949748, 51.49451866836744], zoom: 18 });

    setModelLoaded(true);
  };

  const removeModel = () => {
    if (overlay.current !== null) {
      overlay.current.setProps({ layers: [] });
      setModelLoaded(false);
    }
  };

  const throttleFunc = throttle(1000, (t) => {
    currentTime.current = moment(t.time);
    setTime(t.time.toISOString());

    const currentLayers = map.current?.getMap().getStyle().layers;
    currentLayers?.forEach((layer) => {
      const dataLayer = props.dataLayers.find(
        (d: DataLayer) => d.name === layer.id
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
  props.dataLayers.forEach((l: DataLayer) => {
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
        checked={layers.includes(l.name)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.checked) {
            let tmpLayers = layers.slice(0);
            tmpLayers.push(l.name);
            setLayers(tmpLayers);
          } else {
            let tmpLayers = layers.slice(0);
            tmpLayers = tmpLayers.filter((layer) => layer !== l.name);
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

  const modelLayerTab = (
    <>
      <H5 style={{ marginBottom: 20 }}>Model Layers</H5>
      <Checkbox
        label={"Ukraine"}
        checked={modelLoaded}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.checked) {
            loadModel();
          } else {
            removeModel();
          }
        }}
      />
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

  const properties: JSX.Element[] = [];
  if (feature !== null) {
    Object.entries(feature._source)
      .sort()
      .forEach(([key, value]) => {
        if (typeof value == "number" || typeof value == "string") {
          if (key === "ISO_A3") {
            properties.unshift(
              <p key={key} style={{ display: "flex", alignItems: "center" }}>
                <strong>Units: </strong>
                <Button
                  small
                  intent="primary"
                  style={{ marginLeft: 5 }}
                  onClick={() => loadTable(value as string)}
                >
                  View
                </Button>
              </p>
            );
          } else if (key === "uri") {
            properties.push(<span>hls player used to be here</span>);
          } else {
            properties.push(
              <p key={key} style={{ overflowWrap: "break-word" }}>
                <strong>{key}:</strong> {value}
              </p>
            );
          }
        }
      });
  }

  let unitTable = null;
  if (table !== null) {
    const cellRenderer = (cell: string, rowIndex: number) => (
      <Cell>{table[rowIndex]._source[cell]}</Cell>
    );

    unitTable = (
      <Table numRows={table.length}>
        <Column name="Unit" cellRenderer={(i) => cellRenderer("Unit", i)} />
        <Column name="Service" cellRenderer={(i) => cellRenderer("Svc", i)} />
        <Column
          name="Mission/Task"
          cellRenderer={(i) => cellRenderer("Mission/Task", i)}
        />
        <Column
          name="Start Training"
          cellRenderer={(i) => cellRenderer("Start Training", i)}
        />
        <Column
          name="End Training"
          cellRenderer={(i) => cellRenderer("End Training", i)}
        />
        <Column
          name="Starting Ops Deploy"
          cellRenderer={(i) => cellRenderer("Starting Ops Deploy", i)}
        />
        <Column
          name="End Ops Deploy"
          cellRenderer={(i) => cellRenderer("End Ops Deploy", i)}
        />
        <Column
          name="End Recuperation"
          cellRenderer={(i) => cellRenderer("End Recuperation", i)}
        />
        <Column
          name="Total Personnel"
          cellRenderer={(i) => cellRenderer("Total Personnel", i)}
        />
      </Table>
    );
  }

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
        onMoveEnd={() => {
          //reload geojson layers
          const currentLayers = map.current?.getMap().getStyle().layers;
          currentLayers?.forEach((layer) => {
            const dataLayer = props.dataLayers.find(
              (d: DataLayer) => d.name === layer.id && d.type === "geojson"
            );

            if (dataLayer) {
              //TODO probably shouldnt be using newmoment here
              loadLayer(dataLayer, currentTime.current ?? moment());
            }
          });
        }}
        onLoad={() => {
          // map.current?.loadImage("./airplane.png", (error, image) => {
          //   if (image !== undefined) {
          //     map.current?.addImage("airplane", image, {});
          //   }
          // });

          overlay.current = new MapboxOverlay({
            interleaved: true,
            layers: [],
          });

          map.current?.getMap().addControl(overlay.current);

          map.current?.on("style.load", function () {
            map.current?.loadImage("./airplane.png", (error, image) => {
              if (image !== undefined) {
                map.current?.addImage("airplane", image, {});
              }
            });

            setBaseLoading(true);
          });
        }}
      >
        {props.shipData.map(ship => (
            <Marker
                key={ship.shipName}
                longitude={ship.longitude}
                latitude={ship.latitude}
            />
        ))}

      </Map>
      {timebar}
      {table !== null ? (
        <Card
          elevation={4}
          style={{
            position: "absolute",
            margin: 20,
            right: 400,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <H5 style={{ margin: 0 }}>Units</H5>
            <Button icon="cross" minimal onClick={() => setTable(null)} />
          </div>
          <p>{unitTable}</p>
        </Card>
      ) : null}
      {feature !== null ? (
        <Card
          elevation={4}
          style={{
            width: 375,
            position: "absolute",
            margin: 20,
            right: 0,
            maxHeight: 600,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <H5 style={{ margin: 0 }}>Feature</H5>
            <Button icon="cross" minimal onClick={() => setFeature(null)} />
          </div>
          {properties}
        </Card>
      ) : (
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
                <Tab id="model" title="Model" />
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
                  model: modelLayerTab,
                  chat: chatTab,
                }[selectedTab]
              }
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Cop;

// import React, {useRef, useEffect, useState, useCallback} from 'react';
// import moment, {Moment} from 'moment';
// import {Timeline, TimelineOptions, DataItemCollectionType} from 'vis-timeline';
// import {throttle} from 'throttle-debounce';
// import {
//   Tabs,
//   Tab,
//   MenuDivider,
//   Radio,
//   RadioGroup,
//   Slider,
//   Button,
//   Card,
//   Typography,
//   TableCell,
//   TableRow,
//   Table,
//   Checkbox,
// } from '@mui/material';
// import {Cell, Column, Table} from '@blueprintjs/table';
// import {Tile3DLayer} from '@deck.gl/geo-layers/typed';
// import {MapboxOverlay} from '@deck.gl/mapbox/typed';
// import {CesiumIonLoader} from '@loaders.gl/3d-tiles';
// import Map, {MapRef} from 'react-map-gl';
// import maplibregl from 'maplibre-gl';
// import ReactHlsPlayer from 'react-hls-player';

// import {BaseLayer, DataLayer, Terrain} from '../../../types/map';

// import './Map.css';

// interface CopProps {
//   baseLayers: BaseLayer[];
//   dataLayers: DataLayer[];
//   terrain: Terrain;
// }

// function Cop(props: CopProps) {
//   const timelineContainer = useRef(null);

//   const map = useRef<MapRef | null>(null);
//   const timeline = useRef<Timeline | null>(null);
//   const currentTime = useRef<Moment | null>(null);
//   const hover = useRef<number | null>(null);
//   const hoverLayer = useRef<string | null>(null);
//   const overlay = useRef<MapboxOverlay | null>(null);
//   const playInterval = useRef<number | null>(null);
//   const videoPlayerRef = React.useRef<HTMLVideoElement | null>(null);

//   const [feature, setFeature] = useState<any | null>(null);
//   const [table, setTable] = useState<any | null>(null);
//   const [baseLayer, setBaseLayer] = useState<string>(props.baseLayers[0].url);
//   const [baseLoading, setBaseLoading] = useState(false);
//   const [layers, setLayers] = useState<string[]>([]);
//   const [playing, setPlaying] = useState(false);
//   const [time, setTime] = useState(moment().toISOString());
//   const [rate, setRate] = useState(1);
//   const [selectedTab, setSelectedTab] = useState('data');
//   const [modelLoaded, setModelLoaded] = useState(false);
//   const [modalOpen, setModalOpen] = useState(true);

//   const getGeojsonURL = (dataLayer: DataLayer, t: Moment) => {
//     let url = '';
//     const bounds = map.current?.getBounds();

//     if (bounds !== undefined) {
//       //@ts-ignore
//       const bottom = Math.max(bounds._sw.lat, -90);
//       //@ts-ignore
//       const left = Math.max(bounds._sw.lng, -180);
//       //@ts-ignore
//       const top = Math.min(bounds._ne.lat, 90);
//       //@ts-ignore
//       const right = Math.min(bounds._ne.lng, 180);

//       const boundsquery = `${bottom},${left},${top},${right}`;
//       url = `${dataLayer.url}?startTime=${
//         t.valueOf() - dataLayer.timeWindow
//       }&endTime=${t.valueOf()}&bbox=${boundsquery}&timeField=${
//         dataLayer.timeField
//       }&locationField=${dataLayer.locationField}`;
//     }

//     return url;
//   };

//   const getVectorURL = (dataLayer: DataLayer, t: Moment) => {
//     const url = `${dataLayer.url}?startTime=${
//       t.valueOf() - dataLayer.timeWindow
//     }&endTime=${t.valueOf()}&timeField=${dataLayer.timeField}`;

//     return url;
//   };

//   const loadLayer = async (dataLayer: DataLayer, t: Moment) => {
//     if (dataLayer.type === 'vector') {
//       map.current
//         ?.getMap()
//         .getSource(dataLayer.name)
//         //@ts-ignore
//         .setTiles([getVectorURL(dataLayer, t)]);
//     } else if (dataLayer.type === 'geojson') {
//       const response = await fetch(getGeojsonURL(dataLayer, t));
//       const features = await response.json();

//       // @ts-ignore
//       map.current?.getMap().getSource(dataLayer.name).setData(features);
//     }
//   };

//   useEffect(() => {
//     props.dataLayers.forEach((dataLayer: DataLayer) => {
//       const layerOnMap =
//         map.current?.getMap().getLayer(dataLayer.name) !== undefined;

//       if (layerOnMap && !layers.includes(dataLayer.name)) {
//         map.current?.getMap().removeLayer(dataLayer.name);
//         map.current?.getMap().removeSource(dataLayer.name);
//       }

//       if (!layerOnMap && layers.includes(dataLayer.name)) {
//         if (currentTime.current === null) {
//           return;
//         }

//         if (dataLayer.type === 'vector') {
//           map.current?.getMap().addSource(dataLayer.name, {
//             type: 'vector',
//             tiles: [getVectorURL(dataLayer, currentTime.current)],
//             minzoom: 0,
//             maxzoom: 24,
//             promoteId: '_id',
//           });
//         } else if (dataLayer.type === 'geojson') {
//           map.current?.getMap().addSource(dataLayer.name, {
//             type: 'geojson',
//             data: getGeojsonURL(dataLayer, currentTime.current),
//             promoteId: '_id',
//           });
//         }

//         map.current?.getMap().addLayer(dataLayer.layer);

//         if (dataLayer.type === 'vector') {
//           map.current?.on('mousemove', dataLayer.name, event => {
//             if (map.current == null) return;

//             map.current.getCanvas().style.cursor = 'pointer';

//             // Check whether features exist
//             if (event.features === undefined || event.features.length === 0)
//               return;

//             if (hover.current !== null && hoverLayer.current !== null) {
//               map.current.removeFeatureState({
//                 source: hoverLayer.current,
//                 id: hover.current,
//                 sourceLayer: 'hits',
//               });
//             }

//             const id = event.features[0].id;

//             if (id !== undefined) {
//               hover.current = id as number;
//               hoverLayer.current = dataLayer.name;

//               map.current.setFeatureState(
//                 {
//                   source: hoverLayer.current,
//                   id: hover.current,
//                   sourceLayer: 'hits',
//                 },
//                 {
//                   hover: true,
//                 },
//               );
//             }
//           });

//           map.current?.on('mouseleave', dataLayer.name, function () {
//             if (map.current == null) return;

//             map.current.getCanvas().style.cursor = '';

//             if (hover.current !== null && hoverLayer.current !== null) {
//               map.current.setFeatureState(
//                 {
//                   source: hoverLayer.current,
//                   id: hover.current,
//                   sourceLayer: 'hits',
//                 },
//                 {hover: false},
//               );
//             }
//             hover.current = null;
//           });
//         }

//         map.current?.on('click', dataLayer.name, async event => {
//           if (map.current == null) return;

//           // Check whether features exist
//           if (event.features === undefined || event.features.length === 0)
//             return;

//           const f = event.features[0];
//           if (f.properties !== null) {
//             const response = await fetch(
//               `/api/info/${f.properties._index}/_doc/${f.properties._id}`,
//             );
//             const feature = await response.json();
//             setFeature(feature);
//           }
//         });
//       }
//     });
//   }, [layers, baseLoading, props.dataLayers]);

//   const loadTable = async (country: string) => {
//     const response = await fetch(
//       `/api/info/nato_readiness_092822/_search?q=${country}`,
//     );
//     const features = await response.json();
//     setTable(features.hits.hits);
//   };

//   const loadModel = async () => {
//     if (overlay.current === null) {
//       return;
//     }

//     const token =
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNWZlN2RkYS01YTdhLTRkN2UtOTZhNi1kNzA2YTY3MTVhYWIiLCJpZCI6MTA5NzI2LCJpYXQiOjE2NjQ1MTUyOTJ9.s_cMv49fe6kenOmRCoAeutULmJNPSrJTXZi-dQ3uB1Y';
//     const tile3DLayer = new Tile3DLayer({
//       id: 'tile-3d-layer',
//       pointSize: 2,
//       data: 'https://assets.cesium.com/1338288/tileset.json',
//       loader: CesiumIonLoader,
//       loadOptions: {'cesium-ion': {accessToken: token}},
//     });

//     overlay.current.setProps({
//       layers: [tile3DLayer],
//     });

//     map.current
//       ?.getMap()
//       .flyTo({center: [31.295135035949748, 51.49451866836744], zoom: 18});

//     setModelLoaded(true);
//   };

//   const removeModel = () => {
//     if (overlay.current !== null) {
//       overlay.current.setProps({layers: []});
//       setModelLoaded(false);
//     }
//   };

//   const throttleFunc = throttle(1000, t => {
//     currentTime.current = moment(t.time);
//     setTime(t.time.toISOString());

//     const currentLayers = map.current?.getMap().getStyle().layers;
//     currentLayers?.forEach(layer => {
//       const dataLayer = props.dataLayers.find(
//         (d: DataLayer) => d.name === layer.id,
//       );

//       if (dataLayer) {
//         loadLayer(dataLayer, t.time);
//       }
//     });
//   });

//   const goLive = () => {
//     const live = moment();
//     timeline.current?.setCustomTime(live.toDate(), 'cursor');
//     throttleFunc({time: live});
//   };

//   const playCustom = useCallback(() => {
//     setPlaying(true);
//     playInterval.current = window.setInterval(() => {
//       if (currentTime.current !== null) {
//         const newTime = currentTime.current.add(100 * rate, 'milliseconds');
//         timeline.current?.setCustomTime(newTime.toDate(), 'cursor');
//         throttleFunc({time: newTime});
//       }
//     }, 100);
//   }, [rate, throttleFunc]);

//   const pauseCustom = useCallback(() => {
//     setPlaying(false);
//     if (playInterval.current !== null) {
//       clearInterval(playInterval.current);
//     }
//   }, []);

//   useEffect(() => {
//     if (timelineContainer.current !== null && timeline.current == null) {
//       const options: TimelineOptions = {
//         showCurrentTime: true,
//         snap: null,
//         height: 48,
//       };

//       const dataset: DataItemCollectionType = [];

//       timeline.current = new Timeline(
//         timelineContainer.current,
//         dataset,
//         options,
//       );

//       currentTime.current = moment();
//       timeline.current.addCustomTime(currentTime.current.toDate(), 'cursor');
//       timeline.current.on('timechange', t => {
//         pauseCustom();
//         throttleFunc(t);
//       });
//     }
//   }, [throttleFunc, pauseCustom]);

//   const radioButtons: JSX.Element[] = [];
//   props.baseLayers.forEach((l: BaseLayer) => {
//     radioButtons.push(<Radio key={l.name} label={l.name} value={l.url} />);
//   });

//   const baseLayerTab = (
//     <>
//       <Typography variant='h5' style={{marginBottom: 20}}>Base Layers</Typography>
//       <RadioGroup
//         selectedValue={baseLayer}
//         onChange={(e: React.FormEvent<HTMLInputElement>) => {
//           setBaseLayer(e.currentTarget.value);
//           setBaseLoading(false);
//         }}>
//         {radioButtons}
//       </RadioGroup>
//       <div style={{marginTop: 20}}>
//         <MenuDivider />
//       </div>
//       <Typography variant='h5' style={{marginBottom: 20, marginTop: 20}}>Terrain</Typography>
//       <Checkbox
//         label={'Terrain'}
//         defaultChecked={false}
//         onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//           if (map.current == null) return;

//           if (e.target.checked) {
//             map.current.getMap().addSource('terrain', {
//               type: 'raster-dem',
//               url: props.terrain.url,
//             });
//             map.current.getMap().setTerrain({
//               source: 'terrain',
//             });
//           } else {
//             map.current.getMap().setTerrain();
//             map.current.getMap().removeSource('terrain');
//           }
//         }}
//       />
//     </>
//   );

//   const checkboxes: JSX.Element[] = [];
//   let previousGroup = '';
//   props.dataLayers.forEach((l: DataLayer) => {
//     if (l.group !== previousGroup) {
//       previousGroup = l.group;
//       checkboxes.push(
//         <Typography variant='h6' key={l.group} style={{marginTop: 20}}>
//           {l.group}
//         </Typography>,
//       );
//     }

//     checkboxes.push(
//       <Checkbox
//         key={l.name}
//         label={l.name}
//         checked={layers.includes(l.name)}
//         onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//           if (e.target.checked) {
//             let tmpLayers = layers.slice(0);
//             tmpLayers.push(l.name);
//             setLayers(tmpLayers);
//           } else {
//             let tmpLayers = layers.slice(0);
//             tmpLayers = tmpLayers.filter(layer => layer !== l.name);
//             setLayers(tmpLayers);
//           }
//         }}
//       />,
//     );
//   });

//   const dataLayerTab = (
//     <>
//       <Typography variant='h5' style={{marginBottom: 20}}>Data Layers</Typography>
//       {checkboxes}
//     </>
//   );

//   const modelLayerTab = (
//     <>
//       <Typography variant='h5' style={{marginBottom: 20}}>Model Layers</Typography>
//       <Checkbox
//         label={'Ukraine'}
//         checked={modelLoaded}
//         onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//           if (e.target.checked) {
//             loadModel();
//           } else {
//             removeModel();
//           }
//         }}
//       />
//     </>
//   );

//   const chatTab = (
//     <iframe
//       style={{width: '100%', height: 600, border: 'none'}}
//       src={`./chat/channel/general?layout=embedded`}
//       title="Chat"></iframe>
//   );

//   const timebar = (
//     <div
//       style={{
//         position: 'absolute',
//         width: '100%',
//         bottom: 0,
//         padding: 20,
//         display: 'flex',
//       }}>
//       <Card
//         elevation={4}
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           width: '100%',
//           padding: 0,
//           maxWidth: 800,
//           margin: 'auto',
//         }}>
//         <div
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//           }}>
//           <div
//             style={{
//               display: 'flex',
//               flex: 1,
//               marginLeft: 10,
//               alignItems: 'center',
//             }}>
//             {playing ? (
//               <Button
//                 icon="pause"
//                 large
//                 minimal
//                 onClick={() => pauseCustom()}
//               />
//             ) : (
//               <Button icon="play" large minimal onClick={() => playCustom()} />
//             )}
//             <Button
//               icon="dashboard"
//               large
//               minimal
//               onClick={() => {
//                 pauseCustom();
//                 setRate(1);
//               }}
//             />
//             <div style={{width: 150, marginLeft: 20}}>
//               <Slider
//                 min={1}
//                 max={60}
//                 stepSize={1}
//                 labelRenderer={false}
//                 onChange={e => {
//                   pauseCustom();
//                   setRate(e);
//                 }}
//                 value={rate}
//               />
//             </div>
//             <Typography variant='h5' style={{margin: 0, marginLeft: 20, textAlign: 'center'}}>
//               {rate}X
//             </Typography>
//           </div>
//           <div
//             style={{
//               flex: 1,
//               display: 'flex',
//               justifyContent: 'end',
//               alignItems: 'center',
//               marginRight: 10,
//             }}>
//             <Typography variant='h5' style={{margin: 0, marginRight: 10, textAlign: 'center'}}>
//               {time}
//             </Typography>
//             <Button icon="record" intent="danger" onClick={() => goLive()}>
//               Live
//             </Button>
//           </div>
//         </div>
//         <div ref={timelineContainer}></div>
//       </Card>
//     </div>
//   );

//   const properties: JSX.Element[] = [];
//   if (feature !== null) {
//     Object.entries(feature._source)
//       .sort()
//       .forEach(([key, value]) => {
//         if (typeof value == 'number' || typeof value == 'string') {
//           if (key === 'ISO_A3') {
//             properties.unshift(
//               <p key={key} style={{display: 'flex', alignItems: 'center'}}>
//                 <strong>Units: </strong>
//                 <Button
//                   small
//                   intent="primary"
//                   style={{marginLeft: 5}}
//                   onClick={() => loadTable(value as string)}>
//                   View
//                 </Button>
//               </p>,
//             );
//           } else if (key === 'uri') {
//             properties.push(
//               <ReactHlsPlayer
//                 key={value}
//                 playerRef={videoPlayerRef}
//                 src={value as string}
//                 autoPlay={true}
//                 controls={false}
//                 width="100%"
//                 height="auto"
//               />,
//             );
//           } else {
//             properties.push(
//               <p key={key} style={{overflowWrap: 'break-word'}}>
//                 <strong>{key}:</strong> {value}
//               </p>,
//             );
//           }
//         }
//       });
//   }

//   let unitTable = null;
//   if (table !== null) {
//     const cellRenderer = (cell: string, rowIndex: number) => (
//       <TableCell>{table[rowIndex]._source[cell]}</TableCell>
//     );

//     unitTable = (
//       <Table numRows={table.length}>
//         <Column name="Unit" cellRenderer={i => cellRenderer('Unit', i)} />
//         <Column name="Service" cellRenderer={i => cellRenderer('Svc', i)} />
//         <Column
//           name="Mission/Task"
//           cellRenderer={i => cellRenderer('Mission/Task', i)}
//         />
//         <Column
//           name="Start Training"
//           cellRenderer={i => cellRenderer('Start Training', i)}
//         />
//         <Column
//           name="End Training"
//           cellRenderer={i => cellRenderer('End Training', i)}
//         />
//         <Column
//           name="Starting Ops Deploy"
//           cellRenderer={i => cellRenderer('Starting Ops Deploy', i)}
//         />
//         <Column
//           name="End Ops Deploy"
//           cellRenderer={i => cellRenderer('End Ops Deploy', i)}
//         />
//         <Column
//           name="End Recuperation"
//           cellRenderer={i => cellRenderer('End Recuperation', i)}
//         />
//         <Column
//           name="Total Personnel"
//           cellRenderer={i => cellRenderer('Total Personnel', i)}
//         />
//       </Table>
//     );
//   }

//   return (
//     <div
//       className={'bp4-dark'}
//       style={{
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         position: 'relative',
//       }}>
//       <Map
//         ref={map}
//         mapLib={maplibregl}
//         mapStyle={baseLayer}
//         antialias={true}
//         onMoveEnd={() => {
//           //reload geojson layers
//           const currentLayers = map.current?.getMap().getStyle().layers;
//           currentLayers?.forEach(layer => {
//             const dataLayer = props.dataLayers.find(
//               (d: DataLayer) => d.name === layer.id && d.type === 'geojson',
//             );

//             if (dataLayer) {
//               //TODO probably shouldnt be using newmoment here
//               loadLayer(dataLayer, currentTime.current ?? moment());
//             }
//           });
//         }}
//         onLoad={() => {
//           map.current?.loadImage('./airplane.png', (error, image) => {
//             if (image !== undefined) {
//               map.current?.addImage('airplane', image, {});
//             }
//           });

//           overlay.current = new MapboxOverlay({
//             interleaved: true,
//             layers: [],
//           });

//           map.current?.getMap().addControl(overlay.current);

//           map.current?.on('style.load', function () {
//             map.current?.loadImage('./airplane.png', (error, image) => {
//               if (image !== undefined) {
//                 map.current?.addImage('airplane', image, {});
//               }
//             });

//             setBaseLoading(true);
//           });
//         }}></Map>
//       {timebar}
//       {table !== null ? (
//         <Card
//           elevation={4}
//           style={{
//             position: 'absolute',
//             margin: 20,
//             right: 400,
//           }}>
//           <div
//             style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: 20,
//             }}>
//             <Typography variant='h5' style={{margin: 0}}>Units</Typography>
//             <Button icon="cross" minimal onClick={() => setTable(null)} />
//           </div>
//           <p>{unitTable}</p>
//         </Card>
//       ) : null}
//       {feature !== null ? (
//         <Card
//           elevation={4}
//           style={{
//             width: 375,
//             position: 'absolute',
//             margin: 20,
//             right: 0,
//             maxHeight: 600,
//             overflowY: 'auto',
//           }}>
//           <div
//             style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: 20,
//             }}>
//             <Typography variant='h5' style={{margin: 0}}>Feature</Typography>
//             <Button icon="cross" minimal onClick={() => setFeature(null)} />
//           </div>
//           {properties}
//         </Card>
//       ) : (
//         <div
//           style={{
//             width: 375,
//             position: 'absolute',
//             margin: 20,
//             right: 0,
//           }}>
//           <Card elevation={4} style={{overflow: 'hidden'}}>
//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//               }}>
//               <Tabs
//                 selectedTabId={selectedTab}
//                 onChange={tab => {
//                   setModalOpen(true);
//                   setSelectedTab(tab as string);
//                 }}>
//                 <Tab id="data" title="Data" />
//                 <Tab id="base" title="Base" />
//                 <Tab id="model" title="Model" />
//                 <Tab id="chat" title="Chat" />
//               </Tabs>
//               <div style={{flex: 1}} />
//               <Button
//                 icon={modalOpen ? 'minus' : 'plus'}
//                 large
//                 minimal
//                 onClick={() => setModalOpen(!modalOpen)}
//               />
//             </div>
//             <div
//               style={{
//                 maxHeight: modalOpen ? 10000 : 0,
//                 transition: modalOpen
//                   ? 'max-height 1s ease-in-out'
//                   : 'max-height 0.5s cubic-bezier(0, 1, 0, 1)',
//               }}>
//               <div style={{height: 20}} />
//               {
//                 {
//                   data: dataLayerTab,
//                   base: baseLayerTab,
//                   model: modelLayerTab,
//                   chat: chatTab,
//                 }[selectedTab]
//               }
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Cop;
