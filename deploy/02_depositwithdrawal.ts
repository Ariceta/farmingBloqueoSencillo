import { run, ethers } from "hardhat";
import { DeployFunction, Deployment } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BigNumber } from "ethers";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  let contractDeployment: Deployment = await deployments.get("FirstToken");

  const example = await deploy("DepositWithdrawal", {
    from: deployer,
    args: [contractDeployment.address],
    log: true,
    waitConfirmations: 10,
  });

  console.log("DepositWithdrawal deployed at: ", example.address);
  
  await delay(5000);

  /*
  await run("verify:verify", {
    address: example.address,
    contract: "contracts/DepositWithdrawal.sol:DepositWithdrawal",
    constructorArguments: ["0x7E0c1Fb196FE054034dC97b035874C8e22358b80"]
  });
  */
  
};

deploy.tags = ["DepositWithdrawal"];
export default deploy;
