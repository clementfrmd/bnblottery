"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { Address } from "@scaffold-ui/components";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import {
  getTokenInfo,
  getRaffleStatus,
  formatTokenAmount,
  formatTimeRemaining,
} from "~~/utils/celottery";
import { Leaf, Sparkle, Ticket, Trophy, Star, Bag, Cart, SlotMachine, SpinWheel } from "~~/components/icons/ACIcons";
import { useReadContract, useWriteContract } from "wagmi";

const ERC20_ABI = [
  { inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], name: "allowance", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], name: "approve", outputs: [{ type: "bool" }], stateMutability: "nonpayable", type: "function" },
] as const;

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
  const { address, chain } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const totalCost = ticketPrice * BigInt(ticketCount);
  const { data: raffleInfo } = useDeployedContractInfo("AgentRaffleV3");
  const raffleAddress = raffleInfo?.address;
  const token = getTokenInfo(tokenAddress);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && raffleAddress ? [address, raffleAddress] : undefined,
  });

  const needsApproval = allowance !== undefined && allowance < totalCost;

  const { writeContractAsync: approveToken, isPending: isApproving } = useWriteContract();
  const { writeContractAsync: buyTickets, isPending: isBuying } = useScaffoldWriteContract({ contractName: "AgentRaffleV3" });

  const handleApprove = async () => {
    if (!raffleAddress) return;
    await approveToken({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [raffleAddress, totalCost],
    });
    await refetchAllowance();
  };

  const handleBuy = async () => {
    await buyTickets({
      functionName: "purchaseTickets",
      args: [raffleId, BigInt(ticketCount)],
    });
    onSuccess();
  };

  const isWrongNetwork = chain?.id !== targetNetwork.id;

  if (isWrongNetwork) {
    return (
      <button className="cny-btn w-full justify-center" style={{ background: "#CA8A04", color: "#FEFCE8" }} disabled>
        Wrong Network — Switch to {targetNetwork.name}
      </button>
    );
  }

  if (needsApproval) {
    return (
      <button
        className="cny-btn cny-btn-lavender w-full justify-center"
        onClick={handleApprove}
        disabled={isApproving || ticketCount <= 0}
      >
        {isApproving ? (<>Approving... <Leaf size={18} /></>) : (<><Sparkle size={18} /> Approve {token.symbol}</>)}
      </button>
    );
  }

  return (
    <button
      className="cny-btn cny-btn-mint w-full justify-center"
      onClick={handleBuy}
      disabled={isBuying || ticketCount <= 0}
    >
      {isBuying ? (<>Buying BNB Lucky Draw Tickets... <Ticket size={18} /></>) : (<><Ticket size={18} /> Buy {ticketCount} BNB Lucky Draw Ticket{ticketCount !== 1 ? "s" : ""}</>)}
    </button>
  );
};

