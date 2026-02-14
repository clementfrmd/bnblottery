/**
 * Aleph Cloud VRF - Verifiable Randomness for BNB Lottery
 *
 * Generates randomness from multiple entropy sources and publishes
 * a verifiable proof record to Aleph Cloud for public auditability.
 */
import { encodePacked, keccak256, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const ALEPH_API = "https://api3.aleph.im";
const ALEPH_CHANNEL = "BNBLOTTERY_VRF";

interface VRFResult {
  randomNumber: bigint;
  vrfHash: `0x${string}`;
  proofRecord: Record<string, unknown>;
}

function xorBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const result = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) result[i] = a[i] ^ b[i];
  return result;
}

function hexToBytes32(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const padded = clean.padStart(64, "0").slice(0, 64);
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) bytes[i] = parseInt(padded.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * SHA-256 using Web Crypto API (works in Node, Edge, and Vercel)
 */
async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(hashBuffer));
}

/**
 * Post proof to Aleph Cloud via raw REST API.
 */
export async function postToAleph(proofRecord: Record<string, unknown>): Promise<string> {
  const deployerKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!deployerKey) throw new Error("DEPLOYER_PRIVATE_KEY not set");

  const cleanKey = deployerKey.startsWith("0x") ? deployerKey : `0x${deployerKey}`;
  const account = privateKeyToAccount(cleanKey as `0x${string}`);
  const now = Date.now() / 1000;

  const content = {
    type: "bnblottery-vrf",
    address: account.address,
    content: proofRecord,
    time: now,
  };

  const itemContent = JSON.stringify(content);
  const itemHash = await sha256(itemContent);
  // Aleph protocol: sign "chain\nsender\ntype\nitem_hash" joined by newlines
  const verificationBuffer = ["ETH", account.address, "POST", itemHash].join("\n");
  const signature = await account.signMessage({ message: verificationBuffer });

  const body = {
    message: {
      chain: "ETH",
      sender: account.address,
      type: "POST",
      channel: ALEPH_CHANNEL,
      time: now,
      item_type: "inline",
      item_content: itemContent,
      item_hash: itemHash,
      signature,
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const resp = await fetch(`${ALEPH_API}/api/v0/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const respText = await resp.text();
    console.log(`[VRF] Aleph ${resp.status}: ${respText.slice(0, 200)}`);

    if (!resp.ok) throw new Error(`Aleph API ${resp.status}: ${respText.slice(0, 200)}`);
    return itemHash;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Generate verifiable randomness for a raffle draw.
 */
export async function generateVerifiableRandom(raffleId: number, publicClient: any): Promise<VRFResult> {
  const timestamp = Date.now();

  // Source 1: CSPRNG
  const csprngBytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(csprngBytes);

  // Source 2: BSC block hash
  const block = await publicClient.getBlock();
  const blockHash = block.hash as string;
  const blockBytes = hexToBytes32(blockHash);

  // Source 3: Raffle nonce
  const nonceHash = keccak256(encodePacked(["string"], [`bnblottery-raffle-${raffleId}-${timestamp}`]));
  const nonceBytes = hexToBytes32(nonceHash);

  // XOR all sources
  const combined = xorBytes(xorBytes(csprngBytes, blockBytes), nonceBytes);
  const combinedHex = `0x${bytesToHex(combined)}` as `0x${string}`;
  const randomNumber = BigInt(combinedHex);

  const proofRecord = {
    type: "bnblottery-vrf",
    raffleId,
    timestamp,
    blockHash,
    blockNumber: Number(block.number),
    nonce: `bnblottery-raffle-${raffleId}-${timestamp}`,
    commitment: keccak256(combinedHex),
    randomNumber: combinedHex,
    chain: "bsc",
    contract: "0x0000000000000000000000000000000000000000",
  };

  const vrfHash = keccak256(toHex(JSON.stringify(proofRecord)));

  return { randomNumber, vrfHash, proofRecord };
}

/**
 * Post VRF proof to Aleph Cloud with retry logic (call AFTER the draw tx succeeds).
 */
export async function postVRFProof(proofRecord: Record<string, unknown>): Promise<string | undefined> {
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 1000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const alephHash = await postToAleph(proofRecord);
      console.log(
        `[VRF] Proof posted to Aleph (attempt ${attempt}): https://explorer.aleph.cloud/message/${alephHash}`,
      );
      return alephHash;
    } catch (err: any) {
      console.error(`[VRF] Aleph posting failed (attempt ${attempt}/${MAX_RETRIES}):`, {
        message: err.message,
        raffleId: proofRecord.raffleId,
        timestamp: new Date().toISOString(),
      });
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }
  console.error(`[VRF] All ${MAX_RETRIES} Aleph posting attempts failed for raffle ${proofRecord.raffleId}`);
  return undefined;
}
