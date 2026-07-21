import os
import unittest
from unittest.mock import patch

from backend import catalyst_wrapper
from backend.tools.crime_tools import get_crime_trends


class CrimeToolsTests(unittest.TestCase):
    def test_get_crime_trends_accepts_location_and_crime_type_dict(self):
        result = get_crime_trends.invoke({"location": "Bangalore", "crime_type": "theft"})
        self.assertIn("theft", result)
        self.assertIn("Bangalore", result)

    def test_get_crime_trends_defaults_to_general_crime_type(self):
        result = get_crime_trends.invoke({"location": "Mysore"})
        self.assertIn("general", result)
        self.assertIn("Mysore", result)

    def test_init_catalyst_client_reports_missing_environment_variables(self):
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaisesRegex(RuntimeError, "CATALYST_PROJECT_ID|CATALYST_AUTH_TOKEN"):
                catalyst_wrapper.init_catalyst_client()


if __name__ == "__main__":
    unittest.main()
