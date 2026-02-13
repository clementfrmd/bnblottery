import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";

export const thirdwebClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY || "dummy-key-for-build",
});

export const TREASURY_ADDRESS = "0x3d5A8F83F825f4F36b145e1dAD72e3f35a3030aB";

export const celoSepolia = defineChain(11142220);

/**
 * Dual auth: x402 micropayments OR API key.
 * - If X-API-KEY header matches AGENT_API_KEY env var → authorized
 * - If X-PAYMENT header present → verify via x402/thirdweb
 * - If neither and price is "$0" or "free" → allow through
 * - Otherwise → return 402 with payment instructions
 */
export async function verifyPayment(request: Request, price: string) {
  // Free endpoints always pass
  if (price === "$0" || price === "free") {
    return { status: 200 };
  }

  // API key auth (fallback for agents that don't support x402)
  const apiKey = request.headers.get("X-API-KEY");
  if (apiKey && process.env.AGENT_API_KEY && apiKey === process.env.AGENT_API_KEY) {
    return { status: 200 };
  }

  // x402 payment verification
  const paymentHeader = request.headers.get("X-PAYMENT");
  if (paymentHeader) {
    try {
      const { settlePayment } = await import("thirdweb/x402");

      const result = await settlePayment({
        resourceUrl: request.url,
        method: request.method as any,
        paymentData: paymentHeader,
        payTo: TREASURY_ADDRESS,
        network: celoSepolia,
        price,
        client: thirdwebClient,
      } as any);

      return result;
    } catch {
      return { status: 402, responseBody: { error: "Payment verification failed" } };
    }
  }

  // No auth provided — return 402 with payment instructions
  return {
    status: 402,
    responseBody: {
      error: "Payment required",
      price,
      methods: [
        {
          type: "x402",
          description: "Sign an x402 payment and include as X-PAYMENT header",
          payTo: TREASURY_ADDRESS,
          network: "celo-sepolia",
          chainId: 11142220,
        },
        {
          type: "api-key",
          description: "Include a valid API key as X-API-KEY header",
          contact: "Request an API key from the Celottery team",
        },
      ],
    },
    responseHeaders: {
      "X-Payment-Required": price,
      "X-Payment-Methods": "x402, api-key",
    },
  };
}

export function paymentError(result: { status: number; responseBody?: unknown; responseHeaders?: Record<string, string> }) {
  return Response.json(result.responseBody ?? { error: "Payment required" }, {
    status: result.status,
    headers: result.responseHeaders as HeadersInit,
  });
}
