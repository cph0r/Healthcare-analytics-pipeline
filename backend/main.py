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
import sqlalchemy

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

@app.get('/api/analytics/admission-type-distribution')
def admission_type_distribution():
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    query = f'''
        SELECT at.description as label, COUNT(*) as count
        FROM "{table_name}" d
        LEFT JOIN admission_types at ON d.admission_type_id = at.admission_ty
        GROUP BY at.description
        ORDER BY count DESC
        LIMIT 3
    '''
    with engine.connect() as conn:
        result = conn.execute(sqlalchemy.text(query))
        rows = result.fetchall()
    labels = [row[0] if row[0] is not None else 'Unknown' for row in rows]
    counts = [row[1] for row in rows]
    return {"labels": labels, "counts": counts}

@app.get('/api/analytics/admission-source-distribution')
def admission_source_distribution():
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    query = f'''
        SELECT ast.description as label, COUNT(*) as count
        FROM "{table_name}" d
        LEFT JOIN admission_source_types ast ON d.admission_source_id = ast.admission_source_i
        GROUP BY ast.description
        ORDER BY count DESC
        LIMIT 3
    '''
    with engine.connect() as conn:
        result = conn.execute(sqlalchemy.text(query))
        rows = result.fetchall()
    labels = [row[0] if row[0] is not None else 'Unknown' for row in rows]
    counts = [row[1] for row in rows]
    return {"labels": labels, "counts": counts}

@app.get('/api/analytics/discharge-disposition-distribution')
def discharge_disposition_distribution():
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    query = f'''
        SELECT dt.description as label, COUNT(*) as count
        FROM "{table_name}" d
        LEFT JOIN discharge_types dt ON d.discharge_disposition_id = dt.discharge_di
        GROUP BY dt.description
        ORDER BY count DESC
        LIMIT 3
    '''
    with engine.connect() as conn:
        result = conn.execute(sqlalchemy.text(query))
        rows = result.fetchall()
    labels = [row[0] if row[0] is not None else 'Unknown' for row in rows]
    counts = [row[1] for row in rows]
    return {"labels": labels, "counts": counts}

def normalize_icd9(code):
    code = str(code).lstrip('0')
    if len(code) > 3 and '.' not in code:
        return code[:3] + '.' + code[3:]
    return code

def icd9_to_category(code):
    try:
        code = str(code)
        if '.' in code:
            code = code.split('.')[0]
        code_int = int(code)
    except Exception:
        return 'Other'
    if (390 <= code_int <= 459) or code_int == 785:
        return 'Circulatory'
    elif (460 <= code_int <= 519) or code_int == 786:
        return 'Respiratory'
    elif (520 <= code_int <= 579) or code_int == 787:
        return 'Digestive'
    elif code_int == 250:
        return 'Diabetes'
    elif 800 <= code_int <= 999:
        return 'Injury'
    elif 710 <= code_int <= 739:
        return 'Musculoskeletal'
    elif (580 <= code_int <= 629) or code_int == 788:
        return 'Genitourinary'
    else:
        return 'Other'

@app.get('/api/analytics/top-diagnoses')
def top_diagnoses():
    import pandas as pd
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    df = pd.read_sql_table(table_name, engine)
    df['diag_1_cat'] = df['diag_1'].apply(icd9_to_category)
    top = df['diag_1_cat'].value_counts().head(10)
    labels = top.index.tolist()
    counts = [to_py(x) for x in top.values.tolist()]
    return {"labels": labels, "counts": counts}

@app.get('/api/analytics/readmission-by-diagnosis')
def readmission_by_diagnosis():
    import pandas as pd
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    df = pd.read_sql_table(table_name, engine)
    df['diag_1_cat'] = df['diag_1'].apply(icd9_to_category)
    top_cats = df['diag_1_cat'].value_counts().head(10).index.tolist()
    labels = top_cats
    readmit_perc = []
    for cat in top_cats:
        sub = df[df['diag_1_cat'] == cat]
        total = len(sub)
        if total == 0:
            readmit_perc.append(0)
        else:
            readmit = sub['readmitted'].str.lower().isin(['yes', 'readmitted', '<30', '>30']).sum()
            readmit_perc.append(round(100 * readmit / total, 2))
    readmit_perc = [to_py(x) for x in readmit_perc]
    return {"labels": labels, "readmission_percent": readmit_perc}

