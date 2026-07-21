import os
from pathlib import Path
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = PROJECT_ROOT / ".env"
load_dotenv(dotenv_path=ENV_PATH, override=False)

try:
    import zcatalyst_sdk
except ImportError:  # pragma: no cover - fallback for environments without the SDK
    zcatalyst_sdk = None


def init_catalyst_client():
    """
    Initialize and return a Zoho Catalyst client.
    Raises RuntimeError if initialization fails.
    """
    if zcatalyst_sdk is None:
        raise RuntimeError("zcatalyst_sdk is not installed in this environment")

    project_id = os.getenv("CATALYST_PROJECT_ID", "").strip()
    auth_token = os.getenv("CATALYST_AUTH_TOKEN", "").strip()
    project_key = os.getenv("CATALYST_PROJECT_KEY", "").strip()
    project_domain = os.getenv("CATALYST_PROJECT_DOMAIN", "").strip()
    project_secret_key = os.getenv("CATALYST_PROJECT_SECRET_KEY", "").strip()
    environment = os.getenv("CATALYST_ENVIRONMENT", "development").strip()

    print(f"[Catalyst] env file: {ENV_PATH}")
    print(f"[Catalyst] project_id present: {bool(project_id)}")
    print(f"[Catalyst] auth_token present: {bool(auth_token)}")

    if not project_id and not auth_token:
        raise RuntimeError("Catalyst environment variables missing: CATALYST_PROJECT_ID and CATALYST_AUTH_TOKEN")
    if not project_id:
        raise RuntimeError("Catalyst environment variable missing: CATALYST_PROJECT_ID")
    if not auth_token:
        raise RuntimeError("Catalyst environment variable missing: CATALYST_AUTH_TOKEN")

    missing_headers = [
        name for name, value in {
            "CATALYST_PROJECT_KEY": project_key,
            "CATALYST_PROJECT_DOMAIN": project_domain,
            "CATALYST_PROJECT_SECRET_KEY": project_secret_key,
        }.items() if not value
    ]
    if missing_headers:
        raise RuntimeError(
            "Catalyst header values missing: " + ", ".join(missing_headers)
        )

    headers = {
        "X-ZC-ProjectId": project_id,
        "X-ZC-Project-Key": project_key,
        "X-ZC-Project-Domain": project_domain,
        "X-ZC-Environment": environment,
        "X-ZC-PROJECT-SECRET-KEY": project_secret_key,
        "X-ZC-Admin-Cred-Type": "token",
        "X-ZC-User-Cred-Type": "token",
        "X-ZC-Admin-Cred-Token": auth_token,
        "X-ZC-User-Cred-Token": auth_token,
        "X-ZC-User-Type": "admin",
    }

    class _RequestWithHeaders:
        def __init__(self, headers):
            self.headers = headers

    try:
        print(f"[Catalyst] initializing with project_id={project_id} auth_token={auth_token[:6]}...")
        request = _RequestWithHeaders(headers)
        client = zcatalyst_sdk.initialize(req=request)
        return client
    except Exception as e:
        raise RuntimeError(f"Zoho Catalyst initialization failed: {e}")
