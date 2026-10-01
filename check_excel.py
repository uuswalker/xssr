import pandas as pd
import json

excel_path = r"C:\Users\uuswalker\.gemini\antigravity\brain\50b300bf-229a-4fc2-964c-3356685de0ff\.user_uploaded\media_1790492299226.xlsx"

try:
    df = pd.read_excel(excel_path)
    print("Columns:", df.columns.tolist())
    
    # Check if 'SiteId' or similar exists in columns
    site_cols = [c for c in df.columns if 'site' in str(c).lower()]
    print("Columns with 'site':", site_cols)
except Exception as e:
    print("Error reading Excel:", e)
