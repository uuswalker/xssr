"""Build data/coverage-wireless.json dari wireless_raw.jsonl.
- dedup + thinning grid + tabel zona
- overlap vs homepass fiber (info urutan verdict)
Jalankan: python tools/build-wireless.py [grid_meter]
"""
import io
import json
import math
import os
import sys
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "..", "data-mentah", "wireless_raw.jsonl")
DST = os.path.join(BASE, "data", "coverage-wireless.json")
GRID_M = float(sys.argv[1]) if len(sys.argv) > 1 else 50.0
CELL = GRID_M / 111320.0

seen = {}
for line in open(SRC, encoding="utf-8"):
    line = line.strip()
    if not line:
        continue
    lo, la, zona, _style = json.loads(line)
    key = (lo, la)
    if key not in seen:
        seen[key] = zona

print(f"unik: {len(seen)}")

# thinning: 1 titik per sel
cells = {}
for (lo, la), zona in seen.items():
    key = (round(lo / CELL), round(la / CELL))
    if key not in cells:
        cells[key] = (lo, la, zona)

pts = sorted(cells.values())
zones = sorted({z for _, _, z in pts})
zidx = {z: i for i, z in enumerate(zones)}
out = {
    "v": 1,
    "updated": "2026-09-18",
    "grid_m": GRID_M,
    "count": len(pts),
    "zones": zones,
    "pts": [[lo, la, zidx[z]] for lo, la, z in pts],
}
with open(DST, "w", encoding="utf-8") as f:
    json.dump(out, f, separators=(",", ":"))
print(f"grid {GRID_M}m -> {len(pts)} pts, {len(zones)} zona")
print(f"size: {os.path.getsize(DST) / 1024:.0f} KB")

# overlap: % titik wireless dalam 100m titik fiber homepass
cov = json.load(open(os.path.join(BASE, "data", "coverage.json"), encoding="utf-8"))
fgrid = defaultdict(list)
for i, (lo, la) in enumerate(cov["pts"]):
    fgrid[(math.floor(lo / 0.01), math.floor(la / 0.01))].append(i)


def near_fiber(lo, la, r=100):
    best = 1e18
    cx, cy = math.floor(lo / 0.01), math.floor(la / 0.01)
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            for j in fgrid.get((cx + dx, cy + dy), ()):
                flo, fla = cov["pts"][j]
                t = math.pi / 180
                a = math.sin((fla - la) * t / 2) ** 2 + math.cos(la * t) * math.cos(
                    fla * t
                ) * math.sin((flo - lo) * t / 2) ** 2
                d = 2 * 6371000 * math.asin(math.sqrt(a))
                if d < best:
                    best = d
    return best <= r


import random

random.seed(11)
sample = random.sample(pts, min(3000, len(pts)))
hit = sum(1 for lo, la, _ in sample if near_fiber(lo, la))
print(f"overlap: {hit}/{len(sample)} titik wireless <=100m dari fiber ({hit/len(sample)*100:.0f}%)")
