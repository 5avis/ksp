import pandas as pd
from database import SessionLocal
from models import CaseMaster, Victim, Accused, ComplainantDetails

def clean_and_load_dataset(file_path: str):
    # 1. Load dataset
    df = pd.read_csv(file_path)
    
    # 2. Normalize column names to match FIR schema
    df.rename(columns={
        "case_id": "CaseMasterID",
        "crime_type": "CrimeNo",
        "location": "BriefFacts",
        "date": "CrimeRegisteredDate",
        "accused_name": "AccusedName",
        "victim_name": "VictimName",
        "complainant_name": "ComplainantName",
        "age": "AgeYear",
        "gender": "Gender"
    }, inplace=True)

    # 3. Handle missing values
    df["AgeYear"] = df["AgeYear"].fillna(0).astype(int)
    df["GenderID"] = df["Gender"].map({"male": 1, "female": 2, "transgender": 3})

    # 4. Split into tables
    case_df = df[["CaseMasterID", "CrimeNo", "CrimeRegisteredDate", "BriefFacts"]].drop_duplicates()
    victim_df = df[["VictimName", "AgeYear", "GenderID", "CaseMasterID"]].dropna(subset=["VictimName"])
    accused_df = df[["AccusedName", "AgeYear", "GenderID", "CaseMasterID"]].dropna(subset=["AccusedName"])
    complainant_df = df[["ComplainantName", "AgeYear", "GenderID", "CaseMasterID"]].dropna(subset=["ComplainantName"])

    # 5. Insert into Postgres
    session = SessionLocal()

    for _, row in case_df.iterrows():
        case = CaseMaster(
            CaseMasterID=row["CaseMasterID"],
            CrimeNo=row["CrimeNo"],
            CrimeRegisteredDate=row["CrimeRegisteredDate"],
            BriefFacts=row["BriefFacts"]
        )
        session.merge(case)  # merge avoids duplicates

    for _, row in victim_df.iterrows():
        victim = Victim(
            CaseMasterID=row["CaseMasterID"],
            VictimName=row["VictimName"],
            AgeYear=row["AgeYear"],
            GenderID=row["GenderID"]
        )
        session.add(victim)

    for _, row in accused_df.iterrows():
        accused = Accused(
            CaseMasterID=row["CaseMasterID"],
            AccusedName=row["AccusedName"],
            AgeYear=row["AgeYear"],
            GenderID=row["GenderID"]
        )
        session.add(accused)

    for _, row in complainant_df.iterrows():
        complainant = ComplainantDetails(
            CaseMasterID=row["CaseMasterID"],
            ComplainantName=row["ComplainantName"],
            AgeYear=row["AgeYear"],
            GenderID=row["GenderID"]
        )
        session.add(complainant)

    session.commit()
    session.close()

    print("ETL completed successfully!")
