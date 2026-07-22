import os
from pathlib import Path
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = PROJECT_ROOT / ".env"

# Load environment variables FIRST
load_dotenv(dotenv_path=ENV_PATH, override=False)

required_vars = [
    "CATALYST_PROJECT_ID", "CATALYST_AUTH_TOKEN",
    "QUICKML_ORG_ID", "QUICKML_AUTH_TOKEN",
    "POSTGRES_URL", "NEO4J_URI", "NEO4J_USER", "NEO4J_PASSWORD", "QDRANT_URL"
]

for var in required_vars:
    if not os.getenv(var):
        raise RuntimeError(f"Missing required environment variable: {var}")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

try:
    from pydantic_settings import BaseSettings
except ImportError:  # pragma: no cover - fallback for older environments
    from pydantic import BaseSettings

from agents.quickml_xai_engine import QuickMLExplainableAI, test_quickml_connection
from agents.langgraph_orchestrator import crime_graph
from langchain_core.messages import HumanMessage
from catalyst_wrapper import init_catalyst_client
from database import init_db
import json


class Settings(BaseSettings):
    catalyst_project_id: str = ""
    catalyst_auth_token: str = ""

    class Config:
        env_file = str(ENV_PATH)


settings = Settings()

CATALYST_PROJECT_ID = os.getenv("CATALYST_PROJECT_ID", "")
CATALYST_AUTH_TOKEN = os.getenv("CATALYST_AUTH_TOKEN", "")

trusted_origins = os.getenv("TRUSTED_ORIGINS", "*").split(",")
trusted_origins = [origin.strip() for origin in trusted_origins if origin.strip()]

app = FastAPI(title="Crime Analytics AI Platform - Zoho Catalyst Edition")

app.add_middleware(
    CORSMiddleware,
    allow_origins=trusted_origins if trusted_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create QuickML instance AFTER loading env vars
quickml_ai = QuickMLExplainableAI()


@app.on_event("startup")
def startup_event():
    try:
        init_db()
    except Exception as e:
        print(f"Database init warning: {e}")
    try:
        client = init_catalyst_client()
    except Exception as e:
        print(f"Catalyst init warning: {e}")


class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []


class ChatResponse(BaseModel):
    response: str
    evidence_trail: Optional[Dict[str, Any]] = None


@app.get("/health")
def health_check():
    return {
        "catalyst": True,
        "quickml": test_quickml_connection()
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        messages = [HumanMessage(content=msg["content"]) for msg in request.history if msg.get("role") == "user"]
        messages.append(HumanMessage(content=request.message))

        graph_result = crime_graph.invoke({"messages": messages, "next_step": "", "database_context": {}})

        result_messages = graph_result.get("messages", [])
        if not result_messages:
            return ChatResponse(
                response="Sorry, the analysis engine returned no result. Please try rephrasing your query.",
                evidence_trail=None
            )

        database_context = {"query": request.message, "graph_analysis": result_messages[-1].content}

        ai_response = quickml_ai.generate_explainable_response(user_query=request.message, database_context=database_context)
        return ChatResponse(response=ai_response, evidence_trail=database_context)

    except Exception as e:
        return ChatResponse(response=f"Sorry, something went wrong: {str(e)}", evidence_trail=None)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
