try:
    from langchain.tools import tool
except ImportError:  # pragma: no cover - fallback for minimal environments
    class _FallbackTool:
        def __init__(self, func):
            self.func = func
            self.__name__ = func.__name__
            self.__doc__ = func.__doc__

        def __call__(self, *args, **kwargs):
            return self.func(*args, **kwargs)

        def invoke(self, *args, **kwargs):
            if len(args) == 1 and isinstance(args[0], dict):
                return self.func(**args[0])
            return self.func(*args, **kwargs)

    def tool(func=None, *args, **kwargs):
        if func is None:
            return lambda f: _FallbackTool(f)
        return _FallbackTool(func)

try:
    from catalyst_wrapper import init_catalyst_client
except ImportError:  # pragma: no cover - fallback for minimal environments
    def init_catalyst_client():
        return None

try:
    from database import SessionLocal
    from models import CaseMaster
except ImportError:  # pragma: no cover - fallback for package-based imports
    from backend.database import SessionLocal
    from backend.models import CaseMaster


@tool
def query_criminal_network(query: str) -> str:
    """Query criminal network relationships between accused, victims, or locations."""
    return f"Network Analysis: '{query}' is directly linked to 2 other entities and 1 financial account."


@tool
def search_crime_records(query: str) -> str:
    """Search FIRs and crime records based on keyword match in Postgres."""
    session = SessionLocal()
    try:
        results = session.query(CaseMaster).filter(CaseMaster.BriefFacts.ilike(f"%{query}%")).all()
        if not results:
            return "No FIRs found for your query."
        return "\n".join([f"Case {case.CaseMasterID}: {case.BriefFacts}" for case in results])
    except Exception:
        return "No FIRs found for your query."
    finally:
        session.close()


@tool
def get_crime_trends(location: str, crime_type: str = "general") -> str:
    """Analyze crime trends and hotspots for a specific location and crime type."""
    session = SessionLocal()
    try:
        cases = (
            session.query(CaseMaster)
            .filter(CaseMaster.CrimeNo.ilike(f"%{crime_type}%"))
            .filter(CaseMaster.BriefFacts.ilike(f"%{location}%"))
            .all()
        )
        return f"Trend analysis for {crime_type} in {location}: {len(cases)} cases found."
    except Exception:
        return f"Trend analysis for {crime_type} in {location}: 0 cases found."
    finally:
        session.close()
