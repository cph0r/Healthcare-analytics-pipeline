# 🚀 Healthcare Analytics Pipeline

Welcome to the Healthcare Analytics Pipeline! This project is a full-stack, data-driven platform for analyzing patient data, predicting readmission risk, and uncovering insights with interactive dashboards and advanced analytics.

---

## 🏗️ Project Structure

```
Healthcare-analytics-pipeline/
│
├── backend/
│   ├── main.py                # FastAPI backend
│   ├── requirements.txt       # Backend dependencies
│   ├── analytics/
│   │   ├── AdvancedAnalytics.ipynb  # Jupyter notebook for advanced analytics
│   │   ├── readmission_rf_model.joblib
│   │   ├── length_of_stay_rf_model.joblib
│   │   └── scaler.joblib
│   └── ... (data, db, etc.)
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main React app
│   │   ├── CSVUploader.tsx    # CSV upload component
│   │   ├── *Plots.tsx         # Analytics visualizations
│   │   └── ... (styles, assets)
│   ├── package.json           # Frontend dependencies
│   └── ... (public, config)
│
└── README.md                  # You are here!
```

---

## ⚡ Features

- **CSV Upload:** Upload patient data for instant analysis.
- **Interactive Dashboards:** Visualize race, gender, age, admission patterns, diagnoses, medications, and readmission risk.
- **Predictive Modeling:** Random Forest models for readmission risk and length-of-stay prediction.
- **Clustering:** Segment patients using KMeans and PCA.
- **Advanced Analytics:** Jupyter notebook for deep dives (correlation, clustering, feature importance, and more).
- **Modern UI:** React + Vite + Recharts, styled for a dark, professional look.
- **Backend:** FastAPI, pandas, SQLAlchemy, SQLite.

---

## 🛠️ Setup Instructions

### 1. Backend (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

- The API will be available at `http://localhost:8000`.

### 2. Frontend (React + Vite)

```bash
cd frontend
pnpm install   # or npm install if you prefer
pnpm dev       # or npm run dev
```

- The app will be available at `http://localhost:5173`.

### 3. Advanced Analytics (Jupyter Notebook)

```bash
cd backend/analytics
# Activate your backend venv if not already
jupyter notebook
# Open AdvancedAnalytics.ipynb in your browser
```

---

## 🧪 Usage

- **Upload your CSV** on the frontend to start exploring analytics.
- **Check the dashboards** for interactive plots and insights.
- **Run the Jupyter notebook** for advanced data science (correlation, clustering, feature importance, etc.).
- **Saved models** (`joblib` files) are in `backend/analytics/` for easy deployment or further analysis.

---

## 👨‍💻 Credits

> 🚀 Healthcare Analytics Pipeline by **Chirag Phor - g24ai1018**

Frontend, backend, analytics, and all the data wizardry—crafted with care, caffeine, and a dash of humor.

---

## 🩺 Pro Tips

- If you see a “could not convert string to float” error, check your columns—sometimes strings sneak into numeric lists like party crashers.
- Want to include age in your analytics? Convert age ranges to numeric midpoints for math-friendly fun!
- Models are saved with `joblib`—ready for deployment or further tinkering.

---

## 🦸‍♂️ License

MIT License. Use, share, and make healthcare data a little less mysterious!

---

If you have questions, want to contribute, or just want a data science joke, open an issue or reach out. Happy analyzing! 😄📊
