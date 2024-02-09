import { GeoBoundingBox } from "@/types/geo-bounding-box";
import { useState } from "react";
import axios from "axios";

const useElasticSearchQuery = (index: string, boundingBox: GeoBoundingBox, aggs?: any) => {
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<any>(null)
    const [loading, setLoading] = useState<any>(false)
    const [loaded, setLoaded] = useState<any>(false)
    const request = async (...args: any[]) => {
        setLoading(true)
        try {
            const url = `${process.env.REACT_APP_ES_URL}/${index}/_search`;
            const query: any = {
                size: 0,
                "query": {
                    "bool": {
                        "filter": {
                            "geo_bounding_box": {
                                "location": {
                                    "top_right": {
                                        "lat": boundingBox.topLeftLat,
                                        "lon": boundingBox.topLeftLon
                                    },
                                    "bottom_left": {
                                        "lat": boundingBox.bottomRightLat,
                                        "lon": boundingBox.bottomRightLon
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (aggs) {
                query.aggs = aggs;
            }

            const result = await axios.post(url, query)
            setData(result.data)
        } catch (err) {
            console.log(err)
            setError(err || 'Unexpected Error!')
        } finally {
            setLoading(false)
            setLoaded(true)
        }
    }

    return {
        data,
        error,
        loading,
        loaded,
        request,
    }
}

export default useElasticSearchQuery;