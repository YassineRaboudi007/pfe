import LDTokenAbi from "./ContractABI/LDToken.json";
import AssetAbi from "./ContractABI/AssetContract.json";
import TransactionAbi from "./ContractABI/TransactionContract.json";
import OrderAbi from "./ContractABI/OrderContract.json";
import OperationHistoryAbi from "./ContractABI/OperationHistoryContract.json";

export const LDTokenAddress = "0x0285276A63b0BB60aa1e7ea90Dca0cdc7dfd963F";
export const LDTokenABI = LDTokenAbi.abi;

export const AssetContractAddress =
  "0x4f9cd9422c24Fb994033A8Caa994bfe330fBc40F";
export const AssetContractABI = AssetAbi.abi;

export const TransactionContractAddress =
  "0xE87a70EEBd72F45A585deAc8f74218951b2E741C";
export const TransactionContractABI = TransactionAbi.abi;

export const OrderContractAddress =
  "0x49BC5EA35f0082146ef4D8E1630Ac425C9E5D603";
export const OrderContractABI = OrderAbi.abi;

export const OperationsContractAddress =
  "0x1E996AE3652D0a45de6F1B6a23577a84470D830c";
export const OperationsContractABI = OperationHistoryAbi.abi;

export const backendURl = "http://localhost:4000/";
