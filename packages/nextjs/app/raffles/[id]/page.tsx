"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { Address } from "@scaffold-ui/components";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import {
  getTokenInfo,
  TOKEN_CONTRACTS,
  getRaffleStatus,
  formatTokenAmount,
  formatTimeRemaining,
} from "~~/utils/celottery";
import { Leaf, Sparkle, Ticket, Trophy, Star, Bag, Cart, SlotMachine, SpinWheel } from "~~/components/icons/ACIcons";

function getTokenContractNameByAddress(
  address: string,
  tokenAddresses: Record<string, string>,
): "MockcUSD" | "MockcEUR" | "MockUSDC" {
  for (const [contractName, addr] of Object.entries(tokenAddresses)) {
    if (addr.toLowerCase() === address.toLowerCase()) return contractName as "MockcUSD" | "MockcEUR" | "MockUSDC";
  }
  return "MockcUSD";
}

const ApproveAndBuy = ({
  raffleId,
  tokenAddress,
  ticketPrice,
  ticketCount,
  onSuccess,
}: {
  raffleId: bigint;
  tokenAddress: string;
  ticketPrice: bigint;
  ticketCount: number;
  onSuccess: () => void;
}) => {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const totalCost = ticketPrice * BigInt(ticketCount);

  const { data: cusdInfo } = useDeployedContractInfo("MockcUSD");
  const { data: ceurInfo } = useDeployedContractInfo("MockcEUR");
  const { data: usdcInfo } = useDeployedContractInfo("MockUSDC");
  const { data: raffleInfo } = useDeployedContractInfo("AgentRaffleV2");

  const raffleAddress = raffleInfo?.address;

  const tokenAddresses: Record<string, string> = {};
  if (cusdInfo?.address) tokenAddresses["MockcUSD"] = cusdInfo.address;
  if (ceurInfo?.address) tokenAddresses["MockcEUR"] = ceurInfo.address;
  if (usdcInfo?.address) tokenAddresses["MockUSDC"] = usdcInfo.address;

  const tokenContractName = getTokenContractNameByAddress(tokenAddress, tokenAddresses);
  const tokenInfo = TOKEN_CONTRACTS[tokenContractName] || { symbol: "TOKEN", decimals: 18 };

  const { data: cusdAllowance } = useScaffoldReadContract({
    contractName: "MockcUSD",
    functionName: "allowance",
    args: [address, raffleAddress],
  });
  const { data: ceurAllowance } = useScaffoldReadContract({
    contractName: "MockcEUR",
    functionName: "allowance",
    args: [address, raffleAddress],
  });
  const { data: usdcAllowance } = useScaffoldReadContract({
    contractName: "MockUSDC",
    functionName: "allowance",
    args: [address, raffleAddress],
  });

  const allowanceMap = { MockcUSD: cusdAllowance, MockcEUR: ceurAllowance, MockUSDC: usdcAllowance };
  const allowance = allowanceMap[tokenContractName];
  const needsApproval = allowance !== undefined && allowance < totalCost;

  const { writeContractAsync: approveMockCUSD, isPending: isApprovingCUSD } = useScaffoldWriteContract({ contractName: "MockcUSD" });
  const { writeContractAsync: approveMockCEUR, isPending: isApprovingCEUR } = useScaffoldWriteContract({ contractName: "MockcEUR" });
  const { writeContractAsync: approveMockUSDC, isPending: isApprovingUSDC } = useScaffoldWriteContract({ contractName: "MockUSDC" });
  const { writeContractAsync: buyTickets, isPending: isBuying } = useScaffoldWriteContract({ contractName: "AgentRaffleV2" });

  const isApproving = isApprovingCUSD || isApprovingCEUR || isApprovingUSDC;

  const handleApprove = async () => {
    if (!raffleAddress) return;
    const approveArgs = {
      functionName: "approve" as const,
      args: [raffleAddress, totalCost] as readonly [string, bigint],
    };
    if (tokenContractName === "MockcUSD") await approveMockCUSD(approveArgs);
    else if (tokenContractName === "MockcEUR") await approveMockCEUR(approveArgs);
    else await approveMockUSDC(approveArgs);
  };

  const handleBuy = async () => {
    await buyTickets({
      functionName: "purchaseTickets",
      args: [raffleId, BigInt(ticketCount)],
    });
    onSuccess();
  };

  const isWrongNetwork = useAccount().chain?.id !== targetNetwork.id;

  if (isWrongNetwork) {
    return (
      <button className="fh-btn ac-btn w-full justify-center" style={{ background: "#C41E3A", color: "#fff5e6" }} disabled>
        Wrong Network — Switch to {targetNetwork.name}
      </button>
    );
  }

  if (needsApproval) {
    return (
      <button
        className="fh-btn ac-btn fh-btn ac-btn-lavender w-full justify-center"
        onClick={handleApprove}
        disabled={isApproving || ticketCount <= 0}
      >
        {isApproving ? (<>Approving... <Leaf size={18} /></>) : (<><Sparkle size={18} /> Approve {tokenInfo.symbol}</>)}
      </button>
    );
  }

  return (
    <button
      className="fh-btn ac-btn fh-btn ac-btn-mint w-full justify-center"
      onClick={handleBuy}
      disabled={isBuying || ticketCount <= 0}
    >
      {isBuying ? (<>Buying BNB Lucky Draw Tickets... <Ticket size={18} /></>) : (<><Ticket size={18} /> Buy {ticketCount} BNB Lucky Draw Ticket{ticketCount !== 1 ? "s" : ""}</>)}
    </button>
  );
};

