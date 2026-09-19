"""Ekstrak koordinat point + ID zona dari 70 KMZ (streaming, hemat memori).
Output: data-mentah/wireless_raw.jsonl  -> baris: [lng, lat, zona]
Jalankan: python scripts/extract-kmz.py
"""
import io
import json
import os
import re
import sys
import zipfile

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "..", "KMZXLSATU.zip")
OUTDIR = os.path.join(BASE, "..", "data-mentah")
os.makedirs(OUTDIR, exist_ok=True)
OUT = os.path.join(OUTDIR, "wireless_raw.jsonl")

COORD_RE = re.compile(rb"<coordinates>(.*?)</coordinates>", re.S)
DSA_RE = re.compile(r"DSA_CLUSTER_ID</td>\s*<td[^>]*>(.*?)</td>", re.S)
STYLE_RE = re.compile(r"<styleUrl>#?(.*?)</styleUrl>")


def zone_of(placemark_head):
    """ID zona dari sel tabel DSA_CLUSTER_ID (mis. 3311-1)."""
    m = DSA_RE.search(placemark_head)
    if m:
        return m.group(1).strip()
    return ""


total = 0
with zipfile.ZipFile(SRC) as z:
    members = sorted(z.namelist())
    print("kmz files:", len(members))
    with open(OUT, "w", encoding="utf-8") as f:
        for m in members:
            raw = z.read(m)
            inner = (
                zipfile.ZipFile(io.BytesIO(raw)).read("doc.kml")
                if raw[:2] == b"PK"
                else raw
            )
            # pecah per Placemark agar nama zona akurat
            parts = re.split(rb"<Placemark", inner)
            n_file = 0
            for part in parts[1:]:
                cm = COORD_RE.search(part)
                if not cm:
                    continue
                # hanya Point (bukan Polygon)
                head = part[: cm.start()]
                if b"<Point" not in head:
                    continue
                nums = cm.group(1).decode("ascii", "replace").strip().split(",")
                try:
                    lo, la = round(float(nums[0]), 5), round(float(nums[1]), 5)
                except (ValueError, IndexError):
                    continue
                if not (110.0 < lo < 111.5 and -8.0 < la < -7.0):
                    continue
                zona = zone_of(head.decode("utf-8", "replace")[-2000:])
                sm = STYLE_RE.search(head.decode("utf-8", "replace")[-2000:])
                style = sm.group(1).strip() if sm else ""
                f.write(json.dumps([lo, la, zona, style], separators=(",", ":")) + "\n")
                n_file += 1
            total += n_file
            print(f"{m}: {n_file} points")
print("TOTAL points:", total)
