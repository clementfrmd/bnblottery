"use client";

import React from "react";

interface IconProps {
  size?: number;
  className?: string;
}

/* ─── Lantern ─── */
export const Lantern: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <line x1="24" y1="2" x2="24" y2="10" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round"/>
    <rect x="20" y="8" width="8" height="3" rx="1" fill="#CA8A04"/>
    <ellipse cx="24" cy="26" rx="11" ry="15" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.5"/>
    <ellipse cx="24" cy="26" rx="7" ry="13" fill="#DC2626" opacity="0.5"/>
    <line x1="24" y1="14" x2="24" y2="38" stroke="#991B1B" strokeWidth="0.8" opacity="0.3"/>
    <rect x="20" y="39" width="8" height="2.5" rx="1" fill="#CA8A04"/>
    <line x1="22" y1="41.5" x2="22" y2="46" stroke="#CA8A04" strokeWidth="1" strokeLinecap="round"/>
    <line x1="26" y1="41.5" x2="26" y2="45" stroke="#CA8A04" strokeWidth="1" strokeLinecap="round"/>
    <ellipse cx="24" cy="23" rx="3" ry="2" fill="#EAB308" opacity="0.25"/>
  </svg>
);

export const Leaf = Lantern;

/* ─── GoldCoin ─── */
export const GoldCoin: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" fill="#CA8A04" stroke="#A16207" strokeWidth="2"/>
    <circle cx="24" cy="24" r="14" fill="none" stroke="#EAB308" strokeWidth="1" opacity="0.5"/>
    <rect x="20" y="20" width="8" height="8" rx="1" fill="none" stroke="#7F1D1D" strokeWidth="1.5" transform="rotate(45 24 24)"/>
    <circle cx="24" cy="24" r="2" fill="#A16207" opacity="0.5"/>
    <ellipse cx="20" cy="20" rx="2" ry="1.5" fill="#EAB308" opacity="0.3" transform="rotate(-20 20 20)"/>
  </svg>
);

export const Coin = GoldCoin;

/* ─── RedEnvelope ─── */
export const RedEnvelope: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="6" width="28" height="36" rx="3" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.5"/>
    <rect x="10" y="6" width="28" height="16" rx="3" fill="#DC2626"/>
    <path d="M18 6 L24 12 L30 6" fill="none" stroke="#991B1B" strokeWidth="0.8" opacity="0.3"/>
    <circle cx="24" cy="24" r="7" fill="#CA8A04" stroke="#A16207" strokeWidth="1"/>
    <text x="24" y="27.5" textAnchor="middle" fill="#7F1D1D" fontSize="9" fontWeight="bold" fontFamily="serif">福</text>
  </svg>
);

export const Flower = RedEnvelope;

/* ─── Ticket ─── */
export const Ticket: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="12" width="40" height="24" rx="4" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.5"/>
    <line x1="16" y1="12" x2="16" y2="36" stroke="#CA8A04" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="32" cy="24" r="5" fill="#CA8A04" stroke="#A16207" strokeWidth="1"/>
    <text x="32" y="27" textAnchor="middle" fill="#7F1D1D" fontSize="7" fontWeight="bold" fontFamily="serif">運</text>
    <rect x="7" y="18" width="6" height="1.5" rx="0.75" fill="#CA8A04" opacity="0.3"/>
    <rect x="7" y="22" width="5" height="1.5" rx="0.75" fill="#CA8A04" opacity="0.25"/>
    <rect x="7" y="26" width="6" height="1.5" rx="0.75" fill="#CA8A04" opacity="0.3"/>
  </svg>
);

/* ─── Trophy ─── */
export const Trophy: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8 H32 V24 C32 32 24 36 24 36 C24 36 16 32 16 24 Z" fill="#CA8A04" stroke="#A16207" strokeWidth="1.5"/>
    <path d="M16 12 H8 C8 12 6 12 6 16 C6 20 10 22 14 20" fill="none" stroke="#A16207" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M32 12 H40 C40 12 42 12 42 16 C42 20 38 22 34 20" fill="none" stroke="#A16207" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="20" y="36" width="8" height="4" rx="1" fill="#A16207"/>
    <rect x="17" y="40" width="14" height="3" rx="1.5" fill="#991B1B"/>
    <polygon points="24,14 25.5,17 29,17.5 26.5,20 27,23.5 24,22 21,23.5 21.5,20 19,17.5 22.5,17" fill="#EAB308" opacity="0.7"/>
  </svg>
);

