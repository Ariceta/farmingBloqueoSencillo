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

  const example = await deploy("FirstToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 10,
  });

  console.log("FirstToken deployed at: ", example.address);
  
  await delay(5000);

  /*
  await run("verify:verify", {
    address: example.address,
    contract: "contracts/FirstToken.sol:FirstToken",
    constructorArguments: [initialSupply]
  });
*/  
  
  
};

deploy.tags = ["FirstToken"];
export default deploy;
