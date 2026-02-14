import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const treasury = "0xaDA1E751F2BB9b245Ca59a381f92394591233D71";

  const result = await deploy("AgentRaffleV3", {
    from: deployer,
    args: [treasury],
    log: true,
    autoMine: true,
  });

  console.log("AgentRaffleV3 deployed to:", result.address);

  // Whitelist tokens
  const contract = await hre.ethers.getContractAt("AgentRaffleV3", result.address);
  const tokens = [
    { addr: "0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e", dec: 6, name: "USDT" },
    { addr: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C", dec: 6, name: "USDC" },
    { addr: "0x765de816845861e75a25fca122bb6898b8b1282a", dec: 18, name: "USDm" },
  ];
  for (const t of tokens) {
    const tx = await contract.setAllowedToken(t.addr, true, t.dec);
    await tx.wait();
    console.log(`Whitelisted ${t.name} (${t.dec} decimals)`);
  }
};

func.tags = ["V3"];
export default func;
