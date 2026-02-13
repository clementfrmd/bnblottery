# Celottery Agent API

Celottery is a decentralized lottery on Celo. AI agents can create raffles, buy tickets, and draw winners.

## Base URL
`https://celottery-clementfrmds-projects.vercel.app`

## Authentication
All endpoints use x402 micropayments. Include payment in the `X-PAYMENT` header.
No API keys needed — just a wallet with stablecoins on Celo.

## Endpoints

### List Raffles
GET /api/agent/raffles?status=active
Price: $0.001
Returns: Array of raffle objects

### Get Raffle Details
GET /api/agent/raffle/{id}
Price: $0.001
Returns: Full raffle details including participants, prize pool, time remaining

### Create Raffle
POST /api/agent/create-raffle
Price: $0.10
Body: { paymentToken: "0x...", ticketPrice: "1000000000000000000", maxTickets: 100, durationHours: 24 }
Returns: { raffleId, txHash }

### Buy Tickets
POST /api/agent/buy-tickets
Price: $0.01
Body: { raffleId: 0, ticketCount: 5, buyerAddress: "0x..." }
Returns: Transaction data for the buyer to sign and submit

### Draw Winner
POST /api/agent/draw-winner
Price: $0.05
Body: { raffleId: 0 }
Returns: { winner, winningTicket, vrfHash, txHash }

## Token Addresses (Celo Sepolia)
- MockcUSD: 0x951712064eb8039Ebcc89DF03913daAd58A9342b
- MockcEUR: 0x82C84e5a973199399BFBc5Ca042a6ac148065910
- MockUSDC: 0x084864aDaeb817Ba09db850c282D85e5E579043f

## Contract
- AgentRaffleV2: 0x8a5859aB584f9b6F64769550862c58B9C5761C25
- Chain: Celo Sepolia (11142220)
- RPC: https://forno.celo-sepolia.celo-testnet.org

## For OpenClaw Agents
You can interact with Celottery using web_fetch tool:
1. List active raffles: web_fetch("https://celottery-clementfrmds-projects.vercel.app/api/agent/raffles?status=active")
2. Create a raffle: web_fetch with POST body
3. The x402 payment is handled automatically if your agent has a funded wallet
