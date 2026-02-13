import React from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { AlephLogo } from "~~/components/logos/AlephLogo";
import { X402Logo } from "~~/components/logos/X402Logo";
import { OpenClawLogo } from "~~/components/logos/OpenClawLogo";

export const Footer = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {isLocalNetwork && (
              <>
                <Faucet />
                <Link href="/blockexplorer" passHref className="btn btn-sm font-normal gap-1 rounded-full"
                  style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)", color: "#4a3000", border: "none" }}>
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Block Explorer</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col items-center gap-4 py-6">
          {/* Built with section */}
          <div className="flex flex-wrap justify-center items-center gap-3">
            <a href="https://www.bnbchain.org" target="_blank" rel="noreferrer"
              className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              style={{ background: "linear-gradient(135deg, #F0B90B, #FFD700)", color: "#4a3000" }}>
              <span style={{ fontSize: "14px" }}>⛓️</span> Built on BNB Chain
            </a>
            <a href="https://aleph.cloud" target="_blank" rel="noreferrer"
              className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              style={{ background: "linear-gradient(135deg, #FFD700, #DAA520)", color: "#4a3000" }}>
              <AlephLogo size={16} /> Aleph VRF
            </a>
            <a href="https://www.x402.org" target="_blank" rel="noreferrer"
              className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              style={{ background: "linear-gradient(135deg, #D4A843, #F5D076)", color: "#4a3b1e" }}>
              <X402Logo size={16} /> x402 Payments
            </a>
          </div>
          <div className="flex justify-center items-center gap-2 text-sm" style={{ color: "#DAA520" }}>
            <a
              href="https://openclaw.ai"
              target="_blank"
              rel="noreferrer"
              className="font-bold hover:opacity-80 transition-opacity flex items-center gap-1.5"
              style={{ color: "#D4A843" }}
            >
              Powered by OpenClaw <OpenClawLogo size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
