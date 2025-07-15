from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

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
        df = pd.read_csv(io.BytesIO(contents))
        df_clean = df.dropna(how='all')
        # You could store df_clean to disk or a database here
        return {"message": "CSV uploaded and cleaned successfully! 🧹✨"}
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": f"Failed to process CSV: {str(e)}"})

