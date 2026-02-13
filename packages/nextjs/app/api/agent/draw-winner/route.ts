import { NextRequest } from "next/server";
import { decodeEventLog } from "viem";
import { verifyPayment, paymentError } from "~~/lib/x402";
import { getWalletClient, getPublicClient, CONTRACT_ADDRESS, RAFFLE_ABI } from "~~/lib/contract";
import { generateVerifiableRandom, postVRFProof } from "~~/lib/aleph-vrf";
import { checkRateLimit } from "~~/lib/rate-limit";
import { validateApiKey } from "~~/lib/api-auth";

const WINNER_SELECTED_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "raffleId", type: "uint256" },
      { indexed: true, internalType: "address", name: "winner", type: "address" },
      { indexed: false, internalType: "uint256", name: "winningTicket", type: "uint256" },
      { indexed: false, internalType: "bytes32", name: "vrfHash", type: "bytes32" },
    ],
    name: "WinnerSelected",
    type: "event",
  },
] as const;

export async function POST(request: NextRequest) {
  try {
    const authError = validateApiKey(request);
    if (authError) return authError;

    const rlError = checkRateLimit(request, 10);
    if (rlError) return rlError;

    // x402 payment gate: $0.05
    const payment = await verifyPayment(request, "$0.05");
    if (payment.status !== 200) return paymentError(payment);

    const body = await request.json().catch(() => null);
    if (!body) {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { raffleId } = body;

    if (raffleId === undefined) {
      return Response.json({ error: "Missing required field: raffleId" }, { status: 400 });
    }

    const publicClient = getPublicClient();
    const walletClient = getWalletClient();

    // Verify raffle state
    const raffle = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "getRaffle",
      args: [BigInt(raffleId)],
    });

    if (!raffle.isActive) {
      return Response.json({ error: "Raffle is not active" }, { status: 400 });
    }
    if (raffle.isDrawn) {
      return Response.json({ error: "Winner already drawn" }, { status: 400 });
    }
    if (Number(raffle.totalTickets) === 0) {
      return Response.json({ error: "No tickets sold" }, { status: 400 });
    }

    // Generate verifiable randomness
    const { randomNumber, vrfHash, proofRecord } = await generateVerifiableRandom(raffleId, publicClient);

    // Call drawWinner on contract
    const txHash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "drawWinner",
      args: [BigInt(raffleId), randomNumber, vrfHash],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    // Parse winner from WinnerSelected event (avoids stale read)
    let winner: string | null = null;
    let winningTicket: string | null = null;

    for (const log of receipt.logs) {
      try {
        const event = decodeEventLog({
          abi: WINNER_SELECTED_ABI,
          data: log.data,
          topics: log.topics,
        });
        if (event.eventName === "WinnerSelected") {
          const args = event.args as any;
          winner = args.winner;
          winningTicket = args.winningTicket?.toString();
          break;
        }
      } catch {
        // not our event
      }
    }

    // Fallback: delay + read if event parsing failed
    if (!winner) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const updatedRaffle = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: RAFFLE_ABI,
        functionName: "getRaffle",
        args: [BigInt(raffleId)],
      });
      winner = updatedRaffle.winner;
      winningTicket = updatedRaffle.winningTicket.toString();
    }

    // Post VRF proof to Aleph AFTER the draw succeeds
    const alephHash = await postVRFProof({ ...proofRecord, txHash });

    return Response.json({
      winner,
      winningTicket,
      vrfHash,
      txHash,
      alephProof: alephHash ? `https://explorer.aleph.cloud/message/${alephHash}` : null,
    });
  } catch (error: any) {
    console.error("draw-winner error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