@app.get('/api/analytics/medication-usage')
def medication_usage():
    import pandas as pd
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    df = pd.read_sql_table(table_name, engine)
    meds = ["insulin", "metformin", "glipizide", "glyburide", "pioglitazone", "rosiglitazone", "glimepiride"]
    values = ["No", "Steady", "Up", "Down"]
    usage = {}
    for med in meds:
        if med in df.columns:
            counts = df[med].value_counts(normalize=True).reindex(values, fill_value=0)
            usage[med] = [round(100 * counts[v], 2) for v in values]
        else:
            usage[med] = [0, 0, 0, 0]
    return {"medications": meds, "values": values, "usage": usage}

@app.get('/api/analytics/medication-readmission')
def medication_readmission():
    import pandas as pd
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    df = pd.read_sql_table(table_name, engine)
    meds = ["insulin", "metformin", "glipizide", "glyburide", "pioglitazone", "rosiglitazone", "glimepiride"]
    values = ["No", "Steady", "Up", "Down"]
    readmit = {}
    for med in meds:
        if med in df.columns:
            med_readmit = []
            for v in values:
                sub = df[df[med] == v]
                total = len(sub)
                if total == 0:
                    med_readmit.append(0)
                else:
                    r = sub['readmitted'].str.lower().isin(['yes', 'readmitted', '<30', '>30']).sum()
                    med_readmit.append(round(100 * r / total, 2))
            readmit[med] = med_readmit
        else:
            readmit[med] = [0, 0, 0, 0]
    return {"medications": meds, "values": values, "readmission": readmit}

def to_py(val):
    import numpy as np
    if isinstance(val, np.generic):
        return val.item()
    return val

@app.get('/api/analytics/readmission-distribution')
def readmission_distribution():
    import pandas as pd
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    df = pd.read_sql_table(table_name, engine)
    readmit = df['readmitted'].str.lower().isin(['yes', 'readmitted', '<30', '>30'])
    counts = [(~readmit).sum(), readmit.sum()]
    counts = [to_py(x) for x in counts]
    labels = ['Not Readmitted', 'Readmitted']
    return {"labels": labels, "counts": counts}

@app.get('/api/analytics/readmission-by-age')
def readmission_by_age():
    import pandas as pd
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    df = pd.read_sql_table(table_name, engine)
    df['readmit_bin'] = df['readmitted'].str.lower().isin(['yes', 'readmitted', '<30', '>30'])
    ages_readmit = df[df['readmit_bin']]['age'].dropna().tolist()
    ages_no = df[~df['readmit_bin']]['age'].dropna().tolist()
    ages_readmit = [to_py(x) for x in ages_readmit]
    ages_no = [to_py(x) for x in ages_no]
    return {"readmitted": ages_readmit, "not_readmitted": ages_no}

@app.get('/api/analytics/readmission-by-demographics')
def readmission_by_demographics():
    import pandas as pd
    engine = get_engine()
    table_name = get_latest_table_name(engine)
    if not table_name:
        return JSONResponse(status_code=404, content={"error": "No data table found."})
    df = pd.read_sql_table(table_name, engine)
    df['readmit_bin'] = df['readmitted'].str.lower().isin(['yes', 'readmitted', '<30', '>30'])
    race_grp = df.groupby(['race', 'readmit_bin']).size().unstack(fill_value=0)
    race_labels = race_grp.index.tolist()
    race_counts = {k: [to_py(x) for x in race_grp[k].tolist()] for k in race_grp.columns}
    gender_grp = df.groupby(['gender', 'readmit_bin']).size().unstack(fill_value=0)
    gender_labels = gender_grp.index.tolist()
    gender_counts = {k: [to_py(x) for x in gender_grp[k].tolist()] for k in gender_grp.columns}
    return {
        "race": {"labels": race_labels, "not_readmitted": race_counts.get(False, []), "readmitted": race_counts.get(True, [])},
        "gender": {"labels": gender_labels, "not_readmitted": gender_counts.get(False, []), "readmitted": gender_counts.get(True, [])}
    }


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

