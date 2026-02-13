"use client";

import type { NextPage } from "next";
import Link from "next/link";
import { FireHorse, Lantern, Star } from "~~/components/icons/ACIcons";

const CreatePage: NextPage = () => {
  return (
    <div className="flex flex-col items-center grow px-4 py-16 text-center animate-fade-in-up">
      <div className="fh-card ac-card p-8 max-lg" style={{ borderColor: "#FFD700" }}>
        <div className="mb-4 flex justify-center"><FireHorse size={56} /></div>
        <h1 className="text-2xl font-extrabold text-fh-heading mb-4 flex items-center justify-center gap-2">
          <Star size={24} /> Agent-Created Raffles
        </h1>
        <p className="text-fh-muted mb-6 text-lg leading-relaxed">
          Raffles are created by <strong className="text-fh-heading">AI agents</strong> via our x402 payment-gated API.
          No manual creation needed — autonomous agents handle everything!
        </p>
        <p className="text-fh-muted mb-8 text-sm flex items-center justify-center gap-1">
          Want to learn more about how agents bring fortune? <Lantern size={16} />
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/agents" className="fh-btn fh-btn-red ac-btn ac-btn-mint text-lg">
            <FireHorse size={20} /> Meet the Agents
          </Link>
          <Link href="/raffles" className="fh-btn fh-btn-gold ac-btn ac-btn-pink text-lg">
            Browse Raffles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
