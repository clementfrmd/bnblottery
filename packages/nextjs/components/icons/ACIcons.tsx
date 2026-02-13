"use client";

import React from "react";

interface IconProps {
  size?: number;
  className?: string;
}

/* ─── 1. Leaf ─── */
export const Leaf: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-leaf ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-leaf { animation: ac-sway 3s ease-in-out infinite; transform-origin: bottom center; }
      @keyframes ac-sway { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
    `}</style>
    <path d="M24 44 C24 44 8 32 8 18 C8 8 16 4 24 4 C32 4 40 8 40 18 C40 32 24 44 24 44Z" fill="#A8E6CF" stroke="#6BAF7B" strokeWidth="2"/>
    <path d="M24 12 L24 38" stroke="#6BAF7B" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M24 18 L18 14" stroke="#6BAF7B" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M24 24 L30 20" stroke="#6BAF7B" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M24 30 L18 26" stroke="#6BAF7B" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

/* ─── 2. Star ─── */
export const Star: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-star ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-star { animation: ac-twinkle 2s ease-in-out infinite; }
      @keyframes ac-twinkle { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.9); } }
    `}</style>
    <polygon points="24,4 29,18 44,18 32,28 36,42 24,34 12,42 16,28 4,18 19,18" fill="#f5c542" stroke="#d4a827" strokeWidth="1.5" strokeLinejoin="round"/>
    <polygon points="24,10 27,19 37,19 29,25 32,35 24,29 16,35 19,25 11,19 21,19" fill="#ffe082" opacity="0.6"/>
  </svg>
);

/* ─── 3. Flower ─── */
export const Flower: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-flower ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-flower { animation: ac-bob 2.5s ease-in-out infinite; }
      @keyframes ac-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
    `}</style>
    {[0,60,120,180,240,300].map(r => (
      <ellipse key={r} cx="24" cy="14" rx="7" ry="10" fill="#FFB7B2" opacity="0.85" transform={`rotate(${r} 24 24)`}/>
    ))}
    <circle cx="24" cy="24" r="6" fill="#FFDAC1"/>
    <circle cx="23" cy="23" r="2" fill="#f5c542" opacity="0.6"/>
  </svg>
);

/* ─── 4. Ticket ─── */
export const Ticket: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-ticket ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-ticket { animation: ac-wiggle 3s ease-in-out infinite; }
      @keyframes ac-wiggle { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
    `}</style>
    <rect x="4" y="12" width="40" height="24" rx="4" fill="#FFDAC1" stroke="#8B7355" strokeWidth="1.5"/>
    <line x1="16" y1="12" x2="16" y2="36" stroke="#8B7355" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="32" cy="24" r="5" fill="#A8E6CF" stroke="#6BAF7B" strokeWidth="1"/>
    <text x="31.5" y="26.5" textAnchor="middle" fill="#2d4a3e" fontSize="7" fontWeight="bold" fontFamily="Nunito, sans-serif">R</text>
    <rect x="7" y="18" width="6" height="2" rx="1" fill="#8B7355" opacity="0.4"/>
    <rect x="7" y="22" width="5" height="2" rx="1" fill="#8B7355" opacity="0.3"/>
    <rect x="7" y="26" width="6" height="2" rx="1" fill="#8B7355" opacity="0.4"/>
  </svg>
);

