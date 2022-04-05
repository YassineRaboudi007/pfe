import LDTokenAbi from "./ContractABI/LDToken.json";
import AssetAbi from "./ContractABI/AssetContract.json";
import TransactionAbi from "./ContractABI/TransactionContract.json";
import OrderAbi from "./ContractABI/OrderContract.json";

export const LDTokenAddress = "0x928079D4C07a3911DC8491fEb474B34312177F6A";
export const LDTokenABI = LDTokenAbi.abi;

export const AssetContractAddress =
  "0xf29CE8e7676949F201E8475c7416f5c89Cff1646";
export const AssetContractABI = AssetAbi.abi;

export const TransactionContractAddress =
  "0x1393913FE38a207061D54116cc49915C249e0f9d";
export const TransactionContractABI = TransactionAbi.abi;

export const OrderContractAddress =
  "0xe26A363a0f96B6f36427D55cec6A78aa5c16b70A";
export const OrderContractABI = OrderAbi.abi;

export const backendURl = "http://localhost:4000/";
