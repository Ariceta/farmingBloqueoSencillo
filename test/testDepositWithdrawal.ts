import { BigNumber, Contract, Signer } from "ethers";
import { deployments, ethers } from "hardhat";
import { Deployment } from "hardhat-deploy/dist/types";
import { Address } from "hardhat-deploy/types";
import { DepositWithdrawal } from "../typechain/DepositWithdrawal";
import { expect, assert } from "chai";
import { parseUnits } from "ethers/lib/utils";
import { FirstToken } from "../typechain/FirstToken";


describe("Test suite", async function () {
  let accounts: Signer[];
  let contractDeployment: Deployment;
  let depositWithdrawalContract: DepositWithdrawal;
  let firstTokenContract: FirstToken;
  let firstTokenontractDeployment: Deployment;

  this.beforeEach(async function () {
    accounts = await ethers.getSigners();
    contractDeployment = await deployments.get("DepositWithdrawal");
    firstTokenontractDeployment =  await deployments.get("FirstToken");
    depositWithdrawalContract = await ethers.getContractAt(
      "DepositWithdrawal",
      contractDeployment.address
    );
    firstTokenContract = await ethers.getContractAt(
      "FirstToken",
      firstTokenontractDeployment.address
    );

    let ownerSigner: Signer = await accounts[0];
    let ownerAddress: Address = await accounts[0].getAddress();
    let addressUser: Address = await accounts[1].getAddress();
    let mintAmount: BigNumber = parseUnits("1000", "ether");
    
    await firstTokenContract.mint(ownerAddress, mintAmount);
    await firstTokenContract.mint(addressUser, mintAmount);
    await depositWithdrawalContract.connect(ownerSigner).removeFromWhiteList(addressUser);
  });

  it("Owner is able to add users to whitelist", async function () {
    let ownerSigner: Signer = await accounts[0];
    let addressUser: Address = await accounts[1].getAddress();

    await depositWithdrawalContract.connect(ownerSigner).addToWhiteList(addressUser);
    assert.isTrue(await depositWithdrawalContract.connect(ownerSigner).whiteList(addressUser), '');
  });

  it("Normal user is not able to add users to whitelist", async function () {
    let notOwnerSigner: Signer = await accounts[1];
    let addressUser: Address = await accounts[2].getAddress();

    await expect(depositWithdrawalContract.connect(notOwnerSigner).addToWhiteList(addressUser)).to.revertedWith("Ownable: caller is not the owner");
  });

  it("Not whitelisted user is not able to deposit", async function () {
    let userSigner: Signer = await accounts[1];
    let depositAmount: BigNumber = parseUnits("10", "ether");
    await firstTokenContract.connect(userSigner).approve(depositWithdrawalContract.address, depositAmount);

    await expect(depositWithdrawalContract.connect(userSigner).deposit(depositAmount)).to.revertedWith("You are not whitelisted");
  });

  it("Whitelisted user is able to deposit", async function () {
    let ownerSigner: Signer = await accounts[0];
    let userSigner: Signer = await accounts[1];
    let addressUser: Address = await accounts[1].getAddress();
    let depositAmount: BigNumber = parseUnits("10", "ether");
    
    await firstTokenContract.connect(userSigner).approve(depositWithdrawalContract.address, depositAmount);
    await depositWithdrawalContract.connect(ownerSigner).addToWhiteList(addressUser);

    expect(await depositWithdrawalContract.connect(userSigner).deposit(depositAmount));
  });
});
