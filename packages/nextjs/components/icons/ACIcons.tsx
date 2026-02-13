"use client";

import React from "react";

interface IconProps {
  size?: number;
  className?: string;
}

/* ─── 1. Lantern (replaces Leaf) ─── */
export const Lantern: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-lantern ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-lantern { animation: fh-sway 3s ease-in-out infinite; transform-origin: top center; }
      @keyframes fh-sway { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
    `}</style>
    <line x1="24" y1="2" x2="24" y2="8" stroke="#DAA520" strokeWidth="2" strokeLinecap="round"/>
    <rect x="20" y="6" width="8" height="4" rx="1" fill="#DAA520"/>
    <ellipse cx="24" cy="26" rx="12" ry="16" fill="#C41E3A" stroke="#8B0000" strokeWidth="1.5"/>
    <ellipse cx="24" cy="26" rx="8" ry="14" fill="#DC143C" opacity="0.6"/>
    <line x1="24" y1="12" x2="24" y2="40" stroke="#8B0000" strokeWidth="1" opacity="0.4"/>
    <ellipse cx="24" cy="26" rx="12" ry="4" fill="none" stroke="#8B0000" strokeWidth="0.8" opacity="0.3"/>
    <rect x="20" y="40" width="8" height="3" rx="1" fill="#DAA520"/>
    <line x1="24" y1="43" x2="24" y2="47" stroke="#DAA520" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="24" cy="24" rx="4" ry="3" fill="#FFD700" opacity="0.3"/>
  </svg>
);

// Keep Leaf as alias for compatibility
export const Leaf = Lantern;

/* ─── 2. Star (gold lucky star) ─── */
export const Star: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-star ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-star { animation: fh-twinkle 2s ease-in-out infinite; }
      @keyframes fh-twinkle { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.9); } }
    `}</style>
    <polygon points="24,4 29,18 44,18 32,28 36,42 24,34 12,42 16,28 4,18 19,18" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" strokeLinejoin="round"/>
    <polygon points="24,10 27,19 37,19 29,25 32,35 24,29 16,35 19,25 11,19 21,19" fill="#ffe082" opacity="0.6"/>
  </svg>
);

/* ─── 3. RedEnvelope (replaces Flower) ─── */
export const RedEnvelope: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-envelope ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-envelope { animation: fh-bob 2.5s ease-in-out infinite; }
      @keyframes fh-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
    `}</style>
    <rect x="10" y="6" width="28" height="36" rx="3" fill="#C41E3A" stroke="#8B0000" strokeWidth="1.5"/>
    <rect x="10" y="6" width="28" height="18" rx="3" fill="#DC143C"/>
    <circle cx="24" cy="24" r="8" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <text x="24" y="28" textAnchor="middle" fill="#C41E3A" fontSize="10" fontWeight="bold" fontFamily="serif">福</text>
    <path d="M18 6 L24 12 L30 6" fill="none" stroke="#8B0000" strokeWidth="1" opacity="0.3"/>
  </svg>
);

export const Flower = RedEnvelope;

/* ─── 4. Ticket (red/gold themed) ─── */
export const Ticket: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-ticket ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-ticket { animation: fh-wiggle 3s ease-in-out infinite; }
      @keyframes fh-wiggle { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
    `}</style>
    <rect x="4" y="12" width="40" height="24" rx="4" fill="#C41E3A" stroke="#8B0000" strokeWidth="1.5"/>
    <line x1="16" y1="12" x2="16" y2="36" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="32" cy="24" r="5" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <text x="31.5" y="26.5" textAnchor="middle" fill="#8B0000" fontSize="7" fontWeight="bold" fontFamily="Nunito, sans-serif">運</text>
    <rect x="7" y="18" width="6" height="2" rx="1" fill="#FFD700" opacity="0.4"/>
    <rect x="7" y="22" width="5" height="2" rx="1" fill="#FFD700" opacity="0.3"/>
    <rect x="7" y="26" width="6" height="2" rx="1" fill="#FFD700" opacity="0.4"/>
  </svg>
);

