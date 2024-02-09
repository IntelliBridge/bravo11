from rest_framework import status as HTTP_STATUS
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from apps.prompt.services.chat import ChatAgentService
from bravo11.services.es import (
    GeoPoint, 
    get_es_client, 
    get_asset_data_from_geo_point, 
    transform_asset_resp, 
    get_assets_by_id,
    transform_asset_details_resp
)
from apps.prompt.services.bedrock_client import get_bedrock_model, BedrockModel
from apps.prompt.services.prompts import contruct_context
from apps.prompt.services.avana_client import AvanaLangchainLlm, AvanaModel


MODEL_CLASS_MAP = {
    AvanaModel.llama_2_13b_chat_gptq: AvanaLangchainLlm(model=AvanaModel.llama_2_13b_chat_gptq),
    AvanaModel.mistral_78_instruct_v2_awq: AvanaLangchainLlm(model=AvanaModel.mistral_78_instruct_v2_awq),
    BedrockModel.llama2_70b_chat_v1: get_bedrock_model(model=BedrockModel.llama2_70b_chat_v1),
    BedrockModel.llama2_13b_chat_v1: get_bedrock_model(model=BedrockModel.llama2_13b_chat_v1),
}

@api_view(["POST"])
def prompt(req: Request):

    # Data
    prompt = req.data.get("prompt", "")
    messages = req.data.get("messages", [])
    bounding_box = req.data.get("bounding_box", None)
    asset_id = req.data.get("asset_id", None)
    model = MODEL_CLASS_MAP[req.data.get("model", BedrockModel.llama2_70b_chat_v1)]
    bounding_box_resp = {}
    asset_ids_resp = {}

    # Services
    es_client = get_es_client()
    chat_agent = ChatAgentService(model)

    
    # If has bounding box get context from ES
    if bounding_box:
        try:
            bounding_box_resp = get_asset_data_from_geo_point(
                es_client,
                GeoPoint(lat=bounding_box["top_right"]["lat"], lon=bounding_box["top_right"]["lon"]),
                GeoPoint(lat=bounding_box["bottom_left"]["lat"], lon=bounding_box["bottom_left"]["lon"])
            )
        except Exception as e:
            return Response(
                {"message": f"Error getting bounding box data from ES: {str(e)}"}, 
                status=HTTP_STATUS.HTTP_400_BAD_REQUEST
            )

    if asset_id:
        try:
            asset_ids_resp = get_assets_by_id(
                es_client, 
                asset_id
            )
        except Exception as e:
            return Response(
                {"message": f"Error getting asset data from ES: {str(e)}"}, 
                status=HTTP_STATUS.HTTP_400_BAD_REQUEST
            )
        
    try:
        output = chat_agent.invoke(
            prompt, 
            messages=messages, 
            context=contruct_context(
                bounding_entity_data=transform_asset_resp(bounding_box_resp), 
                entity_detail=transform_asset_details_resp(asset_ids_resp), 
            )
        )
    except Exception as e:
        return Response(
                {"message": f"Error generating LLM response: {str(e)}"}, 
                status=HTTP_STATUS.HTTP_400_BAD_REQUEST
            )
    return Response({"message": output}, status=HTTP_STATUS.HTTP_200_OK)
    