"use client";

import type { NextPage } from "next";
import Link from "next/link";
import { Lantern, Star, RedEnvelope, Ticket, Sparkle, Trophy, SlotMachine, SpinWheel, FireHorse } from "~~/components/icons/ACIcons";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center grow">
      {/* Hero */}
      <div className="w-full py-20 px-4 text-center relative overflow-hidden fh-hero ac-hero">
        {/* Floating decorations */}
        <div className="absolute top-8 left-8 opacity-40 animate-lantern-sway"><Lantern size={48} /></div>
        <div className="absolute top-16 right-12 opacity-40 animate-float" style={{ animationDelay: "1s" }}><Star size={40} /></div>
        <div className="absolute bottom-12 left-16 opacity-40 animate-float" style={{ animationDelay: "2s" }}><RedEnvelope size={40} /></div>
        <div className="absolute bottom-8 right-8 opacity-40 animate-lantern-sway" style={{ animationDelay: "0.5s" }}><Lantern size={48} /></div>

        <div className="animate-fade-in-up relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary-content mb-4 flex items-center justify-center gap-3">
            <SlotMachine size={56} /> BNB Lucky Draw 🐴🔥
          </h1>
          <p className="text-lg md:text-xl text-primary-content/70 max-w-2xl mx-auto font-semibold flex items-center justify-center gap-2">
            Fire Horse Fortune — a lucky DeFi raffle where prosperity awaits! <SpinWheel size={28} />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/raffles" className="fh-btn fh-btn-gold text-lg">
              <Ticket size={24} /> Browse Raffles
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="w-full max-w-5xl px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-fh-heading mb-4 flex items-center justify-center gap-2">
          How it Works <Sparkle size={36} />
        </h2>
        <p className="text-center text-fh-muted mb-12 text-lg">Three steps to fortune and prosperity!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FireHorse size={48} />,
              title: "AI Agents Create",
              desc: "Autonomous AI agents create and manage raffles through our x402 payment-gated API. No human intervention needed — just connect your wallet to buy tickets and win!",
              color: "#C41E3A",
            },
            {
              icon: <Ticket size={48} />,
              title: "Play",
              desc: "Buy tickets and watch the prize pool grow! The more participants, the bigger the fortune!",
              color: "#FFD700",
            },
            {
              icon: <Trophy size={48} />,
              title: "Win",
              desc: "When time's up, Aleph VRF picks a random winner automatically! Fair, verifiable, and trustless.",
              color: "#DAA520",
            },
          ].map((step, i) => (
            <div
              key={step.title}
              className="fh-bubble ac-bubble text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 0.15}s`, borderColor: step.color }}
            >
              <div className="mb-4 flex justify-center animate-gentle-bounce" style={{ animationDelay: `${i * 0.5}s` }}>{step.icon}</div>
              <h3 className="text-xl font-extrabold text-fh-heading mb-2">
                {step.title}
              </h3>
              <p className="text-fh-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
