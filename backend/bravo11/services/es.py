from elasticsearch import Elasticsearch
from attr import dataclass
from django.conf import settings

def get_es_client():
    return Elasticsearch(settings.ES_URL)


@dataclass(kw_only=True)
class GeoPoint:
    lat: float
    lon: float


def transform_asset_resp(json_data: dict):
    if not json_data.get("aggregations", {}):
        return []
    entities = json_data["aggregations"]["entities"]["buckets"]
    transformed_data = []
    for entity in entities:
        asset_id = entity["key"]
        asset_types = [asset_type["key"] for asset_type in entity["assetTypes"]["buckets"]]
        source_types = [source_type["key"] for source_type in entity["sourceTypes"]["buckets"]]
        transformed_data.append(
            {
                "entityId": asset_id,
                "assetTypes": asset_types,
                "sourceTypes": source_types,
            }
        )
    return transformed_data

def get_asset_data_from_geo_point(
        es_client: Elasticsearch,
        top_right: GeoPoint, 
        bottom_left: GeoPoint, 
        asset_type: str = "AssetTypeSatellite",
        max_results: int = 10):
    
    return es_client.search(
        index="assets",
        body={
            "size": 0,
        "query": {
            "bool": {
            "filter": {
                "geo_bounding_box": {
                "location": {
                    "top_right": {
                        "lat": top_right.lat,
                        "lon": top_right.lon
                    
                    },
                    "bottom_left": {
                        "lat": bottom_left.lat,
                        "lon": bottom_left.lon
                    }
                }
                }
            }
            }
        },
        "aggs": {
            "entities": {
            "terms": {
                "field": "entityId.keyword",
                "size": max_results
            },
            "aggs": {
                "assetTypes": {
                    "terms": {
                        "field": "assetType.keyword",
                        "size": max_results
                    }
                },
                "sourceTypes": {
                    "terms": {
                        "field": "sourceType.keyword",
                        "size": max_results
                    }
                }
            }
            }
        }
        }
    )

def transform_asset_details_resp(json_data: dict):
    last_record = json_data.get("hits", {}).get("hits", [])
    if not last_record:
        return []
    
    return last_record[0]["_source"]
    


def get_assets_by_id(es_client: Elasticsearch, asset_id: str, max_results: int = 10):
    return es_client.search(
        index="assets",
        body={
            "size": 1,
            "sort": [
                {
                    "timestamp": {
                        "order": "desc"
                    }
                }
            ],
            "query": {
                "term": {
                    "entityId.keyword": asset_id
                }
            },
            "aggs": {
            "entities": {
            "terms": {
                "field": "entityId.keyword",
                "size": max_results
            },
            }
        }
        }
    )