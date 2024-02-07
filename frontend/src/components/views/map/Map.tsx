import {useEffect, useState} from 'react';
import Cop from '../../common/map/Map';
import { Ship } from "../../../types/ship";

export interface BaseLayer {
  name: string;
  url: string;
}

export interface DataLayer {
  name: string;
  group: string;
  url: string;
  type: string;
  timeWindow: number;
  timeField: string;
  locationField: string;
  layer: any;
}

export interface Terrain {
  url: string;
}

interface Point {
  latitude: number,
  longitude: number
}
/**
 * Generates number of random geolocation points given a center and a radius.
 * Reference URL: http://goo.gl/KWcPE.
 * @param  {Object} center A JS object with lat and lng attributes.
 * @param  {number} radius Radius in meters.
 * @return {Object} The generated random points as JS object with lat and lng attributes.
 */
function generateRandomPoint(center: Point, radius: number) {
  var x0 = center.longitude;
  var y0 = center.latitude;
  // Convert Radius from meters to degrees.
  var rd = radius/111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x/Math.cos(y0);

  // Resulting point.
  return {latitude: y+y0, longitude: xp+x0};
}
const DATA_POINTS = 100;
const generateRandomShipData = () => {
  const center: Point = {
    latitude: 14.628,
    longitude: 115.834
  };
  var ships: Ship[] = [];
  for (var i = 0; i < DATA_POINTS; i++) {
    var p = generateRandomPoint(center, 160934);
    ships.push({
      shipName: (Math.random() + 1).toString(36).substring(7),
      latitude: p.latitude,
      longitude: p.longitude
    })
  }
  return ships;
}

function Map() {
  const [baseLayers, setBaseLayers] = useState<BaseLayer[]>([]);
  const [dataLayers, setDataLayers] = useState<DataLayer[]>([]);
  const [terrain, setTerrain] = useState<Terrain | null>(null);
  const shipData = generateRandomShipData();
  //const [shipData, setShipData] = useState<Ship[]>(generateRandomShipData);
  const fetchBaseLayers = async () => {
    const response = await fetch('/conf/base_layers.json');
    const baseLayers: BaseLayer[] = await response.json();
    setBaseLayers(baseLayers);
  };

  const fetchDataLayers = async () => {
    const response = await fetch('/conf/data_layers.json');
    const dataLayers: DataLayer[] = await response.json();
    setDataLayers(dataLayers);
  };

  const fetchTerrain = async () => {
    const response = await fetch('/conf/terrain.json');
    const t: Terrain = await response.json();
    setTerrain(t);
  };

  useEffect(() => {
    fetchBaseLayers();
    fetchDataLayers();
    fetchTerrain();
  }, []);

  if (baseLayers.length > 0 && dataLayers.length > 0 && terrain != null) {
    return (
      <Cop baseLayers={baseLayers} dataLayers={dataLayers} terrain={terrain} shipData={shipData}/>
    );
  }

  return null;
}

export default Map;