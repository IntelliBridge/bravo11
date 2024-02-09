import { useCallback, useEffect, useMemo, useState } from "react";
import merge from "lodash.merge";
import axios from "axios";
import { estypes } from "@elastic/elasticsearch";
import { isEmpty } from "lodash";
import moment from "moment";

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
  assetTypes?: string[],
  startDate: string = moment().subtract(30, "day").toISOString(),
  endDate: string = moment().toISOString(),
) {
  const [data, setData] = useState<any>(null);

  const query = useMemo(() => {

    const query = {
      size: 0,
      query: {
        bool: {
            must: [
                {
                    range: {
                        timestamp: {
                            gte: startDate, 
                            lte: endDate
                        }
                    }
                },
                ...!isEmpty(assetTypes) ? [{
                    terms: {
                        "assetType.keyword": assetTypes
                    }
                }] : [],

            ...!isEmpty(box?._ne?.lat) ? [{geo_bounding_box: {
              location: {
                top_right: { lat: box?._ne.lat, lon: box?._ne.lng },
                bottom_left: { lat: box?._sw.lat, lon: box?._sw.lng },
              }
            }
          }] : []
            ]
        }
      },
      "aggs": {
        "entities": {
          "terms": {
            "field": "entityId.keyword",
            "size": 10 // Adjust this size as needed
          },
          "aggs": {
            "assetTypes": {
              "terms": {
                "field": "assetType.keyword",
                "size": 10
              }
            },
            "sourceTypes": {
              "terms": {
                "field": "sourceType.keyword",
                "size": 10
              }
            },
            "timestamp": {
              "date_histogram": {
                "field": "timestamp",
                "calendar_interval": "day"  // Adjust this interval as needed
    
              },
              "aggs": {
                "location": {
                  "geo_centroid": {
                    "field": "location"
                  }
                }
              }
            }
          }
        }
      }
    }
    console.log('query', query);
    return query;
  }, [box, assetTypes]);

  const fetchData = useCallback(async () => {
    if (!url) return;

    const res = await axios.post<estypes.SearchResponseBody>(url, query);
    setData(res.data.hits.hits);
  }, [query, url]);

  useEffect(() => {
    fetchData();
  }, [box, assetTypes, fetchData, url]);

  return { data };
}