/* ─── 5. Trophy (gold) ─── */
export const Trophy: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-trophy ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-trophy { animation: fh-bounce 2s ease-in-out infinite; }
      @keyframes fh-bounce { 0%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } 60% { transform: translateY(-2px); } }
    `}</style>
    <path d="M16 8 H32 V24 C32 32 24 36 24 36 C24 36 16 32 16 24 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5"/>
    <path d="M16 12 H8 C8 12 6 12 6 16 C6 20 10 22 14 20" fill="none" stroke="#DAA520" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M32 12 H40 C40 12 42 12 42 16 C42 20 38 22 34 20" fill="none" stroke="#DAA520" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="20" y="36" width="8" height="4" rx="1" fill="#DAA520"/>
    <rect x="17" y="40" width="14" height="3" rx="1.5" fill="#8B0000"/>
    <polygon points="24,14 25.5,17 29,17.5 26.5,20 27,23.5 24,22 21,23.5 21.5,20 19,17.5 22.5,17" fill="#ffe082" opacity="0.8"/>
  </svg>
);

/* ─── 6. Horse (replaces House) ─── */
export const Horse: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-horse ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-horse { animation: fh-gallop 2s ease-in-out infinite; }
      @keyframes fh-gallop { 0%,100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-4px) rotate(-2deg); } 75% { transform: translateY(-2px) rotate(2deg); } }
    `}</style>
    <path d="M12 36 L16 24 L20 20 L24 18 L30 16 L34 14 L36 10 L38 8 L40 10 L38 14 L36 18 L34 22 L32 28 L30 36" fill="#C41E3A" stroke="#8B0000" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M36 10 L38 6 L40 8" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <circle cx="36" cy="14" r="1.5" fill="#1a0a0a"/>
    <path d="M16 24 L14 36" stroke="#8B0000" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 22 L20 36" stroke="#8B0000" strokeWidth="2" strokeLinecap="round"/>
    <path d="M30 22 L28 36" stroke="#8B0000" strokeWidth="2" strokeLinecap="round"/>
    <path d="M34 22 L36 36" stroke="#8B0000" strokeWidth="2" strokeLinecap="round"/>
    <path d="M38 8 C40 6 42 8 40 12" fill="none" stroke="#DC143C" strokeWidth="1.5"/>
    <path d="M12 36 L8 38" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="24" cy="40" rx="16" ry="2" fill="#FFD700" opacity="0.2"/>
  </svg>
);

export const House = Horse;

/* ─── 7. Firecracker (replaces Shovel) ─── */
export const Firecracker: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-firecracker ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-firecracker { animation: fh-shake 1.5s ease-in-out infinite; }
      @keyframes fh-shake { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
    `}</style>
    <rect x="18" y="14" width="12" height="28" rx="2" fill="#C41E3A" stroke="#8B0000" strokeWidth="1.5"/>
    <rect x="18" y="14" width="12" height="5" fill="#FFD700"/>
    <rect x="18" y="24" width="12" height="5" fill="#FFD700"/>
    <rect x="18" y="34" width="12" height="5" fill="#FFD700"/>
    <line x1="24" y1="14" x2="24" y2="8" stroke="#8B0000" strokeWidth="1.5"/>
    <circle cx="24" cy="6" r="3" fill="#FFA500" opacity="0.8"/>
    <circle cx="24" cy="5" r="2" fill="#FFD700"/>
    <line x1="20" y1="4" x2="18" y2="2" stroke="#FFA500" strokeWidth="1" strokeLinecap="round"/>
    <line x1="28" y1="4" x2="30" y2="2" stroke="#FFA500" strokeWidth="1" strokeLinecap="round"/>
    <line x1="24" y1="3" x2="24" y2="1" stroke="#FFD700" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const Shovel = Firecracker;

/* ─── 8. LuckyCoin (replaces Coin) ─── */
export const LuckyCoin: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-coin ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-coin { animation: fh-spin-coin 3s ease-in-out infinite; }
      @keyframes fh-spin-coin { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(0.7); } }
    `}</style>
    <circle cx="24" cy="24" r="18" fill="#FFD700" stroke="#DAA520" strokeWidth="2"/>
    <circle cx="24" cy="24" r="14" fill="none" stroke="#DAA520" strokeWidth="1" opacity="0.5"/>
    <rect x="20" y="20" width="8" height="8" rx="1" fill="none" stroke="#8B0000" strokeWidth="1.5"/>
    <circle cx="24" cy="24" r="2" fill="#8B0000" opacity="0.6"/>
  </svg>
);

export const Coin = LuckyCoin;

