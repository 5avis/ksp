import os
from dotenv import load_dotenv

# Load environment variables FIRST
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from agents.quickml_xai_engine import QuickMLExplainableAI
from agents.langgraph_orchestrator import crime_graph
from langchain_core.messages import HumanMessage
import json

app = FastAPI(title="Crime Analytics AI Platform - Zoho Catalyst Edition")
app.add_middleware(CORSMiddleware, 
                   allow_origins=["*"], 
                   allow_credentials=True, 
                   allow_methods=["*"], 
                   allow_headers=["*"])

# Create QuickML instance AFTER loading env vars
quickml_ai = QuickMLExplainableAI()

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

class ChatResponse(BaseModel):
    response: str
    evidence_trail: Optional[Dict[str, Any]] = None

@app.get("/health")
async def health_check():
    return {"status": "healthy", "quickml_connected": quickml_ai.test_connection()}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        messages = [HumanMessage(content=msg["content"]) for msg in request.history if msg["role"] == "user"]
        messages.append(HumanMessage(content=request.message))
        
        graph_result = crime_graph.invoke({"messages": messages, "next_step": "", "database_context": {}})
        database_context = {"query": request.message, "graph_analysis": graph_result["messages"][-1].content}
        
        ai_response = quickml_ai.generate_explainable_response(user_query=request.message, database_context=database_context)
        return ChatResponse(response=ai_response, evidence_trail=database_context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)