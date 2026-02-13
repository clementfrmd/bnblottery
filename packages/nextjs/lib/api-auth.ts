import { NextRequest } from "next/server";

/**
 * Validate API key if AGENT_API_KEY is configured.
 * Returns a Response if invalid, or null if OK.
 */
export function validateApiKey(request: NextRequest): Response | null {
  const requiredKey = process.env.AGENT_API_KEY;
  if (!requiredKey) return null; // No key configured, skip validation

  const provided =
    request.headers.get("x-api-key") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (provided === requiredKey) return null;

  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
