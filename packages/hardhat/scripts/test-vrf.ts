import { ethers } from "hardhat";
import { keccak256, encodePacked, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const ALEPH_API = "https://api3.aleph.im";
const ALEPH_CHANNEL = "BNBLOTTERY_VRF";
const DEPLOYER_KEY = "0xbbad1d48e8d16e3a5ddf722f0a7f07100362d55c602c9a86220f6dfa1f390901";

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(hashBuffer));
}

async function main() {
  const account = privateKeyToAccount(DEPLOYER_KEY as `0x${string}`);
  console.log("Signer:", account.address);

  const timestamp = Date.now();
  const proofRecord = {
    type: "bnblottery-vrf",
    raffleId: 0,
    timestamp,
    blockHash: "0xtest",
    blockNumber: 12345,
    nonce: `bnblottery-raffle-0-${timestamp}`,
    commitment: "0xtest",
    randomNumber: "0xtest",
    chain: "bsc-testnet",
    contract: "0x0ebC3201aaD226f933e256c6FDC0c55Ed9290934",
  };

  const now = Date.now() / 1000;
  const content = {
    type: "bnblottery-vrf",
    address: account.address,
    content: proofRecord,
    time: now,
  };

  const itemContent = JSON.stringify(content);
  const itemHash = await sha256(itemContent);
  const verificationBuffer = ["ETH", account.address, "POST", itemHash].join("\n");
  const signature = await account.signMessage({ message: verificationBuffer });

  console.log("Item hash:", itemHash);
  console.log("Signature:", signature.slice(0, 20) + "...");

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

  const resp = await fetch(`${ALEPH_API}/api/v0/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await resp.text();
  console.log(`\nAleph response (${resp.status}):`, text.slice(0, 500));
  
  if (resp.ok || resp.status === 202) {
    console.log(`\n✅ VRF proof posted! https://explorer.aleph.cloud/message/${itemHash}`);
  } else {
    console.log("\n❌ VRF posting failed");
  }
}

main().catch(console.error);
