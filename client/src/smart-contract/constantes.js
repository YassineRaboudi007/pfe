import LDTokenAbi from "./ContractABI/LDToken.json";
import AssetAbi from "./ContractABI/AssetContract.json";
import TransactionAbi from "./ContractABI/TransactionContract.json";
import OrderAbi from "./ContractABI/OrderContract.json";

export const LDTokenAddress = "0x7081DCA4b56Eb9759085eB7eF0C1B57B1931c3C4";
export const LDTokenABI = LDTokenAbi.abi;

export const AssetContractAddress =
  "0x0D057716580EaA11FA27b5670916cda0159c95D7";
export const AssetContractABI = AssetAbi.abi;

export const TransactionContractAddress =
  "0x70768F51955BC8F65B550ED4f811649d077f26d1";
export const TransactionContractABI = TransactionAbi.abi;

export const OrderContractAddress =
  "0xD3306B6C7fB6D94827eEd7dBD6579a5520863e65";
export const OrderContractABI = OrderAbi.abi;

export const backendURl = "http://localhost:4000/";
