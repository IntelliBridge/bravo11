import { useCallback, useEffect, useMemo, useState } from "react";
import merge from "lodash.merge";
import axios from "axios";
import { estypes } from "@elastic/elasticsearch";

interface MapCoord {
  lng: number;
  lat: number;
}

export interface BoundingBox {
  _ne: MapCoord;
  _sw: MapCoord;
}

export default function useBoundingData(
  url?: string,
  box?: BoundingBox,
  assetType?: string
) {
  const [data, setData] = useState<any>(null);

  const query = useMemo(() => {
    let query = { bool: {} };

    const withAssetType = {
      bool: { must: { match: { assetType } } },
    };

    const withBox = {
      bool: {
        filter: {
          geo_bounding_box: {
            location: {
              top_right: { lat: box?._ne.lat, lon: box?._ne.lng },
              bottom_left: { lat: box?._sw.lat, lon: box?._sw.lng },
            },
          },
        },
      },
    };

    if (assetType) {
      query = merge(query, withAssetType);
    }

    if (box) {
      query = merge(query, withBox);
    }

    return query;
  }, [box, assetType]);

  const fetchData = useCallback(async () => {
    if (!url) return;

    const res = await axios.get<estypes.SearchResponseBody>(url, {
      headers: {},
      data: { query },
    });

    setData(res.data.hits.hits);
  }, [query, url]);

  useEffect(() => {
    fetchData();
  }, [box, assetType, fetchData, url]);

  return { data };
}
