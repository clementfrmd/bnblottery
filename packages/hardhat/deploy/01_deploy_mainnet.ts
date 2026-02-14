import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Celottery Mainnet Deploy — Celo Mainnet
 *
 * Treasury: 2-of-2 Safe (0xaDA1E751F2BB9b245Ca59a381f92394591233D71)
 * Stake Token: USDm (0x765de816845861e75a25fca122bb6898b8b1282a)
 * Allowed Tokens: USDT, USDC, USDm
 */
const deployMainnet: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, execute } = hre.deployments;

  const TREASURY = "0xaDA1E751F2BB9b245Ca59a381f92394591233D71";
  const USDm = "0x765de816845861e75a25fca122bb6898b8b1282a";
  const USDC = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";
  const USDT = "0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e";

  const raffle = await deploy("AgentRaffleV2", {
    from: deployer,
    args: [TREASURY, USDm], // treasury = Safe multisig, stakeToken = USDm
    log: true,
    autoMine: true,
  });

  console.log("AgentRaffleV2 deployed to:", raffle.address);

  // Whitelist payment tokens
  for (const [name, addr] of [["USDT", USDT], ["USDC", USDC], ["USDm", USDm]]) {
    await execute("AgentRaffleV2", { from: deployer, log: true }, "setAllowedToken", addr, true);
    console.log(`Allowed token: ${name} (${addr})`);
  }

  console.log("\n=== MAINNET DEPLOY COMPLETE ===");
  console.log("Contract:", raffle.address);
  console.log("Treasury:", TREASURY);
  console.log("Owner:", deployer);
  console.log("Allowed tokens: USDT, USDC, USDm");
  console.log("Deployer auto-whitelisted as organizer");
};

deployMainnet.tags = ["Mainnet"];
export default deployMainnet;