/* ─── 5. Trophy ─── */
export const Trophy: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-trophy ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-trophy { animation: ac-bounce 2s ease-in-out infinite; }
      @keyframes ac-bounce { 0%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } 60% { transform: translateY(-2px); } }
    `}</style>
    <path d="M16 8 H32 V24 C32 32 24 36 24 36 C24 36 16 32 16 24 Z" fill="#f5c542" stroke="#d4a827" strokeWidth="1.5"/>
    <path d="M16 12 H8 C8 12 6 12 6 16 C6 20 10 22 14 20" fill="none" stroke="#d4a827" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M32 12 H40 C40 12 42 12 42 16 C42 20 38 22 34 20" fill="none" stroke="#d4a827" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="20" y="36" width="8" height="4" rx="1" fill="#d4a827"/>
    <rect x="17" y="40" width="14" height="3" rx="1.5" fill="#8B7355"/>
    <polygon points="24,14 25.5,17 29,17.5 26.5,20 27,23.5 24,22 21,23.5 21.5,20 19,17.5 22.5,17" fill="#ffe082" opacity="0.8"/>
  </svg>
);

/* ─── 6. House ─── */
export const House: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-house ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-house { animation: ac-settle 3s ease-in-out infinite; }
      @keyframes ac-settle { 0%,100% { transform: scale(1); } 50% { transform: scale(1.03); } }
    `}</style>
    <rect x="10" y="22" width="28" height="20" rx="2" fill="#FFDAC1" stroke="#8B7355" strokeWidth="1.5"/>
    <polygon points="6,24 24,8 42,24" fill="#FFB7B2" stroke="#8B7355" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="20" y="30" width="8" height="12" rx="1" fill="#8B7355"/>
    <circle cx="26" cy="36" r="1" fill="#f5c542"/>
    <rect x="13" y="26" width="6" height="6" rx="1" fill="#B5EAD7" stroke="#6BAF7B" strokeWidth="1"/>
    <rect x="29" y="26" width="6" height="6" rx="1" fill="#B5EAD7" stroke="#6BAF7B" strokeWidth="1"/>
    <line x1="16" y1="26" x2="16" y2="32" stroke="#6BAF7B" strokeWidth="0.5"/>
    <line x1="13" y1="29" x2="19" y2="29" stroke="#6BAF7B" strokeWidth="0.5"/>
  </svg>
);

/* ─── 7. Shovel ─── */
export const Shovel: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-shovel ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-shovel { animation: ac-dig 2s ease-in-out infinite; }
      @keyframes ac-dig { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(4deg); } }
    `}</style>
    <line x1="24" y1="8" x2="24" y2="32" stroke="#8B7355" strokeWidth="3" strokeLinecap="round"/>
    <path d="M16 32 L24 44 L32 32 Z" fill="#A8E6CF" stroke="#6BAF7B" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="20" y="6" width="8" height="6" rx="2" fill="#d4a827" stroke="#8B7355" strokeWidth="1"/>
  </svg>
);

/* ─── 8. Coin ─── */
export const Coin: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-coin ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-coin { animation: ac-spin-coin 3s ease-in-out infinite; }
      @keyframes ac-spin-coin { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(0.7); } }
    `}</style>
    <circle cx="24" cy="24" r="18" fill="#f5c542" stroke="#d4a827" strokeWidth="2"/>
    <circle cx="24" cy="24" r="14" fill="none" stroke="#d4a827" strokeWidth="1" opacity="0.5"/>
    <text x="24" y="29" textAnchor="middle" fill="#8B7355" fontSize="14" fontWeight="bold" fontFamily="Nunito, sans-serif">$</text>
  </svg>
);

/* ─── 9. Clock ─── */
export const Clock: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-clock ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-clock { animation: ac-tick 1s steps(1) infinite; }
      .ac-clock-hand { animation: ac-clock-rotate 4s linear infinite; transform-origin: 24px 24px; }
      @keyframes ac-tick { 0%,50% { transform: scale(1); } 25% { transform: scale(1.02); } }
      @keyframes ac-clock-rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `}</style>
    <circle cx="24" cy="24" r="18" fill="#B5EAD7" stroke="#6BAF7B" strokeWidth="2"/>
    <circle cx="24" cy="24" r="15" fill="#fffdf9"/>
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => (
      <line key={deg} x1="24" y1="11" x2="24" y2="13" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${deg} 24 24)`}/>
    ))}
    <line x1="24" y1="24" x2="24" y2="15" stroke="#2d4a3e" strokeWidth="2" strokeLinecap="round"/>
    <line x1="24" y1="24" x2="30" y2="24" stroke="#2d4a3e" strokeWidth="1.5" strokeLinecap="round" className="ac-clock-hand"/>
    <circle cx="24" cy="24" r="2" fill="#FFB7B2"/>
  </svg>
);

