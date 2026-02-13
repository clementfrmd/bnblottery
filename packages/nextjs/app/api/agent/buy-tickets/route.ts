import { NextRequest } from "next/server";
import { verifyPayment, paymentError } from "~~/lib/x402";
import {
  getPublicClient,
  getWalletClient,
  getServerAccount,
  CONTRACT_ADDRESS,
  RAFFLE_ABI,
} from "~~/lib/contract";
import { encodeFunctionData, parseAbi } from "viem";
import { checkRateLimit } from "~~/lib/rate-limit";
import { validateApiKey } from "~~/lib/api-auth";

const ERC20_ABI = parseAbi([
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
]);

export async function POST(request: NextRequest) {
  try {
    const authError = validateApiKey(request);
    if (authError) return authError;

    const rlError = checkRateLimit(request, 10);
    if (rlError) return rlError;

    // x402 payment gate: $0.01
    const payment = await verifyPayment(request, "$0.01");
    if (payment.status !== 200) return paymentError(payment);

    const body = await request.json().catch(() => null);
    if (!body) {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { raffleId, ticketCount, buyerAddress } = body;

    if (raffleId === undefined || !ticketCount) {
      return Response.json(
        { error: "Missing required fields: raffleId, ticketCount" },
        { status: 400 },
      );
    }

    if (typeof ticketCount !== "number" || ticketCount < 1 || ticketCount > 100) {
      return Response.json({ error: "ticketCount must be between 1 and 100" }, { status: 400 });
    }

    const publicClient = getPublicClient();

    const raffle = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "getRaffle",
      args: [BigInt(raffleId)],
    });

    if (!raffle.isActive) {
      return Response.json({ error: "Raffle is not active" }, { status: 400 });
    }

    const ticketPriceWei = raffle.ticketPrice;
    const totalCost = ticketPriceWei * BigInt(ticketCount);

    if (buyerAddress) {
      const txData = encodeFunctionData({
        abi: RAFFLE_ABI,
        functionName: "purchaseTickets",
        args: [BigInt(raffleId), BigInt(ticketCount)],
      });

      return Response.json({
        mode: "unsigned",
        txData,
        to: CONTRACT_ADDRESS,
        value: "0",
        erc20: {
          token: raffle.paymentToken,
          amount: totalCost.toString(),
          spender: CONTRACT_ADDRESS,
        },
        note: "Buyer must first approve the ERC20 token spend, then send the purchaseTickets transaction.",
      });
    }

    const walletClient = getWalletClient();
    const account = getServerAccount();

    const allowance = await publicClient.readContract({
      address: raffle.paymentToken,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [account.address, CONTRACT_ADDRESS],
    });

    if (allowance < totalCost) {
      const approveTx = await walletClient.writeContract({
        address: raffle.paymentToken,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESS, totalCost],
      });
      await publicClient.waitForTransactionReceipt({ hash: approveTx });
    }

    const purchaseTx = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: RAFFLE_ABI,
      functionName: "purchaseTickets",
      args: [BigInt(raffleId), BigInt(ticketCount)],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: purchaseTx });

    return Response.json({
      mode: "executed",
      txHash: purchaseTx,
      buyer: account.address,
      raffleId: Number(raffleId),
      ticketCount: Number(ticketCount),
      totalCost: totalCost.toString(),
      blockNumber: receipt.blockNumber.toString(),
    });
  } catch (error: any) {
    console.error("buy-tickets error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
