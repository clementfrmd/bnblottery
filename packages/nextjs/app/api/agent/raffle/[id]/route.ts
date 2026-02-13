import { NextRequest } from "next/server";
import { verifyPayment, paymentError } from "~~/lib/x402";
import { getPublicClient, CONTRACT_ADDRESS, RAFFLE_ABI, formatRaffle } from "~~/lib/contract";
import { checkRateLimit } from "~~/lib/rate-limit";
import { validateApiKey } from "~~/lib/api-auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = validateApiKey(request);
    if (authError) return authError;

    const rlError = checkRateLimit(request, 30);
    if (rlError) return rlError;

    // x402 payment gate: free
    const payment = await verifyPayment(request, "free");
    if (payment.status !== 200) return paymentError(payment);

    const { id } = await params;
    const raffleId = parseInt(id, 10);

    if (isNaN(raffleId) || raffleId < 0) {
      return Response.json({ error: "Invalid raffle ID" }, { status: 400 });
    }

    const publicClient = getPublicClient();

    const counter = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "raffleCounter",
    });

    if (raffleId >= Number(counter)) {
      return Response.json({ error: "Raffle not found" }, { status: 404 });
    }

    const raw = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "getRaffle",
      args: [BigInt(raffleId)],
    });

    const formatted = formatRaffle(raw as any, raffleId);

    return Response.json({
      ...formatted,
      participantCount: Number(formatted.totalTickets),
    });
  } catch (error: any) {
    console.error("raffle/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
