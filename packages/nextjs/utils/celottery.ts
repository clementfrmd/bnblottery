// Token info for BNB mainnet stablecoins
export const TOKEN_CONTRACTS: Record<string, { symbol: string; decimals: number; address: string }> = {
  USDT: { symbol: "USDT", decimals: 18, address: "0x55d398326f99059fF775485246999027B3197955" },
  USDC: { symbol: "USDC", decimals: 18, address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d" },
  FDUSD: { symbol: "FDUSD", decimals: 18, address: "0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409" },
};

// Reverse lookup: token address → contract info
export const TOKEN_MAP: Record<string, { symbol: string; decimals: number; address: string }> = {
  "0x55d398326f99059fF775485246999027B3197955": { symbol: "USDT", decimals: 18, address: "0x55d398326f99059fF775485246999027B3197955" },
  "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d": { symbol: "USDC", decimals: 18, address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d" },
  "0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409": { symbol: "FDUSD", decimals: 18, address: "0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409" },
};

export const TOKEN_LIST = Object.values(TOKEN_CONTRACTS);

export function getTokenInfo(address: string) {
  return TOKEN_MAP[address] || { symbol: "TOKEN", decimals: 18, address };
}

export function formatTokenAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const remainder = amount % divisor;
  const decimal = remainder.toString().padStart(decimals, "0").slice(0, 2);
  return `${whole}.${decimal}`;
}

export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [whole, frac = ""] = amount.split(".");
  const paddedFrac = frac.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole + paddedFrac);
}

export function getRaffleStatus(raffle: {
  isActive: boolean;
  isDrawn: boolean;
  isCancelled: boolean;
  endTime: bigint;
}): { label: string; emoji: string; color: string } {
  if (raffle.isCancelled) return { label: "Cancelled", emoji: "❌", color: "text-red-600" };
  if (raffle.isDrawn) return { label: "Winner Selected", emoji: "🏆", color: "text-yellow-600" };
  if (!raffle.isActive || BigInt(Math.floor(Date.now() / 1000)) > raffle.endTime)
    return { label: "Ended", emoji: "⏰", color: "text-gray-500" };
  return { label: "Active", emoji: "🟢", color: "text-green-600" };
}

export function formatTimeRemaining(endTime: bigint): string {
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (now >= endTime) return "Ended";
  const diff = Number(endTime - now);
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
