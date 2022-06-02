import { deployments, getNamedAccounts, ethers } from "hardhat";
import { FirstToken } from "../typechain";
import { Deployment } from "hardhat-deploy/types";
import { BigNumber, ContractTransaction } from "ethers";

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
  let totalSupply: BigNumber = BigNumber.from(await contractBase.totalSupply());
  console.log(totalSupply);

  let amountToBurn: BigNumber = ethers.utils.parseUnits("20", "ether");
  let tx: ContractTransaction = await contractBase.burn(amountToBurn);
  console.log(tx);
  totalSupply = BigNumber.from(await contractBase.totalSupply());
  console.log(totalSupply.toString());

  let amountToMint: BigNumber = ethers.utils.parseUnits("50", "ether");
  await contractBase.mint(amountToMint);
  totalSupply = BigNumber.from(await contractBase.totalSupply());
  console.log(totalSupply);
};

main();
