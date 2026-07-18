from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from langchain_core.messages import HumanMessage
from agents.langgraph_orchestrator import crime_graph

app = FastAPI(title="Crime Analytics AI Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        messages = []
        for msg in request.history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                messages.append(HumanMessage(content=f"AI Previous Response: {msg['content']}")) 
        
        messages.append(HumanMessage(content=request.message))
        initial_state = {"messages": messages, "next_step": ""}
        
        final_state = crime_graph.invoke(initial_state)
        ai_response = final_state["messages"][-1].content
        
        return {"response": ai_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "OK", "services": ["Neo4j", "Qdrant", "PostgreSQL", "Avita8 LLM"]}