/* ─── House (Temple) ─── */
export const House: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 22 L24 6 L42 22" fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 22 L24 10 L38 22" fill="#B91C1C"/>
    <rect x="12" y="22" width="24" height="20" fill="#DC2626" stroke="#991B1B" strokeWidth="1"/>
    <rect x="20" y="28" width="8" height="14" rx="1" fill="#CA8A04"/>
    <circle cx="24" cy="35" r="1" fill="#7F1D1D"/>
    <rect x="14" y="26" width="5" height="5" rx="0.5" fill="#CA8A04" opacity="0.4"/>
    <rect x="29" y="26" width="5" height="5" rx="0.5" fill="#CA8A04" opacity="0.4"/>
  </svg>
);

/* ─── Sparkle ─── */
export const Sparkle: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4 L27 20 L44 24 L27 28 L24 44 L21 28 L4 24 L21 20 Z" fill="#CA8A04" stroke="#A16207" strokeWidth="1"/>
    <path d="M24 12 L25.5 20 L34 24 L25.5 28 L24 36 L22.5 28 L14 24 L22.5 20 Z" fill="#EAB308" opacity="0.4"/>
    <circle cx="24" cy="24" r="2" fill="#FEFCE8" opacity="0.6"/>
  </svg>
);

/* ─── Paw (FireDragon) ─── */
export const Paw: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="28" rx="14" ry="12" fill="#B91C1C"/>
    <ellipse cx="24" cy="28" rx="12" ry="10" fill="#DC2626"/>
    <path d="M14 18 L10 10 L16 16" fill="#CA8A04" stroke="#A16207" strokeWidth="0.8"/>
    <path d="M34 18 L38 10 L32 16" fill="#CA8A04" stroke="#A16207" strokeWidth="0.8"/>
    <ellipse cx="19" cy="25" rx="3" ry="2.5" fill="#CA8A04"/>
    <ellipse cx="29" cy="25" rx="3" ry="2.5" fill="#CA8A04"/>
    <circle cx="19.5" cy="25" r="1.5" fill="#1C1917"/>
    <circle cx="29.5" cy="25" r="1.5" fill="#1C1917"/>
    <circle cx="20" cy="24.5" r="0.5" fill="white"/>
    <circle cx="30" cy="24.5" r="0.5" fill="white"/>
    <ellipse cx="24" cy="32" rx="3.5" ry="1.5" fill="#991B1B"/>
  </svg>
);

/* ─── Star ─── */
export const Star: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <polygon points="24,4 29,18 44,18 32,28 36,42 24,34 12,42 16,28 4,18 19,18" fill="#CA8A04" stroke="#A16207" strokeWidth="1.5" strokeLinejoin="round"/>
    <polygon points="24,10 27,19 37,19 29,25 32,35 24,29 16,35 19,25 11,19 21,19" fill="#EAB308" opacity="0.5"/>
  </svg>
);

