from rest_framework import status as HTTP_STATUS
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from apps.prompt.services.chat import ChatAgentService, get_bedrock_model


@api_view(["POST"])
def prompt(req: Request):
    model = get_bedrock_model()
    chat_agent = ChatAgentService(model)
    prompt = req.data.get("prompt", "")
    messages = req.data.get("messages", [])
    output = chat_agent.invoke(prompt, messages)
    return Response({"message": output}, status=HTTP_STATUS.HTTP_200_OK)