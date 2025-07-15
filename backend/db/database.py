import os
import sqlalchemy
from sqlalchemy import create_engine

# Set the database path to db/diabetes.db
DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "db")
DB_PATH = os.path.join(DB_DIR, "diabetes.db")

# Ensure db directory exists
os.makedirs(DB_DIR, exist_ok=True)

# Admission types mapping
ADMISSION_TYPES = [
    {"admission_ty": 1, "description": "Emergency"},
    {"admission_ty": 2, "description": "Urgent"},
    {"admission_ty": 3, "description": "Elective"},
    {"admission_ty": 4, "description": "Newborn"},
    {"admission_ty": 5, "description": "Not Available"},
    {"admission_ty": 6, "description": "NULL"},
    {"admission_ty": 7, "description": "Trauma Center"},
    {"admission_ty": 8, "description": "Not Mapped"},
]

# Discharge types mapping
DISCHARGE_TYPES = [
    {"discharge_di": 1, "description": "Discharged to home"},
    {"discharge_di": 2, "description": "Discharged/transferred to another short term hospital"},
    {"discharge_di": 3, "description": "Discharged/transferred to SNF"},
    {"discharge_di": 4, "description": "Discharged/transferred to ICF"},
    {"discharge_di": 5, "description": "Discharged/transferred to another type of institution"},
    {"discharge_di": 6, "description": "Discharged/transferred to home with home health service"},
    {"discharge_di": 7, "description": "Left AMA"},
    {"discharge_di": 8, "description": "Discharged/transferred to home under care of organized home health service organization"},
    {"discharge_di": 9, "description": "Admitted as an inpatient to this hospital"},
    {"discharge_di": 10, "description": "Neonate discharged to another hospital"},
    {"discharge_di": 11, "description": "Expired"},
    {"discharge_di": 12, "description": "Still patient or expected to return for outpatient services"},
    {"discharge_di": 13, "description": "Hospice / home"},
    {"discharge_di": 14, "description": "Hospice / medical facility"},
    {"discharge_di": 15, "description": "Discharged/transferred within this institution to hospital-based Medicare approved swing bed"},
    {"discharge_di": 16, "description": "Discharged/transferred to another institution for outpatient services"},
    {"discharge_di": 17, "description": "Discharged/transferred to this institution for outpatient services"},
    {"discharge_di": 18, "description": "NULL"},
    {"discharge_di": 19, "description": "Expired at home. Medicaid only, hospice."},
    {"discharge_di": 20, "description": "Expired in a medical facility. Medicaid only, hospice."},
    {"discharge_di": 21, "description": "Expired, place unknown. Medicaid only, hospice."},
    {"discharge_di": 22, "description": "Discharged/transferred to another rehab facility including rehab units of a hospital"},
    {"discharge_di": 23, "description": "Discharged/transferred to a long term care hospital"},
    {"discharge_di": 24, "description": "Not Mapped"},
    {"discharge_di": 25, "description": "Unknown/Invalid"},
    {"discharge_di": 26, "description": "Unknown/Invalid"},
    {"discharge_di": 27, "description": "Discharged/transferred to a federal health care facility"},
    {"discharge_di": 28, "description": "Discharged/transferred to a critical access hospital"},
    {"discharge_di": 29, "description": "Discharged/transferred to another institution for inpatient care"},
]

# Admission source types mapping
ADMISSION_SOURCE_TYPES = [
    {"admission_source_i": 1, "description": "Physician Referral"},
    {"admission_source_i": 2, "description": "Clinic Referral"},
    {"admission_source_i": 3, "description": "HMO Referral"},
    {"admission_source_i": 4, "description": "Transfer from a hospital"},
    {"admission_source_i": 5, "description": "Transfer from a Skilled Nursing Facility (SNF)"},
    {"admission_source_i": 6, "description": "Transfer from another health care facility"},
    {"admission_source_i": 7, "description": "Emergency Room"},
    {"admission_source_i": 8, "description": "Court/Law Enforcement"},
    {"admission_source_i": 9, "description": "Not Available"},
    {"admission_source_i": 10, "description": "Transfer from critial access hospital"},
    {"admission_source_i": 11, "description": "Normal Delivery"},
    {"admission_source_i": 12, "description": "Premature Delivery"},
    {"admission_source_i": 13, "description": "Sick Baby"},
    {"admission_source_i": 14, "description": "Extramural Birth"},
    {"admission_source_i": 15, "description": "Not Available"},
    {"admission_source_i": 17, "description": "NULL"},
    {"admission_source_i": 18, "description": "Transfer From Another Home Health Agency"},
    {"admission_source_i": 19, "description": "Readmission to Same Home Health Agency"},
    {"admission_source_i": 20, "description": "Not Mapped"},
    {"admission_source_i": 21, "description": "Unknown/Invalid"},
    {"admission_source_i": 22, "description": "Transfer from hospital inpt/same fac reslt in a separate claim"},
    {"admission_source_i": 23, "description": "Born inside this hospital"},
    {"admission_source_i": 24, "description": "Born outside this hospital"},
    {"admission_source_i": 25, "description": "Transfer from Ambulatory Surgery Center"},
    {"admission_source_i": 26, "description": "Transfer from Hospice"},
]

def get_engine():
    return create_engine(f"sqlite:///{DB_PATH}")

def init_admission_types_table():
    engine = get_engine()
    with engine.begin() as conn:  # use begin() for transaction
        conn.execute(sqlalchemy.text("""
            CREATE TABLE IF NOT EXISTS admission_types (
                admission_ty INTEGER PRIMARY KEY,
                description TEXT
            )
        """))
        result = conn.execute(sqlalchemy.text("SELECT COUNT(*) FROM admission_types"))
        count = result.scalar()
        if count == 0:
            for row in ADMISSION_TYPES:
                conn.execute(sqlalchemy.text(
                    "INSERT INTO admission_types (admission_ty, description) VALUES (:admission_ty, :description)"),
                    parameters=row
                )

def init_discharge_types_table():
    engine = get_engine()
    with engine.begin() as conn:  # use begin() for transaction
        conn.execute(sqlalchemy.text("""
            CREATE TABLE IF NOT EXISTS discharge_types (
                discharge_di INTEGER PRIMARY KEY,
                description TEXT
            )
        """))
        result = conn.execute(sqlalchemy.text("SELECT COUNT(*) FROM discharge_types"))
        count = result.scalar()
        if count == 0:
            for row in DISCHARGE_TYPES:
                conn.execute(sqlalchemy.text(
                    "INSERT INTO discharge_types (discharge_di, description) VALUES (:discharge_di, :description)"),
                    parameters=row
                )


def init_admission_source_types_table():
    engine = get_engine()
    with engine.begin() as conn:  # use begin() for transaction
        conn.execute(sqlalchemy.text("""
            CREATE TABLE IF NOT EXISTS admission_source_types (
                admission_source_i INTEGER PRIMARY KEY,
                description TEXT
            )
        """))
        result = conn.execute(sqlalchemy.text("SELECT COUNT(*) FROM admission_source_types"))
        count = result.scalar()
        if count == 0:
            for row in ADMISSION_SOURCE_TYPES:
                conn.execute(sqlalchemy.text(
                    "INSERT INTO admission_source_types (admission_source_i, description) VALUES (:admission_source_i, :description)"),
                    parameters=row
                )
            print("admission_source_types table populated!")

def init_all_tables():
    init_admission_types_table()
    init_discharge_types_table()
    init_admission_source_types_table() 