/* ─── Clock ─── */
export const Clock: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" fill="#B91C1C" stroke="#991B1B" strokeWidth="2"/>
    <circle cx="24" cy="24" r="15" fill="#FAFAF9"/>
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => (
      <line key={deg} x1="24" y1="11" x2="24" y2="13" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${deg} 24 24)`}/>
    ))}
    <line x1="24" y1="24" x2="24" y2="15" stroke="#1C1917" strokeWidth="2" strokeLinecap="round"/>
    <line x1="24" y1="24" x2="30" y2="24" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="2" fill="#B91C1C"/>
  </svg>
);

/* ─── Bag ─── */
export const Bag: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 18 H36 L34 42 H14 Z" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M18 18 C18 10 24 6 24 6 C24 6 30 10 30 18" fill="none" stroke="#991B1B" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="24" cy="28" r="5" fill="#CA8A04" stroke="#A16207" strokeWidth="1"/>
    <text x="24" y="31" textAnchor="middle" fill="#7F1D1D" fontSize="6" fontWeight="bold" fontFamily="serif">福</text>
  </svg>
);

/* ─── Letter (Scroll) ─── */
export const Letter: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="28" height="28" rx="2" fill="#FAFAF9" stroke="#CA8A04" strokeWidth="1.5"/>
    <ellipse cx="10" cy="24" rx="3" ry="14" fill="#CA8A04" stroke="#A16207" strokeWidth="0.8"/>
    <ellipse cx="38" cy="24" rx="3" ry="14" fill="#CA8A04" stroke="#A16207" strokeWidth="0.8"/>
    <line x1="16" y1="18" x2="32" y2="18" stroke="#B91C1C" strokeWidth="0.8" opacity="0.3"/>
    <line x1="16" y1="22" x2="32" y2="22" stroke="#B91C1C" strokeWidth="0.8" opacity="0.3"/>
    <line x1="16" y1="26" x2="32" y2="26" stroke="#B91C1C" strokeWidth="0.8" opacity="0.3"/>
    <line x1="16" y1="30" x2="28" y2="30" stroke="#B91C1C" strokeWidth="0.8" opacity="0.3"/>
  </svg>
);

/* ─── Cart ─── */
export const Cart: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <polyline points="6,10 12,10 18,34 38,34" fill="none" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="14,16 40,16 38,30 16,30" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.5"/>
    <circle cx="20" cy="40" r="3" fill="#CA8A04"/>
    <circle cx="34" cy="40" r="3" fill="#CA8A04"/>
    <rect x="22" y="20" width="8" height="6" rx="1" fill="#CA8A04" stroke="#A16207" strokeWidth="0.5"/>
  </svg>
);

/* ─── Nook (Dragon) ─── */
export const Nook: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="28" rx="16" ry="14" fill="#B91C1C"/>
    <ellipse cx="24" cy="28" rx="14" ry="12" fill="#DC2626"/>
    <path d="M12 16 L8 8 L14 14" fill="#CA8A04"/>
    <path d="M36 16 L40 8 L34 14" fill="#CA8A04"/>
    <ellipse cx="18" cy="24" rx="3.5" ry="3" fill="#CA8A04"/>
    <ellipse cx="30" cy="24" rx="3.5" ry="3" fill="#CA8A04"/>
    <circle cx="19" cy="24" r="1.8" fill="#1C1917"/>
    <circle cx="31" cy="24" r="1.8" fill="#1C1917"/>
    <circle cx="19.5" cy="23.5" r="0.6" fill="white"/>
    <circle cx="31.5" cy="23.5" r="0.6" fill="white"/>
    <ellipse cx="24" cy="32" rx="4" ry="2" fill="#991B1B"/>
  </svg>
);

/* ─── IslandTree (Bamboo) ─── */
export const IslandTree: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <rect x="22" y="8" width="4" height="34" rx="2" fill="#166534" stroke="#14532D" strokeWidth="1"/>
    <line x1="22" y1="16" x2="26" y2="16" stroke="#14532D" strokeWidth="1.5"/>
    <line x1="22" y1="24" x2="26" y2="24" stroke="#14532D" strokeWidth="1.5"/>
    <line x1="22" y1="32" x2="26" y2="32" stroke="#14532D" strokeWidth="1.5"/>
    <path d="M26 14 Q34 10 36 6" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
    <path d="M26 22 Q32 20 38 16" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 18 Q14 14 10 12" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/* ─── Shovel (Firecracker) ─── */
export const Shovel: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="14" width="12" height="28" rx="2" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.5"/>
    <rect x="18" y="14" width="12" height="5" fill="#CA8A04"/>
    <rect x="18" y="24" width="12" height="5" fill="#CA8A04"/>
    <rect x="18" y="34" width="12" height="5" fill="#CA8A04"/>
    <line x1="24" y1="14" x2="24" y2="8" stroke="#991B1B" strokeWidth="1.5"/>
    <circle cx="24" cy="6" r="3" fill="#EAB308" opacity="0.7"/>
    <circle cx="24" cy="5" r="1.5" fill="#FEFCE8"/>
  </svg>
);

/* ─── Cloud ─── */
export const Cloud: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="28" rx="16" ry="10" fill="#CA8A04" opacity="0.15"/>
    <circle cx="16" cy="22" r="10" fill="#CA8A04" opacity="0.2"/>
    <circle cx="30" cy="20" r="12" fill="#CA8A04" opacity="0.2"/>
    <circle cx="22" cy="16" r="8" fill="#EAB308" opacity="0.1"/>
  </svg>
);

/* ─── CrystalBall ─── */
export const CrystalBall: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="38" width="16" height="4" rx="2" fill="#991B1B"/>
    <ellipse cx="24" cy="38" rx="10" ry="3" fill="#A16207" opacity="0.4"/>
    <circle cx="24" cy="24" r="14" fill="url(#cnyBallGrad)"/>
    <defs>
      <radialGradient id="cnyBallGrad" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#EAB308" stopOpacity="0.5"/>
        <stop offset="50%" stopColor="#B91C1C" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#991B1B"/>
      </radialGradient>
    </defs>
    <ellipse cx="19" cy="19" rx="4" ry="3" fill="white" opacity="0.3" transform="rotate(-20 19 19)"/>
    <circle cx="28" cy="28" r="1.5" fill="#EAB308" opacity="0.3"/>
  </svg>
);

/* ─── SlotMachine ─── */
export const SlotMachine: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="36" height="32" rx="4" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.5"/>
    <rect x="8" y="6" width="32" height="6" rx="3" fill="#CA8A04" stroke="#A16207" strokeWidth="1"/>
    <rect x="10" y="16" width="28" height="14" rx="2" fill="#FAFAF9" stroke="#CA8A04" strokeWidth="0.8"/>
    <line x1="19.3" y1="16" x2="19.3" y2="30" stroke="#E7E5E4" strokeWidth="0.8"/>
    <line x1="28.7" y1="16" x2="28.7" y2="30" stroke="#E7E5E4" strokeWidth="0.8"/>
    <text x="14.5" y="26" textAnchor="middle" fontSize="10" fill="#CA8A04">★</text>
    <text x="24" y="26" textAnchor="middle" fontSize="10" fill="#B91C1C">♦</text>
    <text x="33.5" y="26" textAnchor="middle" fontSize="10" fill="#CA8A04">★</text>
    <rect x="42" y="14" width="3" height="16" rx="1.5" fill="#A16207"/>
    <circle cx="43.5" cy="14" r="3" fill="#CA8A04" stroke="#A16207" strokeWidth="1"/>
    <rect x="10" y="34" width="28" height="4" rx="2" fill="#CA8A04" stroke="#A16207" strokeWidth="0.8"/>
  </svg>
);

/* ─── SpinWheel ─── */
export const SpinWheel: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ${className}`} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="none" stroke="#A16207" strokeWidth="2"/>
    <g>
      <path d="M24 4 L24 24 L40.5 11.5Z" fill="#B91C1C"/>
      <path d="M24 4 L24 24 L7.5 11.5Z" fill="#CA8A04"/>
      <path d="M44 24 L24 24 L36.5 7.5Z" fill="#DC2626"/>
      <path d="M44 24 L24 24 L36.5 40.5Z" fill="#EAB308"/>
      <path d="M24 44 L24 24 L40.5 36.5Z" fill="#CA8A04"/>
      <path d="M24 44 L24 24 L7.5 36.5Z" fill="#B91C1C"/>
      <path d="M4 24 L24 24 L11.5 40.5Z" fill="#DC2626"/>
      <path d="M4 24 L24 24 L11.5 7.5Z" fill="#EAB308"/>
    </g>
    <circle cx="24" cy="24" r="4" fill="#FAFAF9" stroke="#A16207" strokeWidth="1.5"/>
    <polygon points="24,2 21,8 27,8" fill="#991B1B"/>
  </svg>
);
