from typing import Any
from langchain import hub
from langchain.agents import initialize_agent, AgentType, AgentExecutor, create_react_agent
from langchain.memory import ChatMessageHistory
from langchain_community.llms.bedrock import Bedrock
from apps.prompt.services.tools import ship_details
from langchain.agents import AgentExecutor
from apps.prompt.services.boto_client import get_bedrock_client


# This a helper class we have that is useful for running tools
# It takes in an agent action and calls that tool and returns the result
tools = [ship_details]



class MessageType:
    user = "user"
    agent = "agent"

def get_bedrock_model(model: str = 'meta.llama2-70b-chat-v1') -> Bedrock:
    inference_modifier = {
        "temperature":0.3,
        "top_p":1,
    }
    return Bedrock(
        client=get_bedrock_client(),
        model_id=model,
        region_name="us-east-1",
        model_kwargs=inference_modifier
    )


class ChatAgentService:
    def __init__(self, model: Bedrock) -> None:
        self.model = model

        # Setup agent
        self.agent = self.setup_agent()

    def setup_agent(self) -> AgentExecutor:
        prompt = hub.pull("hwchase17/react")
        agent = create_react_agent(self.model, tools, prompt)
        agent_executor = AgentExecutor(
            agent=agent,
            tools=tools,
            verbose=True,
            max_iterations=2,
        )
        # return initialize_agent(
        #     tools,
        #     self.model,
        #     agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        #     verbose=True,
        #     max_iteration=2,
        #     return_intermediate_steps=True,
        #     handle_parsing_errors=True,
        # )
        return agent_executor

    def _create_messages(self, messages: list[object]) -> ChatMessageHistory:
        demo_ephemeral_chat_history = ChatMessageHistory()


        for message in messages:
            if message["type"] == MessageType.user:
                demo_ephemeral_chat_history.add_user_message(message["messages"])
            else:
                demo_ephemeral_chat_history.add_ai_message(message["messages"])

        return demo_ephemeral_chat_history
        
    #TODO: temporary uncomment
    # def invoke(self, prompt: str, messages: list[object] = []) -> Any:
    #     chat_message = self._create_messages(messages)
    #     agent_resp = self.agent.invoke({
    #         "input": prompt,
    #         "chat_history": chat_message.messages,
    #     })
    #     chat_message.add_user_message(prompt)
    #     chat_message.add_ai_message(agent_resp["output"])
    #     return agent_resp["output"]
    
    # TODO: temporary invoke method with no context or agents
    def invoke(self, prompt: str, messages: list[object] = []) -> Any:

        return self.model.invoke(prompt)
