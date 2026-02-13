import { NextRequest } from "next/server";
import { verifyPayment, paymentError } from "~~/lib/x402";
import { getWalletClient, getPublicClient, CONTRACT_ADDRESS, RAFFLE_ABI } from "~~/lib/contract";
import { decodeEventLog } from "viem";
import { checkRateLimit } from "~~/lib/rate-limit";
import { validateApiKey } from "~~/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const authError = validateApiKey(request);
    if (authError) return authError;

    const rlError = checkRateLimit(request, 10);
    if (rlError) return rlError;

    // x402 payment gate: $0.10
    const payment = await verifyPayment(request, "$0.10");
    if (payment.status !== 200) return paymentError(payment);

    const body = await request.json().catch(() => null);
    if (!body) {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { paymentToken, ticketPrice, maxTickets, durationHours } = body;

    if (!paymentToken || !ticketPrice || !maxTickets || !durationHours) {
      return Response.json(
        { error: "Missing required fields: paymentToken, ticketPrice, maxTickets, durationHours" },
        { status: 400 },
      );
    }

    const walletClient = getWalletClient();
    const publicClient = getPublicClient();
    const organizerAddress = walletClient.account.address.toLowerCase();

    // Check: organizer can't create a new raffle while they have an active one
    const activeIds = (await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "getActiveRaffles",
    })) as bigint[];
    const now = Math.floor(Date.now() / 1000);
    for (const id of activeIds) {
      const raffle = (await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: RAFFLE_ABI,
        functionName: "getRaffle",
        args: [id],
      })) as { organizer: string; endTime: bigint; isActive: boolean; isDrawn: boolean; isCancelled: boolean };
      if (
        raffle.organizer.toLowerCase() === organizerAddress &&
        raffle.isActive && !raffle.isDrawn && !raffle.isCancelled &&
        Number(raffle.endTime) > now
      ) {
        return Response.json(
          { error: `You already have an active raffle (#${id}). Wait for it to conclude before creating a new one.` },
          { status: 409 },
        );
      }
    }

    const duration = BigInt(Math.floor(Number(durationHours) * 3600));
    const ticketPriceWei = BigInt(ticketPrice);

    const txHash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "createRaffle",
      args: [paymentToken as `0x${string}`, ticketPriceWei, BigInt(maxTickets), duration],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    let raffleId: string | null = null;
    for (const log of receipt.logs) {
      try {
        const event = decodeEventLog({
          abi: RAFFLE_ABI,
          data: log.data,
          topics: log.topics,
        });
        if (event.eventName === "RaffleCreated") {
          raffleId = ((event.args as any).raffleId).toString();
          break;
        }
      } catch {}
    }
    if (!raffleId) {
      const counter = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: RAFFLE_ABI,
        functionName: "raffleCounter",
      });
      raffleId = (Number(counter) - 1).toString();
    }

    return Response.json({ raffleId, txHash });
  } catch (error: any) {
    console.error("create-raffle error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
