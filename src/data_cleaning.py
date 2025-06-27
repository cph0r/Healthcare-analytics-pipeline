import pandas as pd


def clean_diabetes_data(df: pd.DataFrame) -> pd.DataFrame:
    """Simple cleaning for diabetes dataset.

    * Fills missing numeric values with the column mean.
    * Standardizes column names to snake_case.
    * Drops duplicate rows.
    """
    df = df.copy()
    numeric_cols = df.select_dtypes(include=["number"]).columns
    for col in numeric_cols:
        if df[col].isna().any():
            df[col] = df[col].fillna(df[col].mean())
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    df = df.drop_duplicates()
    return df