export default function RaffleDetailPage() {
  const params = useParams();
  const idStr = params.id as string;
  let raffleId: bigint;
  try {
    raffleId = BigInt(idStr);
  } catch {
    return (
      <div className="flex justify-center items-center grow py-16">
        <p className="text-cny-muted text-lg">Invalid raffle ID</p>
      </div>
    );
  }
  const { address } = useAccount();
  const [ticketCount, setTicketCount] = useState(1);
  const [timeLeft, setTimeLeft] = useState("");
  const [vrfProofUrl, setVrfProofUrl] = useState<string | null>(null);
  const [proofLoading, setProofLoading] = useState(false);

  const { data: raffle, isLoading } = useScaffoldReadContract({
    contractName: "AgentRaffleV3",
    functionName: "getRaffle",
    args: [raffleId],
  });

  const { data: myTickets } = useScaffoldReadContract({
    contractName: "AgentRaffleV3",
    functionName: "getParticipantTickets",
    args: [raffleId, address],
  });

  const endTime = raffle?.endTime;
  useEffect(() => {
    if (endTime === undefined) return;
    const update = () => setTimeLeft(formatTimeRemaining(endTime));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

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
        <p className="text-cny-muted text-lg animate-gentle-bounce flex items-center gap-2">Loading raffle details... <SpinWheel size={24} /></p>
      </div>
    );
  }

  const token = getTokenInfo(raffle.paymentToken);
  const status = getRaffleStatus(raffle);
  const soldPercent = raffle.maxTickets > 0n ? Number((raffle.totalTickets * 100n) / raffle.maxTickets) : 0;
  const prizePool = formatTokenAmount(raffle.totalPrize, token.decimals);
  const isActive = status.label === "Active";
  const maxBuyable = Number(raffle.maxTickets - raffle.totalTickets);

  const platformFeeAmount = (raffle.totalPrize * 300n) / 10000n;
  const organizerFeeAmount = (raffle.totalPrize * 200n) / 10000n;
  const winnerPrizeAmount = raffle.totalPrize - platformFeeAmount - organizerFeeAmount;
  const winnerPrize = formatTokenAmount(winnerPrizeAmount, token.decimals);
  const platformFee = formatTokenAmount(platformFeeAmount, token.decimals);
  const organizerFee = formatTokenAmount(organizerFeeAmount, token.decimals);

  return (
    <div className="flex flex-col items-center grow px-4 py-8">
      <div className="w-full max-w-2xl animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-cny-heading flex items-center gap-2">
            <SlotMachine size={36} /> Raffle #{params.id as string}
          </h1>
          <span className="px-4 py-2 rounded-full text-sm font-bold"
            style={{
              background: status.label === "Active" ? "#CA8A04" : status.label === "Winner Selected" ? "#B91C1C" : "#f0ebe3",
              color: "#FEFCE8",
            }}>
            {status.label}
          </span>
        </div>

        <div className="cny-card p-6 mb-6" style={{ borderColor: "#CA8A04", background: "linear-gradient(180deg, var(--color-base-100), var(--color-base-200))" }}>
          <div className="grid grid-cols-2 gap-4 text-cny-muted">
            <div>
              <span className="text-xs uppercase tracking-wide">Organizer</span>
              <div className="font-bold mt-1" style={{ color: "#FEFCE8" }}>
                <span className="[&_*]:!text-cny-heading [&_a]:!text-cny-heading"><Address address={raffle.organizer} /></span>
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide">Token</span>
              <p className="font-bold text-lg text-cny-heading mt-1">{token.symbol}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide">Ticket Price</span>
              <p className="font-bold text-cny-heading mt-1">
                {formatTokenAmount(raffle.ticketPrice, token.decimals)} {token.symbol}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide">Prize Pool</span>
              <p className="font-extrabold text-lg mt-1 flex items-center gap-1" style={{ color: "#CA8A04" }}>
                {prizePool} {token.symbol} <Star size={20} />
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide">Tickets Sold</span>
              <p className="font-bold text-cny-heading mt-1">
                {raffle.totalTickets.toString()} / {raffle.maxTickets.toString()}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide">Time Remaining</span>
              <p className="font-bold text-cny-heading mt-1">{timeLeft}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="cny-progress" style={{ height: "16px" }}>
              <div className="cny-progress-fill" style={{ width: `${Math.min(soldPercent, 100)}%` }}></div>
            </div>
            <p className="text-center text-sm text-cny-muted mt-2">{soldPercent}% sold</p>
          </div>

          {raffle.totalPrize > 0n && (
            <div className="mt-4 pt-4" style={{ borderTop: "1px dashed #CA8A04" }}>
              <p className="text-xs uppercase tracking-wide text-cny-muted mb-2">Prize Distribution</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-cny-muted">Winner (95%)</span>
                  <span className="font-bold" style={{ color: "#CA8A04" }}>{winnerPrize} {token.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cny-muted">Platform (3%)</span>
                  <span className="font-bold text-cny-heading">{platformFee} {token.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cny-muted">Organizer (2%)</span>
                  <span className="font-bold text-cny-heading">{organizerFee} {token.symbol}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {raffle.isDrawn && (
          <div className="cny-card p-6 mb-6 text-center" style={{ borderColor: "#B91C1C", background: "linear-gradient(135deg, #B91C1C, #CA8A04)" }}>
            <h2 className="text-2xl font-extrabold text-cny-heading mb-3 flex items-center justify-center gap-2">
              <Trophy size={32} /> Winner! <Trophy size={32} />
            </h2>
            <div className="flex justify-center mb-2">
              <span className="[&_*]:!text-cny-heading [&_a]:!text-cny-heading"><Address address={raffle.winner} /></span>
            </div>
            <p className="text-cny-muted">Winning Ticket: #{raffle.winningTicket.toString()}</p>
            <p className="text-lg font-extrabold mt-2" style={{ color: "#CA8A04" }}>
              {winnerPrize} {token.symbol}
            </p>
            <div className="mt-4 pt-3" style={{ borderTop: "1px dashed rgba(0,0,0,0.15)" }}>
              <p className="text-xs uppercase tracking-wide text-cny-muted mb-1">Randomness Source</p>
              <p className="text-sm font-bold text-cny-heading">Aleph Cloud VRF</p>
              <p className="text-xs text-cny-muted mt-1">
                Verifiable Random Function — provably fair, on-chain verifiable
              </p>
              {proofLoading ? (
                <p className="text-xs text-cny-muted mt-1">Loading proof...</p>
              ) : vrfProofUrl ? (
                <a href={vrfProofUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs mt-1 inline-block underline" style={{ color: "#CA8A04" }}>
                  View VRF proof (on-chain verified) →
                </a>
              ) : (
                <p className="text-xs text-cny-muted mt-1 italic">Proof not available</p>
              )}
            </div>
          </div>
        )}

        {address && myTickets !== undefined && myTickets > 0n && (
          <div className="cny-card p-4 mb-6 text-center" style={{ borderColor: "#CA8A04" }}>
            <div className="text-sm text-cny-muted mb-1 flex items-center justify-center gap-1"><Bag size={18} /> Your Tickets</div>
            <p className="text-cny-heading font-extrabold text-lg flex items-center justify-center gap-1"><Ticket size={20} /> {myTickets.toString()} Ticket{myTickets > 1n ? "s" : ""}</p>
          </div>
        )}

        {isActive && address && maxBuyable > 0 && (
          <div className="cny-card p-6" style={{ borderColor: "#CA8A04" }}>
            <h2 className="text-lg font-extrabold text-cny-heading mb-4 flex items-center gap-2">
              <Cart size={24} /> Buy BNB Lucky Draw Tickets
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-cny-muted font-semibold">Quantity:</label>
              <input
                type="number"
                min={1}
                max={maxBuyable}
                value={ticketCount}
                onChange={e => setTicketCount(Math.max(1, Math.min(maxBuyable, parseInt(e.target.value) || 1)))}
                className="w-24 text-center rounded-2xl border-2 px-3 py-2 font-bold text-cny-heading"
                style={{ borderColor: "#CA8A04", background: "var(--color-base-100)" }}
              />
              <span className="text-sm text-cny-muted">
                Total: {formatTokenAmount(raffle.ticketPrice * BigInt(ticketCount), token.decimals)} {token.symbol}
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
          <div className="text-center py-6 text-cny-muted">
            <p className="text-lg flex items-center justify-center gap-2">Connect your wallet to play! <Ticket size={24} /></p>
          </div>
        )}
      </div>
    </div>
  );
}
