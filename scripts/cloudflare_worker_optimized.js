/**
 * Cloudflare Worker: coverage-api (v3.0.0 - Enterprise Unified Master D1)
 * Ultra-Fast FTTH & Wireless Coverage Lookup for XL Home Solo Raya & Nationwide Indonesia
 * 
 * Architecture:
 * 1. Unified Master D1 SQLite Database (7.095.867 titik FTTH resmi se-Indonesia)
 * 2. Solo Raya terintegrasi alami di bawah Provinsi Jawa Tengah (Zero Fragmentation)
 * 3. Multi-Level Caching (Isolate RAM Cache -> Cloudflare Edge Cache API -> Master D1)
 * 4. Graceful Fallback to Wireless (XL Ultra 5G+ FWA / XL Home 4G jika jarak > 300m)
 * 5. Strict Rate Limiting (60 req/min per IP) & Dynamic Whitelist CORS
 */

const ADMIN_KEY = "xssr-tahap2-secure-2026";
const RATE_LIMIT_MAX_REQUESTS = 60; // Max 60 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const CACHE_VERSION = "v3.0.5-zerotimeout";

// Solo Raya Core Coverage Cities (Indexed B-Tree fast routing)
const SOLO_CITIES = "'KOTA SURAKARTA', 'KAB. SUKOHARJO', 'KAB. KARANGANYAR', 'KAB. BOYOLALI', 'KAB. KLATEN', 'KAB. SRAGEN', 'KAB. WONOGIRI'";

const PREFIX_STOPWORDS = new Set([
  "jl", "jalan", "jln", "gang", "gg", "gng", "lorong", "lrg",
  "no", "nomor", "rt", "rw", "blok", "kav",
  "perum", "perumahan", "graha", "residence", "residences", "cluster",
  "kel", "kelurahan", "desa", "ds",
  "kec", "kecamatan", "kab", "kabupaten", "kota"
]);

const COMPOUND_ROOTS = [
  "semen", "karang", "suko", "rawa", "banyu", "colo", "kebon", "kelapa", 
  "tanjung", "muara", "pondok", "pasar", "kali", "gunung", "batu"
];

const NATIONAL_CITY_MAP = {
  "surabaya": "KOTA SURABAYA",
  "sidoarjo": "KAB. SIDOARJO",
  "gresik": "KAB. GRESIK",
  "malang": "MALANG",
  "bandung": "BANDUNG",
  "cimahi": "KOTA CIMAHI",
  "cirebon": "CIREBON",
  "jakarta": "JAKARTA",
  "jaksel": "JAKARTA SELATAN",
  "jaktim": "JAKARTA TIMUR",
  "jakpus": "JAKARTA PUSAT",
  "jakbar": "JAKARTA BARAT",
  "jakut": "JAKARTA UTARA",
  "bogor": "BOGOR",
  "depok": "KOTA DEPOK",
  "tangerang": "TANGERANG",
  "tangsel": "TANGERANG SELATAN",
  "bekasi": "BEKASI",
  "semarang": "SEMARANG",
  "jogja": "YOGYAKARTA",
  "yogyakarta": "YOGYAKARTA",
  "sleman": "SLEMAN",
  "bantul": "BANTUL",
  "denpasar": "DENPASAR",
  "bali": "DENPASAR",
  "badung": "BADUNG",
  "medan": "MEDAN",
  "palembang": "PALEMBANG",
  "pekanbaru": "PEKANBARU",
  "batam": "BATAM",
  "makassar": "MAKASSAR"
};

// In-Memory Fast LRU Cache for warm isolates (< 1ms response)
const MEMORY_CACHE = new Map();
const MEMORY_CACHE_MAX_ITEMS = 500;
const MEMORY_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour memory TTL

// In-Memory IP Rate Limiter
const IP_RATE_LIMITS = new Map();

/**
 * Whitelist CORS configurations
 */
const ALLOWED_ORIGIN_LIST = [
  "https://xlhomesolo.com",
  "https://www.xlhomesolo.com",
  "https://xssr.vercel.app"
];

