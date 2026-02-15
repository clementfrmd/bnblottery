import { ethers } from "hardhat";

const RAFFLE = "0x0ebC3201aaD226f933e256c6FDC0c55Ed9290934";
const USDT = "0x53298c20D3E29F9854A077AfB97dB9b0F713E4DD";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Testing with:", deployer.address);

  const raffle = await ethers.getContractAt("AgentRaffleV3", RAFFLE);
  const usdt = await ethers.getContractAt("MockERC20", USDT);

  // 1. Mint mock USDT
  console.log("\n1. Minting 1000 USDT...");
  let nonce = await ethers.provider.getTransactionCount(deployer.address);
  const mintTx = await usdt.mint(deployer.address, ethers.parseEther("1000"), { nonce: nonce++ });
  await mintTx.wait();
  console.log("Balance:", ethers.formatEther(await usdt.balanceOf(deployer.address)), "USDT");

  // 2. Register as organizer (stake 1 USDT)
  console.log("\n2. Registering as organizer...");
  const approveTx = await usdt.approve(RAFFLE, ethers.parseEther("1000"), { nonce: nonce++ });
  await approveTx.wait();
  
  const regTx = await raffle.registerAsOrganizer(USDT, { nonce: nonce++ });
  await regTx.wait();
  console.log("Registered! Stake:", ethers.formatEther(await raffle.organizerStakes(deployer.address, USDT)), "USDT");

  // 3. Create raffle (1 USDT per ticket, 10 max tickets, 60s duration)
  console.log("\n3. Creating raffle...");
  const createTx = await raffle.createRaffle(
    USDT,
    ethers.parseEther("1"), // 1 USDT per ticket
    10, // max 10 tickets
    60, // 60 seconds
    { nonce: nonce++ }
  );
  const receipt = await createTx.wait();
  const raffleId = await raffle.raffleCounter() - 1n;
  console.log("Raffle ID:", raffleId.toString());

  // 4. Buy tickets
  console.log("\n4. Buying 3 tickets...");
  const buyTx = await raffle.purchaseTickets(raffleId, 3, { nonce: nonce++ });
  await buyTx.wait();
  const info = await raffle.getRaffle(raffleId);
  console.log("Tickets sold:", info.totalTickets.toString());
  console.log("Total prize:", ethers.formatEther(info.totalPrize), "USDT");

  // 5. Wait for raffle to end then draw
  console.log("\n5. Waiting 65s for raffle to end...");
  await new Promise(r => setTimeout(r, 65000));

  console.log("Drawing winner...");
  const randomNumber = BigInt(Math.floor(Math.random() * 1000000));
  const vrfHash = ethers.keccak256(ethers.toUtf8Bytes("test-vrf-" + randomNumber.toString()));
  
  nonce = await ethers.provider.getTransactionCount(deployer.address);
  const drawTx = await raffle.drawWinner(raffleId, randomNumber, vrfHash, { nonce });
  await drawTx.wait();

  const finalInfo = await raffle.getRaffle(raffleId);
  console.log("\n=== RAFFLE RESULTS ===");
  console.log("Winner:", finalInfo.winner);
  console.log("Winning ticket:", finalInfo.winningTicket.toString());
  console.log("Drawn:", finalInfo.isDrawn);
  console.log("Total prize:", ethers.formatEther(finalInfo.totalPrize), "USDT");
  console.log("\n✅ Full raffle flow tested successfully!");
}

main().catch(console.error);
