import { deployments, getNamedAccounts, ethers } from "hardhat";
import { BaseContract } from "../typechain";
import { Deployment } from "hardhat-deploy/types";

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const contractDeployment: Deployment = await deployments.get("BaseContract");
  const contractBase: BaseContract = await ethers.getContractAt(
    "BaseContract",
    contractDeployment.address
  );
};

main();
