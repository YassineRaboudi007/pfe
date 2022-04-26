import LDTokenAbi from "./ContractABI/LDToken.json";
import AssetAbi from "./ContractABI/AssetContract.json";
import TransactionAbi from "./ContractABI/TransactionContract.json";
import OrderAbi from "./ContractABI/OrderContract.json";

export const LDTokenAddress = "0x2e7A323F924d56a3ba44aF754099d76A18112C65";
export const LDTokenABI = LDTokenAbi.abi;

export const AssetContractAddress =
  "0xd2D3d37E3C56E1b31449f78Ca201753614f420ED";
export const AssetContractABI = AssetAbi.abi;

export const TransactionContractAddress =
  "0x3e839323a972943BedCD27c72e32E0e3C6906a8D";
export const TransactionContractABI = TransactionAbi.abi;

export const OrderContractAddress =
  "0xCB3715944505636840688bF6906983cEb19F85Ef";

export const OrderContractABI = OrderAbi.abi;

export const backendURl = "http://localhost:4000/";
