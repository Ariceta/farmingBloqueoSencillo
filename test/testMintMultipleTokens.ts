import { BigNumber, Contract, Signer } from "ethers";
import { deployments, ethers } from "hardhat";
import { Deployment } from "hardhat-deploy/dist/types";
import { Address } from "hardhat-deploy/types";
import { MintMultipleTokens } from "../typechain/MintMultipleTokens";
import { expect, assert, use } from "chai";
import { parseUnits } from "ethers/lib/utils";
import { FirstToken } from "../typechain/FirstToken";
import { SecondToken } from "../typechain";
import { snapshot, makeSnapshot } from "./test-helpers/snapshot";

describe("Test suite", async function () {
  let accounts: Signer[];
  let contractDeployment: Deployment;
  let mintMTContract: MintMultipleTokens;
  let firstTokenContract: FirstToken;
  let secondTokenContract: SecondToken;
  let firstTokenontractDeployment: Deployment;
  let secondTokenontractDeployment: Deployment;
  let isSnapshotNeeded: Boolean = true;
  let blockID: number;

  const minterRole = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";

  this.beforeEach(async function () {

    accounts = await ethers.getSigners();

    contractDeployment = await deployments.get("MintMultipleTokens");
    mintMTContract = await ethers.getContractAt(
      "MintMultipleTokens",
      contractDeployment.address
    );

    firstTokenontractDeployment = await deployments.get("FirstToken");
    firstTokenContract = await ethers.getContractAt(
      "FirstToken",
      firstTokenontractDeployment.address
    );

    secondTokenontractDeployment = await deployments.get("SecondToken");
    secondTokenContract = await ethers.getContractAt(
      "SecondToken",
      secondTokenontractDeployment.address
    );

    let ownerSigner: Signer = accounts[0];
    let userAddress: Address = await accounts[1].getAddress();

    await secondTokenContract.connect(ownerSigner).revokeRole(minterRole, userAddress);
  });

  it("Normal user is not able to mint FirstToken", async function () {
    let userSigner: Signer = accounts[1];
    let userAddress: Address = await accounts[1].getAddress();
    let mintAmount: BigNumber = parseUnits("1000", "ether");

    await expect(mintMTContract.connect(userSigner).mintSpecificToken(firstTokenContract.address, userAddress, mintAmount)).to.revertedWith("Ownable: caller is not the owner");
  });

  it("Owner is able to mint FirstToken", async function () {
    const id: number = await makeSnapshot();
    let ownerSigner: Signer = accounts[0];
    let ownerAddres: Address = await accounts[0].getAddress();
    let mintAmount: BigNumber = parseUnits("1000", "ether");

    await firstTokenContract.connect(ownerSigner).transferOwnership(mintMTContract.address);

    expect(await mintMTContract.connect(ownerSigner).mintSpecificToken(firstTokenContract.address, ownerAddres, mintAmount));
    await snapshot(id);
  });

  it("User without MINTER_ROLE is not able to mint SecondToken", async function () {
    let userSigner: Signer = accounts[1];
    let userAddress: Address = await accounts[1].getAddress();
    let mintAmount: BigNumber = parseUnits("1000", "ether");

    await expect(mintMTContract.connect(userSigner).mintSpecificToken(secondTokenContract.address, userAddress, mintAmount)).to.be.reverted;
  });

  it("User with MINTER_ROLE is able to mint SecondToken", async function () {
    const id: number = await makeSnapshot();
    let ownerSigner: Signer = accounts[0];
    let userSigner: Signer = accounts[1];
    let userAddress: Address = await accounts[1].getAddress();
    let mintAmount: BigNumber = parseUnits("1000", "ether");

    await secondTokenContract.connect(ownerSigner).grantRole(minterRole, mintMTContract.address);

    expect(await mintMTContract.mintSpecificToken(secondTokenContract.address, userAddress, mintAmount));
    await snapshot(id);
  });

});
