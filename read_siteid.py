import pandas as pd

excel_path = r"C:\Users\uuswalker\.gemini\antigravity\brain\50b300bf-229a-4fc2-964c-3356685de0ff\.user_uploaded\media_1790512939101.xlsx"

try:
    xls = pd.ExcelFile(excel_path)
    print("Sheet names:", xls.sheet_names)
    
    for sheet in xls.sheet_names:
        df = pd.read_excel(excel_path, sheet_name=sheet)
        print(f"\n=== Sheet: {sheet} ===")
        print(f"Columns: {df.columns.tolist()}")
        print(f"Shape: {df.shape}")
        print(f"First 5 rows:")
        print(df.head().to_string())
except Exception as e:
    print("Error:", e)

# Also check the old uploaded xlsx
excel_path2 = r"C:\Users\uuswalker\.gemini\antigravity\brain\50b300bf-229a-4fc2-964c-3356685de0ff\.user_uploaded\media_1790512779797.xlsx"
try:
    xls2 = pd.ExcelFile(excel_path2)
    print("\n\n=== OLD FILE ===")
    print("Sheet names:", xls2.sheet_names)
    for sheet in xls2.sheet_names:
        df2 = pd.read_excel(excel_path2, sheet_name=sheet)
        print(f"\n=== Sheet: {sheet} ===")
        print(f"Columns: {df2.columns.tolist()}")
        print(f"Shape: {df2.shape}")
        print(f"First 5 rows:")
        print(df2.head().to_string())
except Exception as e:
    print("Error old file:", e)
