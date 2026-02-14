import { NextRequest } from "next/server";
import { getPublicClient, CONTRACT_ADDRESS, RAFFLE_ABI } from "~~/lib/contract";
import { checkRateLimit } from "~~/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const rlError = checkRateLimit(request, 30);
    if (rlError) return rlError;

    const publicClient = getPublicClient();
    const counter = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "raffleCounter",
    });

    return Response.json({
      status: "ok",
      contract: CONTRACT_ADDRESS,
      chain: "bsc",
      chainId: 56,
      totalRaffles: Number(counter),
      auth: {
        x402: !!process.env.THIRDWEB_SECRET_KEY,
        apiKey: !!process.env.AGENT_API_KEY,
      },
      endpoints: {
        free: ["GET /api/agent/health", "GET /api/agent/raffles", "GET /api/agent/raffle/{id}"],
        paid: [
          "POST /api/agent/create-raffle ($0.10 or API key)",
          "POST /api/agent/buy-tickets ($0.01 or API key)",
          "POST /api/agent/draw-winner ($0.05 or API key)",
        ],
      },
    });
  } catch (error: any) {
    console.error("health error:", error);
    return Response.json({ status: "error", error: "Internal server error" }, { status: 500 });
  }
}
