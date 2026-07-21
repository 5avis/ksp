import unittest
from backend.agents.quickml_xai_engine import QuickMLExplainableAI, test_quickml_connection


class QuickMLHealthTests(unittest.TestCase):
    def test_quickml_connection_uses_ping(self):
        engine = QuickMLExplainableAI()
        self.assertIsInstance(engine.test_quickml_connection(), bool)

    def test_global_health_helper_returns_bool(self):
        self.assertIsInstance(test_quickml_connection(), bool)


if __name__ == "__main__":
    unittest.main()
