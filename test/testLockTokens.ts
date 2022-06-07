import { BigNumber, Contract, Signer } from "ethers";
import { deployments, ethers } from "hardhat";
import { Deployment } from "hardhat-deploy/dist/types";
import { Address } from "hardhat-deploy/types";
import { expect, assert } from "chai";
import { parseUnits } from "ethers/lib/utils";
import { FirstToken } from "../typechain/FirstToken";
import { SecondToken } from "../typechain";
import { LockTokens } from "../typechain/LockTokens";


describe("Test suite", async function () {
  let accounts: Signer[];
  let lockTokensDeployment: Deployment;
  let lockTokensContract: LockTokens;
  let firstTokenContract: FirstToken;
  let firstTokenontractDeployment: Deployment;
  let secondTokenContract: SecondToken;
  let secondTokenontractDeployment: Deployment;

  before(async function () {
    accounts = await ethers.getSigners();
    lockTokensDeployment = await deployments.get("LockTokens");
    lockTokensContract = await ethers.getContractAt(
        "LockTokens",
        lockTokensDeployment.address
      );

    firstTokenontractDeployment =  await deployments.get("FirstToken");
    firstTokenContract = await ethers.getContractAt(
      "FirstToken",
      firstTokenontractDeployment.address
    );

    secondTokenontractDeployment =  await deployments.get("SecondToken");
    secondTokenContract = await ethers.getContractAt(
      "SecondToken",
      secondTokenontractDeployment.address
    );

    let ownerSigner: Signer = accounts[0];
    let ownerAddress: Address = await accounts[0].getAddress();
    let aliceAddress: Address = await accounts[1].getAddress();
    let bobAddress: Address = await accounts[2].getAddress();
    let mintAmount: BigNumber = parseUnits("10000", "ether");
        
    //await firstTokenContract.mint(ownerAddress, mintAmount);
    await firstTokenContract.mint(aliceAddress, mintAmount);
    await firstTokenContract.mint(bobAddress, mintAmount);

    await secondTokenContract.mint(aliceAddress, mintAmount);
    await secondTokenContract.mint(bobAddress, mintAmount);
  });

  describe("Unit tests: depositAndBlock()", () => {
    it("Not able to stake less than 1 token", async () => {
      let alice: Signer = accounts[0];
      let depositAmount: BigNumber = parseUnits("0", "ether");
      await (expect(lockTokensContract.connect(alice).depositAndLock(depositAmount))).to.revertedWith("Deposit amount must be bigger than 0");
    });

    it("Not able to stake if not sufficient amount", async () => {
      let alice: Signer = accounts[0];
      let depositAmount: BigNumber = parseUnits("10001", "ether");
      await (expect(lockTokensContract.connect(alice).depositAndLock(depositAmount))).to.revertedWith("Not enough funds for staking");
    });
  });

});