/* ─── 9. Clock ─── */
export const Clock: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-clock ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-clock { animation: fh-tick 1s steps(1) infinite; }
      .fh-clock-hand { animation: fh-clock-rotate 4s linear infinite; transform-origin: 24px 24px; }
      @keyframes fh-tick { 0%,50% { transform: scale(1); } 25% { transform: scale(1.02); } }
      @keyframes fh-clock-rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `}</style>
    <circle cx="24" cy="24" r="18" fill="#C41E3A" stroke="#8B0000" strokeWidth="2"/>
    <circle cx="24" cy="24" r="15" fill="#fffaf5"/>
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => (
      <line key={deg} x1="24" y1="11" x2="24" y2="13" stroke="#8B0000" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${deg} 24 24)`}/>
    ))}
    <line x1="24" y1="24" x2="24" y2="15" stroke="#1a0a0a" strokeWidth="2" strokeLinecap="round"/>
    <line x1="24" y1="24" x2="30" y2="24" stroke="#1a0a0a" strokeWidth="1.5" strokeLinecap="round" className="fh-clock-hand"/>
    <circle cx="24" cy="24" r="2" fill="#C41E3A"/>
  </svg>
);

/* ─── 10. Bag → RedBag ─── */
export const Bag: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-bag ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-bag { animation: fh-bob 2.8s ease-in-out infinite; }
    `}</style>
    <path d="M12 18 H36 L34 42 H14 Z" fill="#C41E3A" stroke="#8B0000" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M18 18 C18 10 24 6 24 6 C24 6 30 10 30 18" fill="none" stroke="#8B0000" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="24" cy="28" r="5" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <text x="24" y="31" textAnchor="middle" fill="#8B0000" fontSize="6" fontWeight="bold" fontFamily="serif">福</text>
  </svg>
);

/* ─── 11. Scroll (replaces Letter) ─── */
export const Scroll: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-scroll ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-scroll { animation: fh-float-scroll 3s ease-in-out infinite; }
      @keyframes fh-float-scroll { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-3px) rotate(2deg); } }
    `}</style>
    <rect x="10" y="10" width="28" height="28" rx="2" fill="#fffaf5" stroke="#DAA520" strokeWidth="2"/>
    <ellipse cx="10" cy="24" rx="3" ry="14" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <ellipse cx="38" cy="24" rx="3" ry="14" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <line x1="16" y1="18" x2="32" y2="18" stroke="#C41E3A" strokeWidth="1" opacity="0.4"/>
    <line x1="16" y1="22" x2="32" y2="22" stroke="#C41E3A" strokeWidth="1" opacity="0.4"/>
    <line x1="16" y1="26" x2="32" y2="26" stroke="#C41E3A" strokeWidth="1" opacity="0.4"/>
    <line x1="16" y1="30" x2="28" y2="30" stroke="#C41E3A" strokeWidth="1" opacity="0.4"/>
    <circle cx="38" cy="12" r="5" fill="#C41E3A"/>
    <text x="38" y="15" textAnchor="middle" fill="#FFD700" fontSize="7" fontWeight="bold">!</text>
  </svg>
);

export const Letter = Scroll;

/* ─── 12. Cart ─── */
export const Cart: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-cart ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-cart { animation: fh-roll 2s ease-in-out infinite; }
      @keyframes fh-roll { 0%,100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
    `}</style>
    <polyline points="6,10 12,10 18,34 38,34" fill="none" stroke="#8B0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="14,16 40,16 38,30 16,30" fill="#C41E3A" stroke="#8B0000" strokeWidth="1.5"/>
    <circle cx="20" cy="40" r="3" fill="#FFD700"/>
    <circle cx="34" cy="40" r="3" fill="#FFD700"/>
    <rect x="22" y="20" width="8" height="6" rx="1" fill="#FFD700" stroke="#DAA520" strokeWidth="0.5"/>
  </svg>
);

/* ─── 13. DragonHead (replaces Nook) ─── */
export const DragonHead: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-dragon ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-dragon { animation: fh-nod 3s ease-in-out infinite; }
      @keyframes fh-nod { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(3deg); } 75% { transform: rotate(-3deg); } }
    `}</style>
    <ellipse cx="24" cy="28" rx="16" ry="14" fill="#C41E3A"/>
    <ellipse cx="24" cy="28" rx="14" ry="12" fill="#DC143C"/>
    <path d="M12 16 L8 8 L14 14" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <path d="M36 16 L40 8 L34 14" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <ellipse cx="18" cy="24" rx="3.5" ry="3" fill="#FFD700"/>
    <ellipse cx="30" cy="24" rx="3.5" ry="3" fill="#FFD700"/>
    <circle cx="19" cy="24" r="1.8" fill="#1a0a0a"/>
    <circle cx="31" cy="24" r="1.8" fill="#1a0a0a"/>
    <circle cx="19.5" cy="23.5" r="0.6" fill="white"/>
    <circle cx="31.5" cy="23.5" r="0.6" fill="white"/>
    <ellipse cx="24" cy="32" rx="4" ry="2" fill="#8B0000"/>
    <path d="M20 34 Q24 38 28 34" fill="none" stroke="#FFD700" strokeWidth="1"/>
  </svg>
);

