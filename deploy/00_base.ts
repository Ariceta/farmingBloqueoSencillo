import { run } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const example = await deploy("ExampleContract", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 10,
  });

  console.log("ExampleContract deployed at: ", example.address);

  await run("verify:verify", {
    address: example.address,
    contract: "contracts/ExampleContract.sol:ExampleContract",
  });
};

deploy.tags = ["ExampleContract"];
export default deploy;
