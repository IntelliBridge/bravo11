from typing import Any, Sequence, Type
from langchain.agents import initialize_agent, AgentType, AgentExecutor
from langchain.memory import ChatMessageHistory
from langchain_core.language_models.llms import LLM
from apps.prompt.services.tools import ship_details
from apps.prompt.services.prompts import template, template_map
from langchain.agents import AgentExecutor
from apps.prompt.services.boto_client import get_bedrock_client
from langchain_core.language_models import BaseLanguageModel
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import Runnable, RunnablePassthrough
from langchain_core.tools import BaseTool
from langchain.agents.format_scratchpad import format_log_to_str
from langchain.agents.output_parsers import ReActSingleInputOutputParser
from langchain.tools.render import render_text_description


def create_react_agent(
    llm: BaseLanguageModel, tools: Sequence[BaseTool], prompt: PromptTemplate
) -> Runnable:
    """Create an agent that uses ReAct prompting.

    Args:
        llm: LLM to use as the agent.
        tools: Tools this agent has access to.
        prompt: The prompt to use. See Prompt section below for more.

    Returns:
        A Runnable sequence representing an agent. It takes as input all the same input
        variables as the prompt passed in does. It returns as output either an
        AgentAction or AgentFinish.

    Examples:

        .. code-block:: python

            from langchain import hub
            from langchain_community.llms import OpenAI
            from langchain.agents import AgentExecutor, create_react_agent

            prompt = hub.pull("hwchase17/react")
            model = OpenAI()
            tools = ...

            agent = create_react_agent(model, tools, prompt)
            agent_executor = AgentExecutor(agent=agent, tools=tools)

            agent_executor.invoke({"input": "hi"})

            # Use with chat history
            from langchain_core.messages import AIMessage, HumanMessage
            agent_executor.invoke(
                {
                    "input": "what's my name?",
                    # Notice that chat_history is a string
                    # since this prompt is aimed at LLMs, not chat models
                    "chat_history": "Human: My name is Bob\nAI: Hello Bob!",
                }
            )

    Prompt:

        The prompt must have input keys:
            * `tools`: contains descriptions and arguments for each tool.
            * `tool_names`: contains all tool names.
            * `agent_scratchpad`: contains previous agent actions and tool outputs as a string.

        Here's an example:

        .. code-block:: python

            from langchain_core.prompts import PromptTemplate

            template = '''Answer the following questions as best you can. You have access to the following tools:

            {tools}

            Use the following format:

            Question: the input question you must answer
            Thought: you should always think about what to do
            Action: the action to take, should be one of [{tool_names}]
            Action Input: the input to the action
            Observation: the result of the action
            ... (this Thought/Action/Action Input/Observation can repeat N times)
            Thought: I now know the final answer
            Final Answer: the final answer to the original input question

            Begin!

            Question: {input}
            Thought:{agent_scratchpad}'''

            prompt = PromptTemplate.from_template(template)
    """  # noqa: E501
    missing_vars = {"tools", "tool_names", "agent_scratchpad"}.difference(
        prompt.input_variables
    )
    if missing_vars:
        raise ValueError(f"Prompt missing required variables: {missing_vars}")

    prompt = prompt.partial(
        tools=render_text_description(list(tools)),
        tool_names=", ".join([t.name for t in tools]),
    )
    # llm_with_stop = llm.bind(stop=["\nObservation"])
    agent = (
        RunnablePassthrough.assign(
            agent_scratchpad=lambda x: format_log_to_str(x["intermediate_steps"]),
        )
        | prompt
        | llm
        | ReActSingleInputOutputParser()
    )
    return agent



# This a helper class we have that is useful for running tools
# It takes in an agent action and calls that tool and returns the result
tools = [ship_details]



class MessageType:
    user = "user"
    agent = "agent"


class ChatAgentService:
    def __init__(self, model: Type[LLM]) -> None:
        self.model = model

        # Setup agent
        self.agent = self.setup_agent()

    def setup_agent(self) -> AgentExecutor:
        prompt = PromptTemplate.from_template(template)
        agent = create_react_agent(self.model, tools, prompt)
        agent_executor = AgentExecutor(
            agent=agent,
            tools=tools,
            verbose=True,
            max_iterations=2,
            handle_parsing_errors=True,
        )
        # TODO: experiment with different agents in progress
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
                demo_ephemeral_chat_history.add_user_message(message["message"])
            else:
                demo_ephemeral_chat_history.add_ai_message(message["message"])

        return demo_ephemeral_chat_history
        
    # TODO: temporary uncomment to disable agent tools
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
    def invoke(self, prompt: str, messages: list[object] = [], context: str = '') -> Any:
        prompt_template = PromptTemplate.from_template(template_map)
        return self.model.invoke(prompt_template.format_prompt(input=prompt, context=context))
