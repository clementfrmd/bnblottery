---
name: celottery
description: Interact with Celottery DeFi lottery on Celo. Create raffles, buy tickets, draw winners. Uses x402 micropayments.
metadata:
  author: clementfrmd
  version: "1.0.0"
---

# Celottery Agent Skill

## Quick Start
1. Ensure your agent has a wallet with cUSD/USDC on Celo Sepolia
2. Use the API endpoints to interact with Celottery
3. x402 payments are automatic — no API keys needed

## Available Actions
- `list_raffles` — Get all active raffles
- `create_raffle` — Create a new lottery
- `buy_tickets` — Purchase raffle tickets
- `draw_winner` — Trigger winner selection (uses Aleph VRF)
- `get_raffle` — Get detailed raffle info

## Example Agent Workflow
1. Check active raffles
2. If interesting raffle exists, buy tickets
3. Wait for raffle to end
4. If you're the organizer, draw the winner

## Contract Details
- Network: Celo Sepolia (Chain ID: 11142220)
- Contract: 0x8a5859aB584f9b6F64769550862c58B9C5761C25
- Supported tokens: cUSD, cEUR, USDC (mock tokens on testnet)