/* ─── 10. Bag ─── */
export const Bag: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-bag ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-bag { animation: ac-bob 2.8s ease-in-out infinite; }
    `}</style>
    <path d="M12 18 H36 L34 42 H14 Z" fill="#FFDAC1" stroke="#8B7355" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M18 18 C18 10 24 6 24 6 C24 6 30 10 30 18" fill="none" stroke="#8B7355" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="24" cy="26" r="4" fill="#A8E6CF" stroke="#6BAF7B" strokeWidth="1"/>
    <line x1="24" y1="30" x2="24" y2="36" stroke="#6BAF7B" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ─── 11. Letter ─── */
export const Letter: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-letter ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-letter { animation: ac-float-letter 3s ease-in-out infinite; }
      @keyframes ac-float-letter { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-3px) rotate(2deg); } }
    `}</style>
    <rect x="6" y="14" width="36" height="24" rx="3" fill="#fffdf9" stroke="#B5EAD7" strokeWidth="2"/>
    <polyline points="6,14 24,28 42,14" fill="none" stroke="#B5EAD7" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="36" cy="16" r="5" fill="#FFB7B2"/>
    <path d="M34,16 L35.5,17.5 L39,14" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ─── 12. Cart ─── */
export const Cart: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-cart ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-cart { animation: ac-roll 2s ease-in-out infinite; }
      @keyframes ac-roll { 0%,100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
    `}</style>
    <polyline points="6,10 12,10 18,34 38,34" fill="none" stroke="#8B7355" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polygon points="14,16 40,16 38,30 16,30" fill="#B5EAD7" stroke="#6BAF7B" strokeWidth="1.5"/>
    <circle cx="20" cy="40" r="3" fill="#8B7355"/>
    <circle cx="34" cy="40" r="3" fill="#8B7355"/>
    <rect x="22" y="20" width="8" height="6" rx="1" fill="#A8E6CF" stroke="#6BAF7B" strokeWidth="0.5"/>
  </svg>
);

/* ─── 13. Nook ─── */
export const Nook: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-nook ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-nook { animation: ac-nod 3s ease-in-out infinite; }
      @keyframes ac-nod { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(3deg); } 75% { transform: rotate(-3deg); } }
    `}</style>
    <ellipse cx="24" cy="28" rx="16" ry="14" fill="#8B7355"/>
    <ellipse cx="24" cy="28" rx="14" ry="12" fill="#FFDAC1"/>
    <circle cx="14" cy="14" r="7" fill="#8B7355"/>
    <circle cx="34" cy="14" r="7" fill="#8B7355"/>
    <circle cx="14" cy="14" r="4" fill="#FFDAC1"/>
    <circle cx="34" cy="14" r="4" fill="#FFDAC1"/>
    <ellipse cx="18" cy="26" rx="3.5" ry="3" fill="white"/>
    <ellipse cx="30" cy="26" rx="3.5" ry="3" fill="white"/>
    <circle cx="19" cy="26" r="1.8" fill="#2d4a3e"/>
    <circle cx="31" cy="26" r="1.8" fill="#2d4a3e"/>
    <circle cx="19.5" cy="25.5" r="0.6" fill="white"/>
    <circle cx="31.5" cy="25.5" r="0.6" fill="white"/>
    <ellipse cx="24" cy="32" rx="3" ry="2" fill="#2d4a3e"/>
    <ellipse cx="24" cy="31" rx="1.5" ry="1" fill="#8B7355"/>
    <circle cx="16" cy="33" r="3" fill="#FFB7B2" opacity="0.4"/>
    <circle cx="32" cy="33" r="3" fill="#FFB7B2" opacity="0.4"/>
  </svg>
);

