// Token info keyed by deployed contract name (matches SE-2 deployedContracts names)
export const TOKEN_CONTRACTS: Record<string, { symbol: string; decimals: number; contractName: string }> = {
  MockcUSD: { symbol: "cUSD", decimals: 18, contractName: "MockcUSD" },
  MockcEUR: { symbol: "cEUR", decimals: 18, contractName: "MockcEUR" },
  MockUSDC: { symbol: "USDC", decimals: 6, contractName: "MockUSDC" },
};

// Reverse lookup: token address → contract info
export const TOKEN_MAP: Record<string, { symbol: string; decimals: number; address: string }> = {
  "0x8De5f97Dab606845A4183CDC337d8441AF84E273": { symbol: "cUSD", decimals: 18, address: "0x8De5f97Dab606845A4183CDC337d8441AF84E273" },
  "0x15a3391423Ec9aE478265DA3e54A7ACBC3850C41": { symbol: "cEUR", decimals: 18, address: "0x15a3391423Ec9aE478265DA3e54A7ACBC3850C41" },
  "0x2ef9B83521fBf50515aC2859956F325f8eEcF9af": { symbol: "USDC", decimals: 6, address: "0x2ef9B83521fBf50515aC2859956F325f8eEcF9af" },
};

export const TOKEN_LIST = Object.values(TOKEN_CONTRACTS);

export function getTokenInfo(address: string) {
  return TOKEN_MAP[address] || { symbol: "TOKEN", decimals: 18, address };
}

export function getTokenContractName(address: string): string {
  for (const [contractName, info] of Object.entries(TOKEN_CONTRACTS)) {
    // Match by address from TOKEN_MAP
    const mapEntry = Object.entries(TOKEN_MAP).find(([addr]) => {
      const tokenInfo = TOKEN_MAP[addr];
      return tokenInfo && tokenInfo.symbol === info.symbol;
    });
    if (mapEntry && mapEntry[0].toLowerCase() === address.toLowerCase()) {
      return contractName;
    }
  }
  return "MockcUSD";
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
