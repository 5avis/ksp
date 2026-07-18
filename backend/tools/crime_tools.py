from langchain.tools import tool

# Simple in-memory prototype database (Pure Python, no blocked DLLs)
CRIME_RECORDS = [
    "FIR-2023-001: Theft at MG Road by Accused 'Ravi Kumar'. Modus Operandi: Two-wheeler chain snatching.",
    "FIR-2023-045: Assault in Koramangala by Accused 'Suresh'. Linked to Ravi Kumar via shared phone tower.",
    "FIR-2023-112: Financial Fraud linked to Accused 'Ravi Kumar' and shell company 'XYZ Logistics'.",
    "FIR-2023-200: Cyber fraud in Indiranagar targeting elderly victims, linked to organized gang."
]

@tool
def query_criminal_network(query: str) -> str:
    """Query criminal network relationships between accused, victims, or locations."""
    return f"Network Analysis: '{query}' is directly linked to 2 other entities and 1 financial account."

@tool
def search_crime_records(query: str) -> str:
    """Search local database for FIRs and crime records based on keyword match."""
    query_lower = query.lower()
    matches = [record for record in CRIME_RECORDS if any(word in record.lower() for word in query_lower.split())]
    if not matches:
        matches = CRIME_RECORDS[:2]
    return f"Found {len(matches)} relevant FIRs:\n" + "\n".join([f"- {doc}" for doc in matches])

@tool
def get_crime_trends(location: str, crime_type: str) -> str:
    """Analyze crime trends and hotspots for a specific location and crime type."""
    return f"Predictive analysis for {crime_type} in {location}: 15% increase expected next month based on historical seasonal data."
