import { BigNumber, Contract, Signer } from "ethers";
import { deployments, ethers } from "hardhat";
import { Deployment } from "hardhat-deploy/dist/types";
import { Address } from "hardhat-deploy/types";
import { SecondToken } from "../typechain/SecondToken";
import { expect } from "chai";
import { parseUnits } from "ethers/lib/utils";


describe("Test suite", async function () {
  let accounts: Signer[];
  let contractDeployment: Deployment;
  let secondTokenContract: SecondToken;

  const amountToMint: BigNumber = parseUnits("20", "ether");
  const amountToBurn: BigNumber = parseUnits("10", "ether");
  const pauserRole = "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a";
  const minterRole = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";

  this.beforeEach(async function () {
    accounts = await ethers.getSigners();
    contractDeployment = await deployments.get("SecondToken");
    secondTokenContract = await ethers.getContractAt(
      "SecondToken",
      contractDeployment.address
    );
    
    let adminSigner: Signer = await accounts[0];
    let adminAddress: Address = await adminSigner.getAddress();

    await secondTokenContract.connect(adminSigner).grantRole(pauserRole, adminAddress);
    await secondTokenContract.connect(adminSigner).grantRole(minterRole, adminAddress);

    if(await secondTokenContract.paused()) await secondTokenContract.unpause();
  });

  it("Deployment should assign the total supply of tokens to the owner", async function () {
    let address: Address = await accounts[0].getAddress();
    let address2: Address = await accounts[1].getAddress();
    let ownerBalance = await secondTokenContract.balanceOf(address); //duda
    let otherBalance = await secondTokenContract.balanceOf(address2); //duda
    expect(await secondTokenContract.totalSupply()).to.equal(ownerBalance.add(otherBalance));
  });
  
  it("Burning should decrease total supply", async function () {
    let currentTotalSupply = BigNumber.from(await secondTokenContract.totalSupply());
    currentTotalSupply = currentTotalSupply.sub(amountToBurn);
    await secondTokenContract.burn(amountToBurn);
    expect(await secondTokenContract.totalSupply()).to.equal(currentTotalSupply);
  });

  it("Minting should increase total supply", async function () {
    let currentTotalSupply = BigNumber.from(await secondTokenContract.totalSupply());
    currentTotalSupply = currentTotalSupply.add(amountToMint);
    let address: Address = await accounts[0].getAddress();
    await secondTokenContract.mint(address, amountToMint);
    expect(await secondTokenContract.totalSupply()).to.equal(currentTotalSupply);
  });

  it("Mining tokens can not increase supply above cap", async function () {
    //let cap: BigNumber = BigNumber.from(await firstTokenContract.cap());
    let tooBigMintQuantity: BigNumber = parseUnits("100000", "ether");
    let address: Address = await accounts[0].getAddress();
    await expect(secondTokenContract.mint(address, tooBigMintQuantity)).to.revertedWith('ERC20Capped: cap exceeded');
  });

  it("Unable to send token when contract is paused", async function () {
    await secondTokenContract.pause();
    let receiverAddress: Address = await accounts[1].getAddress();
    await expect(secondTokenContract.transfer(receiverAddress, 10)).to.revertedWith("ERC20Pausable: token transfer while paused");
  });

  it("Able to send token after contract is unpaused", async function () {
    let adminSigner: Signer = await accounts[0];
    await secondTokenContract.connect(adminSigner).pause();
    let receiverAddress: Address = await accounts[1].getAddress();
    let receiverPrevBalance: BigNumber = await accounts[1].getBalance();
    let amountToTransfer: BigNumber = parseUnits("10", "ether");
    await secondTokenContract.connect(adminSigner).unpause();
    await secondTokenContract.transfer(receiverAddress, amountToTransfer);
    let receiverCurrentBalance: BigNumber = await accounts[1].getBalance();
    let balanceDifference = receiverCurrentBalance.sub(receiverPrevBalance);
    expect(balanceDifference).to.equal(0);
  });

  it("Unable to grant roles if not admin", async function () {
    let notAdminSigner: Signer = await accounts[1];
    let notAdminAddress2: Address = await accounts[2].getAddress();
    await expect(secondTokenContract.connect(notAdminSigner).grantRole(pauserRole, notAdminAddress2)).to.reverted;
  });

  it("Able to grant roles if admin", async function () {
    let adminSigner: Signer = await accounts[0];
    let notAdminAddress: Address = await accounts[1].getAddress();

    await secondTokenContract.connect(adminSigner).grantRole(pauserRole, notAdminAddress);

    await expect(secondTokenContract.hasRole(pauserRole, notAdminAddress));
  });

  it("Able to pause if have pauser role", async function () {
    let adminSigner: Signer = await accounts[0];    
    let notAdminAddress: Address = await accounts[1].getAddress();
    await secondTokenContract.connect(adminSigner).grantRole(pauserRole, notAdminAddress);
   
  });

  it("Unable to pause if not have pauser role", async function () {
    let notAdminSigner: Signer = await accounts[2];
    let notAdminAddress: Address = await accounts[3].getAddress();
    await expect(secondTokenContract.connect(notAdminSigner).pause()).to.reverted;
  });

});