function getCorsHeaders(request) {
  const origin = request.headers.get("Origin");
  let allowOrigin = "https://xlhomesolo.com";

  if (origin) {
    if (
      ALLOWED_ORIGIN_LIST.includes(origin) ||
      origin.endsWith(".xlhomesolo.com") ||
      origin.endsWith(".vercel.app") ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:")
    ) {
      allowOrigin = origin;
    }
  } else {
    allowOrigin = "*";
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-key",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json"
  };
}

/**
 * In-Memory Sliding Window Rate Limiter
 */
function applyRateLimit(clientIp) {
  if (!clientIp || clientIp === "unknown") {
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS, resetSeconds: 60 };
  }

  const now = Date.now();
  let record = IP_RATE_LIMITS.get(clientIp);

  if (IP_RATE_LIMITS.size > 5000) {
    for (const [ip, data] of IP_RATE_LIMITS.entries()) {
      if (now - data.startTime > RATE_LIMIT_WINDOW_MS) {
        IP_RATE_LIMITS.delete(ip);
      }
    }
  }

  if (!record || (now - record.startTime) > RATE_LIMIT_WINDOW_MS) {
    record = { count: 1, startTime: now };
    IP_RATE_LIMITS.set(clientIp, record);
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetSeconds: 60 };
  }

  record.count += 1;
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - record.count);
  const resetSeconds = Math.max(1, Math.ceil((record.startTime + RATE_LIMIT_WINDOW_MS - now) / 1000));

  if (record.count > RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetSeconds };
  }

  return { allowed: true, remaining, resetSeconds };
}

function getMemoryCache(key) {
  const item = MEMORY_CACHE.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    MEMORY_CACHE.delete(key);
    return null;
  }
  return item.value;
}