/* ─── 14. IslandTree ─── */
export const IslandTree: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-tree ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-tree { animation: ac-sway 4s ease-in-out infinite; transform-origin: bottom center; }
    `}</style>
    <rect x="21" y="22" width="6" height="20" rx="2" fill="#8B7355"/>
    <ellipse cx="18" cy="12" rx="12" ry="10" fill="#A8E6CF"/>
    <ellipse cx="32" cy="16" rx="10" ry="8" fill="#6BAF7B"/>
    <ellipse cx="22" cy="8" rx="8" ry="7" fill="#B5EAD7"/>
    <ellipse cx="24" cy="44" rx="14" ry="3" fill="#FFDAC1" opacity="0.5"/>
  </svg>
);

/* ─── 15. Sparkle ─── */
export const Sparkle: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-sparkle ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-sparkle { animation: ac-sparkle-pulse 1.5s ease-in-out infinite; }
      @keyframes ac-sparkle-pulse { 0%,100% { opacity: 1; transform: scale(1) rotate(0deg); } 50% { opacity: 0.6; transform: scale(0.85) rotate(15deg); } }
    `}</style>
    <polygon points="24,2 27,18 44,20 29,28 32,46 24,32 16,46 19,28 4,20 21,18" fill="#f5c542" stroke="#d4a827" strokeWidth="1"/>
    <polygon points="24,8 26,18 36,20 28,26 30,38 24,30 18,38 20,26 12,20 22,18" fill="#ffe082" opacity="0.5"/>
    <circle cx="24" cy="22" r="3" fill="white" opacity="0.7"/>
  </svg>
);

/* ─── 16. Paw ─── */
export const Paw: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-paw ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-paw { animation: ac-stamp 2s ease-in-out infinite; }
      @keyframes ac-stamp { 0%,100% { transform: scale(1); } 40% { transform: scale(1.1); } 60% { transform: scale(0.95); } }
    `}</style>
    <ellipse cx="24" cy="30" rx="10" ry="9" fill="#E2D1F9"/>
    <ellipse cx="15" cy="18" rx="5" ry="6" fill="#E2D1F9"/>
    <ellipse cx="33" cy="18" rx="5" ry="6" fill="#E2D1F9"/>
    <ellipse cx="10" cy="26" rx="4.5" ry="5.5" fill="#E2D1F9"/>
    <ellipse cx="38" cy="26" rx="4.5" ry="5.5" fill="#E2D1F9"/>
  </svg>
);

/* ─── 17. Cloud ─── */
export const Cloud: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-cloud ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-cloud { animation: ac-drift 4s ease-in-out infinite; }
      @keyframes ac-drift { 0%,100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
    `}</style>
    <ellipse cx="24" cy="28" rx="16" ry="10" fill="#B5EAD7"/>
    <circle cx="16" cy="22" r="10" fill="#B5EAD7"/>
    <circle cx="30" cy="20" r="12" fill="#B5EAD7"/>
    <circle cx="22" cy="16" r="8" fill="#A8E6CF" opacity="0.6"/>
    <ellipse cx="24" cy="28" rx="14" ry="8" fill="white" opacity="0.3"/>
  </svg>
);

