import { deployments, getNamedAccounts, ethers } from "hardhat";
import { FirstToken } from "../typechain";
import { Deployment } from "hardhat-deploy/types";

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const token: Deployment = await deployments.get(
    "FirstToken"
  );
  const contractBase: FirstToken = await ethers.getContractAt(
    "FirstToken",
    token.address
  );
  console.log(await contractBase.address);
};

main();
