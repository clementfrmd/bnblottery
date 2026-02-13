import { NextRequest } from "next/server";
import { getPublicClient, CONTRACT_ADDRESS, RAFFLE_ABI } from "~~/lib/contract";
import { checkRateLimit } from "~~/lib/rate-limit";
import { validateApiKey } from "~~/lib/api-auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = validateApiKey(request);
    if (authError) return authError;

    const rlError = checkRateLimit(request, 30);
    if (rlError) return rlError;

    const { id } = await params;
    const raffleId = parseInt(id, 10);

    if (isNaN(raffleId) || raffleId < 0) {
      return Response.json({ error: "Invalid raffle ID" }, { status: 400 });
    }

    const publicClient = getPublicClient();

    const raffle = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "getRaffle",
      args: [BigInt(raffleId)],
    });

    if (!raffle.isDrawn) {
      return Response.json({ error: "Raffle not yet drawn" }, { status: 400 });
    }

    const vrfHash = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "vrfHashes",
      args: [BigInt(raffleId)],
    });

    return Response.json({
      raffleId: Number(raffleId),
      vrfHash,
      winner: raffle.winner,
      winningTicket: Number(raffle.winningTicket),
      totalTickets: Number(raffle.totalTickets),
      totalPrize: raffle.totalPrize.toString(),
      contract: CONTRACT_ADDRESS,
      chain: "celo-sepolia",
      chainId: 11142220,
      verification: "The vrfHash is stored on-chain and can be independently verified by calling vrfHashes(raffleId) on the contract.",
    });
  } catch (error: any) {
    console.error("vrf-proof error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
