import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";

export const thirdwebClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY || "dummy-key-for-build",
});

export const TREASURY_ADDRESS = "0x3d5A8F83F825f4F36b145e1dAD72e3f35a3030aB";

export const bscChain = defineChain(56);

/**
 * Dual auth: x402 micropayments OR API key.
 */
export async function verifyPayment(request: Request, price: string) {
  if (price === "$0" || price === "free") {
    return { status: 200 };
  }

  const apiKey = request.headers.get("X-API-KEY");
  if (apiKey && process.env.AGENT_API_KEY && apiKey === process.env.AGENT_API_KEY) {
    return { status: 200 };
  }

  const paymentHeader = request.headers.get("X-PAYMENT");
  if (paymentHeader) {
    try {
      const { settlePayment } = await import("thirdweb/x402");

      const result = await settlePayment({
        resourceUrl: request.url,
        method: request.method as any,
        paymentData: paymentHeader,
        payTo: TREASURY_ADDRESS,
        network: bscChain,
        price,
        client: thirdwebClient,
      } as any);

      return result;
    } catch {
      return { status: 402, responseBody: { error: "Payment verification failed" } };
    }
  }

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
          network: "bsc",
          chainId: 56,
        },
        {
          type: "api-key",
          description: "Include a valid API key as X-API-KEY header",
          contact: "Request an API key from the BNB Lottery team",
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
