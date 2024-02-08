import { AnySourceData } from "mapbox-gl";
import { DataLayer } from "./map";

export interface AssetSourceLayer {
    source: AnySourceData,
    layer: DataLayer
}