import os
import subprocess
import sys
import unittest
from pathlib import Path


class EnvironmentValidationTests(unittest.TestCase):
    def test_missing_required_environment_variables_raise_runtime_error(self):
        project_root = Path(__file__).resolve().parents[2]
        env = os.environ.copy()
        for var in [
            "CATALYST_PROJECT_ID", "CATALYST_AUTH_TOKEN",
            "QUICKML_ORG_ID", "QUICKML_AUTH_TOKEN",
            "POSTGRES_URL", "NEO4J_URI", "NEO4J_USER", "NEO4J_PASSWORD", "QDRANT_URL"
        ]:
            env.pop(var, None)

        env["PYTHONPATH"] = os.pathsep.join([str(project_root), str(project_root / "backend")])
        result = subprocess.run(
            [sys.executable, "-c", "import backend.main"],
            cwd=str(project_root),
            env=env,
            capture_output=True,
            text=True,
        )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Missing required environment variable", result.stderr + result.stdout)


if __name__ == "__main__":
    unittest.main()
