import { createPublicClient, createWalletClient, defineChain, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export const bscMainnet = defineChain({
  id: 56,
  name: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://bsc-dataseed.binance.org"] },
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://bscscan.com" },
  },
});

export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export const RAFFLE_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "raffleId", type: "uint256" },
      { indexed: true, internalType: "address", name: "organizer", type: "address" },
      { indexed: false, internalType: "address", name: "paymentToken", type: "address" },
      { indexed: false, internalType: "uint256", name: "ticketPrice", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "maxTickets", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "endTime", type: "uint256" },
    ],
    name: "RaffleCreated",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "_paymentToken", type: "address" },
      { internalType: "uint256", name: "_ticketPrice", type: "uint256" },
      { internalType: "uint256", name: "_maxTickets", type: "uint256" },
      { internalType: "uint256", name: "_duration", type: "uint256" },
    ],
    name: "createRaffle",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_raffleId", type: "uint256" },
      { internalType: "uint256", name: "_ticketCount", type: "uint256" },
    ],
    name: "purchaseTickets",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_raffleId", type: "uint256" },
      { internalType: "uint256", name: "_randomNumber", type: "uint256" },
      { internalType: "bytes32", name: "_vrfHash", type: "bytes32" },
    ],
    name: "drawWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_raffleId", type: "uint256" }],
    name: "getRaffle",
    outputs: [
      {
        components: [
          { internalType: "address", name: "organizer", type: "address" },
          { internalType: "address", name: "paymentToken", type: "address" },
          { internalType: "uint256", name: "ticketPrice", type: "uint256" },
          { internalType: "uint256", name: "maxTickets", type: "uint256" },
          { internalType: "uint256", name: "totalTickets", type: "uint256" },
          { internalType: "uint256", name: "startTime", type: "uint256" },
          { internalType: "uint256", name: "endTime", type: "uint256" },
          { internalType: "bool", name: "isActive", type: "bool" },
          { internalType: "bool", name: "isDrawn", type: "bool" },
          { internalType: "bool", name: "isCancelled", type: "bool" },
          { internalType: "address", name: "winner", type: "address" },
          { internalType: "uint256", name: "winningTicket", type: "uint256" },
          { internalType: "uint256", name: "totalPrize", type: "uint256" },
        ],
        internalType: "struct AgentRaffleV3.Raffle",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "raffleCounter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveRaffles",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_raffleId", type: "uint256" }],
    name: "vrfHashes",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_raffleId", type: "uint256" },
      { internalType: "address", name: "_participant", type: "address" },
    ],
    name: "getParticipantTickets",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function getServerAccount() {
  if (!process.env.DEPLOYER_PRIVATE_KEY) {
    throw new Error("DEPLOYER_PRIVATE_KEY not set");
  }
  return privateKeyToAccount(process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`);
}

export function getWalletClient() {
  return createWalletClient({
    account: getServerAccount(),
    chain: bscMainnet,
    transport: http(),
  });
}

export function getPublicClient() {
  return createPublicClient({
    chain: bscMainnet,
    transport: http(),
  });
}

export interface RaffleData {
  organizer: string;
  paymentToken: string;
  ticketPrice: string;
  maxTickets: string;
  totalTickets: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  isDrawn: boolean;
  isCancelled: boolean;
  winner: string;
  winningTicket: string;
  totalPrize: string;
}

export function formatRaffle(raw: any, id: number): RaffleData & { raffleId: number; status: string } {
  const { organizer, paymentToken, ticketPrice, maxTickets, totalTickets, startTime, endTime, isActive, isDrawn, isCancelled, winner, winningTicket, totalPrize } = raw;

  let status = "active";
  if (isCancelled) status = "cancelled";
  else if (isDrawn) status = "drawn";
  else if (!isActive || BigInt(Math.floor(Date.now() / 1000)) >= endTime) status = "ended";

  return {
    raffleId: id,
    organizer,
    paymentToken,
    ticketPrice: ticketPrice.toString(),
    maxTickets: maxTickets.toString(),
    totalTickets: totalTickets.toString(),
    startTime: startTime.toString(),
    endTime: endTime.toString(),
    isActive,
    isDrawn,
    isCancelled,
    winner,
    winningTicket: winningTicket.toString(),
    totalPrize: totalPrize.toString(),
    status,
  };
}
