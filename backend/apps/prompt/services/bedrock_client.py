

from langchain_community.llms.bedrock import Bedrock
from apps.prompt.services.boto_client import get_bedrock_client

class BedrockModel:
    llama2_70b_chat_v1 = "meta.llama2-70b-chat-v1"
    llama2_13b_chat_v1 = "meta.llama2-13b-chat-v1"

def get_bedrock_model(model: str = 'meta.llama2-70b-chat-v1') -> Bedrock:
    inference_modifier = {
        "temperature": 0.3,
        "top_p": 0.9,
        "max_gen_len": 2048,
    }
    return Bedrock(
        client=get_bedrock_client(),
        model_id=model,
        region_name="us-east-1",
        model_kwargs=inference_modifier
    )