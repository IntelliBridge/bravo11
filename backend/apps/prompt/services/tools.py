# Import things that are needed generically
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool, StructuredTool, tool

class ShipDetailsInput(BaseModel):
    ship_id: str = Field(description="should be the id or identifier of a ship or vessel")

# TODO: For testing purposes
@tool("ship_details", args_schema=ShipDetailsInput, return_direct=True)
def ship_details(ship_id: str) -> str:
    """Use this tool to look up details about a ship"""

    return "Ship 34k3j43k33 is in the sothern hemisphere"