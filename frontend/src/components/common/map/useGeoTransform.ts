import { useEffect, useMemo, useState } from "react"
import { estypes } from "@elastic/elasticsearch";
import { GeoJSON } from 'geojson';

// note(myles) we expect an 
export default function useGeoTransform(elasticHits: estypes.SearchHit[]) {
    // const [data, setData] = useState();
    
    const data = useMemo(() => {
        
    }, [elasticHits])
    

    return { data };
}
