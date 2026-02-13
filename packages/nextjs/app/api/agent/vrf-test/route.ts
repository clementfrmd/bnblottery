import { NextRequest } from "next/server";
import { postToAleph } from "~~/lib/aleph-vrf";
import { checkRateLimit } from "~~/lib/rate-limit";
import { validateApiKey } from "~~/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const authError = validateApiKey(request);
    if (authError) return authError;

    const rlError = checkRateLimit(request, 10);
    if (rlError) return rlError;

    const testRecord = {
      type: "celottery-vrf-test",
      raffleId: -1,
      timestamp: Date.now(),
      test: true,
    };

    const alephHash = await postToAleph(testRecord);

    return Response.json({
      status: "ok",
      alephHash,
      explorerUrl: `https://explorer.aleph.cloud/message/${alephHash}`,
      apiUrl: `https://api3.aleph.im/api/v0/messages.json?hashes=${alephHash}`,
    });
  } catch (error: any) {
    console.error("vrf-test error:", error);
    return Response.json({
      status: "error",
      error: "VRF test failed",
    }, { status: 500 });
  }
}
