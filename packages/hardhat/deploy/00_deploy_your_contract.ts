import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy MockERC20 tokens for testing
  const mockCUSD = await deploy("MockcUSD", {
    from: deployer,
    contract: "MockERC20",
    args: ["Mock cUSD", "cUSD", 18],
    log: true,
    autoMine: true,
  });

  const mockCEUR = await deploy("MockcEUR", {
    from: deployer,
    contract: "MockERC20",
    args: ["Mock cEUR", "cEUR", 18],
    log: true,
    autoMine: true,
  });

  const mockUSDC = await deploy("MockUSDC", {
    from: deployer,
    contract: "MockERC20",
    args: ["Mock USDC", "USDC", 6],
    log: true,
    autoMine: true,
  });

  // Deploy AgentRaffleV2 with treasury address and stake token (cUSD for testnet)
  const treasuryAddress = "0x3d5A8F83F825f4F36b145e1dAD72e3f35a3030aB";
  const stakeTokenAddress = mockCUSD.address; // USDm on mainnet
  const raffle = await deploy("AgentRaffleV2", {
    from: deployer,
    args: [treasuryAddress, stakeTokenAddress],
    log: true,
    autoMine: true,
  });

  console.log("MockcUSD deployed to:", mockCUSD.address);
  console.log("MockcEUR deployed to:", mockCEUR.address);
  console.log("MockUSDC deployed to:", mockUSDC.address);
  console.log("AgentRaffleV2 deployed to:", raffle.address);
};

deployContracts.tags = ["AgentRaffleV2", "MockERC20"];
export default deployContracts;
