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

  this.beforeEach(async function () {
    accounts = await ethers.getSigners();
    contractDeployment = await deployments.get("FirstToken");
    firstTokenContract = await ethers.getContractAt(
      "FirstToken",
      contractDeployment.address
    );
    if(await firstTokenContract.paused()) firstTokenContract.unpause();
  });

  it("Deployment should assign the total supply of tokens to the owner", async function () {
    let address: Address = await accounts[0].getAddress();
    let address2: Address = await accounts[1].getAddress();
    let ownerBalance = await firstTokenContract.balanceOf(address); //duda
    let otherBalance = await firstTokenContract.balanceOf(address2); //duda
    expect(await firstTokenContract.totalSupply()).to.equal(ownerBalance.add(otherBalance));
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
    let address: Address = await accounts[0].getAddress();
    await firstTokenContract.mint(address, amountToMint);
    expect(await firstTokenContract.totalSupply()).to.equal(currentTotalSupply);
  });

  it("Mining tokens can not increase supply above cap", async function () {
    //let cap: BigNumber = BigNumber.from(await firstTokenContract.cap());
    let tooBigMintQuantity: BigNumber = parseUnits("100000", "ether");
    let address: Address = await accounts[0].getAddress();
    await expect(firstTokenContract.mint(address, tooBigMintQuantity)).to.revertedWith('ERC20Capped: cap exceeded');
  });

  it("Unable to send token when contract is paused", async function () {
    await firstTokenContract.pause();
    let receiverAddress: Address = await accounts[1].getAddress();
    await expect(firstTokenContract.transfer(receiverAddress, 10)).to.revertedWith("ERC20Pausable: token transfer while paused");
    await firstTokenContract.unpause();
  });

  it("Able to send token after contract is unpaused", async function () {
    await firstTokenContract.pause();
    let receiverAddress: Address = await accounts[1].getAddress();
    let receiverPrevBalance: BigNumber = await accounts[1].getBalance();
    let amountToTransfer: BigNumber = parseUnits("10", "ether");
    await firstTokenContract.unpause();
    await firstTokenContract.transfer(receiverAddress, amountToTransfer);
    let receiverCurrentBalance: BigNumber = await accounts[1].getBalance();
    let balanceDifference = receiverCurrentBalance.sub(receiverPrevBalance);
    expect(balanceDifference).to.equal(0);
  });

});
