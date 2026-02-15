import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying to BSC Testnet with account:", deployer);

  // Deploy mock stablecoins for testing
  const mockUSDT = await deploy("MockUSDT", {
    from: deployer,
    contract: "MockERC20",
    args: ["Mock USDT", "USDT", 18],
    log: true,
    autoMine: true,
  });

  const mockUSDC = await deploy("MockUSDC_BSC", {
    from: deployer,
    contract: "MockERC20",
    args: ["Mock USDC", "USDC", 18],
    log: true,
    autoMine: true,
  });

  const mockFDUSD = await deploy("MockFDUSD", {
    from: deployer,
    contract: "MockERC20",
    args: ["Mock FDUSD", "FDUSD", 18],
    log: true,
    autoMine: true,
  });

  // Deploy AgentRaffleV3 with treasury = deployer for testnet
  const treasury = deployer;
  const raffle = await deploy("AgentRaffleV3", {
    from: deployer,
    args: [treasury],
    log: true,
    autoMine: true,
  });

  console.log("\n=== Deployed Addresses ===");
  console.log("MockUSDT:", mockUSDT.address);
  console.log("MockUSDC:", mockUSDC.address);
  console.log("MockFDUSD:", mockFDUSD.address);
  console.log("AgentRaffleV3:", raffle.address);

  // Whitelist tokens (all 18 decimals on BSC)
  const contract = await hre.ethers.getContractAt("AgentRaffleV3", raffle.address);
  const tokens = [
    { addr: mockUSDT.address, dec: 18, name: "USDT" },
    { addr: mockUSDC.address, dec: 18, name: "USDC" },
    { addr: mockFDUSD.address, dec: 18, name: "FDUSD" },
  ];

  for (const t of tokens) {
    const tx = await contract.setAllowedToken(t.addr, true, t.dec);
    await tx.wait();
    console.log(`Whitelisted ${t.name} (${t.dec} decimals) at ${t.addr}`);
  }

  console.log("\n✅ BSC Testnet deployment complete!");
};

func.tags = ["BSCTestnet"];
export default func;
