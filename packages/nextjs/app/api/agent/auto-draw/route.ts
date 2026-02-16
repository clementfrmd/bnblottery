import { NextRequest } from "next/server";
import { decodeEventLog } from "viem";
import { getWalletClient, getPublicClient, CONTRACT_ADDRESS, RAFFLE_ABI, WINNER_SELECTED_ABI } from "~~/lib/contract";
import { generateVerifiableRandom, postVRFProof } from "~~/lib/aleph-vrf";
import { checkRateLimit } from "~~/lib/rate-limit";
import { validateApiKey } from "~~/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const authError = validateApiKey(request);
    if (authError) return authError;

    const rlError = checkRateLimit(request, 10);
    if (rlError) return rlError;

    const publicClient = getPublicClient();
    const walletClient = getWalletClient();
    const now = BigInt(Math.floor(Date.now() / 1000));

    const raffleCount = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "raffleCounter",
    });

    const results: { raffleId: number; winner: string; txHash: string }[] = [];
    const errors: { raffleId: number; error: string }[] = [];

    for (let i = 0; i < Number(raffleCount); i++) {
      const raffle = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: RAFFLE_ABI,
        functionName: "getRaffle",
        args: [BigInt(i)],
      });

      if (raffle.isDrawn || raffle.isCancelled) continue;
      if (now < raffle.endTime) continue;
      if (Number(raffle.totalTickets) === 0) continue;

      try {
        const { randomNumber, vrfHash, proofRecord } = await generateVerifiableRandom(i, publicClient);

        const txHash = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: RAFFLE_ABI,
          functionName: "drawWinner",
          args: [BigInt(i), randomNumber, vrfHash],
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

        // Post VRF proof to Aleph after successful draw
        await postVRFProof({ ...proofRecord, txHash });

        // Parse winner from event
        let winner = "unknown";
        for (const log of receipt.logs) {
          try {
            const event = decodeEventLog({
              abi: WINNER_SELECTED_ABI,
              data: log.data,
              topics: log.topics,
            });
            if (event.eventName === "WinnerSelected") {
              winner = (event.args as any).winner;
              break;
            }
          } catch {}
        }

        if (winner === "unknown") {
          await new Promise(resolve => setTimeout(resolve, 3000));
          const updated = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: RAFFLE_ABI,
            functionName: "getRaffle",
            args: [BigInt(i)],
          });
          winner = updated.winner;
        }

        results.push({ raffleId: i, winner, txHash });
      } catch (err: any) {
        console.error(`auto-draw raffle ${i} error:`, err);
        errors.push({ raffleId: i, error: err.message || "Unknown error" });
      }
    }

    return Response.json({ drawn: results, errors, checked: Number(raffleCount) });
  } catch (error: any) {
    console.error("auto-draw error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
