import LDTokenAbi from "./ContractABI/LDToken.json";
import AssetAbi from "./ContractABI/AssetContract.json";
import TransactionAbi from "./ContractABI/TransactionContract.json";
import OrderAbi from "./ContractABI/OrderContract.json";

export const LDTokenAddress = "0x69d149FAE214EaB4186EfFa3FcF4d06C74B13A4c";
export const LDTokenABI = LDTokenAbi.abi;

export const AssetContractAddress =
  "0x74078Ef934950991b51d7440ca2F74Ed5898d389";
export const AssetContractABI = AssetAbi.abi;

export const TransactionContractAddress =
  "0x310a45d5FbF31a1B6a00b7AB3E0bB98f1421f692";
export const TransactionContractABI = TransactionAbi.abi;

export const OrderContractAddress =
  "0x4FFdA91e685EBe2c89F8DA6428DA6E626412ed0A";
export const OrderContractABI = OrderAbi.abi;

export const backendURl = "http://localhost:4000/";
