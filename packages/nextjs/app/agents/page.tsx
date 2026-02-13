"use client";

import { FireHorse, LuckyCoin, Sparkle, Lantern, Star, Ticket } from "~~/components/icons/ACIcons";

const endpoints = [
  {
    method: "GET",
    path: "/api/agent/health",
    price: "Free",
    description: "Health check — returns contract info, chain, auth status, and available endpoints",
  },
  {
    method: "GET",
    path: "/api/agent/raffles?status=active",
    price: "Free",
    description: "List all raffles, optionally filtered by status (active, ended, drawn, cancelled)",
  },
  {
    method: "GET",
    path: "/api/agent/raffle/{id}",
    price: "Free",
    description: "Get full raffle details including participants, prize pool, and time remaining",
  },
  {
    method: "POST",
    path: "/api/agent/create-raffle",
    price: "$0.10",
    description: "Create a new raffle with specified token, price, max tickets, and duration",
  },
  {
    method: "POST",
    path: "/api/agent/buy-tickets",
    price: "$0.01",
    description: "Get unsigned transaction data for purchasing raffle tickets",
  },
  {
    method: "POST",
    path: "/api/agent/draw-winner",
    price: "$0.05",
    description: "Trigger VRF-based winner selection for an ended raffle",
  },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen px-4 py-12" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-2 flex items-center justify-center gap-2" style={{ color: "#C41E3A" }}>
            <FireHorse size={36} /> AI Agent Integration
          </h1>
          <p style={{ color: "#DAA520" }}>Programmatic access to BNB Lucky Draw for autonomous agents</p>
        </div>

        {/* Auth Methods */}
        <section className="fh-card ac-card p-6" style={{ borderColor: "#C41E3A" }}>
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#C41E3A" }}><LuckyCoin size={24} /> Authentication</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#DAA520" }}>
            Read endpoints are <strong style={{ color: "#C41E3A" }}>free and open</strong> — no auth needed.
            Write endpoints support two auth methods:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* x402 */}
            <div className="p-4 rounded-2xl" style={{ background: "#C41E3A20", border: "2px solid #C41E3A" }}>
              <h3 className="font-extrabold mb-2" style={{ color: "#C41E3A" }}>x402 Micropayments</h3>
              <p className="text-xs mb-3" style={{ color: "#DAA520" }}>Pay per-request with any EVM wallet. No accounts or API keys needed.</p>
              <div className="space-y-2 text-xs" style={{ color: "#DAA520" }}>
                {[
                  "Call an endpoint",
                  <>Get <code className="px-1 py-0.5 rounded" style={{ background: "#ffe8d6" }}>402</code> with payment details</>,
                  "Sign payment with your wallet",
                  <>Retry with <code className="px-1 py-0.5 rounded" style={{ background: "#ffe8d6" }}>X-PAYMENT</code> header</>,
                ].map((text, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0"
                      style={{ background: "#C41E3A", color: "#fff5e6" }}>{i + 1}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div className="p-4 rounded-2xl" style={{ background: "#FFD70020", border: "2px solid #FFD700" }}>
              <h3 className="font-extrabold mb-2" style={{ color: "#C41E3A" }}>API Key (Fallback)</h3>
              <p className="text-xs mb-3" style={{ color: "#DAA520" }}>Simpler auth for agents that don&apos;t support x402 yet.</p>
              <pre className="text-[10px] p-3 overflow-x-auto rounded-xl font-mono" style={{ background: "#ffe8d6", color: "#C41E3A" }}>
{`curl -X POST \\
  -H "X-API-KEY: your-key-here" \\
  -H "Content-Type: application/json" \\
  -d '{"raffleId":0}' \\
  /api/agent/draw-winner`}
              </pre>
              <p className="text-[10px] mt-2" style={{ color: "#DAA520" }}>Contact the BNB Lucky Draw team to request an API key.</p>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section>
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#C41E3A" }}><Sparkle size={24} /> API Endpoints</h2>
          <div className="space-y-4">
            {endpoints.map((ep, i) => (
              <div key={i} className="fh-card ac-card p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{
                    background: ep.method === "GET" ? "#00A86B40" : "#FFD70040",
                    color: ep.method === "GET" ? "#00A86B" : "#DAA520",
                  }}>
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono font-bold" style={{ color: "#C41E3A" }}>{ep.path}</code>
                  <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-bold" style={{
                    background: ep.price === "Free" ? "#00A86B" : "#ffe8d6",
                    color: ep.price === "Free" ? "#fff5e6" : "#DAA520",
                  }}>
                    {ep.price === "Free" ? "Free" : <><LuckyCoin size={12} className="inline-block mr-1" />{ep.price}</>}
                  </span>
                </div>
                <p className="text-sm" style={{ color: "#DAA520" }}>{ep.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section className="fh-card ac-card p-6">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#C41E3A" }}><Star size={24} /> Quick Start</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: "#C41E3A" }}>cURL — Free reads (no auth)</h3>
              <pre className="text-xs p-4 overflow-x-auto rounded-2xl font-mono" style={{ background: "#ffe8d6", color: "#C41E3A" }}>
{`# Health check
curl https://bnbluckydraw.vercel.app/api/agent/health

# List active raffles (free)
curl https://bnbluckydraw.vercel.app/api/agent/raffles?status=active

# Get raffle details (free)
curl https://bnbluckydraw.vercel.app/api/agent/raffle/0`}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: "#C41E3A" }}>cURL — Write with API key</h3>
              <pre className="text-xs p-4 overflow-x-auto rounded-2xl font-mono" style={{ background: "#ffe8d6", color: "#C41E3A" }}>
{`# Create a raffle (requires auth)
curl -X POST \\
  -H "X-API-KEY: your-key-here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "paymentToken": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    "ticketPrice": "1000000000000000000",
    "maxTickets": 100,
    "durationHours": 24
  }' \\
  https://bnbluckydraw.vercel.app/api/agent/create-raffle`}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: "#C41E3A" }}>Python</h3>
              <pre className="text-xs p-4 overflow-x-auto rounded-2xl font-mono" style={{ background: "#ffe8d6", color: "#C41E3A" }}>
{`import requests

BASE = "https://bnbluckydraw.vercel.app"
API_KEY = "your-key-here"  # or use x402

# Free: list raffles
raffles = requests.get(f"{BASE}/api/agent/raffles").json()

# Paid: create raffle (API key auth)
resp = requests.post(
    f"{BASE}/api/agent/create-raffle",
    headers={"X-API-KEY": API_KEY, "Content-Type": "application/json"},
    json={
        "paymentToken": "0xe9e7CE...",
        "ticketPrice": "1000000000000000000",
        "maxTickets": 50,
        "durationHours": 12,
    },
)
print(resp.json())  # {"raffleId": 3, "txHash": "0x..."}`}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: "#C41E3A" }}>TypeScript — x402 flow</h3>
              <pre className="text-xs p-4 overflow-x-auto rounded-2xl font-mono" style={{ background: "#ffe8d6", color: "#C41E3A" }}>
{`const BASE = "https://bnbluckydraw.vercel.app";

// Free reads — just fetch
const raffles = await fetch(\`\${BASE}/api/agent/raffles\`).then(r => r.json());

// Paid writes — x402 flow
async function x402Fetch(url: string, options?: RequestInit) {
  let resp = await fetch(url, options);
  if (resp.status === 402) {
    const info = await resp.json();
    const payment = await signX402Payment(info); // your wallet signer
    resp = await fetch(url, {
      ...options,
      headers: { ...options?.headers, "X-PAYMENT": payment },
    });
  }
  return resp;
}

// Or just use API key
const resp = await fetch(\`\${BASE}/api/agent/create-raffle\`, {
  method: "POST",
  headers: { "X-API-KEY": "your-key", "Content-Type": "application/json" },
  body: JSON.stringify({ ... }),
});`}
              </pre>
            </div>
          </div>
        </section>

        {/* Request/Response Format */}
        <section className="fh-card ac-card p-6">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#C41E3A" }}><Ticket size={24} /> Request / Response Reference</h2>
          <div className="space-y-4 text-sm">
            {[
              { title: "POST /api/agent/create-raffle", code: `// Request:\n{\n  "paymentToken": "0xe9e7CE...",  // ERC20 token address\n  "ticketPrice": "1000000000000000000",  // in wei\n  "maxTickets": 100,\n  "durationHours": 24\n}\n\n// Response:\n{ "raffleId": "3", "txHash": "0xabc..." }` },
              { title: "POST /api/agent/buy-tickets", code: `// Request:\n{\n  "raffleId": 0,\n  "ticketCount": 5,\n  "buyerAddress": "0x..."\n}\n\n// Response (unsigned tx for buyer to execute):\n{\n  "txData": "0x...",\n  "to": "0x8a58...",\n  "erc20": {\n    "token": "0xe9e7...",\n    "amount": "5000000000000000000",\n    "spender": "0x8a58..."\n  },\n  "note": "Buyer must approve ERC20 first, then send tx"\n}` },
              { title: "POST /api/agent/draw-winner", code: `// Request:\n{ "raffleId": 0 }\n\n// Response:\n{\n  "winner": "0x...",\n  "winningTicket": "17",\n  "vrfHash": "0x...",\n  "txHash": "0x..."\n}` },
            ].map(item => (
              <div key={item.title}>
                <h3 className="font-bold mb-2" style={{ color: "#C41E3A" }}>{item.title}</h3>
                <pre className="text-xs p-3 overflow-x-auto rounded-2xl font-mono" style={{ background: "#ffe8d6", color: "#C41E3A" }}>
                  {item.code}
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* OpenClaw Integration */}
        <section className="fh-card ac-card p-6" style={{ borderColor: "#C41E3A" }}>
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#C41E3A" }}><FireHorse size={24} /> OpenClaw Integration</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#DAA520" }}>
            <strong style={{ color: "#C41E3A" }}>OpenClaw</strong> agents can interact with BNB Lucky Draw directly
            using the built-in web_fetch tool. Read endpoints work out of the box.
          </p>
          <pre className="text-xs p-4 overflow-x-auto rounded-2xl font-mono" style={{ background: "#ffe8d6", color: "#C41E3A" }}>
{`# Free reads — just works
web_fetch("https://bnbluckydraw.vercel.app/api/agent/health")
web_fetch("https://bnbluckydraw.vercel.app/api/agent/raffles?status=active")
web_fetch("https://bnbluckydraw.vercel.app/api/agent/raffle/0")`}
          </pre>
        </section>

        {/* Supported Tokens */}
        <section className="fh-card ac-card p-6">
          <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: "#C41E3A" }}><Lantern size={24} /> Supported Tokens (BNB Chain)</h2>
          <div className="space-y-2 text-sm">
            {[
              { name: "BUSD", address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" },
              { name: "USDT", address: "0x55d398326f99059fF775485246999027B3197955" },
              { name: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d" },
            ].map(t => (
              <div key={t.name} className="flex flex-col sm:flex-row sm:items-center gap-1" style={{ color: "#DAA520" }}>
                <span className="font-bold w-24" style={{ color: "#C41E3A" }}>{t.name}</span>
                <code className="break-all px-2 py-0.5 rounded-lg text-xs" style={{ background: "#ffe8d6" }}>{t.address}</code>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