/* ─── 18. CrystalBall ─── */
export const CrystalBall: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-crystal ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-crystal { animation: ac-glow 2.5s ease-in-out infinite; }
      @keyframes ac-glow { 0%,100% { filter: drop-shadow(0 0 2px #E2D1F9); } 50% { filter: drop-shadow(0 0 8px #E2D1F9); } }
    `}</style>
    <rect x="16" y="38" width="16" height="4" rx="2" fill="#8B7355"/>
    <ellipse cx="24" cy="38" rx="10" ry="3" fill="#6BAF7B" opacity="0.5"/>
    <circle cx="24" cy="24" r="16" fill="#E2D1F9" opacity="0.6"/>
    <circle cx="24" cy="24" r="14" fill="url(#crystalGrad)"/>
    <defs>
      <radialGradient id="crystalGrad" cx="35%" cy="35%">
        <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
        <stop offset="50%" stopColor="#E2D1F9" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#d4c1f0"/>
      </radialGradient>
    </defs>
    <ellipse cx="19" cy="19" rx="4" ry="3" fill="white" opacity="0.5" transform="rotate(-20 19 19)"/>
    <circle cx="28" cy="28" r="2" fill="#f5c542" opacity="0.4"/>
    <circle cx="20" cy="30" r="1.5" fill="#FFB7B2" opacity="0.4"/>
    <circle cx="30" cy="20" r="1" fill="#A8E6CF" opacity="0.5"/>
  </svg>
);

/* ─── 19. SlotMachine ─── */
export const SlotMachine: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-slot ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-slot { animation: ac-slot-wiggle 2s ease-in-out infinite; transform-origin: center; }
      @keyframes ac-slot-wiggle { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } }
    `}</style>
    {/* Machine body */}
    <rect x="6" y="8" width="36" height="32" rx="4" fill="#FFB7B2" stroke="#E8948E" strokeWidth="1.5"/>
    {/* Top */}
    <rect x="8" y="6" width="32" height="6" rx="3" fill="#FFDAC1" stroke="#E8B896" strokeWidth="1"/>
    {/* Display window */}
    <rect x="10" y="16" width="28" height="14" rx="2" fill="#FFF8F0" stroke="#E8B896" strokeWidth="1"/>
    {/* Dividers */}
    <line x1="19.3" y1="16" x2="19.3" y2="30" stroke="#E8B896" strokeWidth="0.8"/>
    <line x1="28.7" y1="16" x2="28.7" y2="30" stroke="#E8B896" strokeWidth="0.8"/>
    {/* Slot symbols — star, leaf, coin */}
    <text x="14.5" y="26" textAnchor="middle" fontSize="10" fill="#f5c542">★</text>
    <text x="24" y="26" textAnchor="middle" fontSize="10" fill="#6BAF7B">♣</text>
    <text x="33.5" y="26" textAnchor="middle" fontSize="10" fill="#E8948E">♦</text>
    {/* Handle */}
    <rect x="42" y="14" width="3" height="16" rx="1.5" fill="#E8B896"/>
    <circle cx="43.5" cy="14" r="3" fill="#f5c542" stroke="#E8B896" strokeWidth="1"/>
    {/* Base */}
    <rect x="10" y="34" width="28" height="4" rx="2" fill="#FFDAC1" stroke="#E8B896" strokeWidth="1"/>
    {/* Stars */}
    <circle cx="14" cy="9" r="1" fill="#f5c542"/>
    <circle cx="24" cy="8.5" r="1.2" fill="#f5c542"/>
    <circle cx="34" cy="9" r="1" fill="#f5c542"/>
  </svg>
);

/* ─── 20. SpinWheel ─── */
export const SpinWheel: React.FC<IconProps> = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={`inline-block ac-icon-wheel ${className}`} xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .ac-icon-wheel .wheel-inner { animation: ac-spin 4s linear infinite; transform-origin: 24px 24px; }
      @keyframes ac-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `}</style>
    {/* Outer ring */}
    <circle cx="24" cy="24" r="20" fill="none" stroke="#E8B896" strokeWidth="2"/>
    <g className="wheel-inner">
      {/* Wheel segments */}
      <path d="M24 4 L24 24 L40.5 11.5Z" fill="#A8E6CF"/>
      <path d="M24 4 L24 24 L7.5 11.5Z" fill="#FFB7B2"/>
      <path d="M44 24 L24 24 L36.5 7.5Z" fill="#FFDAC1"/>
      <path d="M44 24 L24 24 L36.5 40.5Z" fill="#E2D1F9"/>
      <path d="M24 44 L24 24 L40.5 36.5Z" fill="#f5c542"/>
      <path d="M24 44 L24 24 L7.5 36.5Z" fill="#A8E6CF"/>
      <path d="M4 24 L24 24 L11.5 40.5Z" fill="#FFB7B2"/>
      <path d="M4 24 L24 24 L11.5 7.5Z" fill="#FFDAC1"/>
    </g>
    {/* Center */}
    <circle cx="24" cy="24" r="4" fill="#FFF8F0" stroke="#E8B896" strokeWidth="1.5"/>
    {/* Pointer */}
    <polygon points="24,2 21,8 27,8" fill="#E8948E"/>
  </svg>
);