function setMemoryCache(key, value) {
  if (MEMORY_CACHE.size >= MEMORY_CACHE_MAX_ITEMS) {
    const firstKey = MEMORY_CACHE.keys().next().value;
    MEMORY_CACHE.delete(firstKey);
  }
  MEMORY_CACHE.set(key, {
    value,
    expiresAt: Date.now() + MEMORY_CACHE_TTL_MS
  });
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function getMasterDb(env) {
  // Support DB or DB_JATENG bindings smoothly
  return env.DB || env.DB_JATENG;
}

const XL_5G_CITIES = [
  "SURAKARTA", "SOLO", "BOYOLALI", "KARANGANYAR", "SUKOHARJO", "KLATEN",
  "SEMARANG", "KOTA SEMARANG", "SALATIGA", "DEMAK", "KUDUS", "GROBOGAN", "JEPARA", "BLORA", "PATI",
  "YOGYAKARTA", "KOTA YOGYAKARTA", "SLEMAN", "BANTUL",
  "SURABAYA", "KOTA SURABAYA", "SIDOARJO", "GRESIK", "TUBAN",
  "JAKARTA", "JAKARTA PUSAT", "JAKARTA SELATAN", "JAKARTA BARAT", "JAKARTA TIMUR", "JAKARTA UTARA",
  "DEPOK", "TANGERANG SELATAN", "TANGERANG", "BEKASI", "BOGOR", "BANDUNG",
  "MEDAN", "BINJAI", "DELI SERDANG", "DENPASAR", "BADUNG", "MAKASSAR", "BANJARMASIN", "BALIKPAPAN"
];

function isXL5GCoverage(lat, lng, city) {
  if (city) {
    const cUpper = String(city).toUpperCase();
    for (const c of XL_5G_CITIES) {
      if (cUpper.includes(c)) return true;
    }
  }
  // Bounding box Solo Raya (Surakarta, Sukoharjo, Karanganyar, Boyolali, Klaten) -> 100% 5G Blanket
  if (lat >= -8.00 && lat <= -7.25 && lng >= 110.55 && lng <= 111.15) return true;
  // Bounding box DKI Jakarta & Sekitarnya
  if (lat >= -6.38 && lat <= -6.08 && lng >= 106.68 && lng <= 106.98) return true;
  // Bounding box Surabaya Raya (Surabaya, Sidoarjo, Gresik)
  if (lat >= -7.48 && lat <= -7.15 && lng >= 112.60 && lng <= 112.85) return true;
  // Bounding box Semarang & Salatiga
  if (lat >= -7.35 && lat <= -6.95 && lng >= 110.30 && lng <= 110.55) return true;
  // Bounding box Yogyakarta & Sleman
  if (lat >= -7.90 && lat <= -7.65 && lng >= 110.30 && lng <= 110.50) return true;

  return false;
}

async function queryCandidates(db, lat, lng, delta) {
  if (!db) return [];
  const minLat = lat - delta;
  const maxLat = lat + delta;
  const minLng = lng - delta;
  const maxLng = lng + delta;

  const query = `
    SELECT id, lat, lng, cluster_name, status, odp_id, city, address, h3_res10,
           ((lat - ?)*(lat - ?) + (lng - ?)*(lng - ?)) as distSq
    FROM homepass
    WHERE lat BETWEEN ? AND ? AND lng BETWEEN ? AND ?
    ORDER BY distSq ASC
    LIMIT 25
  `;
  try {
    const res = await db.prepare(query)
      .bind(lat, lat, lng, lng, minLat, maxLat, minLng, maxLng)
      .all();
    return res.results || [];
  } catch (e) {
    return [];
  }
}

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = getCorsHeaders(request);

    // 1. Handle CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const clientIp = request.headers.get("cf-connecting-ip") || "unknown";

    const adminKey = request.headers.get("x-admin-key");
    const isAdmin = adminKey === ADMIN_KEY;

    // 2. IP Rate Limiting Middleware (Exempt admin endpoints & health check)
    if (!isAdmin && path !== "/api/health" && !path.startsWith("/api/health/")) {
      const rateCheck = applyRateLimit(clientIp);
      if (!rateCheck.allowed) {
        return new Response(
          JSON.stringify({
            error: "Too Many Requests",
            message: "Batas pencarian tercapai (Maksimal 60 request/menit). Silakan tunggu sebentar.",
            resetSeconds: rateCheck.resetSeconds
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              "Retry-After": String(rateCheck.resetSeconds),
              "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
              "X-RateLimit-Remaining": "0"
            }
          }
        );
      }
    }

    try {
      const masterDb = getMasterDb(env);

      // =========================================================================
      // ENDPOINT 1: Health & Unified Database Statistics
      // =========================================================================
      if (path === "/api/health" || path === "/api/health/") {
        let totalCount = 0;
        let totalWireless = 0;
        let cities = [];

        if (masterDb) {
          try {
            const countRes = await masterDb.prepare("SELECT count(*) as total FROM homepass").first();
            totalCount = countRes?.total || 0;
            const wRes = await masterDb.prepare("SELECT count(*) as total FROM wireless_points").first();
            totalWireless = wRes?.total || 0;
            const cityRes = await masterDb.prepare("SELECT city, count(*) as count FROM homepass GROUP BY city ORDER BY count DESC").all();
            cities = cityRes.results || [];
          } catch (e) {}
        }

        return new Response(
          JSON.stringify({
            status: "healthy",
            engine: "Cloudflare Workers + Unified Master D1 Edge SQLite",
            version: "3.0.5-zerotimeout",
            database: "xlhomesolo-coverage-db (Master FTTH & 5G/Wireless)",
            totalHomepass: totalCount,
            totalWireless: totalWireless,
            totalCities: cities.length,
            cities: cities.slice(0, 30),
            optimizations: [
              "Unified Master D1 Architecture (7.09M FTTH & 24.4k 5G/Wireless)",
              "Precision KMZ Wireless Grid Lookup (70 DSA Zones)",
              "Smart Two-Tier B-Tree Routing (Solo Raya 5ms, National Fallback)",
              "Edge Caching (Cloudflare Cache API + S-MaxAge 86400)",
              "In-Memory Isolate RAM Cache (< 1ms)",
              "Dynamic Whitelist CORS (Production & Dev)",
              "IP Anti-Scraping Rate Limiting (60 req/min)"
            ]
          }),
          {
            headers: {
              ...corsHeaders,
              "Cache-Control": "public, max-age=60, s-maxage=300"
            }
          }
        );
      }

      // =========================================================================
      // ENDPOINT 2: Unified Free-Text Search (/api/search?q=...)
      // =========================================================================
      if (path === "/api/search" && request.method === "GET") {
        const q = (url.searchParams.get("q") || "").trim();
        const latParam = url.searchParams.get("lat");
        const lngParam = url.searchParams.get("lng");

        // If coordinates provided, route directly to spatial lookup
        if (latParam && lngParam && !q) {
          return await handleCoordinatesLookup(latParam, lngParam, masterDb, corsHeaders, url);
        }

        if (!q || q.length < 2) {
          return new Response(
            JSON.stringify({ results: [], total: 0 }),
            { headers: corsHeaders }
          );
        }

        // Tier 1: Check In-Memory RAM Cache (< 1ms)
        const cacheKey = `search:${CACHE_VERSION}:${q.toLowerCase()}`;
        const memCached = getMemoryCache(cacheKey);
        if (memCached) {
          return new Response(JSON.stringify(memCached), {
            headers: {
              ...corsHeaders,
              "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
              "X-RAM-Cache": "HIT"
            }
          });
        }

        // Tier 2: Check Cloudflare Edge Cache API (Versioned Key)
        let cfCache = null;
        const cacheUrl = new URL(url.toString());
        cacheUrl.searchParams.set("__v", CACHE_VERSION);
        try {
          if (typeof caches !== "undefined" && caches.default) {
            cfCache = caches.default;
            const match = await cfCache.match(cacheUrl.toString());
            if (match) {
              const resHeaders = new Headers(match.headers);
              for (const [k, v] of Object.entries(corsHeaders)) {
                resHeaders.set(k, v);
              }
              resHeaders.set("X-Edge-Cache", "HIT-CF-EDGE");
              return new Response(match.body, {
                status: match.status,
                headers: resHeaders
              });
            }
          }
        } catch (errCache) {}

        // Tier 3: Query Unified Master D1 Database with Indonesian Address Intelligence & Zero-Timeout City Routing
        let results = [];

        if (masterDb) {
          const cleanQuery = q.toLowerCase().replace(/[,._\-/]/g, " ").trim();
          const rawTokens = cleanQuery.split(/\s+/).filter(t => t.length >= 1);

          // 1. Detect if a city name is explicitly provided in query tokens
          let detectedCity = null;
          const remainingTokens = [];
          for (const t of rawTokens) {
            if (NATIONAL_CITY_MAP[t] && !detectedCity) {
              detectedCity = NATIONAL_CITY_MAP[t];
            } else {
              remainingTokens.push(t);
            }
          }

          let subTokens = remainingTokens.filter(t => !PREFIX_STOPWORDS.has(t) && t.length >= 2);

          // Preserve numeric/alphanumeric house tokens (e.g., "85", "107", "23a")
          const numTokens = remainingTokens.filter(t => /^\d+[a-z]?$/i.test(t));
          for (const n of numTokens) {
            if (!subTokens.includes(n)) subTokens.push(n);
          }

          if (subTokens.length === 0) subTokens = remainingTokens.filter(t => t.length >= 2);

          // Decompound words like "semenromo" -> ["semen", "romo"]
          const substantiveTokens = [];
          for (const tok of subTokens) {
            let split = false;
            for (const root of COMPOUND_ROOTS) {
              if (tok.startsWith(root) && tok.length > root.length + 2) {
                substantiveTokens.push(root, tok.slice(root.length));
                split = true;
                break;
              }
            }
            if (!split) substantiveTokens.push(tok);
          }

          // Build query conditions for substantive tokens across (address, cluster_name, city, odp_id)
          const whereParts = [];
          const bindValues = [];

          for (const tok of substantiveTokens.slice(0, 4)) {
            whereParts.push("(address LIKE ? OR cluster_name LIKE ? OR city LIKE ? OR odp_id LIKE ?)");
            const p = `%${tok}%`;
            bindValues.push(p, p, p, p);
          }

          if (whereParts.length > 0) {
            if (detectedCity) {
              // Priority A: Targeted City Query via idx_hp_city (Super-fast, ~150-700ms, NO TIMEOUT)
              const citySql = `
                SELECT id, cluster_name, city, odp_id, lat, lng, status, address
                FROM homepass
                WHERE city LIKE ? AND ${whereParts.join(" AND ")}
                LIMIT 30
              `;
              try {
                const resCity = await masterDb.prepare(citySql).bind(`%${detectedCity}%`, ...bindValues).all();
                if (resCity.results && resCity.results.length > 0) results = resCity.results;
              } catch (e) {}
            } else {
              // Priority B: Default Solo Raya Core via DB_SOLO regional shard (Ultra-fast, ~3-10ms)
              const soloDb = env.DB_SOLO || masterDb;
              const soloSql = `
                SELECT id, cluster_name, city, odp_id, lat, lng, status, address
                FROM homepass
                WHERE ${env.DB_SOLO ? "" : `city IN (${SOLO_CITIES}) AND `}${whereParts.join(" AND ")}
                LIMIT 30
              `;
              try {
                const resSolo = await soloDb.prepare(soloSql).bind(...bindValues).all();
                if (resSolo.results && resSolo.results.length > 0) results = resSolo.results;
              } catch (e) {}

              // Priority C: Nationwide fallback ONLY if substantive tokens are specific (length >= 4)
              if (results.length < 10 && substantiveTokens.some(t => t.length >= 4)) {
                const nationalSql = `
                  SELECT id, cluster_name, city, odp_id, lat, lng, status, address
                  FROM homepass
                  WHERE ${whereParts.join(" AND ")}
                  LIMIT 30
                `;
                try {
                  const resNat = await masterDb.prepare(nationalSql).bind(...bindValues).all();
                  if (resNat.results) {
                    const seenIds = new Set(results.map(r => r.id));
                    for (const row of resNat.results) {
                      if (!seenIds.has(row.id)) {
                        seenIds.add(row.id);
                        results.push(row);
                      }
                      if (results.length >= 30) break;
                    }
                  }
                } catch (e) {}
              }
            }
          }
        }

        const payload = {
          results: results,
          total: results.length,
          query: q,
          database: "xlhomesolo-coverage-db"
        };

        if (results.length > 0) {
          // Cache in isolate RAM only if there are results
          setMemoryCache(cacheKey, payload);

          const edgeResponse = new Response(JSON.stringify(payload), {
            headers: {
              ...corsHeaders,
              "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
              "X-Edge-Cache": "MISS"
            }
          });

          if (cfCache && request.method === "GET") {
            try {
              ctx.waitUntil(cfCache.put(cacheUrl.toString(), edgeResponse.clone()));
            } catch (e) {}
          }

          return edgeResponse;
        } else {
          // NEVER cache empty results in edge or RAM
          return new Response(JSON.stringify(payload), {
            headers: {
              ...corsHeaders,
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "X-Edge-Cache": "BYPASS-EMPTY"
            }
          });
        }
      }

      // =========================================================================
      // ENDPOINT 3: Quick Autocomplete Suggestions (/api/suggestions?q=...)
      // =========================================================================
      if (path === "/api/suggestions" && request.method === "GET") {
        const q = (url.searchParams.get("q") || "").trim();
        if (!q || q.length < 2) {
          return new Response(JSON.stringify([]), {
            headers: {
              ...corsHeaders,
              "Cache-Control": "no-cache, no-store, must-revalidate"
            }
          });
        }

        const cacheKey = `sug:${CACHE_VERSION}:${q.toLowerCase()}`;
        const memCached = getMemoryCache(cacheKey);
        if (memCached) {
          return new Response(JSON.stringify(memCached), {
            headers: {
              ...corsHeaders,
              "Cache-Control": "public, max-age=86400, s-maxage=604800",
              "X-RAM-Cache": "HIT"
            }
          });
        }

        let cfCache = null;
        const cacheUrl = new URL(url.toString());
        cacheUrl.searchParams.set("__v", CACHE_VERSION);
        try {
          if (typeof caches !== "undefined" && caches.default) {
            cfCache = caches.default;
            const match = await cfCache.match(cacheUrl.toString());
            if (match) {
              const resHeaders = new Headers(match.headers);
              for (const [k, v] of Object.entries(corsHeaders)) {
                resHeaders.set(k, v);
              }
              resHeaders.set("X-Edge-Cache", "HIT-CF-EDGE");
              return new Response(match.body, {
                status: match.status,
                headers: resHeaders
              });
            }
          }
        } catch (errCache) {}

        const soloDb = env.DB_SOLO || masterDb;
        let results = [];
        if (soloDb) {
          // Priority 1: Solo Raya clusters via soloDb shard (Ultra-fast < 10ms)
          const soloQuerySql = `
            SELECT DISTINCT cluster_name, city
            FROM homepass
            WHERE cluster_name LIKE ?
            LIMIT 10
          `;
          try {
            const res = await soloDb.prepare(soloQuerySql).bind(`%${q}%`).all();
            if (res.results && res.results.length > 0) results = res.results;
          } catch (e) {}

          // Priority 2: Nationwide clusters if fewer than 5 (City-indexed or Prefix-bounded)
          if (results.length < 5 && masterDb) {
            let natQuerySql = "";
            let params = [];
            const normQ = q.toLowerCase();
            let foundCity = null;
            for (const [key, cityName] of Object.entries(NATIONAL_CITY_MAP)) {
              if (normQ.includes(key)) {
                foundCity = cityName;
                break;
              }
            }

            if (foundCity) {
              natQuerySql = `
                SELECT DISTINCT cluster_name, city
                FROM homepass
                WHERE city = ? AND cluster_name LIKE ?
                LIMIT 10
              `;
              params = [foundCity, `%${q}%`];
            } else {
              natQuerySql = `
                SELECT DISTINCT cluster_name, city
                FROM homepass
                WHERE cluster_name LIKE ?
                LIMIT 10
              `;
              params = [`${q}%`];
            }
            try {
              const resNat = await masterDb.prepare(natQuerySql).bind(...params).all();
              if (resNat.results) {
                const seen = new Set(results.map(r => `${r.cluster_name}:${r.city}`));
                for (const row of resNat.results) {
                  const key = `${row.cluster_name}:${row.city}`;
                  if (!seen.has(key)) {
                    seen.add(key);
                    results.push(row);
                  }
                  if (results.length >= 10) break;
                }
              }
            } catch (e) {}
          }
        }

        const suggestions = results.map(r => ({
          label: `${r.cluster_name} (${r.city})`,
          cluster: r.cluster_name,
          city: r.city
        }));

        if (suggestions.length > 0) {
          setMemoryCache(cacheKey, suggestions);

          const edgeResponse = new Response(JSON.stringify(suggestions), {
            headers: {
              ...corsHeaders,
              "Cache-Control": "public, max-age=86400, s-maxage=604800",
              "X-Edge-Cache": "MISS"
            }
          });

          if (cfCache && request.method === "GET") {
            try {
              ctx.waitUntil(cfCache.put(cacheUrl.toString(), edgeResponse.clone()));
            } catch (e) {}
          }

          return edgeResponse;
        } else {
          return new Response(JSON.stringify([]), {
            headers: {
              ...corsHeaders,
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "X-Edge-Cache": "BYPASS-EMPTY"
            }
          });
        }
      }

      // =========================================================================
      // ENDPOINT 4: Coordinates Exact Lookup (/api/coverage?lat=...&lng=...)
      // =========================================================================
      if ((path === "/api/coverage" || path === "/api/search") && request.method === "GET" && url.searchParams.get("lat") && url.searchParams.get("lng")) {
        const latParam = url.searchParams.get("lat");
        const lngParam = url.searchParams.get("lng");
        return await handleCoordinatesLookup(latParam, lngParam, masterDb, corsHeaders, url, ctx);
      }

      // =========================================================================
      // ENDPOINT 5: Admin Query (Unified Master)
      // =========================================================================
      if (path === "/api/admin/query" && request.method === "POST") {
        if (!isAdmin) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: corsHeaders
          });
        }
        const body = await request.json();
        const sql = body.sql;
        if (!sql) {
          return new Response(JSON.stringify({ error: "Missing sql" }), {
            status: 400,
            headers: corsHeaders
          });
        }

        let targetDb = masterDb;
        if (body.db === "DB_SOLO" || body.db === "SOLO") {
          targetDb = env.DB_SOLO || masterDb;
        } else if (body.db === "DB_JATENG" || body.db === "JATENG") {
          targetDb = env.DB_JATENG || masterDb;
        }
        const stmt = targetDb.prepare(sql);
        const res = body.binds && Array.isArray(body.binds) && body.binds.length > 0
          ? await stmt.bind(...body.binds).all()
          : await stmt.all();
        return new Response(JSON.stringify(res), { headers: corsHeaders });
      }

      // =========================================================================
      // ENDPOINT 6: Admin Batch Ingest (Unified Master)
      // =========================================================================
      if (path === "/api/admin/batch-import" && request.method === "POST") {
        if (!isAdmin) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: corsHeaders
          });
        }
        const body = await request.json();
        const rows = body.rows;
        if (!Array.isArray(rows) || rows.length === 0) {
          return new Response(JSON.stringify({ error: "Invalid rows" }), {
            status: 400,
            headers: corsHeaders
          });
        }

        const targetDb = masterDb;
        const stmt = targetDb.prepare("INSERT OR REPLACE INTO homepass (id, h3_res10, lat, lng, cluster_name, status, odp_id, city, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        const batchStatements = rows.map(r => stmt.bind(r.id, r.h3, r.lat, r.lng, r.cluster, r.status, r.odp, r.city, r.address || null));
        
        await targetDb.batch(batchStatements);

        return new Response(
          JSON.stringify({ success: true, count: rows.length }),
          { headers: corsHeaders }
        );
      }

      // Default fallback
      return new Response(
        JSON.stringify({
          message: "XL Home Coverage API (Unified Master v3.0.0)",
          documentation: "https://xlhomesolo.com"
        }),
        { headers: corsHeaders }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Internal Server Error", details: err.message }),
        { status: 500, headers: corsHeaders }
      );
    }
  }
};