export const Nook = DragonHead;

/* ─── 14. BambooTree (replaces IslandTree) ─── */
export const BambooTree: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-bamboo ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-bamboo { animation: fh-sway 4s ease-in-out infinite; transform-origin: bottom center; }
    `}</style>
    <rect x="22" y="8" width="4" height="34" rx="2" fill="#00A86B" stroke="#006B3F" strokeWidth="1"/>
    <line x1="22" y1="16" x2="26" y2="16" stroke="#006B3F" strokeWidth="1.5"/>
    <line x1="22" y1="24" x2="26" y2="24" stroke="#006B3F" strokeWidth="1.5"/>
    <line x1="22" y1="32" x2="26" y2="32" stroke="#006B3F" strokeWidth="1.5"/>
    <path d="M26 14 Q34 10 36 6" fill="none" stroke="#00A86B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M26 22 Q32 20 38 16" fill="none" stroke="#00A86B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 18 Q14 14 10 12" fill="none" stroke="#00A86B" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="24" cy="44" rx="10" ry="2" fill="#00A86B" opacity="0.2"/>
  </svg>
);

export const IslandTree = BambooTree;

/* ─── 15. Sparkle (fire sparkle) ─── */
export const Sparkle: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-sparkle ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-sparkle { animation: fh-sparkle-pulse 1.5s ease-in-out infinite; }
      @keyframes fh-sparkle-pulse { 0%,100% { opacity: 1; transform: scale(1) rotate(0deg); } 50% { opacity: 0.6; transform: scale(0.85) rotate(15deg); } }
    `}</style>
    <polygon points="24,2 27,18 44,20 29,28 32,46 24,32 16,46 19,28 4,20 21,18" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <polygon points="24,8 26,18 36,20 28,26 30,38 24,30 18,38 20,26 12,20 22,18" fill="#FFA500" opacity="0.5"/>
    <circle cx="24" cy="22" r="3" fill="white" opacity="0.7"/>
  </svg>
);

