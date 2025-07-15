import os
import io
import pandas as pd
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import re
from db.database import get_engine, init_all_tables, DB_PATH
import glob
from sqlalchemy import inspect

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize all mapping tables on startup
def startup_event():
    init_all_tables()

app.add_event_handler("startup", startup_event)

@app.get('/')
def read_root():
    return {'message': 'Hello from FastAPI! 🚀'}

@app.post('/upload-csv')
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        return JSONResponse(status_code=400, content={"error": "Only CSV files are allowed."})
    contents = await file.read()
    try:
        # Ensure directories exist
        raw_dir = os.path.join(os.getcwd(), "data", "raw")
        processed_dir = os.path.join(os.getcwd(), "data", "processed")
        os.makedirs(raw_dir, exist_ok=True)
        os.makedirs(processed_dir, exist_ok=True)
        # Save the raw file
        raw_path = os.path.join(raw_dir, file.filename)
        with open(raw_path, "wb") as f:
            f.write(contents)
        # Process and clean the file
        df = pd.read_csv(io.BytesIO(contents))
        df_clean = df.dropna(how='all')
        # Save the cleaned file
        clean_path = os.path.join(processed_dir, file.filename)
        df_clean.to_csv(clean_path, index=False)
        # Load cleaned data into SQLite database (db/diabetes.db)
        engine = get_engine()
        table_name = re.sub(r'\W+', '_', os.path.splitext(file.filename)[0])
        df_clean.to_sql(table_name, engine, if_exists='replace', index=False)
        return {"message": "CSV uploaded, files saved, and data loaded into database successfully! 🧹✨"}
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": f"Failed to process CSV: {str(e)}"})

@app.get('/api/analytics/race-distribution')
def race_distribution():
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    import pandas as pd
    df = pd.read_sql_table(table_name, engine)
    if 'race' not in df.columns:
        return JSONResponse(status_code=400, content={"error": "No 'race' column in data."})
    counts = df['race'].value_counts(dropna=False).to_dict()
    return {"labels": list(counts.keys()), "counts": list(counts.values())}

@app.get('/api/analytics/gender-distribution')
def gender_distribution():
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    import pandas as pd
    df = pd.read_sql_table(table_name, engine)
    if 'gender' not in df.columns:
        return JSONResponse(status_code=400, content={"error": "No 'gender' column in data."})
    counts = df['gender'].value_counts(dropna=False).to_dict()
    return {"labels": list(counts.keys()), "counts": list(counts.values())}

@app.get('/api/analytics/age-distribution')
def age_distribution():
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    import pandas as pd
    df = pd.read_sql_table(table_name, engine)
    if 'age' not in df.columns:
        return JSONResponse(status_code=400, content={"error": "No 'age' column in data."})
    # Return all ages for histogram/box plot
    ages = df['age'].dropna().tolist()
    return {"ages": ages}

def get_latest_table_name(engine):
    # Get the most recently created/modified table (by name, assuming upload order)
    insp = inspect(engine)
    tables = insp.get_table_names()
    # Exclude mapping tables
    mapping_tables = {'admission_types', 'discharge_types', 'admission_source_types'}
    data_tables = [t for t in tables if t not in mapping_tables]
    if not data_tables:
        return None
    # Return the last table alphabetically (assuming latest upload)
    return sorted(data_tables)[-1]

