import { BigNumber, Contract, Signer } from "ethers";
import { deployments, ethers } from "hardhat";
import { Deployment } from "hardhat-deploy/dist/types";
import { Address } from "hardhat-deploy/types";
import { FirstToken } from "../typechain/FirstToken";
import { expect } from "chai";
import { parseUnits } from "ethers/lib/utils";


describe("Test suite", async function () {
  let accounts: Signer[];
  let contractDeployment: Deployment;
  let firstTokenContract: FirstToken;

  const amountToMint: BigNumber = parseUnits("20", "ether");
  const amountToBurn: BigNumber = parseUnits("10", "ether");

  before(async function () {
    accounts = await ethers.getSigners();
    contractDeployment = await deployments.get("FirstToken");
    firstTokenContract = await ethers.getContractAt(
      "FirstToken",
      contractDeployment.address
    );
  });

  it("Deployment should assign the total supply of tokens to the owner", async function () {
    let address: Address = await accounts[0].getAddress();
    let ownerBalance = await firstTokenContract.balanceOf(address); //duda
    expect(await firstTokenContract.totalSupply()).to.equal(ownerBalance);
  });

  it("Burning should decrease total supply", async function () {
    let currentTotalSupply = BigNumber.from(await firstTokenContract.totalSupply());
    currentTotalSupply = currentTotalSupply.sub(amountToBurn);
    await firstTokenContract.burn(amountToBurn);
    expect(await firstTokenContract.totalSupply()).to.equal(currentTotalSupply);
  });

  it("Minting should increase total supply", async function () {
    let currentTotalSupply = BigNumber.from(await firstTokenContract.totalSupply());
    currentTotalSupply = currentTotalSupply.add(amountToMint);
    await firstTokenContract.mint(amountToMint);
    expect(await firstTokenContract.totalSupply()).to.equal(currentTotalSupply);
  });
});
