import { run, ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BigNumber } from "ethers";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const initialSupply: BigNumber = ethers.utils.parseUnits("12000", "ether");

  const example = await deploy("FirstToken", {
    from: deployer,
    args: [initialSupply],
    log: true,
    waitConfirmations: 10,
  });

  console.log("FirstToken deployed at: ", example.address);
  
  await delay(10000);

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
