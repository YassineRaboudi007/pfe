// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // We get the contract to deploy
  const LDTOKEN = await hre.ethers.getContractFactory("LDToken");
  const LDToken = await LDTOKEN.deploy();

  await LDToken.deployed();

  // We get the contract to deploy
  const ASSETCONTRACT = await hre.ethers.getContractFactory("AssetContract");
  const AssetContract = await ASSETCONTRACT.deploy();

  await AssetContract.deployed();

  // We get the contract to deploy
  const TRANSACTIONCONTRACT = await hre.ethers.getContractFactory(
    "TransactionContract"
  );
  const TransactionContract = await TRANSACTIONCONTRACT.deploy(
    LDToken.address,
    AssetContract.address
  );

  await TransactionContract.deployed();
  await LDToken.setTransactionContract(TransactionContract.address);

  const ORDERCONTRACT = await hre.ethers.getContractFactory("OrderContract");
  const OrderContract = await ORDERCONTRACT.deploy(AssetContract.address);

  await OrderContract.deployed();
  console.log("Token Contract deployed to:", LDToken.address);
  console.log("Asset Contract deployed to:", AssetContract.address);
  console.log("Transaction Contract deployed to:", TransactionContract.address);
  console.log("Order Contract deployed to:", OrderContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
