import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
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
  Radio,
  RadioGroup,
  Slider,
  Button,
  Card,
  H5,
  H6,
  Checkbox,
} from "@blueprintjs/core";
import Map, { MapRef, Popup, Marker } from "react-map-gl/maplibre";
import { OutlinedInput } from "@mui/material";

import { BaseLayer, DataLayer, Terrain } from "../../../types/map";
import Chat from "components/ui/cards/Chat";
import { BoundingBox } from "./useBoundingData";

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/table/lib/css/table.css";
import "vis-timeline/dist/vis-timeline-graph2d.min.css";
import "./Map.css";
import useMarkerTransform, {
  ASSET_IMAGES,
  MarkerPropsWithMetadata,
} from "./useMarkerTransform";
import { MarkerData } from "@/types/marker-data";
import { isEmpty } from "lodash";
import axios from "axios";

interface CopProps {
  baseLayers: BaseLayer[];
  dataLayers: DataLayer[];
  terrain: Terrain;
}

const { REACT_APP_ES_URL } = process.env;
const LAYERS = ["Satellite", "Aircraft", "Vessel"];

console.log('establishing "NOW"');
const NOW = moment();

const url = "https://ad7a-72-253-135-20.ngrok-free.app/assets/_search";
const assetTypes = ["Satellite", "Airplane", "Surface Vessel"];

