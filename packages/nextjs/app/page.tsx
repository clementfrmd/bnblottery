"use client";

import type { NextPage } from "next";
import Link from "next/link";
import { Leaf, SlotMachine, Coin, Paw, Sparkle, Trophy } from "~~/components/icons/ACIcons";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center grow">
      {/* Hero */}
      <div className="w-full py-20 px-4 text-center relative overflow-hidden ac-hero">
        <div className="absolute top-8 left-8 opacity-30 animate-float"><Leaf size={48} /></div>
        <div className="absolute top-16 right-12 opacity-30 animate-float" style={{ animationDelay: "1s" }}><Sparkle size={40} /></div>
        <div className="absolute bottom-12 left-16 opacity-30 animate-float" style={{ animationDelay: "2s" }}><Coin size={36} /></div>
        <div className="absolute bottom-8 right-8 opacity-30 animate-float" style={{ animationDelay: "0.5s" }}><Paw size={40} /></div>

        <div className="animate-fade-in-up relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary-content mb-4 flex items-center justify-center gap-3">
            <SlotMachine size={56} /> BNB Lucky Draw
          </h1>
          <p className="text-lg md:text-xl text-primary-content/70 max-w-2xl mx-auto font-semibold">
            A cozy island raffle on the BNB Chain — buy tickets, win prizes, all verified on-chain!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/raffles" className="ac-btn ac-btn-mint text-lg">
              <Coin size={24} /> Browse Raffles
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="w-full max-w-5xl px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-ac-heading mb-4 flex items-center justify-center gap-2">
          How it Works <Sparkle size={36} />
        </h2>
        <p className="text-center text-ac-muted mb-12 text-lg">Just three simple steps to join the fun!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Paw size={48} />,
              title: "AI Agents Create",
              desc: "Autonomous AI agents create and manage raffles through our x402 payment-gated API. No human intervention needed — just connect your wallet to buy tickets and win!",
            },
            {
              icon: <Coin size={48} />,
              title: "Play",
              desc: "Buy tickets and watch the prize pool grow! The more participants, the bigger the reward!",
            },
            {
              icon: <Trophy size={48} />,
              title: "Win",
              desc: "When time's up, Aleph VRF picks a random winner automatically! Fair, verifiable, and trustless.",
            },
          ].map((step, i) => (
            <div
              key={step.title}
              className="ac-bubble text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="mb-4 flex justify-center animate-gentle-bounce" style={{ animationDelay: `${i * 0.5}s` }}>{step.icon}</div>
              <h3 className="text-xl font-extrabold text-ac-heading mb-2">
                {step.title}
              </h3>
              <p className="text-ac-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
