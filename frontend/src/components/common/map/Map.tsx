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
import Map, { Layer, MapProvider, MapRef, Marker } from "react-map-gl/maplibre";
import { OutlinedInput } from "@mui/material";
import axios from "axios";

import { BaseLayer, DataLayer, Terrain } from "../../../types/map";
import Chat from "components/ui/cards/Chat";
import useBoundingData, { BoundingBox } from "./useBoundingData";
import useGeoTransform from "./useGeoTransform";

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

const { REACT_APP_ES_URL } = process.env;

function Cop(props: CopProps) {
  const timelineContainer = useRef(null);

  const map = useRef<MapRef | null>(null);
  const timeline = useRef<Timeline | null>(null);
  const currentTime = useRef<Moment | null>(null);
  const playInterval = useRef<number | null>(null);

  const [baseLayer, setBaseLayer] = useState<string>(props.baseLayers[0].url);
  const [baseLoading, setBaseLoading] = useState(false);
  const [enabledLayers, setEnabledLayers] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(moment().toISOString());
  const [rate, setRate] = useState(1);

  const [selectedTab, setSelectedTab] = useState("data");
  const [modalOpen, setModalOpen] = useState(true);

  const loadLayer = async (dataLayer: DataLayer, t: Moment) => {
    if (dataLayer.type === "geojson") {
      // const response = await fetch(getGeojsonURL(dataLayer, t));
      // const features = await response.json();
      // console.log(features);
      // @ts-ignore
      // map.current?.getMap().getSource(dataLayer.name).setData(features);
      // map.current?.getMap().getSource(dataLayer.name).setData(geoJson);
    }
  };

  const [bounds, setBounds] = useState<BoundingBox>(); // don't use this for now lmao
  const { data: boundingData } = useBoundingData("/mock/some-data.json");
  const { data: boundingDataSource } = useGeoTransform(boundingData);

  useEffect(() => {
    console.log(boundingDataSource);
  }, [boundingDataSource]);

  // useEffect(() => {
  //   dataLayers.forEach((layer: DataLayer) => {
  //     const layerOnMap =
  //       map.current?.getMap().getLayer(layer.layer.id) !== undefined;
  //     var ciLayer = ciConeLayers.find((s) => s.layer.source === layer.layer.id);
  //     if (layerOnMap && !layers.includes(layer.layer.id)) {
  //       map.current?.getMap().removeLayer(layer.layer.id);
  //       if (ciLayer) {
  //         map.current?.getMap().removeLayer(ciLayer.layer.id);
  //       }
  //       map.current?.getMap().removeSource(layer.layer.id);
  //     }
  //
  //     var data = dataSources.find((s) => s.key === layer.layer.id);
  //     if (
  //       !layerOnMap &&
  //       layers.includes(layer.layer.id) &&
  //       data !== undefined
  //     ) {
  //       map.current?.getMap().addSource(layer.layer.id, data.data);
  //       map.current?.getMap().addLayer(layer.layer);
  //       // get ci data
  //       if (ciLayer) {
  //         map.current?.getMap().addLayer(ciLayer.layer);
  //       }
  //
  //       map.current
  //         ?.getMap()
  //         .flyTo({ center: [INITIAL_LONG + 5, INITIAL_LAT + 5], zoom: 4 });
  //     }
  //   });
  // }, [layers, baseLoading]);

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
    </>
  );

  const checkboxes: JSX.Element[] = [];
  let previousGroup = "";

  useEffect(() => {
    const layers = [...props.dataLayers];

    // add data layer props
    layers.forEach((l: DataLayer) => {
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
              setEnabledLayers([...layers, l.layer.id]);
            } else {
              setEnabledLayers((prev) =>
                prev.filter((id) => id !== l.layer.id)
              );
            }
          }}
        />
      );
    });
  }, [props.dataLayers]);

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

  const chatTab = <Chat bounds={bounds} assetId={""}/>;

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

  // deleteme(myles) used for testing
  useEffect(() => {
    const current = map.current?.getMap();
    if (!current || !boundingDataSource) return;
  }, []);

  return (
    <div
      className={"bp4-dark"}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Map
        ref={map}
        mapLib={import("maplibre-gl")}
        mapStyle={baseLayer}
        antialias={true}
        onLoad={() => {
          setBaseLoading(true);
        }}
        onRender={(_e) => {
          if (!map.current) return;
          const { _sw, _ne } = map.current?.getBounds();
          setBounds({ _sw, _ne });
        }}
        initialViewState={{ latitude: 0, longitude: 0, zoom: 4 }}
      >
        <Marker latitude={0} longitude={0}></Marker>
        {/* {boundingDataSource && */}
        {/*   boundingDataSource.features.map((f, i) => { */}
        {/*     if (f.geometry.type === "Point") { */}
        {/*       console.log("writing point", f.geometry.coordinates); // deleteme(myles) */}
        {/*       return ( */}
        {/*         <Marker */}
        {/*           key={i} */}
        {/*           // latitude={f.geometry.coordinates.at(0) || 0} */}
        {/*           // longitude={f.geometry.coordinates.at(1) || 0} */}
        {/*           latitude={0} */}
        {/*           longitude={0} */}
        {/*         /> */}
        {/*       ); */}
        {/*     } else { */}
        {/*       return null; */}
        {/*     } */}
        {/*   })} */}
      </Map>
      {timebar}
      <div
        style={{
          width: 375,
          position: "absolute",
          margin: 20,
          right: 0,
          top: 0,
          maxHeight: "calc(100% - 40px)",
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
            }}
          >
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
