// note(myles) we'll probably use this instead, because we're gonna render
// everything as a marker. if we run into lag issues, we'll revisit later.
import { useMemo } from "react";

import { MarkerProps } from "react-map-gl"; // instead of going to geojson, just create markers
import { type Entity } from "@/types/elasticsearch/SourceProperties";

export interface MarkerPropsWithMetadata extends MarkerProps {
  _source?: Entity;
}

export const ASSET_IMAGES: Record<string, string> = {
  Satellite: "/markers/satellite.svg",
  Tank: "", // todo(myles) needs svg
  Aircraft: "/markers/plane.svg",
  "Surface Vessel": "/markers/ship.svg",
  "Ground Motor Vehicle": "", // todo(myles) needs svg
  "Bomber Aircraft": "/markers/plane.svg", // todo(myles) maybe needs svg?
};
const DEFAULT_ASSET_IMAGE = "https://via.placeholder.com/30";

export default function useMarkerTransform(elasticHits?: any) {
  return useMemo(() => {
    const data: any[] = [];
    const entities = elasticHits?.aggregations?.entities?.buckets ?? [];

    for (const entity of entities) {
      const assetType = entity.assetTypes.buckets.at(0)?.key;
      const en: MarkerPropsWithMetadata = {
        latitude: 0,
        longitude: 0,
        _source: {
          id: entity.key,
          assetType,
          sourceType: entity.sourceTypes.buckets.at(0)?.key,
          locationByTime: [],
        },
        children: (
          <img
            src={assetType ? ASSET_IMAGES[assetType] : DEFAULT_ASSET_IMAGE}
            alt={entity.key}
            height={24}
            width={24}
          />
        ),
      };

      const timestamps = entity.timestamp.buckets;

      for (const timestamp of timestamps) {
        if (timestamp.location.count > 0) {
          if (!timestamp.location?.location) {
            console.warn(`Timestamp found without an location: ${JSON.stringify(timestamp)}`);
            continue;
          }
          en._source!.locationByTime!.push({
            timestamp: timestamp.key_as_string,
            location: {
              lat: timestamp.location.location.lat,
              lon: timestamp.location.location.lon,
            },
          });
        }
      }

      data.push(en);
    }

    return { data };
  }, [elasticHits]);
}

// ==================================================================== HELPERS
function isMarkerProps(object: any): object is MarkerProps {
  return object && object.latitude && object.longitude;
}