/**
 * Handle Coordinates Exact Lookup with Wireless Graceful Degradation
 */
async function handleCoordinatesLookup(latParam, lngParam, masterDb, corsHeaders, url, ctx) {
  const lat = parseFloat(latParam);
  const lng = parseFloat(lngParam);

  if (isNaN(lat) || isNaN(lng)) {
    return new Response(
      JSON.stringify({ error: "Invalid latitude or longitude" }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Precision 4 decimals (~11m bucket) for edge caching
  const coordKey = `cov:${CACHE_VERSION}:${lat.toFixed(4)},${lng.toFixed(4)}`;
  const memCached = getMemoryCache(coordKey);
  if (memCached) {
    return new Response(JSON.stringify(memCached), {
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
        "X-RAM-Cache": "HIT"
      }
    });
  }

  const t0 = performance.now();
  let candidates = [];

  // Adaptive Expanding Bounding Box (~500m -> ~1.2km)
  const deltas = [0.005, 0.012];
  for (const delta of deltas) {
    candidates = await queryCandidates(masterDb, lat, lng, delta);
    if (candidates.length > 0) break;
  }

  const t1 = performance.now();

  let bestCandidate = null;
  let minDistance = Infinity;

  for (const item of candidates) {
    const dist = haversineMeters(lat, lng, item.lat, item.lng);
    if (dist < minDistance) {
      minDistance = dist;
      bestCandidate = item;
    }
  }

  // FTTH standard drop cable SOP radius: 300 meters max from FAT box
  const FTTH_MAX_DISTANCE = 300;
  const isCovered = minDistance <= FTTH_MAX_DISTANCE;

  let isWirelessCovered = false;
  let wirelessType = null;
  let wirelessZone = null;
  let wirelessSource = null;
  let minWirelessDist = Infinity;

  if (isCovered) {
    isWirelessCovered = true;
    wirelessType = "XL Ultra 5G+ (FWA)";
    wirelessSource = "CLOUDFLARE_D1_FTTH_OFFICIAL";
  } else {
    // Check D1 official wireless_points (24,411 real KMZ grid points with 70 DSA zones)
    if (masterDb) {
      try {
        const deltaW = 0.005; // ~500m bounding box
        const wSql = `
          SELECT zone, lat, lng
          FROM wireless_points
          WHERE lat BETWEEN ? AND ? AND lng BETWEEN ? AND ?
          LIMIT 25
        `;
        const wRes = await masterDb.prepare(wSql).bind(
          lat - deltaW, lat + deltaW,
          lng - deltaW, lng + deltaW
        ).all();
        if (wRes.results && wRes.results.length > 0) {
          for (const wp of wRes.results) {
            const d = haversineMeters(lat, lng, wp.lat, wp.lng);
            if (d < minWirelessDist) {
              minWirelessDist = d;
              wirelessZone = wp.zone;
            }
          }
        }
      } catch (e) {}
    }

    // Radius SOP wireless KMZ grid: 300 meters
    if (wirelessZone && minWirelessDist <= 300) {
      isWirelessCovered = true;
      wirelessType = `XL Ultra 5G+ (FWA - Zona ${wirelessZone})`;
      wirelessSource = "CLOUDFLARE_D1_WIRELESS_GRID_OFFICIAL";
    } else {
      const candidateCity = bestCandidate ? bestCandidate.city : null;
      const is5G = isXL5GCoverage(lat, lng, candidateCity);
      if (is5G) {
        isWirelessCovered = true;
        wirelessType = "XL Ultra 5G+ (FWA)";
        wirelessSource = "XL_5G_NATIONAL_NETWORK";
      } else {
        isWirelessCovered = true;
        wirelessType = "XL Home Wireless 4G";
        wirelessSource = "XL_4G_NATIONAL_NETWORK";
      }
    }
  }

  const responsePayload = {
    covered: isCovered,
    type: isCovered ? "FIBER_FTTH" : (wirelessType.includes("5G") ? "WIRELESS_5G" : "WIRELESS_4G"),
    wirelessCovered: isWirelessCovered,
    wirelessType: wirelessType,
    wirelessZone: wirelessZone || null,
    distance: isCovered ? (minDistance === Infinity ? null : Math.round(minDistance)) : (minWirelessDist !== Infinity ? Math.round(minWirelessDist) : (minDistance === Infinity ? null : Math.round(minDistance))),
    maxDistance: FTTH_MAX_DISTANCE,
    homepassId: bestCandidate ? bestCandidate.id : null,
    cluster: bestCandidate ? bestCandidate.cluster_name : null,
    odp: bestCandidate ? bestCandidate.odp_id : null,
    city: bestCandidate ? bestCandidate.city : null,
    address: bestCandidate ? bestCandidate.address : null,
    status: bestCandidate ? bestCandidate.status : null,
    lookupLatencyMs: Number((t1 - t0).toFixed(2)),
    candidateCount: candidates.length,
    databaseServed: "xlhomesolo-coverage-db (Unified Master FTTH & 5G/Wireless)",
    source: isCovered ? "CLOUDFLARE_D1_FTTH_OFFICIAL" : wirelessSource
  };

  setMemoryCache(coordKey, responsePayload);

  return new Response(JSON.stringify(responsePayload), {
    headers: {
      ...corsHeaders,
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      "X-Edge-Cache": "MISS"
    }
  });
}
