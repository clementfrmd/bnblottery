"use client";

import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { getTokenInfo, getRaffleStatus, formatTokenAmount, formatTimeRemaining } from "~~/utils/celottery";
import { Lantern, SlotMachine, House, Paw, CrystalBall, Trophy } from "~~/components/icons/ACIcons";

const statusStyles: Record<string, { bg: string; border: string; text: string }> = {
  Active: { bg: "#B91C1C", border: "#991B1B", text: "#FEF2F2" },
  "Winner Selected": { bg: "#CA8A04", border: "#A16207", text: "#FEFCE8" },
  Cancelled: { bg: "#44403C", border: "#292524", text: "#E7E5E4" },
  Ended: { bg: "#E7E5E4", border: "#D6D3D1", text: "#44403C" },
};

const RaffleCard = ({ raffleId, compact }: { raffleId: number; compact?: boolean }) => {
  const { data: raffle } = useScaffoldReadContract({
    contractName: "AgentRaffleV2",
    functionName: "getRaffle",
    args: [BigInt(raffleId)],
  });

  if (!raffle) {
    return (
      <div className="cny-card cny-card p-6 animate-pulse">
        <div className="h-6 rounded-full w-1/2 mb-4" style={{ background: "var(--color-base-300)" }}></div>
        <div className="h-4 rounded-full w-full mb-2" style={{ background: "var(--color-base-300)" }}></div>
        <div className="h-4 rounded-full w-3/4" style={{ background: "var(--color-base-300)" }}></div>
      </div>
    );
  }

  const token = getTokenInfo(raffle.paymentToken);
  const status = getRaffleStatus(raffle);
  const soldPercent = raffle.maxTickets > 0n ? Number((raffle.totalTickets * 100n) / raffle.maxTickets) : 0;
  const style = statusStyles[status.label] || statusStyles.Ended;
  const prizePool = formatTokenAmount(raffle.ticketPrice * raffle.totalTickets, token.decimals);

  if (compact) {
    return (
      <Link href={`/raffles/${raffleId}`}>
        <div className="cny-card cny-card p-6 cursor-pointer hover:scale-[1.02] transition-transform opacity-60 hover:opacity-90" style={{ borderColor: style.border }}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <SlotMachine size={32} />
              <div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#FFDAC1", color: "#1C1917" }}>
                  #{raffleId}
                </span>
                <div className="text-lg font-extrabold text-cny-heading mt-1">{prizePool} {token.symbol}</div>
                <div className="text-xs text-cny-muted">Prize Pool</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {raffle.isDrawn && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: "#FFDAC1", color: "#1C1917" }}>
                  <CrystalBall size={12} /> VRF
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                {status.label}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-cny-muted">
            <div className="flex justify-between">
              <span>Tickets Sold</span>
              <span className="font-bold text-cny-heading">{raffle.totalTickets.toString()}/{raffle.maxTickets.toString()}</span>
            </div>
            <div className="cny-progress cny-progress">
              <div className="cny-progress-fill cny-progress-fill" style={{ width: `${Math.min(soldPercent, 100)}%` }}></div>
            </div>
            {raffle.isDrawn && raffle.winner && raffle.winner !== "0x0000000000000000000000000000000000000000" && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1"><Trophy size={14} /> Winner</span>
                <span className="font-bold text-cny-heading font-mono text-xs">{raffle.winner.slice(0, 6)}...{raffle.winner.slice(-4)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/raffles/${raffleId}`}>
      <div className="cny-card cny-card p-6 cursor-pointer hover:scale-[1.02] transition-transform" style={{ borderColor: style.border }}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <SlotMachine size={36} />
            <div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#FFDAC1", color: "#1C1917" }}>
                #{raffleId}
              </span>
              <div className="text-lg font-extrabold text-cny-heading mt-1">{prizePool} {token.symbol}</div>
              <div className="text-xs text-cny-muted">Prize Pool</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
            {status.label}
          </span>
        </div>

        <div className="space-y-2 text-sm text-cny-muted">
          <div className="flex justify-between">
            <span>Ticket Price</span>
            <span className="font-bold text-cny-heading">{formatTokenAmount(raffle.ticketPrice, token.decimals)} {token.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span>Tickets Sold</span>
            <span className="font-bold text-cny-heading">{raffle.totalTickets.toString()}/{raffle.maxTickets.toString()}</span>
          </div>

          <div className="cny-progress cny-progress">
            <div className="cny-progress-fill cny-progress-fill" style={{ width: `${Math.min(soldPercent, 100)}%` }}></div>
          </div>

          <div className="flex justify-between">
            <span>Time Left</span>
            <span className="font-bold text-cny-heading">{formatTimeRemaining(raffle.endTime)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const RaffleClassifier = ({ raffleId, onClassify }: { raffleId: number; onClassify: (id: number, isActive: boolean) => void }) => {
  const { data: raffle } = useScaffoldReadContract({
    contractName: "AgentRaffleV2",
    functionName: "getRaffle",
    args: [BigInt(raffleId)],
  });

  useEffect(() => {
    if (!raffle) return;
    const status = getRaffleStatus(raffle);
    onClassify(raffleId, status.label === "Active");
  }, [raffle, raffleId, onClassify]);

  return null;
};

const RafflesPage: NextPage = () => {
  const [classified, setClassified] = useState<Record<number, boolean>>({});

  const { data: raffleCounter, isLoading } = useScaffoldReadContract({
    contractName: "AgentRaffleV2",
    functionName: "raffleCounter",
  });

  const count = raffleCounter ? Number(raffleCounter) : 0;
  const allIds = Array.from({ length: count }, (_, i) => i);

  const handleClassify = (id: number, isActive: boolean) => {
    setClassified(prev => {
      if (prev[id] === isActive) return prev;
      return { ...prev, [id]: isActive };
    });
  };

  const activeIds = allIds.filter(id => classified[id] === true);
  const pastIds = allIds.filter(id => classified[id] === false).reverse();
  const loaded = Object.keys(classified).length === count;

  return (
    <div className="flex flex-col items-center grow px-4 py-8 relative">
      {/* Hidden classifiers */}
      {allIds.map(id => <RaffleClassifier key={id} raffleId={id} onClassify={handleClassify} />)}

      {/* Floating lanterns */}
      <div className="absolute top-4 right-8 opacity-30 animate-lantern-sway"><Leaf size={40} /></div>
      <div className="absolute top-20 left-6 opacity-20 animate-lantern-sway" style={{ animationDelay: "2s" }}><Leaf size={32} /></div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-cny-heading mb-2 flex items-center gap-2">
        <SlotMachine size={44} /> All Raffles
      </h1>
      <p className="text-cny-muted mb-8 text-lg">Browse the fortune board! 🏮</p>

      {isLoading || !loaded ? (
        <div className="text-cny-muted text-lg animate-gentle-bounce flex items-center gap-2">Loading raffles... <House size={24} /></div>
      ) : count === 0 ? (
        <div className="text-center animate-fade-in-up">
          <p className="text-cny-muted text-lg mb-4 flex items-center justify-center gap-2">No raffles yet — AI agents will create them soon! <Paw size={24} /></p>
          <Link href="/agents" className="cny-btn cny-btn-red cny-btn cny-btn-mint">
            <Paw size={20} /> Meet the Agents
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-6xl space-y-8">
          {/* Active Raffles */}
          {activeIds.length > 0 && (
            <div>
              <h2 className="text-xl font-extrabold text-cny-heading mb-4 flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full animate-pulse" style={{ background: "#CA8A04" }}></span>
                Active Raffles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeIds.map(id => <RaffleCard key={id} raffleId={id} />)}
              </div>
            </div>
          )}

          {/* Past Raffles */}
          {pastIds.length > 0 && (
            <div>
              <h2 className="text-xl font-extrabold text-cny-muted mb-4 flex items-center gap-2">
                Past Raffles ({pastIds.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastIds.map(id => <RaffleCard key={id} raffleId={id} compact />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RafflesPage;
