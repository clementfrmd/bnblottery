import { NextRequest } from "next/server";
import { verifyPayment, paymentError } from "~~/lib/x402";
import { getPublicClient, CONTRACT_ADDRESS, RAFFLE_ABI, formatRaffle } from "~~/lib/contract";
import { checkRateLimit } from "~~/lib/rate-limit";
import { validateApiKey } from "~~/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const authError = validateApiKey(request);
    if (authError) return authError;

    const rlError = checkRateLimit(request, 30);
    if (rlError) return rlError;

    // x402 payment gate: free
    const payment = await verifyPayment(request, "free");
    if (payment.status !== 200) return paymentError(payment);

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    const publicClient = getPublicClient();

    const counter = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "raffleCounter",
    });

    const total = Number(counter);
    const raffles = [];

    for (let i = 0; i < total; i++) {
      const raw = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: RAFFLE_ABI,
        functionName: "getRaffle",
        args: [BigInt(i)],
      });

      const formatted = formatRaffle(raw as any, i);

      if (!statusFilter || formatted.status === statusFilter) {
        raffles.push(formatted);
      }
    }

    return Response.json({ raffles, total: raffles.length });
  } catch (error: any) {
    console.error("raffles error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
