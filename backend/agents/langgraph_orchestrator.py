from typing import TypedDict, Annotated, Sequence
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from tools.crime_tools import query_criminal_network, search_crime_records, get_crime_trends
from agents.autogen_team import run_criminology_debate

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    next_step: str
    database_context: dict

def router_node(state: AgentState):
    last_message = state["messages"][-1].content.lower()
    if any(w in last_message for w in ["network", "link", "associate"]):
        return {"next_step": "network_tool"}
    elif any(w in last_message for w in ["trend", "predict", "hotspot"]):
        return {"next_step": "trend_tool"}
    elif any(w in last_message for w in ["profile", "analyze", "behavior"]):
        return {"next_step": "autogen_debate"}
    else:
        return {"next_step": "rag_search"}

def network_tool_node(state: AgentState):
    result = query_criminal_network.invoke(state["messages"][-1].content)
    return {
        "messages": [AIMessage(content=f"Network Analysis: {result}")], 
        "database_context": {"tool": "network", "result": result}
    }

def trend_tool_node(state: AgentState):
    user_input = state["messages"][-1].content.lower()

    # naive parsing: fallback defaults
    parts = user_input.split()
    location = parts[-2] if len(parts) > 1 else "unknown"
    crime_type = parts[-1] if len(parts) > 1 else "general"

    result = get_crime_trends.invoke({"location": location, "crime_type": crime_type})
    return {
        "messages": [AIMessage(content=f"Trend Analysis: {result}")],
        "database_context": {"tool": "trend", "result": result}
    }


def rag_search_node(state: AgentState):
    result = search_crime_records.invoke(state["messages"][-1].content)


    return {
        "messages": [AIMessage(content=f"RAG Search: {result}")], 
        "database_context": {"tool": "rag", "result": result}
    }

def autogen_debate_node(state: AgentState):
    result = run_criminology_debate(state["messages"][-1].content)
    return {
        "messages": [AIMessage(content=f"Deep Analysis: {result}")], 
        "database_context": {"tool": "debate", "result": result}
    }

workflow = StateGraph(AgentState)
workflow.add_node("router", router_node)
workflow.add_node("network_tool", network_tool_node)
workflow.add_node("trend_tool", trend_tool_node)
workflow.add_node("rag_search", rag_search_node)
workflow.add_node("autogen_debate", autogen_debate_node)

workflow.set_entry_point("router")

def route_decision(state: AgentState):
    return state["next_step"]

workflow.add_conditional_edges(
    "router",
    route_decision,
    {
        "network_tool": "network_tool",
        "trend_tool": "trend_tool",
        "rag_search": "rag_search",
        "autogen_debate": "autogen_debate"
    }
)

workflow.add_edge("network_tool", END)
workflow.add_edge("trend_tool", END)
workflow.add_edge("rag_search", END)
workflow.add_edge("autogen_debate", END)

crime_graph = workflow.compile()