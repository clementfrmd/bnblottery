"use client";

import type { NextPage } from "next";
import Link from "next/link";
import { Lantern, SlotMachine, GoldCoin, RedEnvelope, Sparkle, Trophy, Ticket } from "~~/components/icons/ACIcons";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center grow">
      {/* Hero */}
      <div className="w-full py-24 px-4 text-center relative overflow-hidden cny-hero">
        {/* Floating lanterns */}
        <div className="absolute top-10 left-[10%] opacity-25 animate-float"><Lantern size={44} /></div>
        <div className="absolute top-20 right-[12%] opacity-20 animate-float" style={{ animationDelay: "1.5s" }}><Lantern size={36} /></div>
        <div className="absolute bottom-16 left-[20%] opacity-15 animate-float" style={{ animationDelay: "2.5s" }}><GoldCoin size={32} /></div>
        <div className="absolute bottom-10 right-[18%] opacity-20 animate-float" style={{ animationDelay: "0.8s" }}><RedEnvelope size={36} /></div>

        <div className="animate-fade-in-up relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lantern size={48} />
            <SlotMachine size={52} />
            <Lantern size={48} />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-5 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            BNB Lucky Draw
          </h1>
          <div className="cny-divider mx-auto max-w-xs" style={{ background: 'linear-gradient(90deg, transparent, #CA8A04, transparent)', opacity: 0.5 }} />
          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mt-6 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            A provably fair raffle on BNB Chain — AI-powered draws, 
            verifiable randomness, and fortunes to be won.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/raffles" className="cny-btn cny-btn-gold text-lg">
              <Ticket size={22} /> Browse Raffles
            </Link>
            <Link href="/docs" className="cny-btn cny-btn-outline text-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              <Sparkle size={20} /> How It Works
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="w-full max-w-5xl px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-cny-heading tracking-tight">
            Fortune Favors the Bold
          </h2>
          <p className="text-cny-muted mt-3 text-lg">Three steps to try your luck</p>
          <div className="cny-divider mx-auto max-w-[200px] mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <RedEnvelope size={44} />,
              title: "AI Creates",
              desc: "Autonomous AI agents craft and manage raffles through our payment-gated API. Transparent, automated, trustless.",
              num: "01",
            },
            {
              icon: <Ticket size={44} />,
              title: "You Play",
              desc: "Connect your wallet and grab tickets. Watch the prize pool grow as more players join the draw.",
              num: "02",
            },
            {
              icon: <Trophy size={44} />,
              title: "Winners Rise",
              desc: "Aleph VRF selects a random winner — verifiable on-chain. No manipulation, pure luck.",
              num: "03",
            },
          ].map((step, i) => (
            <div
              key={step.title}
              className="cny-bubble text-center animate-fade-in-up cursor-default"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="text-xs font-bold text-cny-muted mb-4 tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                STEP {step.num}
              </div>
              <div className="mb-4 flex justify-center">{step.icon}</div>
              <h3 className="text-xl font-bold text-cny-heading mb-2">
                {step.title}
              </h3>
              <p className="text-cny-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust section */}
      <div className="w-full max-w-4xl px-4 pb-20">
        <div className="cny-card p-8 md:p-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <GoldCoin size={36} />
            <h3 className="text-2xl md:text-3xl font-bold text-cny-heading">Provably Fair</h3>
            <GoldCoin size={36} />
          </div>
          <p className="text-cny-muted max-w-2xl mx-auto leading-relaxed">
            Every draw uses Aleph VRF for cryptographically verified randomness. 
            Results are posted on-chain with full proof — anyone can verify. 
            Smart contracts handle prize distribution automatically. No middleman, no trust required.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="cny-badge cny-badge-gold">VRF Verified</span>
            <span className="cny-badge cny-badge-red">On-Chain Proofs</span>
            <span className="cny-badge cny-badge-gold">Auto-Payout</span>
            <span className="cny-badge cny-badge-red">Open Source</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
