import sys
import os
import glob
import pandas as pd
from datetime import datetime
from typing import Tuple, Dict

# Handle relative imports depending on execution context
try:
    from database import SessionLocal
    from models import CaseMaster, Victim, Accused, ComplainantDetails
except ImportError:
    from backend.database import SessionLocal
    from backend.models import CaseMaster, Victim, Accused, ComplainantDetails


def clean_dataset(path: str) -> pd.DataFrame:
    """Reads a CSV file or directory of ER table CSVs, standardizes column names, and handles missing values."""
    if os.path.isdir(path):
        return clean_er_directory(path)

    df = pd.read_csv(path)

    # Normalize column names to match FIR schema if present
    column_mapping = {
        "case_id": "CaseMasterID",
        "crime_type": "CrimeNo",
        "location": "BriefFacts",
        "date": "CrimeRegisteredDate",
        "accused_name": "AccusedName",
        "victim_name": "VictimName",
        "complainant_name": "ComplainantName",
        "age": "AgeYear",
        "gender": "Gender"
    }

    df.rename(columns={k: v for k, v in column_mapping.items() if k in df.columns}, inplace=True)

    if "AgeYear" in df.columns:
        df["AgeYear"] = df["AgeYear"].fillna(0).astype(int)

    if "Gender" in df.columns:
        df["GenderID"] = df["Gender"].astype(str).str.lower().map({"male": 1, "female": 2, "transgender": 3}).fillna(1).astype(int)

    if "CrimeRegisteredDate" in df.columns:
        df["CrimeRegisteredDate"] = pd.to_datetime(df["CrimeRegisteredDate"], errors="coerce").dt.date

    # Fill remaining object columns with empty string and numeric with 0
    str_cols = df.select_dtypes(include=['object']).columns
    df[str_cols] = df[str_cols].fillna('')
    num_cols = df.select_dtypes(include=['number']).columns
    df[num_cols] = df[num_cols].fillna(0)

    return df


def clean_er_directory(dir_path: str, output_dir: str = "datasets") -> Dict[str, pd.DataFrame]:
    """Cleans all CSV files in an ER tables directory and exports cleaned CSVs to output_dir."""
    cleaned_tables = {}
    os.makedirs(output_dir, exist_ok=True)

    for filepath in glob.glob(os.path.join(dir_path, "*.csv")):
        filename = os.path.basename(filepath)
        tablename = os.path.splitext(filename)[0]

        df = pd.read_csv(filepath)
        
        # Clean nulls
        str_cols = df.select_dtypes(include=['object']).columns
        df[str_cols] = df[str_cols].fillna('')
        num_cols = df.select_dtypes(include=['number']).columns
        df[num_cols] = df[num_cols].fillna(0)

        out_name = f"cleaned_{filename}"
        out_path = os.path.join(output_dir, out_name)
        df.to_csv(out_path, index=False)
        cleaned_tables[tablename] = df

        # Save standard names for key primary tables
        if tablename == "CaseMaster":
            df.to_csv(os.path.join(output_dir, "cleaned_cases.csv"), index=False)
        elif tablename == "Victim":
            df.to_csv(os.path.join(output_dir, "cleaned_victims.csv"), index=False)
        elif tablename == "Accused":
            df.to_csv(os.path.join(output_dir, "cleaned_accused.csv"), index=False)
        elif tablename == "ComplainantDetails":
            df.to_csv(os.path.join(output_dir, "cleaned_complainants.csv"), index=False)

    return cleaned_tables


