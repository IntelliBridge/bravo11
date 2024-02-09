from __future__ import annotations
from openai import OpenAI as AvanaLlmInterface
from django.conf import settings

from langchain_core.callbacks import CallbackManagerForLLMRun
from langchain_core.language_models.llms import LLM

import logging
from typing import (

    Any,
    Dict,
    List,
    Optional,
    Set,
)

logger = logging.getLogger(__name__)

class AvanaModel:
    llama_2_13b_chat_gptq = "Llama-2-13b-chat-GPTQ"
    mistral_78_instruct_v2_awq = "mistral-78-Instruct-v0.2-AWQ"

def avana_llm_client():
    '''
        completion = client.completions.create(model="Llama-2-13b-chat-GPTQ", prompt="San Francisco is ")
        print("Completion result:", completion)
    '''
    return AvanaLlmInterface(
        api_key="EMPTY",
        base_url=settings.STITCHES_API_URL,
    )




class AvanaLangchainLlm(LLM):

    model: str = "mistral-78-Instruct-v0.2-AWQ"

    @property
    def _identifying_params(self) -> Dict[str, Any]:
        """Get the identifying parameters."""
        return {"model": self.model}

    @property
    def _llm_type(self) -> str:
        """Return type of llm."""
        return "avana"

    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        client = avana_llm_client()
        response_json = client.completions.create(model=self.model, prompt=prompt)
        return response_json["choices"][0]["text"]
