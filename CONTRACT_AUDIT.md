# AgentRaffleV2 Contract Self-Audit

**Contract:** `packages/hardhat/contracts/AgentRaffleV2.sol`  
**Solidity:** ^0.8.24  
**Date:** 2026-02-13  

## Summary

The contract is generally well-structured, using OpenZeppelin's `ReentrancyGuard`, `Ownable`, and `SafeERC20`. However, several issues were identified.

---

## 1. Reentrancy

**Status: ✅ Mitigated**

- `purchaseTickets` and `drawWinner` use `nonReentrant` modifier.
- `purchaseTickets` follows CEI pattern (state updates before `safeTransferFrom`).
- `drawWinner` updates state before transfers.
- `emergencyRefund` uses `nonReentrant` and zeroes balance before transfer.

**Minor note:** `cancelRaffle` doesn't need reentrancy protection (no external calls).

## 2. Integer Overflow/Underflow

**Status: ✅ Safe**

Solidity 0.8.24 has built-in overflow checks. All arithmetic will revert on overflow.

## 3. Access Control

**Status: ⚠️ Concerns**

- `drawWinner`: Only organizer or owner can call. ✅
- `cancelRaffle`: Only organizer or owner. ✅
- `createRaffle`: Restricted to `allowedOrganizers`. ✅
- **Issue:** `emergencyRefund` has no time lock or admin gate — anyone who bought tickets in a cancelled raffle can refund, which is correct behavior. ✅
- **Issue:** Owner can set fees up to 9999 bps (99.99%), leaving winner with almost nothing. Consider a max fee cap.

## 4. Fund Handling — Can Funds Get Stuck?

**Status: ⚠️ YES — Funds can get stuck**

- **Cancelled raffles with 0 ticket buyers:** No funds to get stuck, OK.
- **Cancelled raffles with buyers:** Refunds are claim-based (`emergencyRefund`). If a participant never claims, their funds remain in the contract forever. There's **no admin sweep function** to recover unclaimed funds after a timeout.
- **Rounding dust:** Fee calculation `(totalPrize * feeBps) / 10000` can leave dust due to rounding. For example, if `totalPrize = 1` and fees are 3%+2%, the division rounds to 0 for both fees, so all goes to winner. For larger amounts, 1-2 wei can remain stuck per draw. Over many raffles this accumulates with no recovery mechanism.
- **No `withdrawStuck()` function:** If tokens are accidentally sent to the contract (not via `purchaseTickets`), they're stuck forever.

**Recommendation:** Add an owner-only `rescueTokens(address token, uint256 amount)` function with a time-lock or restriction that it can't touch active raffle funds.

## 5. Edge Cases

### 0 Participants
- `drawWinner` requires `raffle.totalTickets > 0`. ✅ Handled.

### Max Participants
- `purchaseTickets` checks `totalTickets + _ticketCount <= maxTickets`. ✅
- Max 100 tickets per tx prevents gas griefing. ✅

### Raffle with maxTickets = 1
- Works correctly. Single buyer is guaranteed winner.

### Draw timing
- `drawWinner` requires `block.timestamp >= endTime || totalTickets == maxTickets`. ✅
- This means a raffle can be drawn early if sold out. By design.

### Re-drawing
- `isDrawn` flag prevents double draw. ✅

### Cancel after draw
- `cancelRaffle` requires `!isDrawn`. ✅ Can't cancel after draw.

### emergencyRefund after draw
- Requires `isCancelled`. Can't be cancelled after draw. ✅ Safe.

### Refund math
- `ticketPrice * tickets` — same calculation as purchase. No rounding issue. ✅
- **However:** If `totalPrize` in the raffle struct doesn't match actual contract balance (e.g., fee-on-transfer tokens), refunds could fail for the last claimant.

## 6. Fee-on-Transfer / Rebasing Tokens

**Status: ❌ Vulnerable**

The contract assumes `safeTransferFrom` delivers exactly `totalCost` tokens. Fee-on-transfer tokens (like some deflationary tokens) will deliver less, but `totalPrize` tracks the nominal amount. This means:
- `drawWinner` will try to transfer more than the contract holds → revert, blocking the draw forever.
- `emergencyRefund` could fail similarly.

**Recommendation:** Either (a) measure actual balance change after transfer, or (b) restrict to known non-fee tokens via `allowedTokens` (currently implemented — just document this requirement).

## 7. Centralization Risks

- Owner can pause the agent (`agentPaused`), change fees, change treasury, add/remove organizers and tokens.
- Owner can draw winners for any raffle (acts as co-organizer).
- No timelock on any admin function.

**Recommendation:** Consider a timelock or multisig for admin functions in production.

## 8. Gas Considerations

- `getActiveRaffles` and `getRafflesByOrganizer` iterate all raffles. With many raffles, these become expensive view calls (may hit gas limits for eth_call).
- `purchaseTickets` loop writes `ticketOwners` per ticket (up to 100 storage writes per tx). At ~20k gas per SSTORE, that's ~2M gas for 100 tickets. Acceptable but worth noting.

---

## Overall Assessment

The contract is **reasonably secure** for a testnet/MVP deployment. The main risks are:
1. **Stuck funds** — no recovery mechanism for dust or unclaimed refunds
2. **Fee-on-transfer tokens** — would break draw/refund logic (mitigated by allowlist)
3. **No admin fee cap** — owner could set fees to 99.99%
4. **No timelock** on admin functions

For production, recommend adding fund recovery, fee caps, and governance timelocks.
