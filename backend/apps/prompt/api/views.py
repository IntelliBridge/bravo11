from rest_framework import status as HTTP_STATUS
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from apps.prompt.services.chat import ChatAgentService, get_bedrock_model
from bravo11.services.es import (
    GeoPoint, 
    get_es_client, 
    get_asset_data_from_geo_point, 
    transform_asset_resp, 
    get_assets_by_id,
    transform_asset_details_resp
)
from apps.prompt.services.prompts import contruct_context


@api_view(["POST"])
def prompt(req: Request):
    # Services
    model = get_bedrock_model()
    es_client = get_es_client()
    chat_agent = ChatAgentService(model)

    # Data
    prompt = req.data.get("prompt", "")
    messages = req.data.get("messages", [])
    bounding_box = req.data.get("bounding_box", None)
    asset_id = req.data.get("asset_id", None)
    bounding_box_resp = {}
    asset_ids_resp = {}

    # If has bounding box get context from ES
    if bounding_box:
        bounding_box_resp = get_asset_data_from_geo_point(
            es_client,
            GeoPoint(lat=bounding_box["top_left"]["lat"], lon=bounding_box["top_left"]["lon"]),
            GeoPoint(lat=bounding_box["bottom_right"]["lat"], lon=bounding_box["bottom_right"]["lon"])
        )

    if asset_id:
        asset_ids_resp = get_assets_by_id(
            es_client, 
            asset_id
        )
        

    output = chat_agent.invoke(
        prompt, 
        messages=messages, 
        context=contruct_context(
            bounding_entity_data=transform_asset_resp(bounding_box_resp), 
            entity_detail=transform_asset_details_resp(asset_ids_resp), 
        )
    )
    return Response({"message": output}, status=HTTP_STATUS.HTTP_200_OK)