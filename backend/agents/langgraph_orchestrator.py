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

def _safe_tool_call(tool_fn, query: str, label: str) -> str:
    """Run a tool call, never let it crash the graph."""
    try:
        result = tool_fn.invoke(query)
        if not result:
            return f"{label}: No results found."
        return f"{label}: {result}"
    except Exception as e:
        return f"{label}: Tool error - {str(e)}"

def router_node(state: AgentState):
    if not state["messages"]:
        return {"next_step": "rag_search"}
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
    query = state["messages"][-1].content if state["messages"] else ""
    content = _safe_tool_call(query_criminal_network, query, "Network Analysis")
    return {"messages": [AIMessage(content=content)], "database_context": {"tool": "network", "result": content}}

def trend_tool_node(state: AgentState):
    query = state["messages"][-1].content if state["messages"] else ""
    content = _safe_tool_call(get_crime_trends, query, "Trend Analysis")
    return {"messages": [AIMessage(content=content)], "database_context": {"tool": "trend", "result": content}}

def rag_search_node(state: AgentState):
    query = state["messages"][-1].content if state["messages"] else ""
    content = _safe_tool_call(search_crime_records, query, "RAG Search")
    return {"messages": [AIMessage(content=content)], "database_context": {"tool": "rag", "result": content}}

def autogen_debate_node(state: AgentState):
    query = state["messages"][-1].content if state["messages"] else ""
    try:
        result = run_criminology_debate(query)
        content = f"Deep Analysis: {result}" if result else "Deep Analysis: No result generated."
    except Exception as e:
        content = f"Deep Analysis: Error - {str(e)}"
    return {"messages": [AIMessage(content=content)], "database_context": {"tool": "debate", "result": content}}

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