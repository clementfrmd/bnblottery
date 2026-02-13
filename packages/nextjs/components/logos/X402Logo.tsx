export const X402Logo = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="32" height="32" rx="6" fill="#1a1a2e" />
    <text x="16" y="21" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff" fontFamily="monospace">402</text>
  </svg>
);
