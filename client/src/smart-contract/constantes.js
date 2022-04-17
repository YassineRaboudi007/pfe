import LDTokenAbi from "./ContractABI/LDToken.json";
import AssetAbi from "./ContractABI/AssetContract.json";
import TransactionAbi from "./ContractABI/TransactionContract.json";
import OrderAbi from "./ContractABI/OrderContract.json";

export const LDTokenAddress = "0xDa13D54913b6b1668d90E934CCd7e1b827fd16A1";
export const LDTokenABI = LDTokenAbi.abi;

export const AssetContractAddress =
  "0xA2FE30D75F4898B28A724Bb431cA79390cbD9e4d";
export const AssetContractABI = AssetAbi.abi;

export const TransactionContractAddress =
  "0x4DC64485a2278Fce127A331cf8b6743dCE379488";
export const TransactionContractABI = TransactionAbi.abi;

export const OrderContractAddress =
  "0xE7D4B6ec97379F6ec578B3C5ef4FF4CeBB0121A4";
export const OrderContractABI = OrderAbi.abi;

export const backendURl = "http://localhost:4000/";
