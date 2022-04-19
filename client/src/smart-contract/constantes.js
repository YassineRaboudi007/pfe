import LDTokenAbi from "./ContractABI/LDToken.json";
import AssetAbi from "./ContractABI/AssetContract.json";
import TransactionAbi from "./ContractABI/TransactionContract.json";
import OrderAbi from "./ContractABI/OrderContract.json";

export const LDTokenAddress = "0xb26C88f207B275bad12D875C7cB001F60De26365";
export const LDTokenABI = LDTokenAbi.abi;

export const AssetContractAddress =
  "0xcb6fc5769c8A5044e88BFbD90439fB3d190644AC";
export const AssetContractABI = AssetAbi.abi;

export const TransactionContractAddress =
  "0x8461Facc791e2E93192b6DD4489cdA1f07ca4238";
export const TransactionContractABI = TransactionAbi.abi;

export const OrderContractAddress =
  "0x58Fc4B3C353F3Dbaf25457D931Be2d5d6882F2F2";

export const OrderContractABI = OrderAbi.abi;

export const backendURl = "http://localhost:4000/";
