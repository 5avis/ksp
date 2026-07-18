from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage
from tools.crime_tools import query_criminal_network, search_crime_records, get_crime_trends
from agents.autogen_team import run_criminology_debate

# ==========================================
# CUSTOM LLM LOADER WITH FAIL-SAFE
# ==========================================
try:
    from langchain_huggingface import HuggingFacePipeline
    from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

    MODEL_PATH = "./avita8_model" 
    print(f"🔄 Attempting to load custom model from: {MODEL_PATH}...")
    
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForCausalLM.from_pretrained(MODEL_PATH, device_map="auto")
    
    pipe = pipeline("text-generation", model=model, tokenizer=tokenizer, max_new_tokens=512, temperature=0.1)
    llm = HuggingFacePipeline(pipeline=pipe)
    print("✅ Custom LLM loaded successfully!")
    
except Exception as e:
    print(f"⚠️ Model load skipped/failed ({e}). Using Fail-Safe Mock LLM so the app still works!")
    class MockLLM:
        def invoke(self, prompt):
            class Response:
                content = "✅ CONNECTION SUCCESSFUL! The Frontend and Backend are talking. (Note: Custom model is loading or needs to be placed in the 'avita8_model' folder)."
            return Response()
    llm = MockLLM()
# ==========================================

class AgentState(TypedDict):
    messages: list
    next_step: str

def router_node(state: AgentState):
    last_message = state["messages"][-1].content.lower()
    if "network" in last_message or "link" in last_message:
        return {"next_step": "network_tool"}
    elif "trend" in last_message or "predict" in last_message:
        return {"next_step": "trend_tool"}
    elif "profile" in last_message or "analyze" in last_message:
        return {"next_step": "autogen_debate"}
    else:
        return {"next_step": "rag_search"}

def network_tool_node(state: AgentState):
    result = query_criminal_network.invoke(state["messages"][-1].content)
    return {"messages": [AIMessage(content=f"Network Analysis: {result}")]}

def trend_tool_node(state: AgentState):
    result = get_crime_trends.invoke(state["messages"][-1].content)
    return {"messages": [AIMessage(content=f"Trend Analysis: {result}")]}

def rag_search_node(state: AgentState):
    result = search_crime_records.invoke(state["messages"][-1].content)
    return {"messages": [AIMessage(content=f"RAG Search: {result}")]}

def autogen_debate_node(state: AgentState):
    result = run_criminology_debate(state["messages"][-1].content)
    return {"messages": [AIMessage(content=f"Deep Analysis: {result}")]}

def llm_response_node(state: AgentState):
    context = "\n".join([msg.content for msg in state["messages"]])
    prompt = f"Based on this intelligence, provide a clear, structured response:\n\n{context}"
    response = llm.invoke(prompt)
    
    if hasattr(response, 'content'):
        return {"messages": [AIMessage(content=response.content)]}
    else:
        return {"messages": [AIMessage(content=str(response))]}

workflow = StateGraph(AgentState)
workflow.add_node("router", router_node)
workflow.add_node("network_tool", network_tool_node)
workflow.add_node("trend_tool", trend_tool_node)
workflow.add_node("rag_search", rag_search_node)
workflow.add_node("autogen_debate", autogen_debate_node)
workflow.add_node("llm_response", llm_response_node)

workflow.set_entry_point("router")
workflow.add_conditional_edges("router", lambda s: s["next_step"])
workflow.add_edge("network_tool", "llm_response")
workflow.add_edge("trend_tool", "llm_response")
workflow.add_edge("rag_search", "llm_response")
workflow.add_edge("autogen_debate", "llm_response")
workflow.add_edge("llm_response", END)

crime_graph = workflow.compile()