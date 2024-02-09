// note(myles) we'll probably use this instead, because we're gonna render
// everything as a marker. if we run into lag issues, we'll revisit later.
import { useMemo } from "react";
import { estypes } from "@elastic/elasticsearch";

import { MarkerProps } from "react-map-gl"; // instead of going to geojson, just create markers
import { type SourceProperties } from "@/types/elasticsearch/SourceProperties";

const ASSET_IMAGES: Record<string, string> = {
  Satellite: "/markers/satellite.svg",
  Tank: "", // todo(myles) needs svg
  Airplane: "/markers/plane.svg",
  "Surface Vessel": "/markers/ship.svg",
  "Ground Motor Vehicle": "", // todo(myles) needs svg
  "Bomber Aircraft": "/markers/plane.svg", // todo(myles) maybe needs svg?
};
const DEFAULT_ASSET_IMAGE = "https://via.placeholder.com/30";

export default function useMarkerTransform<T extends SourceProperties>(
  elasticHits?: estypes.SearchHit<T>[]
) {
  const data = useMemo(() => {
    if (!elasticHits || elasticHits?.length === 0) return;

    const hits: estypes.SearchHit<T>[] = elasticHits;
    const markers: MarkerProps[] | undefined = hits
      .map((hit) => {
        const source = hit._source;
        if (!source) return undefined; // just get rid of hits without a source for now

        // todo(myles) determine the asset type, pick an image based on that type

        const children = ASSET_IMAGES[source.assetType] ? (
          <img
            src={ASSET_IMAGES[source.assetType]}
            alt={source.entityId}
            style={{ maxHeight: "20%", maxWidth: "20%" }}
          />
        ) : (
          <img src={DEFAULT_ASSET_IMAGE} alt={source.entityId} />
        );

        const m: MarkerProps = {
          anchor: "center",
          latitude: source.location.lat,
          longitude: source.location.lon,
          children,
        };

        return m;
      })
      .filter(isMarkerProps);

    return markers;
  }, [elasticHits]);

  return { data };
}

// ==================================================================== HELPERS
function isMarkerProps(object: any): object is MarkerProps {
  return object && object.latitude && object.longitude;
}
