import LDTokenAbi from "./ContractABI/LDToken.json";
import AssetAbi from "./ContractABI/AssetContract.json";
import TransactionAbi from "./ContractABI/TransactionContract.json";
import OrderAbi from "./ContractABI/OrderContract.json";

export const LDTokenAddress = "0x013ADbe3D84cC0d1965b4f929a45a02945721493";
export const LDTokenABI = LDTokenAbi.abi;

export const AssetContractAddress =
  "0x033bAd1c6619225C8D112169a1A999249f327877";
export const AssetContractABI = AssetAbi.abi;

export const TransactionContractAddress =
  "0x98054FBE5645De09916e642B76E15cE26d5e2499";
export const TransactionContractABI = TransactionAbi.abi;

export const OrderContractAddress =
  "0x426834bE9Ca93a4145b0EC7C24A202EB300c856C";

export const OrderContractABI = OrderAbi.abi;

export const backendURl = "http://localhost:4000/";
