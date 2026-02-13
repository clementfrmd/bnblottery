import { NextRequest } from "next/server";

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter(t => now - t < 60_000);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}, 300_000);

function getIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Check rate limit. Returns a Response if exceeded, or null if OK.
 */
export function checkRateLimit(request: NextRequest, maxPerMinute: number): Response | null {
  const ip = getIP(request);
  const now = Date.now();

  let entry = store.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(ip, entry);
  }

  // Remove timestamps older than 1 minute
  entry.timestamps = entry.timestamps.filter(t => now - t < 60_000);

  if (entry.timestamps.length >= maxPerMinute) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  entry.timestamps.push(now);
  return null;
}
