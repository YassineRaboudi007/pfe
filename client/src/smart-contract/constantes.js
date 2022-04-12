import LDTokenAbi from "./ContractABI/LDToken.json";
import AssetAbi from "./ContractABI/AssetContract.json";
import TransactionAbi from "./ContractABI/TransactionContract.json";
import OrderAbi from "./ContractABI/OrderContract.json";

export const LDTokenAddress = "0x7264460596B68393c956872520a3175A2CB8C4FC";
export const LDTokenABI = LDTokenAbi.abi;

export const AssetContractAddress =
  "0x194eb04A61866f67189cCe01E27Dca06750087a1";
export const AssetContractABI = AssetAbi.abi;

export const TransactionContractAddress =
  "0x8ec47A37e754493b194B96c67d0d619E4b8D40a5";
export const TransactionContractABI = TransactionAbi.abi;

export const OrderContractAddress =
  "0x3413a2369038A85dCEf19ed31d8927d488ddA4C5";
export const OrderContractABI = OrderAbi.abi;

export const backendURl = "http://localhost:4000/";
