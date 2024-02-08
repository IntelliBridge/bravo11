import * as ships from '../mock/ship-mock-assets.json';
import * as planes from '../mock/plane-mock-assets.json';
import * as sats from '../mock/sat-mock-assets.json';
import { StandardAssetSchema } from "../types/StandardAssetSchema";
import _ from 'lodash';
import { AnySourceData } from "mapbox-gl";

export function getLineStringByAsset(assetType: string) {
    var data: StandardAssetSchema[] = ships;
    switch (assetType) {
        case 'planes':
            data = planes;
            break;
        case 'sats':
            data = sats;
            break;
        default:
    }

    var assetsById = _.groupBy(data, 'entityId');
    let features: any[] = [];
    for (const [key, value] of Object.entries(assetsById)) {
        var timestamps: string[] = [];
        var coords: number[][] = [];
        let sortedPointsByTimestamp = value.sort(function(a, b) {
            let dateA = new Date(a.timestamp);
            let dateB = new Date(b.timestamp);
            return dateA.getTime() - dateB.getTime();
        });

        // push coords and timestamp
        sortedPointsByTimestamp.forEach(p => {
            timestamps.push(p.timestamp);
            coords.push([p.location.lon, p.location.lat])
        });

        let feature: any = {
            id: key,
            properties: {
                timestamp: timestamps
            },
            type: "LineString",
            geometry: {
                type: "LineString",
                coordinates: coords
            }
        };

        features.push(feature);
    }

    // create linestring obj
    const assetSourceData: AnySourceData = {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: features
        }
    };
    console.log(assetSourceData);
    return assetSourceData;
}



