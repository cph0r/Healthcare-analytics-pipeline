from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        return {"message": "CSV uploaded, raw and cleaned files saved successfully! 🧹✨"}
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": f"Failed to process CSV: {str(e)}"})

