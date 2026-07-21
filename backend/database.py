
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

try:
    from models import Base
except ImportError:  # pragma: no cover - fallback for package-based imports
    from backend.models import Base


DATABASE_URL = os.getenv("POSTGRES_URL", "postgresql://crimeuser:crimepassword@localhost:5432/crimedb")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)



def init_db():
    Base.metadata.create_all(bind=engine)
