/**
 * Cloudflare Worker: coverage-api (v2.4.0 - Enterprise Edge-Optimized)
 * Ultra-Fast FTTH & Wireless Coverage Lookup for XL Home Solo Raya & Central Java - DIY
 * 
 * Features:
 * 1. 3-Tier Multi-Level Caching (Isolate RAM Cache -> Cloudflare Edge Cache API -> D1 SQLite)
 * 2. Strict Rate Limiting (60 req/min per IP) to prevent ODP/Homepass database scraping
 * 3. Dynamic Whitelist CORS (Production domains, staging, and local dev)
 * 4. Federated Multi-Database Routing (env.DB: Solo Raya, env.DB_JATENG: Central Java & DIY)
 * 5. Instant Cache-Control (public, max-age=86400, s-maxage=604800) for sub-5ms search
 */

const ADMIN_KEY = "xssr-tahap2-secure-2026";
const RATE_LIMIT_MAX_REQUESTS = 60; // Max 60 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

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

  // Periodically clean stale entries if map grows large
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

/**
 * In-Memory RAM Cache helpers
 */
function getMemoryCache(key) {
  const item = MEMORY_CACHE.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    MEMORY_CACHE.delete(key);
    return null;
  }
  return item.data;
}

function setMemoryCache(key, data, ttlMs = MEMORY_CACHE_TTL_MS) {
  if (MEMORY_CACHE.size >= MEMORY_CACHE_MAX_ITEMS) {
    // Evict oldest item
    const firstKey = MEMORY_CACHE.keys().next().value;
    if (firstKey) MEMORY_CACHE.delete(firstKey);
  }
  MEMORY_CACHE.set(key, {
    data,
    expiry: Date.now() + ttlMs
  });
}

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function selectTargetDb(env, dbName) {
  if (dbName && (dbName.toLowerCase() === "jateng" || dbName === "DB_JATENG")) {
    if (env.DB_JATENG) return env.DB_JATENG;
  }
  return env.DB;
}

// Bounding box for Solo Raya (Surakarta, Sukoharjo, Karanganyar, Boyolali, Klaten, Sragen, Wonogiri)
function isSoloRaya(lat, lng) {
  return lat >= -8.20 && lat <= -7.25 && lng >= 110.55 && lng <= 111.35;
}