def split_into_tables(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Splits normalized DataFrame into individual domain tables."""
    req_case_cols = [c for c in ["CaseMasterID", "CrimeNo", "CrimeRegisteredDate", "BriefFacts"] if c in df.columns]
    case_df = df[req_case_cols].drop_duplicates() if req_case_cols else pd.DataFrame()

    req_victim_cols = [c for c in ["VictimName", "AgeYear", "GenderID", "CaseMasterID"] if c in df.columns]
    victim_df = df[req_victim_cols].dropna(subset=["VictimName"]) if "VictimName" in df.columns else pd.DataFrame()

    req_accused_cols = [c for c in ["AccusedName", "AgeYear", "GenderID", "CaseMasterID"] if c in df.columns]
    accused_df = df[req_accused_cols].dropna(subset=["AccusedName"]) if "AccusedName" in df.columns else pd.DataFrame()

    req_complainant_cols = [c for c in ["ComplainantName", "AgeYear", "GenderID", "CaseMasterID"] if c in df.columns]
    complainant_df = df[req_complainant_cols].dropna(subset=["ComplainantName"]) if "ComplainantName" in df.columns else pd.DataFrame()

    return case_df, victim_df, accused_df, complainant_df


def load_tables_to_db(case_df: pd.DataFrame, victim_df: pd.DataFrame, accused_df: pd.DataFrame, complainant_df: pd.DataFrame):
    """Persists extracted DataFrames into PostgreSQL database tables."""
    session = SessionLocal()
    try:
        if not case_df.empty:
            for _, row in case_df.iterrows():
                case = CaseMaster(
                    CaseMasterID=int(row["CaseMasterID"]) if "CaseMasterID" in row and pd.notna(row["CaseMasterID"]) else None,
                    CrimeNo=str(row.get("CrimeNo", "")),
                    CrimeRegisteredDate=row.get("CrimeRegisteredDate"),
                    BriefFacts=str(row.get("BriefFacts", ""))
                )
                session.merge(case)

        if not victim_df.empty:
            for _, row in victim_df.iterrows():
                victim = Victim(
                    CaseMasterID=int(row["CaseMasterID"]) if "CaseMasterID" in row and pd.notna(row["CaseMasterID"]) else None,
                    VictimName=str(row.get("VictimName", "")),
                    AgeYear=int(row.get("AgeYear", 0)),
                    GenderID=int(row.get("GenderID", 1))
                )
                session.add(victim)

        if not accused_df.empty:
            for _, row in accused_df.iterrows():
                accused = Accused(
                    CaseMasterID=int(row["CaseMasterID"]) if "CaseMasterID" in row and pd.notna(row["CaseMasterID"]) else None,
                    AccusedName=str(row.get("AccusedName", "")),
                    AgeYear=int(row.get("AgeYear", 0)),
                    GenderID=int(row.get("GenderID", 1))
                )
                session.add(accused)

        if not complainant_df.empty:
            for _, row in complainant_df.iterrows():
                complainant = ComplainantDetails(
                    CaseMasterID=int(row["CaseMasterID"]) if "CaseMasterID" in row and pd.notna(row["CaseMasterID"]) else None,
                    ComplainantName=str(row.get("ComplainantName", "")),
                    AgeYear=int(row.get("AgeYear", 0)),
                    GenderID=int(row.get("GenderID", 1))
                )
                session.add(complainant)

        session.commit()
        print("ETL completed successfully!")
    except Exception as e:
        session.rollback()
        print(f"ETL Error: {e}")
        raise e
    finally:
        session.close()


def clean_and_load_dataset(file_path: str):
    """Full pipeline: cleans dataset, splits into domain tables, and loads to DB."""
    if os.path.isdir(file_path):
        clean_er_directory(file_path)
        return
    df = clean_dataset(file_path)
    case_df, victim_df, accused_df, complainant_df = split_into_tables(df)
    load_tables_to_db(case_df, victim_df, accused_df, complainant_df)
    return case_df, victim_df, accused_df, complainant_df


if __name__ == "__main__":
    datasets_dir = os.path.join(os.path.dirname(__file__), "..", "datasets")
    validated_dir = os.path.join(datasets_dir, "ksp_fir_er_tables_precisely_validated")

    if os.path.exists(validated_dir):
        print(f"Cleaning ER tables directory: {validated_dir}")
        cleaned_tables = clean_er_directory(validated_dir, datasets_dir)
        print(f"Successfully cleaned {len(cleaned_tables)} ER table files.")
    else:
        default_input = os.path.join(datasets_dir, "ksp_crime_data(in).csv")
        target_file = sys.argv[1] if len(sys.argv) > 1 else default_input

        if os.path.exists(target_file):
            print(f"Cleaning dataset from: {target_file}")
            df = clean_dataset(target_file)
            case_df, victim_df, accused_df, complainant_df = split_into_tables(df)

            case_df.to_csv(os.path.join(datasets_dir, "cleaned_cases.csv"), index=False)
            victim_df.to_csv(os.path.join(datasets_dir, "cleaned_victims.csv"), index=False)
            accused_df.to_csv(os.path.join(datasets_dir, "cleaned_accused.csv"), index=False)
            complainant_df.to_csv(os.path.join(datasets_dir, "cleaned_complainants.csv"), index=False)
            print("Exported cleaned CSVs.")
