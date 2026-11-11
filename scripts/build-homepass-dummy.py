"""
Script: scripts/build-homepass-dummy.py
Deskripsi:
  Menggabungkan data koordinat geografis dari file KMZ (Kota Surakarta, Sukoharjo, Karanganyar)
  dengan file 'Homepass Dummy.xlsx' untuk menghasilkan pemetaan presisi Homepass ID -> ODP Code -> GPS Coordinate.

Output:
  1. data-mentah/homepass_dummy_merged.json (Master JSON 16.873 titik)
  2. data-mentah/homepass_dummy_d1.sql (SQL Batch siap import ke Cloudflare D1)
  3. data-mentah/odp_summary.json (Ringkasan 1.824 ODP & centroid tiang)
"""

import os
import re
import json
import zipfile
import openpyxl

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data-mentah")
XLSX_PATH = os.path.join(DATA_DIR, "Homepass Dummy.xlsx")

KMZ_FILES = [
    "KAB. KARANGANYAR.kmz.zip",
    "KAB. SUKOHARJO.kmz.zip",
    "KOTA SURAKARTA.kmz.zip"
]

def extract_kmz_coordinates():
    kmz_data = {}
    print("Membaca file KMZ...")
    for kmz_name in KMZ_FILES:
        kmz_path = os.path.join(DATA_DIR, kmz_name)
        if not os.path.exists(kmz_path):
            print(f"⚠️  File {kmz_name} tidak ditemukan, lewati.")
            continue
        
        with zipfile.ZipFile(kmz_path) as z:
            kml_content = z.read("doc.kml").decode("utf-8", "replace")
            # Ekstrak tiap Placemark
            placemarks = re.findall(r"<Placemark>(.*?)</Placemark>", kml_content, re.DOTALL)
            count = 0
            for pm in placemarks:
                name_m = re.search(r"<name>(.*?)</name>", pm)
                coord_m = re.search(r"<coordinates>(.*?)</coordinates>", pm)
                if name_m and coord_m:
                    hp_id = name_m.group(1).strip()
                    coords = coord_m.group(1).strip().split(",")
                    try:
                        lng = round(float(coords[0]), 6)
                        lat = round(float(coords[1]), 6)
                        kmz_data[hp_id] = {
                            "lng": lng,
                            "lat": lat
                        }
                        count += 1
                    except ValueError:
                        continue
            print(f"  ✓ {kmz_name}: {count} titik dummy terbaca.")
    
    print(f"Total unik Homepass ID dari KMZ: {len(kmz_data)}")
    return kmz_data

