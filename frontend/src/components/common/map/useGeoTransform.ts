import { useMemo, } from "react";
import { estypes } from "@elastic/elasticsearch";

export default function useGeoTransform(elasticHits?: estypes.SearchHit[]) {
  const data = useMemo(() => {
    if (!elasticHits || elasticHits?.length === 0) return;

    const collection: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: elasticHits.map((hit) => {
        const source: any = hit._source;
        const coordinates = source.location;
        return {
          type: "Feature",
          properties: source,
          geometry: {
            type: "Point",
            coordinates: [coordinates.lat as number, coordinates.lon as number],
          },
        };
      }),
    };

    return collection;
  }, [elasticHits]);

  return { data };
}
