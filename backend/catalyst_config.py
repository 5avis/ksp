import os
from dotenv import load_dotenv

load_dotenv()

class CatalystConfig:
    # These will be auto-populated by Catalyst CLI authentication
    ZOHO_AUTH_TOKEN = os.getenv("ZOHO_AUTH_TOKEN", "")
    PROJECT_ID = os.getenv("CATALYST_PROJECT_ID", "4568000000016001")
    ORG_ID = os.getenv("CATALYST_ORG_ID", "60078554986")
    REGION = os.getenv("CATALYST_REGION", "in")
    
    # Updated for GLM-4.7-Flash (replaces deprecated Qwen)
    QUICKML_API_URL = f"https://api.catalyst.zoho.in/quickml/v1/project/{PROJECT_ID}/glm/chat"
    
    LLM_MODEL_NAME = "GLM-4.7-Flash"
    TEMPERATURE = 0.1
    MAX_TOKENS = 1024
    REQUIRE_ID_CITATIONS = True