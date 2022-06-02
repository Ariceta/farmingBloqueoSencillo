import { deployments, getNamedAccounts, ethers } from "hardhat";
import { FirstToken } from "../typechain";
import { Deployment } from "hardhat-deploy/types";
import { BigNumber, ContractTransaction, Signer } from "ethers";

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const signer: Signer = await ethers.getSigner(deployer);

  const token: Deployment = await deployments.get(
    "FirstToken"
  );
  const contractBase: FirstToken = await ethers.getContractAt(
    "FirstToken",
    token.address
  );

  if(await contractBase.paused()){
    contractBase.unpause();
  }

  console.log(await contractBase.address);
  let totalSupply: BigNumber = BigNumber.from(await contractBase.totalSupply());
  console.log(totalSupply);

  let amountToBurn: BigNumber = ethers.utils.parseUnits("20", "ether");
  let tx: ContractTransaction = await contractBase.burn(amountToBurn);
  console.log(tx);
  totalSupply = BigNumber.from(await contractBase.totalSupply());
  console.log(totalSupply);

  let amountToMint: BigNumber = ethers.utils.parseUnits("50", "ether");
  await contractBase.connect(signer).mint(deployer, amountToMint);
  totalSupply = BigNumber.from(await contractBase.totalSupply());
  console.log(totalSupply);

  //Probamos que el cap no deja mintear tanto
  //let tooBigMintQuantity: BigNumber = ethers.utils.parseUnits("20000", "ether"); //duda qué forma es mejor
  //await contractBase.mint(tooBigMintQuantity);

  //Probamos el pause
  let amountToSend: BigNumber = ethers.utils.parseUnits("10", "ether");

  await contractBase.pause();
  //await contractBase.transfer("0x4C2E673918BA30FA109f6f0EfAda49580CE32042", amountToSend);

  await contractBase.unpause();
  await contractBase.transfer("0x4C2E673918BA30FA109f6f0EfAda49580CE32042", amountToSend);
};

main();
