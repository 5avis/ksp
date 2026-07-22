import requests
import json
import os
from types import SimpleNamespace
from typing import Dict, Any, Optional
import re

quickml_client = None


def test_quickml_connection() -> bool:
    global quickml_client
    if quickml_client is None:
        quickml_client = QuickMLExplainableAI()
    try:
        response = quickml_client.ping()
        return getattr(response, "status", None) == "success"
    except Exception:
        return False


class QuickMLExplainableAI:
    def __init__(self):
        global quickml_client

        self.org_id = os.getenv("CATALYST_ORG_ID") or os.getenv("QUICKML_ORG_ID") or "60078554986"
        self.access_token = os.getenv("ZOHO_ACCESS_TOKEN") or os.getenv("QUICKML_AUTH_TOKEN") or ""
        self.refresh_token = os.getenv("ZOHO_REFRESH_TOKEN", "")
        self.client_id = os.getenv("ZOHO_CLIENT_ID", "")
        self.client_secret = os.getenv("ZOHO_CLIENT_SECRET", "")
        self.region = os.getenv("CATALYST_REGION", "in")
        self.project_id = os.getenv("CATALYST_PROJECT_ID") or "45680000000016001"

        self.api_endpoint = f"https://api.catalyst.zoho.{self.region}/quickml/v1/project/{self.project_id}/glm/chat"
        self.token_url = f"https://accounts.zoho.{self.region}/oauth/v2/token"

        # STRONGER prompt to prevent reasoning output
        self.system_prompt = (
            "You are an elite Crime Intelligence Assistant for law enforcement. "
            "Provide ONLY the final, professional answer. "
            "DO NOT show your analysis steps, reasoning process, or internal thoughts. "
            "DO NOT number your analysis steps. "
            "Speak directly and professionally to the officer. "
            "Cite specific CaseMasterID, AccusedMasterID, and ArrestSurrenderID when applicable."
        )

        quickml_client = self

    def _headers(self) -> dict:
        return {
            "Content-Type": "application/json",
            "Authorization": f"Zoho-oauthtoken {self.access_token}",
            "CATALYST-ORG": self.org_id
        }

    def _refresh_access_token(self) -> bool:
        if not self.refresh_token or not self.client_id or not self.client_secret:
            return False
        try:
            resp = requests.post(self.token_url, data={
                "grant_type": "refresh_token",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "refresh_token": self.refresh_token
            }, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            new_token = data.get("access_token")
            if new_token:
                self.access_token = new_token
                return True
            return False
        except Exception:
            return False

    def _post_with_retry(self, payload: dict, timeout: int):
        response = requests.post(self.api_endpoint, json=payload, headers=self._headers(), timeout=timeout)
        if response.status_code == 401:
            if self._refresh_access_token():
                response = requests.post(self.api_endpoint, json=payload, headers=self._headers(), timeout=timeout)
        return response

    def generate_explainable_response(self, user_query: str, database_context: Dict[str, Any], fir_context: Optional[str] = None) -> str:
        context_text = f"DATABASE CONTEXT:\n{json.dumps(database_context, indent=2)}\n"
        if fir_context:
            context_text += f"FIR DOCUMENTS CONTEXT:\n{fir_context}\n"

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
            response = self._post_with_retry(payload, timeout=30)
            response.raise_for_status()
            result = response.json()

            # DEBUG: Print the actual response structure
            print(f"DEBUG API Response: {json.dumps(result, indent=2)}")

            # Try multiple extraction methods
            clean_response = self._extract_clean_response(result)
            return clean_response

        except Exception as e:
            print(f"ERROR in generate_explainable_response: {str(e)}")
            return f"System Error: {str(e)}. Check your auth token and connection."

    def _extract_clean_response(self, result: Dict) -> str:
        """Extract the clean response from various API response formats"""
        
        # Method 1: Direct 'response' key
        if isinstance(result, dict) and "response" in result:
            response_text = result["response"]
            if isinstance(response_text, str):
                return self._clean_response_text(response_text)
        
        # Method 2: Nested in 'data' -> 'response'
        if isinstance(result, dict) and "data" in result:
            data = result["data"]
            if isinstance(data, dict) and "response" in data:
                return self._clean_response_text(data["response"])
        
        # Method 3: OpenAI-style 'choices' -> 'message' -> 'content'
        if isinstance(result, dict) and "choices" in result and len(result["choices"]) > 0:
            choice = result["choices"][0]
            if isinstance(choice, dict) and "message" in choice:
                message = choice["message"]
                if isinstance(message, dict) and "content" in message:
                    return self._clean_response_text(message["content"])
        
        # Method 4: If result is already a string (edge case)
        if isinstance(result, str):
            return self._clean_response_text(result)
        
        # Fallback: Convert to string but try to parse it
        result_str = str(result)
        print(f"WARNING: Using fallback parsing. Result: {result_str[:200]}...")
        
        # Try to extract from a string that looks like a dict
        if "'response':" in result_str or '"response":' in result_str:
            try:
                if result_str.startswith("{") and result_str.endswith("}"):
                    json_str = result_str.replace("'", '"')
                    parsed = json.loads(json_str)
                    if "response" in parsed:
                        return self._clean_response_text(parsed["response"])
            except:
                pass
        
        return f"Received response but couldn't parse cleanly: {result_str[:300]}"

    def _clean_response_text(self, text: str) -> str:
        """Remove AI reasoning steps and keep only the final answer"""
        if not isinstance(text, str):
            return str(text)
        
        patterns_to_remove = [
            r'\d+\.\s*\*\*?(Analyze|Review|Formulate|Evaluate|Determine|Context|Self-Correction).*?[\n]',
            r'\*\*?(Analyze the User|Review System|Formulate the Response|Evaluate the Intent|Drafting the Content).*?\*\*?',
            r'\n\s*\*.*?(User Query|Context|Role|Constraints|Analysis|Synthesize).*?[\n]',
        ]
        
        cleaned = text
        for pattern in patterns_to_remove:
            cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE | re.DOTALL)
        
        cleaned = cleaned.strip()
        
        if cleaned.startswith("1.") or cleaned.startswith("1 "):
            lines = cleaned.split('\n')
            actual_answer_lines = []
            
            for line in lines:
                if any(keyword in line.lower() for keyword in ['analyze', 'review', 'formulate', 'determine', 'context']):
                    continue
                if line.strip() and not line.strip().startswith('*') and not '**' in line:
                    actual_answer_lines.append(line)
            
            if actual_answer_lines:
                cleaned = '\n'.join(actual_answer_lines)
        
        return cleaned if cleaned else text

    def test_connection(self) -> bool:
        if not self.access_token:
            print("DEBUG: No access token found")
            return False
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
            response = self._post_with_retry(test_payload, timeout=10)
            print(f"DEBUG: Status code = {response.status_code}")
            print(f"DEBUG: Response body = {response.text}")
            print(f"DEBUG: Endpoint = {self.api_endpoint}")
            return response.status_code == 200
        except Exception as e:
            print(f"DEBUG: Exception = {str(e)}")
            return False

    def ping(self):
        ok = self.test_connection()
        return SimpleNamespace(status="success" if ok else "error")

    def test_quickml_connection(self) -> bool:
        return self.test_connection()
