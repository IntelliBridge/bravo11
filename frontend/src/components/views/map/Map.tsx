import { useEffect, useState } from "react";
import Cop from "../../common/map/Map";

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

function Map() {
	const [baseLayers, setBaseLayers] = useState<BaseLayer[]>([]);
	const [dataLayers, setDataLayers] = useState<DataLayer[]>([]);
	const [terrain, setTerrain] = useState<Terrain | null>(null);

	const fetchBaseLayers = async () => {
		const response = await fetch("/conf/base_layers.json");
		const baseLayers: BaseLayer[] = await response.json();
		setBaseLayers(baseLayers);
	};

	const fetchDataLayers = async () => {
		const response = await fetch("/conf/data_layers.json");
		const dataLayers: DataLayer[] = await response.json();
		setDataLayers(dataLayers);
	};

	const fetchTerrain = async () => {
		const response = await fetch("/conf/terrain.json");
		const t: Terrain = await response.json();
		setTerrain(t);
	};

	useEffect(() => {
		fetchBaseLayers();
		fetchDataLayers();
		fetchTerrain();
	}, []);

	if (baseLayers.length > 0 && dataLayers.length > 0 && terrain != null) {
		return <Cop baseLayers={baseLayers} dataLayers={dataLayers} terrain={terrain} />;
	}

	return null;
}

export default Map;
