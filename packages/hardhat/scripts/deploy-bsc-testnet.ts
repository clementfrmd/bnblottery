import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "tBNB");

  // Deploy mock tokens one at a time with explicit nonce
  let nonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log("Starting nonce:", nonce);

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  
  console.log("\nDeploying MockUSDT...");
  const usdt = await MockERC20.deploy("Mock USDT", "USDT", 18, { nonce: nonce++ });
  await usdt.waitForDeployment();
  console.log("MockUSDT:", await usdt.getAddress());

  console.log("Deploying MockUSDC...");
  const usdc = await MockERC20.deploy("Mock USDC", "USDC", 18, { nonce: nonce++ });
  await usdc.waitForDeployment();
  console.log("MockUSDC:", await usdc.getAddress());

  console.log("Deploying MockFDUSD...");
  const fdusd = await MockERC20.deploy("Mock FDUSD", "FDUSD", 18, { nonce: nonce++ });
  await fdusd.waitForDeployment();
  console.log("MockFDUSD:", await fdusd.getAddress());

  console.log("\nDeploying AgentRaffleV3...");
  const AgentRaffleV3 = await ethers.getContractFactory("AgentRaffleV3");
  const raffle = await AgentRaffleV3.deploy(deployer.address, { nonce: nonce++ });
  await raffle.waitForDeployment();
  const raffleAddr = await raffle.getAddress();
  console.log("AgentRaffleV3:", raffleAddr);

  // Whitelist tokens
  console.log("\nWhitelisting tokens...");
  const tokens = [
    { addr: await usdt.getAddress(), dec: 18, name: "USDT" },
    { addr: await usdc.getAddress(), dec: 18, name: "USDC" },
    { addr: await fdusd.getAddress(), dec: 18, name: "FDUSD" },
  ];

  for (const t of tokens) {
    const tx = await raffle.setAllowedToken(t.addr, true, t.dec, { nonce: nonce++ });
    await tx.wait();
    console.log(`✅ ${t.name} whitelisted (${t.dec} dec) at ${t.addr}`);
  }

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log(JSON.stringify({
    network: "bscTestnet",
    deployer: deployer.address,
    contracts: {
      AgentRaffleV3: raffleAddr,
      MockUSDT: await usdt.getAddress(),
      MockUSDC: await usdc.getAddress(),
      MockFDUSD: await fdusd.getAddress(),
    }
  }, null, 2));
}

main().catch(console.error);
