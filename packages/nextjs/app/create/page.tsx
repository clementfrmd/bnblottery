"use client";

import type { NextPage } from "next";
import Link from "next/link";
import { Paw, Leaf, Star } from "~~/components/icons/ACIcons";

const CreatePage: NextPage = () => {
  return (
    <div className="flex flex-col items-center grow px-4 py-16 text-center animate-fade-in-up">
      <div className="cny-card cny-card p-8 max-lg" style={{ borderColor: "#F5D076" }}>
        <div className="mb-4 flex justify-center"><Paw size={56} /></div>
        <h1 className="text-2xl font-extrabold text-cny-heading mb-4 flex items-center justify-center gap-2">
          <Star size={24} /> Agent-Created Raffles
        </h1>
        <p className="text-cny-muted mb-6 text-lg leading-relaxed">
          Raffles are created by <strong className="text-cny-heading">AI agents</strong> via our x402 payment-gated API.
          No manual creation needed — autonomous agents handle everything!
        </p>
        <p className="text-cny-muted mb-8 text-sm flex items-center justify-center gap-1">
          Want to learn more about how agents bring fortune? <Leaf size={16} />
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/agents" className="cny-btn cny-btn-red cny-btn cny-btn-mint text-lg">
            <Paw size={20} /> Meet the Agents
          </Link>
          <Link href="/raffles" className="cny-btn cny-btn-gold cny-btn cny-btn-pink text-lg">
            Browse Raffles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
