import requests
import json
import os
from types import SimpleNamespace
from typing import Dict, Any, Optional

quickml_client = None


def test_quickml_connection():
    try:
        response = quickml_client.ping()
        return response.status == "success"
    except Exception:
        return False


class QuickMLExplainableAI:
    def __init__(self):
        global quickml_client

        self.org_id = os.getenv("QUICKML_ORG_ID", "")
        self.auth_token = os.getenv("QUICKML_AUTH_TOKEN", "")
        project_id = os.getenv("CATALYST_PROJECT_ID", "")
        self.api_endpoint = f"https://api.catalyst.zoho.in/quickml/v1/project/{project_id}/glm/chat"
        
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Zoho-oauthtoken {self.auth_token}",
            "CATALYST-ORG": self.org_id
        }
        
        self.system_prompt = "You are an elite Crime Intelligence Assistant for law enforcement. Analyze the provided context and answer professionally, citing specific CaseMasterID, AccusedMasterID, and ArrestSurrenderID when applicable."
        quickml_client = self

    def generate_explainable_response(self, user_query: str, database_context: Dict[str, Any], fir_context: Optional[str] = None) -> str:
        context_text = f"DATABASE CONTEXT:\n{json.dumps(database_context, indent=2)}\n"
        if fir_context:
            context_text += f"FIR DOCUMENTS CONTEXT:\n{fir_context}\n"
            
        # EXACT payload structure from Zoho's sample request
        payload = {
            "model": "crm-di-glm47b_30b_it",
            "messages": [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": f"Context:\n{context_text}\n\nQuery: {user_query}"}
            ],
            "max_tokens": 500,
            "temperature": 0.7,
            "stream": False
        }
        
        try:
            response = requests.post(
                self.api_endpoint,
                json=payload,
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()
            result = response.json()
            
            # Extract response from Zoho's format
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"]
            elif "data" in result and "response" in result["data"]:
                return result["data"]["response"]
            else:
                return str(result)
                
        except Exception as e:
            return f"System Error: {str(e)}. Check your auth token and connection."

    def ping(self):
        if not self.auth_token:
            return SimpleNamespace(status="error")
        try:
            test_payload = {
                "model": "crm-di-glm47b_30b_it",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "Hi"}
                ],
                "max_tokens": 10,
                "temperature": 0.7,
                "stream": False
            }
            response = requests.post(
                self.api_endpoint,
                json=test_payload,
                headers=self.headers,
                timeout=10
            )
            response.raise_for_status()
            return SimpleNamespace(status="success" if response.status_code == 200 else "error")
        except Exception:
            return SimpleNamespace(status="error")

    def test_quickml_connection(self) -> bool:
        return test_quickml_connection()

    def test_connection(self) -> bool:
        return self.test_quickml_connection()