/* ─── 16. FireHorse (replaces Paw) ─── */
export const FireHorse: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-firehorse ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-firehorse { animation: fh-flame 2s ease-in-out infinite; }
      @keyframes fh-flame { 0%,100% { transform: scale(1); filter: drop-shadow(0 0 2px #FFD700); } 50% { transform: scale(1.05); filter: drop-shadow(0 0 6px #FFA500); } }
    `}</style>
    <path d="M20 40 L22 30 L18 26 L20 20 L24 16 L28 12 L30 8 L32 12 L34 16 L30 20 L32 26 L28 30 L30 40Z" fill="#C41E3A" stroke="#8B0000" strokeWidth="1.5"/>
    <path d="M24 16 L26 10 L28 14 L30 8 L28 16" fill="#FFD700" opacity="0.7"/>
    <path d="M22 30 L24 22 L26 30" fill="#FFA500" opacity="0.5"/>
    <circle cx="26" cy="20" r="1.5" fill="#1a0a0a"/>
    <ellipse cx="25" cy="38" rx="6" ry="2" fill="#FFD700" opacity="0.3"/>
  </svg>
);

export const Paw = FireHorse;

/* ─── 17. Cloud (lucky cloud) ─── */
export const Cloud: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-cloud ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-cloud { animation: fh-drift 4s ease-in-out infinite; }
      @keyframes fh-drift { 0%,100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
    `}</style>
    <ellipse cx="24" cy="28" rx="16" ry="10" fill="#DC143C" opacity="0.3"/>
    <circle cx="16" cy="22" r="10" fill="#C41E3A" opacity="0.4"/>
    <circle cx="30" cy="20" r="12" fill="#C41E3A" opacity="0.4"/>
    <circle cx="22" cy="16" r="8" fill="#FFD700" opacity="0.2"/>
    <ellipse cx="24" cy="28" rx="14" ry="8" fill="white" opacity="0.1"/>
  </svg>
);

/* ─── 18. CrystalBall (fortune orb) ─── */
export const CrystalBall: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-crystal ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-crystal { animation: fh-glow 2.5s ease-in-out infinite; }
      @keyframes fh-glow { 0%,100% { filter: drop-shadow(0 0 2px #FFD700); } 50% { filter: drop-shadow(0 0 8px #FFD700); } }
    `}</style>
    <rect x="16" y="38" width="16" height="4" rx="2" fill="#8B0000"/>
    <ellipse cx="24" cy="38" rx="10" ry="3" fill="#DAA520" opacity="0.5"/>
    <circle cx="24" cy="24" r="16" fill="#C41E3A" opacity="0.3"/>
    <circle cx="24" cy="24" r="14" fill="url(#fhCrystalGrad)"/>
    <defs>
      <radialGradient id="fhCrystalGrad" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6"/>
        <stop offset="50%" stopColor="#C41E3A" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#8B0000"/>
      </radialGradient>
    </defs>
    <ellipse cx="19" cy="19" rx="4" ry="3" fill="white" opacity="0.4" transform="rotate(-20 19 19)"/>
    <circle cx="28" cy="28" r="2" fill="#FFD700" opacity="0.4"/>
    <circle cx="20" cy="30" r="1.5" fill="#FFA500" opacity="0.4"/>
  </svg>
);

/* ─── 19. SlotMachine (red/gold) ─── */
export const SlotMachine: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-slot ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-slot { animation: fh-slot-wiggle 2s ease-in-out infinite; transform-origin: center; }
      @keyframes fh-slot-wiggle { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } }
    `}</style>
    <rect x="6" y="8" width="36" height="32" rx="4" fill="#C41E3A" stroke="#8B0000" strokeWidth="1.5"/>
    <rect x="8" y="6" width="32" height="6" rx="3" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <rect x="10" y="16" width="28" height="14" rx="2" fill="#fffaf5" stroke="#DAA520" strokeWidth="1"/>
    <line x1="19.3" y1="16" x2="19.3" y2="30" stroke="#DAA520" strokeWidth="0.8"/>
    <line x1="28.7" y1="16" x2="28.7" y2="30" stroke="#DAA520" strokeWidth="0.8"/>
    <text x="14.5" y="26" textAnchor="middle" fontSize="10" fill="#FFD700">★</text>
    <text x="24" y="26" textAnchor="middle" fontSize="10" fill="#C41E3A">♦</text>
    <text x="33.5" y="26" textAnchor="middle" fontSize="10" fill="#FFD700">★</text>
    <rect x="42" y="14" width="3" height="16" rx="1.5" fill="#DAA520"/>
    <circle cx="43.5" cy="14" r="3" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <rect x="10" y="34" width="28" height="4" rx="2" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
    <circle cx="14" cy="9" r="1" fill="#C41E3A"/>
    <circle cx="24" cy="8.5" r="1.2" fill="#C41E3A"/>
    <circle cx="34" cy="9" r="1" fill="#C41E3A"/>
  </svg>
);

/* ─── 20. SpinWheel (red/gold) ─── */
export const SpinWheel: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block fh-icon-wheel ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .fh-icon-wheel .wheel-inner { animation: fh-spin 4s linear infinite; transform-origin: 24px 24px; }
      @keyframes fh-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `}</style>
    <circle cx="24" cy="24" r="20" fill="none" stroke="#DAA520" strokeWidth="2"/>
    <g className="wheel-inner">
      <path d="M24 4 L24 24 L40.5 11.5Z" fill="#C41E3A"/>
      <path d="M24 4 L24 24 L7.5 11.5Z" fill="#FFD700"/>
      <path d="M44 24 L24 24 L36.5 7.5Z" fill="#DC143C"/>
      <path d="M44 24 L24 24 L36.5 40.5Z" fill="#FFA500"/>
      <path d="M24 44 L24 24 L40.5 36.5Z" fill="#FFD700"/>
      <path d="M24 44 L24 24 L7.5 36.5Z" fill="#C41E3A"/>
      <path d="M4 24 L24 24 L11.5 40.5Z" fill="#DC143C"/>
      <path d="M4 24 L24 24 L11.5 7.5Z" fill="#FFA500"/>
    </g>
    <circle cx="24" cy="24" r="4" fill="#fffaf5" stroke="#DAA520" strokeWidth="1.5"/>
    <polygon points="24,2 21,8 27,8" fill="#8B0000"/>
  </svg>
);