export default function RaffleDetailPage() {
  const params = useParams();
  const raffleId = BigInt(params.id as string);
  const { address } = useAccount();
  const [ticketCount, setTicketCount] = useState(1);
  const [timeLeft, setTimeLeft] = useState("");
  const [vrfProofUrl, setVrfProofUrl] = useState<string | null>(null);
  const [proofLoading, setProofLoading] = useState(false);

  const { data: raffle, isLoading } = useScaffoldReadContract({
    contractName: "AgentRaffleV2",
    functionName: "getRaffle",
    args: [raffleId],
  });

  const { data: myTickets } = useScaffoldReadContract({
    contractName: "AgentRaffleV2",
    functionName: "getParticipantTickets",
    args: [raffleId, address],
  });

  useEffect(() => {
    if (!raffle) return;
    const update = () => setTimeLeft(formatTimeRemaining(raffle.endTime));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [raffle]);

  // Check VRF proof availability for drawn raffles
  useEffect(() => {
    if (!raffle?.isDrawn) return;
    setProofLoading(true);
    fetch(`/api/agent/vrf-proof/${raffleId}`)
      .then(r => { if (r.ok) setVrfProofUrl(`/api/agent/vrf-proof/${raffleId}`); })
      .catch(() => {})
      .finally(() => setProofLoading(false));
  }, [raffle?.isDrawn, raffleId]);

  if (isLoading || !raffle) {
    return (
      <div className="flex justify-center items-center grow py-16">
        <p className="text-fh-muted text-lg animate-gentle-bounce flex items-center gap-2">Loading raffle details... <SpinWheel size={24} /></p>
      </div>
    );
  }

  const token = getTokenInfo(raffle.paymentToken);
  const status = getRaffleStatus(raffle);
  const soldPercent = raffle.maxTickets > 0n ? Number((raffle.totalTickets * 100n) / raffle.maxTickets) : 0;
  const prizePool = formatTokenAmount(raffle.totalPrize, token.decimals);
  const isActive = status.label === "Active";
  const maxBuyable = Number(raffle.maxTickets - raffle.totalTickets);

  // Fee breakdown (matching contract: 3% platform, 2% organizer, 95% winner)
  const totalPrizeNum = Number(raffle.totalPrize) / (10 ** token.decimals);
  const winnerPrize = (totalPrizeNum * 0.95).toFixed(2);
  const platformFee = (totalPrizeNum * 0.03).toFixed(2);
  const organizerFee = (totalPrizeNum * 0.02).toFixed(2);

  return (
    <div className="flex flex-col items-center grow px-4 py-8">
      <div className="w-full max-w-2xl animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-fh-heading flex items-center gap-2">
            <SlotMachine size={36} /> Raffle #{params.id as string}
          </h1>
          <span className="px-4 py-2 rounded-full text-sm font-bold"
            style={{
              background: status.label === "Active" ? "#C41E3A" : status.label === "Winner Selected" ? "#FFA500" : "#f0ebe3",
              color: "#fff5e6",
            }}>
            {status.label}
          </span>
        </div>

        {/* Raffle info card */}
        <div className="fh-card ac-card p-6 mb-6" style={{ borderColor: "#DAA520", background: "linear-gradient(180deg, var(--color-base-100), var(--color-base-200))" }}>
          <div className="grid grid-cols-2 gap-4 text-fh-muted">
            <div>
              <span className="text-xs uppercase tracking-wide">Organizer</span>
              <div className="font-bold mt-1" style={{ color: "#fff5e6" }}>
                <span className="[&_*]:!text-fh-heading [&_a]:!text-fh-heading"><Address address={raffle.organizer} /></span>
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide">Token</span>
              <p className="font-bold text-lg text-fh-heading mt-1">{token.symbol}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide">Ticket Price</span>
              <p className="font-bold text-fh-heading mt-1">
                {formatTokenAmount(raffle.ticketPrice, token.decimals)} {token.symbol}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide">Prize Pool</span>
              <p className="font-extrabold text-lg mt-1 flex items-center gap-1" style={{ color: "#C41E3A" }}>
                {prizePool} {token.symbol} <Star size={20} />
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide">Tickets Sold</span>
              <p className="font-bold text-fh-heading mt-1">
                {raffle.totalTickets.toString()} / {raffle.maxTickets.toString()}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide">Time Remaining</span>
              <p className="font-bold text-fh-heading mt-1">{timeLeft}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="fh-progress ac-progress" style={{ height: "16px" }}>
              <div className="fh-progress fh-progress-fill ac-progress-fill" style={{ width: `${Math.min(soldPercent, 100)}%` }}></div>
            </div>
            <p className="text-center text-sm text-fh-muted mt-2">{soldPercent}% sold</p>
          </div>

          {/* Fee breakdown */}
          {raffle.totalPrize > 0n && (
            <div className="mt-4 pt-4" style={{ borderTop: "1px dashed #DAA520" }}>
              <p className="text-xs uppercase tracking-wide text-fh-muted mb-2">Prize Distribution</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-fh-muted">Winner (95%)</span>
                  <span className="font-bold" style={{ color: "#C41E3A" }}>{winnerPrize} {token.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fh-muted">Platform (3%)</span>
                  <span className="font-bold text-fh-heading">{platformFee} {token.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fh-muted">Organizer (2%)</span>
                  <span className="font-bold text-fh-heading">{organizerFee} {token.symbol}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Winner announcement */}
        {raffle.isDrawn && (
          <div className="fh-card ac-card p-6 mb-6 text-center" style={{ borderColor: "#FFA500", background: "linear-gradient(135deg, #FFA500, #C41E3A)" }}>
            <h2 className="text-2xl font-extrabold text-fh-heading mb-3 flex items-center justify-center gap-2">
              <Trophy size={32} /> Winner! <Trophy size={32} />
            </h2>
            <div className="flex justify-center mb-2">
              <span className="[&_*]:!text-fh-heading [&_a]:!text-fh-heading"><Address address={raffle.winner} /></span>
            </div>
            <p className="text-fh-muted">Winning Ticket: #{raffle.winningTicket.toString()}</p>
            <p className="text-lg font-extrabold mt-2" style={{ color: "#C41E3A" }}>
              {winnerPrize} {token.symbol}
            </p>
            <div className="mt-4 pt-3" style={{ borderTop: "1px dashed rgba(0,0,0,0.15)" }}>
              <p className="text-xs uppercase tracking-wide text-fh-muted mb-1">Randomness Source</p>
              <p className="text-sm font-bold text-fh-heading">Aleph Cloud VRF</p>
              <p className="text-xs text-fh-muted mt-1">
                Verifiable Random Function — provably fair, on-chain verifiable
              </p>
              {proofLoading ? (
                <p className="text-xs text-fh-muted mt-1">Loading proof...</p>
              ) : vrfProofUrl ? (
                <a
                  href={vrfProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs mt-1 inline-block underline"
                  style={{ color: "#C41E3A" }}
                >
                  View VRF proof (on-chain verified) →
                </a>
              ) : (
                <p className="text-xs text-fh-muted mt-1 italic">
                  Proof not available
                </p>
              )}
            </div>
          </div>
        )}

        {/* Your tickets inventory card */}
        {address && myTickets !== undefined && myTickets > 0n && (
          <div className="fh-card ac-card p-4 mb-6 text-center" style={{ borderColor: "#FFD700" }}>
            <div className="text-sm text-fh-muted mb-1 flex items-center justify-center gap-1"><Bag size={18} /> Your Tickets</div>
            <p className="text-fh-heading font-extrabold text-lg flex items-center justify-center gap-1"><Ticket size={20} /> {myTickets.toString()} Ticket{myTickets > 1n ? "s" : ""}</p>
          </div>
        )}

        {/* Buy tickets */}
        {isActive && address && maxBuyable > 0 && (
          <div className="fh-card ac-card p-6" style={{ borderColor: "#C41E3A" }}>
            <h2 className="text-lg font-extrabold text-fh-heading mb-4 flex items-center gap-2">
              <Cart size={24} /> Buy BNB Lucky Draw Tickets
            </h2>

            <div className="flex items-center gap-4 mb-4">
              <label className="text-fh-muted font-semibold">Quantity:</label>
              <input
                type="number"
                min={1}
                max={maxBuyable}
                value={ticketCount}
                onChange={e =>
                  setTicketCount(Math.max(1, Math.min(maxBuyable, parseInt(e.target.value) || 1)))
                }
                className="w-24 text-center rounded-2xl border-2 px-3 py-2 font-bold text-fh-heading"
                style={{ borderColor: "#DAA520", background: "var(--color-base-100)" }}
              />
              <span className="text-sm text-fh-muted">
                Total: {formatTokenAmount(raffle.ticketPrice * BigInt(ticketCount), token.decimals)}{" "}
                {token.symbol}
              </span>
            </div>

            <ApproveAndBuy
              raffleId={raffleId}
              tokenAddress={raffle.paymentToken}
              ticketPrice={raffle.ticketPrice}
              ticketCount={ticketCount}
              onSuccess={() => {}}
            />
          </div>
        )}

        {!address && isActive && (
          <div className="text-center py-6 text-fh-muted">
            <p className="text-lg flex items-center justify-center gap-2">Connect your wallet to play! <Ticket size={24} /></p>
          </div>
        )}
      </div>
    </div>
  );
}
