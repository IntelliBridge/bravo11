from langchain_core.prompts import PromptTemplate
from typing import List

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


template_map = '''
Answer the following question based on the below context data. If there is no context data, answer the question with "I am unsure, No data found.".

Question: {input}

========= Context =========
{context}
========= End Context =========
'''

def contruct_context(bounding_entity_data: List[dict] = None, entity_detail: dict = None):
    context = ""
    if bounding_entity_data:
        context += "Below assets are in the region of interest: \n{}".format("\n\n".join(
            [
                f"entityId: {entity['entityId']}\nassetType: {entity['assetTypes']}\nsourceType: {entity['sourceTypes']}"
                for entity in bounding_entity_data
            ]
        ))

    if entity_detail:
        context += f"""
        Below is information about asset(s) selected: \n
        entityId: {entity_detail['entityId']}\nassetType: {entity_detail['assetType']}\nsourceType: {entity_detail['sourceType']}\ntimestamp: {entity_detail['timestamp']}\nlocation: {entity_detail['location']}
        """
    return context