function Cop(props: CopProps) {
  const timelineContainer = useRef(null);

  const map = useRef<MapRef | null>(null);
  const timeline = useRef<Timeline | null>(null);
  const currentTime = useRef<Moment | null>(null);
  const playInterval = useRef<number | null>(null);

  const [baseLayer, setBaseLayer] = useState<string>(props.baseLayers[0].url);
  const [baseLoading, setBaseLoading] = useState(false);
  const [enabledAssets, setEnabledAssets] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(NOW.toISOString());
  const [rate, setRate] = useState(1440);

  const [selectedTab, setSelectedTab] = useState("data");
  const [modalOpen, setModalOpen] = useState(true);

  const [bounds, setBounds] = useState<BoundingBox>();

  const [startDate, setStartDate] = useState(
    NOW.clone().subtract(30, "day").toISOString()
  );
  const [endDate, setEndDate] = useState(NOW.toISOString());

  const [data, setData] = useState<any>(null);

  const box = useMemo(
    () => ({
      _ne: { lat: bounds?._ne.lat || 0, lng: bounds?._ne.lng || 0 },
      _sw: { lat: bounds?._sw.lat || 0, lng: bounds?._sw.lng || 0 },
    }),
    [bounds?._ne.lat, bounds?._ne.lng, bounds?._sw.lat, bounds?._sw.lng]
  );

  const query = useMemo(() => {
    return {
      size: 0,
      query: {
        bool: {
          must: [
            {
              range: {
                timestamp: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
            ...(!isEmpty(assetTypes)
              ? [
                  {
                    terms: {
                      "assetType.keyword": enabledAssets,
                    },
                  },
                ]
              : []),

            ...(!isEmpty(box?._ne?.lat)
              ? [
                  {
                    geo_bounding_box: {
                      location: {
                        top_right: { lat: box?._ne.lat, lon: box?._ne.lng },
                        bottom_left: { lat: box?._sw.lat, lon: box?._sw.lng },
                      },
                    },
                  },
                ]
              : []),
          ],
        },
      },
      aggs: {
        entities: {
          terms: {
            field: "entityId.keyword",
            size: 10, // Adjust this size as needed
          },
          aggs: {
            assetTypes: {
              terms: {
                field: "assetType.keyword",
                size: 10,
              },
            },
            sourceTypes: {
              terms: {
                field: "sourceType.keyword",
                size: 10,
              },
            },
            timestamp: {
              date_histogram: {
                field: "timestamp",
                calendar_interval: "day", // Adjust this interval as needed
              },
              aggs: {
                location: {
                  geo_centroid: {
                    field: "location",
                  },
                },
              },
            },
          },
        },
      },
    };
  }, [
    startDate,
    endDate,
    enabledAssets,
    box?._ne.lat,
    box?._ne.lng,
    box?._sw.lat,
    box?._sw.lng,
  ]);

  useEffect(() => {
    if (!url) return;

    axios.post(url, query).then((res) => setData(res.data));
  }, [query, box, url]);

  // const { data: boundingData } = useBoundingData("./mock/data.json");
  const { data: markers } = useMarkerTransform(data);

  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<MarkerData | null>(null);
  const throttleFunc = throttle(1000, (t) => {
    currentTime.current = moment(t.time);
    setTime(t.time.toISOString());
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

      // currentTime.current = moment();  // todo(myles) uncomment this lmao
      currentTime.current = moment(new Date("2024-01-02"));
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

  // ===================================================================== TABS
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

  const dataLayerTab = (
    <>
      <H5 style={{ marginBottom: 20 }}>Data Layers</H5>
      {LAYERS.map((l) => {
        return (
          <Checkbox
            key={l}
            label={l}
            checked={enabledAssets.includes(l)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.checked) {
                setEnabledAssets((prev) => [...prev, l]);
              } else {
                setEnabledAssets((prev) => prev.filter((id) => id !== l));
              }
            }}
          />
        );
      })}
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

  const chatTab = <Chat bounds={bounds} assetId={""} />;

  // ================================================================== TIMEBAR
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

  const [points, setPoints] = useState<any[]>([]); // todo(myles) type this

  useEffect(() => {
    const points: any[] = []; // todo(myles) type this

    const filter = {
      geo_bounding_box: {
        location: {
          top_left: {
            lat: 30,
            lon: 117,
          },
          bottom_right: {
            lat: 22,
            lon: 165,
          },
        },
      },
    };

    const vessels =
      enabledAssets.includes("Vessel") &&
      axios.post(
        url,
        {
          size: 1000,
          query: {
            bool: {
              must: [
                { match: { assetType: "Vessel" } },
                {
                  range: {
                    timestamp: {
                      gte: moment(time).subtract(10, "minute").toISOString(),
                      lte: moment(time).toISOString(),
                    },
                  },
                },
              ],
              filter,
            },
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );

    const aircraft =
      enabledAssets.includes("Aircraft") &&
      axios.post(
        url,
        {
          size: 1000,
          query: {
            bool: {
              must: [
                { match: { assetType: "Aircraft" } },
                {
                  range: {
                    timestamp: {
                      gte: moment(time).subtract(10, "minute").toISOString(),
                      lte: moment(time).toISOString(),
                    },
                  },
                },
              ],
              filter,
            },
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );

    const sats =
      enabledAssets.includes("Satellites") &&
      axios.post(
        url,
        {
          size: 1000,
          query: {
            bool: {
              must: [
                { match: { assetType: "Satellite" } },
                {
                  range: {
                    timestamp: {
                      gte: moment(time).subtract(1, "day").toISOString(),
                      lte: moment(time).toISOString(),
                    },
                  },
                },
              ],
              filter,
            },
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );

    Promise.all([vessels, sats, aircraft]).then((res) => {
      const d = [];
      const markers = [];

      for (const r of res) {
        if (r && r.data) {
          d.push(...r.data.hits.hits);
        }
      }

      for (const entity of d) {
        const latitude =
          entity._source.location.lat > 90
            ? entity._source.location.lat + 180
            : entity._source.location.lat;

        const m: MarkerPropsWithMetadata = {
          longitude: entity._source.location.lon,
          latitude,
          _source: entity._source,
          children: (
            <img
              src={
                entity._source.assetType
                  ? ASSET_IMAGES[entity._source.assetType]
                  : undefined
              }
              alt={entity._source.id}
              height={24}
              width={24}
            />
          ),
        };

        markers.push(m);
      }

      setPoints(markers);
    });
  }, [time, query, enabledAssets]);

  const handlePopupToggle = (data: MarkerData) => {
    if (!showPopup) {
      setPopupData(data);
      setShowPopup(true);
    } else {
      setPopupData(null);
      setShowPopup(false);
    }
  };
  
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
      >
        {showPopup && (
          <Popup
            longitude={popupData?.lng ?? 0}
            latitude={popupData?.lat ?? 0}
            closeOnClick={false}
            onClose={() => {
              setShowPopup(false);
              setPopupData(null);
            }}
            style={{
              color: "black",
            }}
          >
            {Object.entries(popupData?.metadata ?? {}).map(([key, value]) => {
              return (
                <div key={key}>
                  {key}: {value}
                </div>
              );
            })}
          </Popup>
        )}
        {/* Stick markers here */}
        {points &&
          points.map(({ _source, ...m }, i) => {
            return (
              <Marker key={i} {...m} onClick={() => console.log("works")} />
            );
          })}
        {/* {markers && */}
        {/*   markers?.map(({ _source, ...m }, i) => { */}
        {/*       const markerData: MarkerData = { */}
        {/*           lat: _source?.location.lat ?? 0, */}
        {/*           lng: _source?.location.lon ?? 0, */}
        {/*           metadata: {id: _source?.entityId} */}
        {/*       } */}
        {/*       return ( */}
        {/*           <Marker {...(m as MarkerProps)} onClick={() => handlePopupToggle(markerData)}/> */}
        {/*       ) */}
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
