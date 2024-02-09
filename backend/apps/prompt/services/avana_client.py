from __future__ import annotations
from openai import OpenAI as AvanaLlmInterface
from django.conf import settings

import logging
from typing import (

    Any,
    Dict,
    List,
    Tuple,
    Union,
    Optional,
)

from langchain_core.language_models.llms import BaseLLM
from langchain_core.pydantic_v1 import Field, root_validator
from langchain_core.utils import get_pydantic_field_names
from langchain_core.utils.utils import build_extra_kwargs
from langchain_community.llms.openai import update_token_usage

from langchain_core.callbacks import (
    CallbackManagerForLLMRun,
)
from langchain_core.outputs import LLMResult
from langchain_core.pydantic_v1 import Field, root_validator
from langchain_core.utils import get_pydantic_field_names
from langchain_core.utils.utils import build_extra_kwargs


logger = logging.getLogger(__name__)

class AvanaModel:
    llama_2_13b_chat_gptq = "Llama-2-13b-chat-GPTQ"
    mistral_78_instruct_v2_awq = "mistral-78-Instruct-v0.2-AWQ"

def avana_llm_client(model=AvanaModel.llama_2_13b_chat_gptq):
    '''
        completion = client.completions.create(model="Llama-2-13b-chat-GPTQ", prompt="San Francisco is ")
        print("Completion result:", completion)
    '''
    return AvanaLlmInterface(
        api_key="EMPTY",
        base_url=settings.STITCHES_API_URL,
    )


# Langchain llm service
class AvanaLangchainLlm(BaseLLM):
    """Base Avana large language model class."""

    @property
    def _llm_type(self) -> str:
        """Return type of llm."""
        return "avana"

    @classmethod
    def get_lc_namespace(cls) -> List[str]:
        """Get the namespace of the langchain object."""
        return ["langchain", "llms", "avana"]

    @property
    def lc_attributes(self) -> Dict[str, Any]:
        attributes: Dict[str, Any] = {}
        return attributes

    @classmethod
    def is_lc_serializable(cls) -> bool:
        return True

    client: Any = Field(default=None, exclude=True)  #: :meta private:
    model_name: str = Field(default=AvanaModel.llama_2_13b_chat_gptq, alias="model")
    
    """Batch size to use when passing multiple documents to generate."""
    request_timeout: Union[float, Tuple[float, float], Any, None] = Field(
        default=None, alias="timeout"
    )

    class Config:
        """Configuration for this pydantic object."""

        allow_population_by_field_name = True

    @root_validator(pre=True)
    def build_extra(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        """Build extra kwargs from additional params that were passed in."""
        all_required_field_names = get_pydantic_field_names(cls)
        extra = values.get("model_kwargs", {})
        values["model_kwargs"] = build_extra_kwargs(
            extra, values, all_required_field_names
        )
        return values

    @root_validator()
    def validate_environment(cls, values: Dict) -> Dict:
        values["client"] = avana_llm_client().completions
        return values
    
    def _generate(
        self,
        prompts: List[str],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> LLMResult:
        """Call out to OpenAI's endpoint with k unique prompts.

        Args:
            prompts: The prompts to pass into the model.
            stop: Optional list of stop words to use when generating.

        Returns:
            The full LLM output.

        Example:
            .. code-block:: python

                response = openai.generate(["Tell me a joke."])
        """
        params = self._invocation_params
        params = {**params, **kwargs}
        sub_prompts = self.get_sub_prompts(params, prompts, stop)
        choices = []
        token_usage: Dict[str, int] = {}
        # Get the token usage from the response.
        # Includes prompt, completion, and total tokens used.
        _keys = {"completion_tokens", "prompt_tokens", "total_tokens"}
        system_fingerprint: Optional[str] = None
        for _prompts in sub_prompts:
            
            response = self.client.create(
                self, prompt=_prompts, run_manager=run_manager, **params
            )
            if not isinstance(response, dict):
                # V1 client returns the response in an PyDantic object instead of
                # dict. For the transition period, we deep convert it to dict.
                response = response.dict()

            choices.extend(response["choices"])
            update_token_usage(_keys, response, token_usage)
            if not system_fingerprint:
                system_fingerprint = response.get("system_fingerprint")
        return self.create_llm_result(
            choices,
            prompts,
            params,
            token_usage,
            system_fingerprint=system_fingerprint,
        )