/**
 * Daftar Kota / Area Resmi Blanket Coverage 5G XL Axiata (Per 2026)
 */
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
    LIMIT 15
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

    // 1. Handle CORS OPTIONS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const clientIp = request.headers.get("cf-connecting-ip") ||
                     request.headers.get("x-real-ip") ||
                     "unknown";

    // Check for admin bypass
    const adminKey = request.headers.get("x-admin-key");
    const isAdmin = adminKey === ADMIN_KEY;

    // 2. IP Rate Limiting Middleware (Exempt admin endpoints & health check)
    if (!isAdmin && path !== "/" && path !== "/api/health") {
      const rateLimitResult = applyRateLimit(clientIp);
      if (!rateLimitResult.allowed) {
        return new Response(JSON.stringify({
          error: "Too Many Requests",
          message: "Akses dibatasi sementara untuk mencegah scraping database. Silakan coba lagi nanti.",
          limit: RATE_LIMIT_MAX_REQUESTS,
          retryAfter: rateLimitResult.resetSeconds
        }), {
          status: 429,
          headers: {
            ...corsHeaders,
            "Retry-After": String(rateLimitResult.resetSeconds),
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimitResult.resetSeconds)
          }
        });
      }
    }

    try {
      // =========================================================================
      // ENDPOINT 1: Health check & Multi-Database Federation Status
      // =========================================================================
      if (path === "/" || path === "/api/health") {
        let soloTotal = 0;
        let soloCities = [];
        try {
          const countRes = await env.DB.prepare("SELECT count(*) as total FROM homepass").first();
          const cityRes = await env.DB.prepare("SELECT city, count(*) as count FROM homepass GROUP BY city").all();
          soloTotal = countRes ? countRes.total : 0;
          soloCities = cityRes ? cityRes.results : [];
        } catch (e) {}

        let jatengTotal = 0;
        let jatengCities = [];
        if (env.DB_JATENG) {
          try {
            const countJateng = await env.DB_JATENG.prepare("SELECT count(*) as total FROM homepass").first();
            const cityJateng = await env.DB_JATENG.prepare("SELECT city, count(*) as count FROM homepass GROUP BY city").all();
            jatengTotal = countJateng ? countJateng.total : 0;
            jatengCities = cityJateng ? cityJateng.results : [];
          } catch (e) {}
        }

        return new Response(JSON.stringify({
          status: "healthy",
          engine: "Cloudflare Workers + Federated D1 Edge SQLite",
          version: "2.4.0-optimized",
          totalHomepass: soloTotal + jatengTotal,
          optimizations: [
            "Edge Caching (Cache-Control + Cloudflare Cache API)",
            "In-Memory Isolate RAM Cache (< 1ms)",
            "Dynamic Whitelist CORS (Production & Dev)",
            "IP Anti-Scraping Rate Limiting (60 req/min)"
          ],
          databases: {
            soloRaya: {
              bound: true,
              totalHomepass: soloTotal,
              cities: soloCities
            },
            jatengDiy: {
              bound: !!env.DB_JATENG,
              totalHomepass: jatengTotal,
              cities: jatengCities
            }
          }
        }, null, 2), {
          headers: {
            ...corsHeaders,
            "Cache-Control": "public, max-age=300, s-maxage=600"
          }
        });
      }

      // =========================================================================
      // ENDPOINT 2: Autocomplete Cluster / Address Search with Edge Caching
      // GET /api/search?q=kartasura
      // =========================================================================
      if (path === "/api/search") {
        const rawQ = url.searchParams.get("q") || "";
        const q = rawQ.trim();

        // Return empty results immediately if query too short
        if (q.length < 2) {
          return new Response(JSON.stringify({ query: q, results: [] }), {
            headers: {
              ...corsHeaders,
              "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400"
            }
          });
        }

        const normalizedKey = `search:${q.toLowerCase()}`;

        // Tier 1: In-Memory RAM Cache (< 1ms)
        const memCached = getMemoryCache(normalizedKey);
        if (memCached) {
          return new Response(JSON.stringify(memCached), {
            headers: {
              ...corsHeaders,
              "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
              "X-Edge-Cache": "HIT-MEMORY"
            }
          });
        }

        // Tier 2: Cloudflare Cache API (Edge Datacenter RAM < 5ms)
        const cacheUrl = new URL(request.url);
        cacheUrl.searchParams.set("q", q.toLowerCase());
        const cacheKey = new Request(cacheUrl.toString(), {
          method: "GET",
          headers: request.headers
        });

        let cfCache = null;
        try {
          if (typeof caches !== "undefined" && caches.default) {
            cfCache = caches.default;
            const match = await cfCache.match(cacheKey);
            if (match) {
              const resHeaders = new Headers(match.headers);
              // Ensure CORS headers match incoming origin
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
        } catch (errCache) {
          // Ignore cache errors and fallback to D1
        }

        // Tier 3: Query Federated D1 Databases
        const searchPattern = `%${q}%`;
        const querySql = `
          SELECT id, cluster_name, city, odp_id, lat, lng, status, address
          FROM homepass
          WHERE cluster_name LIKE ? OR address LIKE ? OR id LIKE ? OR odp_id LIKE ?
          LIMIT 25
        `;

        let results = [];
        try {
          const res1 = await env.DB.prepare(querySql).bind(searchPattern, searchPattern, searchPattern, searchPattern).all();
          if (res1.results) results = results.concat(res1.results);
        } catch (e) {}

        if (env.DB_JATENG && results.length < 25) {
          try {
            const res2 = await env.DB_JATENG.prepare(querySql).bind(searchPattern, searchPattern, searchPattern, searchPattern).all();
            if (res2.results) results = results.concat(res2.results);
          } catch (e) {}
        }

        const responsePayload = {
          query: q,
          results: results.slice(0, 25)
        };

        // Save to Tier 1 In-Memory RAM Cache
        setMemoryCache(normalizedKey, responsePayload);

        const edgeResponse = new Response(JSON.stringify(responsePayload), {
          headers: {
            ...corsHeaders,
            "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
            "X-Edge-Cache": "MISS"
          }
        });

        // Save to Tier 2 Cloudflare Cache API in background
        if (cfCache && ctx && typeof ctx.waitUntil === "function") {
          try {
            ctx.waitUntil(cfCache.put(cacheKey, edgeResponse.clone()));
          } catch (ePut) {}
        }

        return edgeResponse;
      }

      // =========================================================================
      // ENDPOINT 3: Intelligent Coverage / Radius ODP Checker
      // GET /api/coverage?lat=-7.557&lng=110.743
      // =========================================================================
      if (path === "/api/coverage") {
        const clusterQuery = url.searchParams.get("cluster");

        // Cluster search support inside /api/coverage
        if (clusterQuery) {
          const q = clusterQuery.trim();
          const querySql = "SELECT id, cluster_name, city, odp_id, lat, lng, status FROM homepass WHERE cluster_name LIKE ? LIMIT 10";
          let results = [];
          try {
            const res1 = await env.DB.prepare(querySql).bind(`%${q}%`).all();
            if (res1.results) results = results.concat(res1.results);
          } catch (e) {}

          if (env.DB_JATENG && results.length < 10) {
            try {
              const res2 = await env.DB_JATENG.prepare(querySql).bind(`%${q}%`).all();
              if (res2.results) results = results.concat(res2.results);
            } catch (e) {}
          }

          return new Response(JSON.stringify({
            query: q,
            results: results.slice(0, 15)
          }), {
            headers: {
              ...corsHeaders,
              "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400"
            }
          });
        }

        const latStr = url.searchParams.get("lat");
        const lngStr = url.searchParams.get("lng");

        if (!latStr || !lngStr) {
          return new Response(JSON.stringify({ error: "Missing lat/lng parameters" }), {
            status: 400,
            headers: corsHeaders
          });
        }

        const rawLat = parseFloat(latStr);
        const rawLng = parseFloat(lngStr);

        if (isNaN(rawLat) || isNaN(rawLng)) {
          return new Response(JSON.stringify({ error: "Invalid lat/lng values" }), {
            status: 400,
            headers: corsHeaders
          });
        }

        // Precision rounding to 5 decimal places (~1.1 meter accuracy) for caching
        const lat = Number(rawLat.toFixed(5));
        const lng = Number(rawLng.toFixed(5));
        const coordKey = `cov:${lat},${lng}`;

        // Tier 1: In-Memory Cache
        const memCachedCov = getMemoryCache(coordKey);
        if (memCachedCov) {
          return new Response(JSON.stringify(memCachedCov), {
            headers: {
              ...corsHeaders,
              "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
              "X-Edge-Cache": "HIT-MEMORY"
            }
          });
        }

        // Tier 2: Cloudflare Edge Cache API
        const cacheUrl = new URL(request.url);
        cacheUrl.searchParams.set("lat", String(lat));
        cacheUrl.searchParams.set("lng", String(lng));
        const cacheKey = new Request(cacheUrl.toString(), {
          method: "GET",
          headers: request.headers
        });

        let cfCache = null;
        try {
          if (typeof caches !== "undefined" && caches.default) {
            cfCache = caches.default;
            const match = await cfCache.match(cacheKey);
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
        } catch (e) {}

        const t0 = performance.now();

        // Federated Intelligent Routing
        // Primary DB is determined by geography, with automatic cross-database fallback
        const primaryIsSolo = isSoloRaya(lat, lng);
        const primaryDb = primaryIsSolo ? env.DB : (env.DB_JATENG || env.DB);
        const secondaryDb = primaryIsSolo ? env.DB_JATENG : env.DB;

        // Stage 1: Spatial query on Primary DB (delta 0.0032 = ~350m bounding box to cover 300m SOP radius)
        let candidates = await queryCandidates(primaryDb, lat, lng, 0.0032);
        let activeDbName = primaryIsSolo ? "coverage-db (Solo Raya)" : "coverage-jateng-db (Jateng-DIY)";

        // Stage 2: Cross-boundary check if no candidates in Primary DB and Secondary DB is bound
        if (candidates.length === 0 && secondaryDb) {
          const secCandidates = await queryCandidates(secondaryDb, lat, lng, 0.0032);
          if (secCandidates.length > 0) {
            candidates = secCandidates;
            activeDbName = primaryIsSolo ? "coverage-jateng-db (Jateng-DIY)" : "coverage-db (Solo Raya)";
          }
        }

        // Stage 3: Wider 750m query fallback for nearest cluster identification if outside SOP
        if (candidates.length === 0) {
          candidates = await queryCandidates(primaryDb, lat, lng, 0.007);
          if (candidates.length === 0 && secondaryDb) {
            candidates = await queryCandidates(secondaryDb, lat, lng, 0.007);
            if (candidates.length > 0) {
              activeDbName = primaryIsSolo ? "coverage-jateng-db (Jateng-DIY)" : "coverage-db (Solo Raya)";
            }
          }
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
        const candidateCity = bestCandidate ? bestCandidate.city : null;
        const is5G = isXL5GCoverage(lat, lng, candidateCity);

        const responsePayload = {
          covered: isCovered,
          type: isCovered ? "FIBER_FTTH" : (is5G ? "WIRELESS_5G" : "WIRELESS_4G"),
          wirelessCovered: true,
          wirelessType: is5G ? "XL Ultra 5G+ (FWA)" : "XL Home Wireless 4G",
          distance: minDistance === Infinity ? null : Math.round(minDistance),
          maxDistance: FTTH_MAX_DISTANCE,
          homepassId: bestCandidate ? bestCandidate.id : null,
          cluster: bestCandidate ? bestCandidate.cluster_name : null,
          odp: bestCandidate ? bestCandidate.odp_id : null,
          city: bestCandidate ? bestCandidate.city : null,
          address: bestCandidate ? bestCandidate.address : null,
          status: bestCandidate ? bestCandidate.status : null,
          lookupLatencyMs: Number((t1 - t0).toFixed(2)),
          candidateCount: candidates.length,
          databaseServed: activeDbName,
          source: isCovered ? "CLOUDFLARE_D1_FTTH_OFFICIAL" : (is5G ? "XL_5G_ULTRA_BLANKET" : "XL_4G_NATIONAL_NETWORK")
        };

        // Cache coordinates result
        setMemoryCache(coordKey, responsePayload);

        const edgeCovResponse = new Response(JSON.stringify(responsePayload), {
          headers: {
            ...corsHeaders,
            "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
            "X-Edge-Cache": "MISS"
          }
        });

        if (cfCache && ctx && typeof ctx.waitUntil === "function") {
          try {
            ctx.waitUntil(cfCache.put(cacheKey, edgeCovResponse.clone()));
          } catch (e) {}
        }

        return edgeCovResponse;
      }

      // =========================================================================
      // ENDPOINT 4: Admin Direct SQL Execution
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

        const targetDb = selectTargetDb(env, body.db || body.targetDb);
        const stmt = targetDb.prepare(sql);
        const res = await stmt.all();
        return new Response(JSON.stringify(res), { headers: corsHeaders });
      }

      // =========================================================================
      // ENDPOINT 5: Admin Batch Ingest
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

        const targetDb = selectTargetDb(env, body.db || body.targetDb);
        const stmt = targetDb.prepare("INSERT OR REPLACE INTO homepass (id, h3_res10, lat, lng, cluster_name, status, odp_id, city, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        const batchStatements = rows.map(r => stmt.bind(r.id, r.h3, r.lat, r.lng, r.cluster, r.status, r.odp, r.city, r.address || null));
        
        const t0 = performance.now();
        const results = await targetDb.batch(batchStatements);
        const t1 = performance.now();

        // Clear memory cache after batch updates
        MEMORY_CACHE.clear();

        return new Response(JSON.stringify({
          success: true,
          count: rows.length,
          timeMs: Number((t1 - t0).toFixed(2))
        }), { headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: "Endpoint Not Found" }), {
        status: 404,
        headers: corsHeaders
      });
    } catch (err) {
      return new Response(JSON.stringify({
        error: err.message,
        stack: err.stack
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
