"""Dedup + thinning + statistik spacing titik wireless.
Input : ../data-mentah/wireless_raw.jsonl
Output: ../data-mentah/wireless_stats.txt (laporan; build file terpisah)
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

seen = {}
zones = set()
n_raw = 0
for line in open(SRC, encoding="utf-8"):
    line = line.strip()
    if not line:
        continue
    n_raw += 1
    lo, la, zona = json.loads(line)
    key = (lo, la)
    if key not in seen:
        seen[key] = zona
        if zona:
            zones.add(zona)

pts = [(lo, la) for (lo, la) in seen]
print(f"raw: {n_raw} | unik: {len(pts)} | zona: {len(zones)}")

# --- spacing: nearest-neighbor via grid hash, sampel 8000 titik ---
import random

random.seed(7)
sample = random.sample(pts, min(8000, len(pts)))
CELL = 0.01
grid = defaultdict(list)
for i, (lo, la) in enumerate(pts):
    grid[(math.floor(lo / CELL), math.floor(la / CELL))].append(i)


def nn_m(idx):
    lo, la = pts[idx]
    best = 1e18
    cx, cy = math.floor(lo / CELL), math.floor(la / CELL)
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            for j in grid.get((cx + dx, cy + dy), ()):
                if j == idx:
                    continue
                olo, ola = pts[j]
                # haversine cepat (meter)
                t = math.pi / 180
                a = math.sin((ola - la) * t / 2) ** 2 + math.cos(
                    la * t
                ) * math.cos(ola * t) * math.sin((olo - lo) * t / 2) ** 2
                d = 2 * 6371000 * math.asin(math.sqrt(a))
                if d < best:
                    best = d
    return best


dists = []
index_of = {p: i for i, p in enumerate(pts)}
for lo, la in sample:
    dists.append(nn_m(index_of[(lo, la)]))
dists.sort()
n = len(dists)


def pct(q):
    return dists[min(n - 1, int(q * n))]


print(f"NN spacing (m) p50={pct(0.5):.0f} p90={pct(0.9):.0f} p95={pct(0.95):.0f} max~{dists[-1]:.0f}")

# --- thinning 25m ---
CELL2 = 0.00025
cells = {}
for (lo, la), zona in seen.items():
    key = (round(lo / CELL2), round(la / CELL2))
    if key not in cells:
        cells[key] = (lo, la, zona)
print(f"thinned 25m: {len(cells)}")

with open(os.path.join(BASE, "..", "data-mentah", "wireless_stats.txt"), "w", encoding="utf-8") as f:
    f.write(f"raw={n_raw} unik={len(pts)} zona={len(zones)} thinned={len(cells)}\n")
    f.write(f"nn_p50={pct(0.5):.0f} nn_p90={pct(0.9):.0f} nn_p95={pct(0.95):.0f}\n")
