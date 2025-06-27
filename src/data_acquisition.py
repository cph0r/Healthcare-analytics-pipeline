import os
import pandas as pd
import requests

DIABETES_URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/00296/dataset_diabetes.zip"


def download_diabetes_dataset(dest_dir: str = "data/raw") -> str:
    """Download the UCI diabetes dataset if it does not exist.

    Parameters
    ----------
    dest_dir: str
        Directory to store the downloaded file.

    Returns
    -------
    str
        Path to the downloaded zip file.
    """
    os.makedirs(dest_dir, exist_ok=True)
    zip_path = os.path.join(dest_dir, "dataset_diabetes.zip")
    if not os.path.exists(zip_path):
        response = requests.get(DIABETES_URL, timeout=60)
        response.raise_for_status()
        with open(zip_path, "wb") as f:
            f.write(response.content)
    return zip_path
