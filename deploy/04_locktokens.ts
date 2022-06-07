import { run, ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const example = await deploy("LockTokens", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 10,
  });

  console.log("LockTokens deployed at: ", example.address);
  
  await delay(5000);

  /*
  await run("verify:verify", {
    address: example.address,
    contract: "contracts/LockTokens.sol:LockTokens",
    constructorArguments: []
  });
*/  
  
  
};

deploy.tags = ["LockTokens"];
export default deploy;
