"use client";

import { Letter, Ticket, Leaf, Star, Clock, Trophy, Coin, CrystalBall, Shovel } from "~~/components/icons/ACIcons";

export default function DocsPage() {
  return (
    <div className="min-h-screen px-4 py-12" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-2 flex items-center justify-center gap-2" style={{ color: "#CA8A04" }}>
            <Letter size={36} /> Documentation
          </h1>
          <p style={{ color: "#CA8A04" }}>Everything you need to know about BNB Lucky Draw</p>
        </div>

        {/* Overview */}
        <section className="cny-card cny-card p-6">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#CA8A04" }}><Leaf size={24} /> Overview</h2>
          <p style={{ color: "#CA8A04" }} className="leading-relaxed">
            BNB Lucky Draw is a decentralized raffle platform built on BNB Chain. It enables anyone to create
            provably fair raffles using ERC-20 tokens, with winner selection powered by Aleph Cloud VRF (Verifiable
            Random Function) for cryptographic randomness. AI agents can interact with the platform via x402
            micropayment-gated API endpoints.
          </p>
        </section>

        {/* Smart Contract */}
        <section className="cny-card cny-card p-6">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#CA8A04" }}><Shovel size={24} /> Smart Contract</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: "Contract:", value: "AgentRaffleV2" },
              { label: "Address:", value: "0x5904CC468E9bE48683Ae9A09d323157d648e36c6" },
              { label: "Chain:", value: "BNB Smart Chain (Chain ID: 56)", mono: false },
              { label: "RPC:", value: "https://bsc-dataseed.binance.org" },
            ].map(item => (
              <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold w-32 shrink-0" style={{ color: "#CA8A04" }}>{item.label}</span>
                {item.mono === false ? (
                  <span style={{ color: "#CA8A04" }}>{item.value}</span>
                ) : (
                  <code className="break-all px-3 py-1 rounded-lg font-mono text-xs" style={{ background: "#ffe8d6", color: "#CA8A04" }}>{item.value}</code>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* How Raffles Work */}
        <section className="cny-card cny-card p-6">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#CA8A04" }}><Ticket size={24} /> How Raffles Work</h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#CA8A04" }}>
            {[
              { icon: <Shovel size={18} />, title: "1. Creation", text: "AI agents create raffles via the x402 payment-gated API, specifying a payment token, ticket price, maximum number of tickets, and duration. The raffle is deployed on-chain and immediately begins accepting ticket purchases." },
              { icon: <Ticket size={18} />, title: "2. Ticket Purchase", text: "Participants approve the raffle contract to spend their tokens, then purchase one or more tickets. Each ticket purchase transfers the ticket price to the contract, growing the prize pool." },
              { icon: <CrystalBall size={18} />, title: "3. Winner Selection", text: "After the raffle duration expires, the draw can be triggered. Aleph Cloud VRF provides a verifiable random number to select the winning ticket. The process is fully transparent and auditable on-chain." },
              { icon: <Trophy size={18} />, title: "4. Prize Distribution", text: "The prize pool is automatically distributed according to the fee structure. No manual claim is required." },
            ].map(step => (
              <div key={step.title}>
                <h3 className="font-bold mb-1 flex items-center gap-1" style={{ color: "#CA8A04" }}>{step.icon} {step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fee Structure */}
        <section className="cny-card cny-card p-6">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#CA8A04" }}><Star size={24} /> Fee Structure</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #CA8A0420, #CA8A0440)" }}>
              <div className="text-3xl font-extrabold" style={{ color: "#CA8A04" }}>95%</div>
              <div className="text-sm mt-1 flex items-center justify-center gap-1" style={{ color: "#CA8A04" }}><Trophy size={14} /> Winner</div>
            </div>
            <div className="text-center p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #CA8A0420, #CA8A0440)" }}>
              <div className="text-3xl font-extrabold" style={{ color: "#CA8A04" }}>3%</div>
              <div className="text-sm mt-1" style={{ color: "#CA8A04" }}>Platform</div>
            </div>
            <div className="text-center p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #00A86B20, #00A86B40)" }}>
              <div className="text-3xl font-extrabold" style={{ color: "#00A86B" }}>2%</div>
              <div className="text-sm mt-1" style={{ color: "#CA8A04" }}>Organizer</div>
            </div>
          </div>
        </section>

        {/* Supported Tokens */}
        <section className="cny-card cny-card p-6">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#CA8A04" }}><Coin size={24} /> Supported Tokens</h2>
          <div className="space-y-3">
            {[
              { name: "BUSD", address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", decimals: 18 },
              { name: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
              { name: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 18 },
            ].map((token) => (
              <div key={token.name} className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm">
                <span className="font-bold w-28 shrink-0 flex items-center gap-1" style={{ color: "#CA8A04" }}><Coin size={14} /> {token.name}</span>
                <code className="break-all px-3 py-1 rounded-lg font-mono text-xs" style={{ background: "#ffe8d6", color: "#CA8A04" }}>{token.address}</code>
                <span className="text-xs ml-auto" style={{ color: "#CA8A04", opacity: 0.6 }}>{token.decimals} decimals</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: "#CA8A04", opacity: 0.6 }}>These are tokens on BNB Smart Chain mainnet.</p>
        </section>

        {/* VRF Randomness */}
        <section className="cny-card cny-card p-6">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#CA8A04" }}><CrystalBall size={24} /> VRF Randomness</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#CA8A04" }}>
            BNB Lucky Draw uses <strong style={{ color: "#CA8A04" }}>Aleph Cloud VRF</strong> (Verifiable Random Function)
            for winner selection. VRF generates cryptographically secure random numbers with on-chain proof of
            correctness, ensuring that no party - including the platform operators - can predict or manipulate the
            outcome. Each draw produces a VRF hash that can be independently verified.
          </p>
        </section>

        {/* Key Functions */}
        <section className="cny-card cny-card p-6">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#CA8A04" }}><Clock size={24} /> Contract Functions</h2>
          <div className="space-y-4 text-sm">
            {[
              { fn: "createRaffle(address token, uint256 price, uint256 maxTickets, uint256 duration)", desc: "Creates a new raffle with the specified parameters." },
              { fn: "purchaseTickets(uint256 raffleId, uint256 count)", desc: "Purchases tickets for a raffle. Requires prior token approval." },
              { fn: "drawWinner(uint256 raffleId)", desc: "Triggers VRF-based winner selection. Only callable after raffle ends." },
              { fn: "getRaffle(uint256 raffleId)", desc: "Returns full raffle details including status, participants, and prize pool." },
              { fn: "getParticipantTickets(uint256 raffleId, address participant)", desc: "Returns the number of tickets a participant holds." },
            ].map((item) => (
              <div key={item.fn}>
                <code className="text-xs px-3 py-1.5 rounded-lg block font-mono break-all" style={{ background: "#ffe8d6", color: "#CA8A04" }}>{item.fn}</code>
                <p className="mt-1 ml-1" style={{ color: "#CA8A04" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
