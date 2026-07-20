import requests
import json
import os
from typing import Dict, Any, Optional

class QuickMLExplainableAI:
    def __init__(self):
        self.org_id = "60078554986"
        self.auth_token = os.getenv("ZOHO_AUTH_TOKEN", "")
        self.api_endpoint = "https://api.catalyst.zoho.in/quickml/v1/project/45680000000016001/glm/chat"
        
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Zoho-oauthtoken {self.auth_token}",
            "CATALYST-ORG": self.org_id
        }
        
        self.system_prompt = "You are an elite Crime Intelligence Assistant for law enforcement. Analyze the provided context and answer professionally, citing specific CaseMasterID, AccusedMasterID, and ArrestSurrenderID when applicable."

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

    def test_connection(self) -> bool:
        if not self.auth_token:
            return False
        try:
            # Minimal test payload with CORRECT model name
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
            return response.status_code == 200
        except:
            return False