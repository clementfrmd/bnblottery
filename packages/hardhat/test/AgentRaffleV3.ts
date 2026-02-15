import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("AgentRaffleV3 — Full Security & Edge Case Suite", function () {
  let raffle: any;
  let usdt: any;
  let usdc: any;
  let owner: SignerWithAddress;
  let organizer: SignerWithAddress;
  let player1: SignerWithAddress;
  let player2: SignerWithAddress;
  let player3: SignerWithAddress;
  let treasury: SignerWithAddress;
  let attacker: SignerWithAddress;

  beforeEach(async () => {
    [owner, organizer, player1, player2, player3, treasury, attacker] = await ethers.getSigners();

    // Deploy mock tokens
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    usdt = await MockERC20.deploy("Mock USDT", "USDT", 18);
    usdc = await MockERC20.deploy("Mock USDC", "USDC", 6);
    await usdt.waitForDeployment();
    await usdc.waitForDeployment();

    // Deploy raffle
    const AgentRaffleV3 = await ethers.getContractFactory("AgentRaffleV3");
    raffle = await AgentRaffleV3.deploy(treasury.address);
    await raffle.waitForDeployment();

    // Whitelist tokens
    await raffle.setAllowedToken(await usdt.getAddress(), true, 18);
    await raffle.setAllowedToken(await usdc.getAddress(), true, 6);

    // Mint tokens to all players
    const amount18 = ethers.parseEther("10000");
    const amount6 = 10000n * 10n ** 6n;
    for (const user of [owner, organizer, player1, player2, player3, attacker]) {
      await usdt.mint(user.address, amount18);
      await usdc.mint(user.address, amount6);
      await usdt.connect(user).approve(await raffle.getAddress(), ethers.MaxUint256);
      await usdc.connect(user).approve(await raffle.getAddress(), ethers.MaxUint256);
    }
  });

  // ========== DEPLOYMENT ==========

  describe("Deployment", () => {
    it("sets correct treasury", async () => {
      expect(await raffle.treasury()).to.equal(treasury.address);
    });

    it("sets owner as allowed organizer", async () => {
      expect(await raffle.allowedOrganizers(owner.address)).to.be.true;
    });

    it("sets correct fee BPS", async () => {
      expect(await raffle.platformFeeBps()).to.equal(300);
      expect(await raffle.organizerFeeBps()).to.equal(200);
    });

    it("reverts with zero treasury", async () => {
      const AgentRaffleV3 = await ethers.getContractFactory("AgentRaffleV3");
      await expect(AgentRaffleV3.deploy(ethers.ZeroAddress)).to.be.revertedWith("Invalid treasury");
    });
  });

  // ========== ORGANIZER REGISTRATION ==========

  describe("Organizer Registration", () => {
    it("allows staking and registering as organizer", async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
      expect(await raffle.allowedOrganizers(organizer.address)).to.be.true;
      expect(await raffle.organizerStakes(organizer.address, await usdt.getAddress())).to.equal(ethers.parseEther("1"));
    });

    it("uses correct stake for 6-decimal token", async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdc.getAddress());
      expect(await raffle.organizerStakes(organizer.address, await usdc.getAddress())).to.equal(10n ** 6n);
    });

    it("reverts double registration for same token", async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
      await expect(raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress()))
        .to.be.revertedWith("Already staked for this token");
    });

    it("allows registration for different tokens", async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
      await raffle.connect(organizer).registerAsOrganizer(await usdc.getAddress());
      expect(await raffle.organizerStakes(organizer.address, await usdt.getAddress())).to.be.gt(0);
      expect(await raffle.organizerStakes(organizer.address, await usdc.getAddress())).to.be.gt(0);
    });

    it("reverts for non-allowed token", async () => {
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      const fakeToken = await MockERC20.deploy("Fake", "FAKE", 18);
      await expect(raffle.connect(organizer).registerAsOrganizer(await fakeToken.getAddress()))
        .to.be.revertedWith("Token not allowed");
    });

    it("allows unregistration when no active raffles", async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
      const balBefore = await usdt.balanceOf(organizer.address);
      await raffle.connect(organizer).unregisterAsOrganizer(await usdt.getAddress());
      const balAfter = await usdt.balanceOf(organizer.address);
      expect(balAfter - balBefore).to.equal(ethers.parseEther("1"));
    });

    it("reverts unregistration with active raffle", async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
      await raffle.connect(organizer).createRaffle(await usdt.getAddress(), ethers.parseEther("1"), 10, 3600);
      await expect(raffle.connect(organizer).unregisterAsOrganizer(await usdt.getAddress()))
        .to.be.revertedWith("Cannot unregister with active raffles for this token");
    });
  });

  // ========== RAFFLE CREATION ==========

  describe("Raffle Creation", () => {
    beforeEach(async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
    });

    it("creates raffle with correct params", async () => {
      const tx = await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 100, 3600
      );
      const r = await raffle.getRaffle(0);
      expect(r.organizer).to.equal(organizer.address);
      expect(r.ticketPrice).to.equal(ethers.parseEther("1"));
      expect(r.maxTickets).to.equal(100);
      expect(r.isActive).to.be.true;
      expect(r.totalTickets).to.equal(0);
    });

    it("increments raffle counter", async () => {
      await raffle.connect(organizer).createRaffle(await usdt.getAddress(), ethers.parseEther("1"), 10, 3600);
      await raffle.connect(organizer).createRaffle(await usdt.getAddress(), ethers.parseEther("2"), 20, 7200);
      expect(await raffle.raffleCounter()).to.equal(2);
    });

    it("reverts if not allowed organizer", async () => {
      await expect(raffle.connect(attacker).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 10, 3600
      )).to.be.revertedWith("Not an allowed organizer");
    });

    it("reverts if no stake for token", async () => {
      // organizer already has USDT stake from beforeEach, try USDC without staking
      await expect(raffle.connect(organizer).createRaffle(
        await usdc.getAddress(), 10n ** 6n, 10, 3600
      )).to.be.revertedWith("Must stake in this token first");
    });

    it("reverts with zero ticket price", async () => {
      await expect(raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), 0, 10, 3600
      )).to.be.revertedWith("Price must be > 0");
    });

    it("reverts with zero max tickets", async () => {
      await expect(raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 0, 3600
      )).to.be.revertedWith("Max tickets must be > 0");
    });

    it("reverts with zero duration", async () => {
      await expect(raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 10, 0
      )).to.be.revertedWith("Duration must be > 0");
    });

    it("reverts when paused", async () => {
      await raffle.setAgentPaused(true);
      await expect(raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 10, 3600
      )).to.be.revertedWith("Agent is paused");
    });
  });

  // ========== TICKET PURCHASE ==========

  describe("Ticket Purchase", () => {
    beforeEach(async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
      await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 10, 3600
      );
    });

    it("allows buying tickets", async () => {
      await raffle.connect(player1).purchaseTickets(0, 3);
      expect(await raffle.getParticipantTickets(0, player1.address)).to.equal(3);
      const r = await raffle.getRaffle(0);
      expect(r.totalTickets).to.equal(3);
      expect(r.totalPrize).to.equal(ethers.parseEther("3"));
    });

    it("correctly assigns ticket ownership", async () => {
      await raffle.connect(player1).purchaseTickets(0, 2);
      await raffle.connect(player2).purchaseTickets(0, 3);
      expect(await raffle.getTicketOwner(0, 0)).to.equal(player1.address);
      expect(await raffle.getTicketOwner(0, 1)).to.equal(player1.address);
      expect(await raffle.getTicketOwner(0, 2)).to.equal(player2.address);
      expect(await raffle.getTicketOwner(0, 3)).to.equal(player2.address);
      expect(await raffle.getTicketOwner(0, 4)).to.equal(player2.address);
    });

    it("transfers correct token amount", async () => {
      const balBefore = await usdt.balanceOf(player1.address);
      await raffle.connect(player1).purchaseTickets(0, 5);
      const balAfter = await usdt.balanceOf(player1.address);
      expect(balBefore - balAfter).to.equal(ethers.parseEther("5"));
    });

    it("reverts buying 0 tickets", async () => {
      await expect(raffle.connect(player1).purchaseTickets(0, 0))
        .to.be.revertedWith("Must buy > 0 tickets");
    });

    it("reverts buying > 100 tickets per tx", async () => {
      // Need a raffle with more capacity
      await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 200, 3600
      );
      await expect(raffle.connect(player1).purchaseTickets(1, 101))
        .to.be.revertedWith("Max 100 tickets per tx");
    });

    it("reverts exceeding max tickets", async () => {
      await raffle.connect(player1).purchaseTickets(0, 8);
      await expect(raffle.connect(player2).purchaseTickets(0, 3))
        .to.be.revertedWith("Exceeds max tickets");
    });

    it("reverts after raffle ended", async () => {
      await time.increase(3601);
      await expect(raffle.connect(player1).purchaseTickets(0, 1))
        .to.be.revertedWith("Raffle ended");
    });

    it("reverts on cancelled raffle", async () => {
      await raffle.cancelRaffle(0, "test");
      await expect(raffle.connect(player1).purchaseTickets(0, 1))
        .to.be.revertedWith("Raffle not active");
    });
  });

  // ========== DRAW WINNER ==========

  describe("Draw Winner", () => {
    beforeEach(async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
      await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("10"), 10, 3600
      );
      await raffle.connect(player1).purchaseTickets(0, 3);
      await raffle.connect(player2).purchaseTickets(0, 4);
      await raffle.connect(player3).purchaseTickets(0, 3);
    });

    it("draws winner after max tickets sold", async () => {
      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test-vrf"));
      await raffle.connect(organizer).drawWinner(0, 42, vrfHash);
      const r = await raffle.getRaffle(0);
      expect(r.isDrawn).to.be.true;
      expect(r.isActive).to.be.false;
      expect(r.winner).to.not.equal(ethers.ZeroAddress);
    });

    it("draws winner after time expired", async () => {
      // Create new raffle with fewer tickets sold
      await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 100, 3600
      );
      await raffle.connect(player1).purchaseTickets(1, 5);
      await time.increase(3601);
      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test-vrf-2"));
      await raffle.connect(organizer).drawWinner(1, 42, vrfHash);
      const r = await raffle.getRaffle(1);
      expect(r.isDrawn).to.be.true;
    });

    it("distributes fees correctly (95/3/2)", async () => {
      const totalPrize = ethers.parseEther("100"); // 10 tickets * 10 USDT
      const treasuryBefore = await usdt.balanceOf(treasury.address);
      const organizerBefore = await usdt.balanceOf(organizer.address);

      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test-vrf"));
      // Pick random number that selects player1 (ticket 0-2)
      await raffle.connect(organizer).drawWinner(0, 1, vrfHash);
      const r = await raffle.getRaffle(0);

      const winnerBal = await usdt.balanceOf(r.winner);
      const treasuryAfter = await usdt.balanceOf(treasury.address);
      const organizerAfter = await usdt.balanceOf(organizer.address);

      const platformFee = treasuryAfter - treasuryBefore;
      const orgFee = organizerAfter - organizerBefore;

      expect(platformFee).to.equal(ethers.parseEther("3")); // 3%
      expect(orgFee).to.equal(ethers.parseEther("2")); // 2%
      // Winner gets 95% = 95 USDT
    });

    it("stores VRF hash on-chain", async () => {
      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test-vrf"));
      await raffle.connect(organizer).drawWinner(0, 42, vrfHash);
      expect(await raffle.vrfHashes(0)).to.equal(vrfHash);
    });

    it("reverts if not organizer or owner", async () => {
      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test-vrf"));
      await expect(raffle.connect(attacker).drawWinner(0, 42, vrfHash))
        .to.be.revertedWith("Not authorized");
    });

    it("reverts if no tickets sold", async () => {
      await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 10, 60
      );
      await time.increase(61);
      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test-vrf"));
      await expect(raffle.connect(organizer).drawWinner(1, 42, vrfHash))
        .to.be.revertedWith("No tickets sold");
    });

    it("reverts double draw", async () => {
      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test-vrf"));
      await raffle.connect(organizer).drawWinner(0, 42, vrfHash);
      await expect(raffle.connect(organizer).drawWinner(0, 42, vrfHash))
        .to.be.revertedWith("Raffle not active");
    });

    it("reverts if raffle not ended and not full", async () => {
      await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 100, 3600
      );
      await raffle.connect(player1).purchaseTickets(1, 5);
      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test-vrf"));
      await expect(raffle.connect(organizer).drawWinner(1, 42, vrfHash))
        .to.be.revertedWith("Not ended yet");
    });

    it("owner can also draw", async () => {
      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test-vrf"));
      await raffle.connect(owner).drawWinner(0, 42, vrfHash);
      expect((await raffle.getRaffle(0)).isDrawn).to.be.true;
    });
  });

  // ========== CANCELLATION & REFUNDS ==========

  describe("Cancellation & Refunds", () => {
    beforeEach(async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
      await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("10"), 10, 3600
      );
    });

    it("organizer can cancel with no tickets", async () => {
      await raffle.connect(organizer).cancelRaffle(0, "changed mind");
      const r = await raffle.getRaffle(0);
      expect(r.isCancelled).to.be.true;
      expect(r.isActive).to.be.false;
    });

    it("organizer cannot cancel after tickets sold", async () => {
      await raffle.connect(player1).purchaseTickets(0, 1);
      await expect(raffle.connect(organizer).cancelRaffle(0, "want money"))
        .to.be.revertedWith("Cannot cancel: tickets already sold");
    });

    it("owner CAN cancel even after tickets sold", async () => {
      await raffle.connect(player1).purchaseTickets(0, 3);
      await raffle.connect(owner).cancelRaffle(0, "emergency");
      expect((await raffle.getRaffle(0)).isCancelled).to.be.true;
    });

    it("refund works after cancellation", async () => {
      await raffle.connect(player1).purchaseTickets(0, 5);
      const balBefore = await usdt.balanceOf(player1.address);
      await raffle.connect(owner).cancelRaffle(0, "test");
      await raffle.connect(player1).emergencyRefund(0);
      const balAfter = await usdt.balanceOf(player1.address);
      expect(balAfter - balBefore).to.equal(ethers.parseEther("50")); // 5 * 10 USDT
    });

    it("cannot refund twice", async () => {
      await raffle.connect(player1).purchaseTickets(0, 2);
      await raffle.connect(owner).cancelRaffle(0, "test");
      await raffle.connect(player1).emergencyRefund(0);
      await expect(raffle.connect(player1).emergencyRefund(0))
        .to.be.revertedWith("No tickets");
    });

    it("cannot refund if not cancelled", async () => {
      await raffle.connect(player1).purchaseTickets(0, 2);
      await expect(raffle.connect(player1).emergencyRefund(0))
        .to.be.revertedWith("Not cancelled");
    });

    it("multiple players can refund", async () => {
      await raffle.connect(player1).purchaseTickets(0, 3);
      await raffle.connect(player2).purchaseTickets(0, 4);
      await raffle.connect(owner).cancelRaffle(0, "test");

      await raffle.connect(player1).emergencyRefund(0);
      await raffle.connect(player2).emergencyRefund(0);

      // Contract should have no leftover funds (except organizer stake)
    });

    it("attacker cannot cancel", async () => {
      await expect(raffle.connect(attacker).cancelRaffle(0, "hack"))
        .to.be.revertedWith("Not authorized");
    });
  });

  // ========== FORCE EXPIRE ==========

  describe("Force Expire", () => {
    beforeEach(async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
      await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 10, 3600
      );
      await raffle.connect(player1).purchaseTickets(0, 3);
    });

    it("anyone can force expire after 7-day grace period", async () => {
      await time.increase(3600 + 7 * 86400 + 1);
      await raffle.connect(attacker).forceExpireRaffle(0);
      expect((await raffle.getRaffle(0)).isCancelled).to.be.true;
    });

    it("reverts before grace period", async () => {
      await time.increase(3601);
      await expect(raffle.connect(attacker).forceExpireRaffle(0))
        .to.be.revertedWith("Grace period not over");
    });

    it("refund works after force expire", async () => {
      await time.increase(3600 + 7 * 86400 + 1);
      await raffle.connect(player1).forceExpireRaffle(0);
      await raffle.connect(player1).emergencyRefund(0);
      // No revert = success
    });
  });

  // ========== SLASHING ==========

  describe("Slashing", () => {
    it("owner can slash organizer stake", async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
      const treasuryBefore = await usdt.balanceOf(treasury.address);
      await raffle.slashOrganizer(organizer.address, await usdt.getAddress(), "bad behavior");
      const treasuryAfter = await usdt.balanceOf(treasury.address);
      expect(treasuryAfter - treasuryBefore).to.equal(ethers.parseEther("1"));
      expect(await raffle.organizerStakes(organizer.address, await usdt.getAddress())).to.equal(0);
    });

    it("non-owner cannot slash", async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
      await expect(raffle.connect(attacker).slashOrganizer(organizer.address, await usdt.getAddress(), "hack"))
        .to.be.reverted;
    });
  });

  // ========== TIMELOCKED ADMIN ==========

  describe("Timelocked Admin", () => {
    it("queues and executes fee change after timelock", async () => {
      await raffle.queueSetFees(400, 100);
      await time.increase(2 * 86400 + 1);
      await raffle.executeChange(0);
      expect(await raffle.platformFeeBps()).to.equal(400);
      expect(await raffle.organizerFeeBps()).to.equal(100);
    });

    it("reverts executing before timelock", async () => {
      await raffle.queueSetFees(400, 100);
      await expect(raffle.executeChange(0)).to.be.revertedWith("Timelock not expired");
    });

    it("reverts fees exceeding 10% cap", async () => {
      await expect(raffle.queueSetFees(800, 300))
        .to.be.revertedWith("Fees exceed 10% cap");
    });

    it("can cancel pending change", async () => {
      await raffle.queueSetFees(400, 100);
      await raffle.cancelChange(0);
      await time.increase(2 * 86400 + 1);
      await expect(raffle.executeChange(0)).to.be.revertedWith("Change does not exist");
    });

    it("queues and executes treasury change", async () => {
      await raffle.queueSetTreasury(player1.address);
      await time.increase(2 * 86400 + 1);
      await raffle.executeChange(0);
      expect(await raffle.treasury()).to.equal(player1.address);
    });
  });

  // ========== EMERGENCY WITHDRAW ==========

  describe("Emergency Withdraw", () => {
    it("cannot withdraw locked funds", async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
      await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("10"), 10, 3600
      );
      await raffle.connect(player1).purchaseTickets(0, 5);

      // Try to withdraw the player funds
      await expect(raffle.emergencyWithdraw(await usdt.getAddress(), ethers.parseEther("50")))
        .to.be.revertedWith("Amount exceeds withdrawable balance");
    });

    it("can withdraw excess tokens (accidentally sent)", async () => {
      // Send some tokens directly to the contract
      await usdt.mint(await raffle.getAddress(), ethers.parseEther("100"));
      await raffle.emergencyWithdraw(await usdt.getAddress(), ethers.parseEther("100"));
      // No revert = success
    });

    it("non-owner cannot emergency withdraw", async () => {
      await expect(raffle.connect(attacker).emergencyWithdraw(await usdt.getAddress(), 1))
        .to.be.reverted;
    });
  });

  // ========== EDGE CASES & SECURITY ==========

  describe("Security & Edge Cases", () => {
    beforeEach(async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdt.getAddress());
    });

    it("winning ticket is deterministic from random number", async () => {
      await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 10, 3600
      );
      await raffle.connect(player1).purchaseTickets(0, 5);
      await raffle.connect(player2).purchaseTickets(0, 5);

      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      // random 7 % 10 = 7 → player2 (tickets 5-9)
      await raffle.connect(organizer).drawWinner(0, 7, vrfHash);
      const r = await raffle.getRaffle(0);
      expect(r.winner).to.equal(player2.address);
      expect(r.winningTicket).to.equal(7);
    });

    it("handles raffle with exactly 1 ticket", async () => {
      await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 1, 3600
      );
      await raffle.connect(player1).purchaseTickets(0, 1);
      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      await raffle.connect(organizer).drawWinner(0, 999, vrfHash);
      const r = await raffle.getRaffle(0);
      expect(r.winner).to.equal(player1.address);
    });

    it("handles large random numbers correctly", async () => {
      await raffle.connect(organizer).createRaffle(
        await usdt.getAddress(), ethers.parseEther("1"), 10, 3600
      );
      await raffle.connect(player1).purchaseTickets(0, 10);
      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const bigRandom = ethers.MaxUint256;
      await raffle.connect(organizer).drawWinner(0, bigRandom, vrfHash);
      const r = await raffle.getRaffle(0);
      expect(r.isDrawn).to.be.true;
      expect(r.winner).to.equal(player1.address);
    });

    it("getActiveRaffles returns correct list", async () => {
      await raffle.connect(organizer).createRaffle(await usdt.getAddress(), ethers.parseEther("1"), 10, 3600);
      await raffle.connect(organizer).createRaffle(await usdt.getAddress(), ethers.parseEther("1"), 10, 3600);
      await raffle.connect(organizer).createRaffle(await usdt.getAddress(), ethers.parseEther("1"), 10, 3600);
      await raffle.cancelRaffle(1, "test");

      const active = await raffle.getActiveRaffles();
      expect(active.length).to.equal(2);
      expect(active[0]).to.equal(0);
      expect(active[1]).to.equal(2);
    });

    it("getRafflesByOrganizer returns correct list", async () => {
      await raffle.connect(organizer).createRaffle(await usdt.getAddress(), ethers.parseEther("1"), 10, 3600);
      await raffle.connect(organizer).createRaffle(await usdt.getAddress(), ethers.parseEther("1"), 10, 3600);
      // Owner creates one too (owner is auto-allowed + needs stake)
      await raffle.registerAsOrganizer(await usdt.getAddress());
      await raffle.createRaffle(await usdt.getAddress(), ethers.parseEther("1"), 10, 3600);

      const orgRaffles = await raffle.getRafflesByOrganizer(organizer.address);
      expect(orgRaffles.length).to.equal(2);
    });

    it("6-decimal token raffle works end to end", async () => {
      await raffle.connect(organizer).registerAsOrganizer(await usdc.getAddress());
      const price = 5n * 10n ** 6n; // 5 USDC
      await raffle.connect(organizer).createRaffle(await usdc.getAddress(), price, 10, 60);
      await raffle.connect(player1).purchaseTickets(0, 10);

      const treasuryBefore = await usdc.balanceOf(treasury.address);
      const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
      await raffle.connect(organizer).drawWinner(0, 3, vrfHash);

      const r = await raffle.getRaffle(0);
      expect(r.isDrawn).to.be.true;
      const treasuryAfter = await usdc.balanceOf(treasury.address);
      // 50 USDC total, 3% = 1.5 USDC = 1500000
      expect(treasuryAfter - treasuryBefore).to.equal(1500000n);
    });
  });
});
