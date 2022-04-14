import LDTokenAbi from "./ContractABI/LDToken.json";
import AssetAbi from "./ContractABI/AssetContract.json";
import TransactionAbi from "./ContractABI/TransactionContract.json";
import OrderAbi from "./ContractABI/OrderContract.json";

export const LDTokenAddress = "0x5a0c0BE0db34e164DB5fF6ddE10a9d365B484572";
export const LDTokenABI = LDTokenAbi.abi;

export const AssetContractAddress =
  "0x243815971dad93258f96CCC83368B18dF7960201";
export const AssetContractABI = AssetAbi.abi;

export const TransactionContractAddress =
  "0xaDd2C2D54B07B1d1a78FF02280Dad727f18f4f22";
export const TransactionContractABI = TransactionAbi.abi;

export const OrderContractAddress =
  "0xf9FE7BD002D8afEc71b8Daee29e532Cea5b940e9";
export const OrderContractABI = OrderAbi.abi;

export const backendURl = "http://localhost:4000/";