def process_and_merge():
    kmz_coords = extract_kmz_coordinates()
    
    print(f"\nMembaca file Excel {XLSX_PATH}...")
    wb = openpyxl.load_workbook(XLSX_PATH, read_only=True)
    sheet = wb.active
    
    merged_records = []
    odp_groups = {} # odp_code -> { "count": n, "lats": [], "lngs": [], "city": c, "district": d, "sub_district": sd, "cluster": cl }
    
    matched = 0
    total_xlsx = 0
    
    for i, row in enumerate(sheet.iter_rows(values_only=True)):
        if i == 0:
            continue
        total_xlsx += 1
        
        hp_id = str(row[0]).strip() if row[0] is not None else ""
        status = str(row[1]).strip() if row[1] is not None else "ASSIGNED"
        b_type = str(row[2]).strip() if row[2] is not None else ""
        cluster = str(row[3]).strip() if row[3] is not None else ""
        fat_code = str(row[4]).strip() if row[4] is not None else ""
        city = str(row[6]).strip() if row[6] is not None else ""
        district = str(row[7]).strip() if row[7] is not None else ""
        sub_dist = str(row[8]).strip() if row[8] is not None else ""
        dsa = str(row[9]).strip() if row[9] is not None else ""
        excel_lng = row[10]
        excel_lat = row[11]
        addr = str(row[12]).strip() if row[12] is not None else ""
        
        # Cari koordinat terbaik (prioritaskan KMZ, fallback ke Excel jika ada)
        lat = None
        lng = None
        if hp_id in kmz_coords:
            lat = kmz_coords[hp_id]["lat"]
            lng = kmz_coords[hp_id]["lng"]
            matched += 1
        elif excel_lat and excel_lng:
            try:
                lat = round(float(excel_lat), 6)
                lng = round(float(excel_lng), 6)
            except ValueError:
                pass
        
        if lat is None or lng is None:
            continue
            
        record = {
            "id": hp_id,
            "odp": fat_code,
            "status": status,
            "building_type": b_type,
            "cluster": cluster,
            "city": city,
            "district": district,
            "sub_district": sub_dist,
            "dsa_cluster_id": dsa,
            "lat": lat,
            "lng": lng,
            "address": addr
        }
        merged_records.append(record)
        
        # Kelompokkan ODP untuk summary tiang
        if fat_code:
            if fat_code not in odp_groups:
                odp_groups[fat_code] = {
                    "odp": fat_code,
                    "city": city,
                    "district": district,
                    "sub_district": sub_dist,
                    "cluster": cluster,
                    "count": 0,
                    "lats": [],
                    "lngs": []
                }
            odp_groups[fat_code]["count"] += 1
            odp_groups[fat_code]["lats"].append(lat)
            odp_groups[fat_code]["lngs"].append(lng)
            
    print(f"\nStatistik Penggabungan:")
    print(f"  - Total baris Excel: {total_xlsx}")
    print(f"  - Sukses Match dengan KMZ: {matched}")
    print(f"  - Total Data Berkoordinat Final: {len(merged_records)}")
    print(f"  - Total Tiang ODP Unik: {len(odp_groups)}")
    
    # 1. Tulis JSON Master
    json_out = os.path.join(DATA_DIR, "homepass_dummy_merged.json")
    print(f"\nMenulis Master JSON ke {json_out}...")
    with open(json_out, "w", encoding="utf-8") as f:
        json.dump(merged_records, f, indent=2, ensure_ascii=False)
    print("  ✓ Master JSON berhasil ditulis.")
    
    # 2. Tulis ODP Summary (Centroid Tiang)
    odp_summary = []
    for odp, g in odp_groups.items():
        avg_lat = round(sum(g["lats"]) / len(g["lats"]), 6)
        avg_lng = round(sum(g["lngs"]) / len(g["lngs"]), 6)
        odp_summary.append({
            "odp": odp,
            "city": g["city"],
            "district": g["district"],
            "sub_district": g["sub_district"],
            "cluster": g["cluster"],
            "homepass_count": g["count"],
            "centroid_lat": avg_lat,
            "centroid_lng": avg_lng
        })
    
    # Urutkan berdasarkan kota & kecamatan
    odp_summary.sort(key=lambda x: (x["city"], x["district"], x["sub_district"], x["odp"]))
    odp_out = os.path.join(DATA_DIR, "odp_summary.json")
    print(f"Menulis ODP Summary ke {odp_out}...")
    with open(odp_out, "w", encoding="utf-8") as f:
        json.dump(odp_summary, f, indent=2, ensure_ascii=False)
    print(f"  ✓ {len(odp_summary)} Tiang ODP Summary berhasil ditulis.")
    
    # 3. Tulis SQL Batch untuk Cloudflare D1
    sql_out = os.path.join(DATA_DIR, "homepass_dummy_d1.sql")
    print(f"Menulis SQL Batch D1 ke {sql_out}...")
    with open(sql_out, "w", encoding="utf-8") as f:
        f.write("-- Batch Insert Homepass Dummy Solo Raya ke Cloudflare D1 (coverage-db)\n")
        f.write("-- Total Data: %d rows\n\n" % len(merged_records))
        
        chunk_size = 500
        for chunk_idx in range(0, len(merged_records), chunk_size):
            chunk = merged_records[chunk_idx:chunk_idx + chunk_size]
            values = []
            for r in chunk:
                # Escape single quote pada string
                esc_cluster = r["cluster"].replace("'", "''")
                esc_addr = r["address"].replace("'", "''")
                esc_city = r["city"].replace("'", "''")
                esc_odp = r["odp"].replace("'", "''")
                values.append(f"('{r['id']}', {r['lat']}, {r['lng']}, '{esc_cluster}', '{r['status']}', '{esc_odp}', '{esc_city}', '{esc_addr}')")
            
            f.write(f"-- Chunk {chunk_idx // chunk_size + 1}\n")
            f.write("INSERT OR REPLACE INTO homepass (id, lat, lng, cluster_name, status, odp_id, city, address) VALUES\n")
            f.write(",\n".join(values))
            f.write(";\n\n")
            
    print("  ✓ SQL Batch D1 berhasil ditulis.")
    print("\n✅ Seluruh pemrosesan data dummy & KMZ selesai 100%!")

if __name__ == "__main__":
    process_and_merge()
