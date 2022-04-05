import {ethers} from "ethers";
import {
  LDTokenABI,
  LDTokenAddress,
  AssetContractAddress,
  AssetContractABI,
  TransactionContractABI,
  TransactionContractAddress,
  OrderContractABI,
  OrderContractAddress,
} from "./constantes";

export const getLdtContract = () => {
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "HTTP://127.0.0.1:7545"
  // );
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const LDTContract = new ethers.Contract(LDTokenAddress, LDTokenABI, signer);
  return LDTContract;
};

export const getTransactionContract = () => {
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "HTTP://127.0.0.1:7545"
  // );
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();
  const TransactionContract = new ethers.Contract(
    TransactionContractAddress,
    TransactionContractABI,
    signer
  );

  return TransactionContract;
};

export const getAssetContract = () => {
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "HTTP://127.0.0.1:7545"
  // );
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // const wallet = new ethers.Wallet(
  //   "2ac6190b29d03d2ac71351acf24be68bec290797486c136a0e358d40d81be94f",
  //   provider
  // );
  const signer = provider.getSigner();
  const AssetContract = new ethers.Contract(
    AssetContractAddress,
    AssetContractABI,
    signer
  );
  return AssetContract;
};

export const getOrderContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "HTTP://127.0.0.1:7545"
  // );
  const signer = provider.getSigner();
  const OrderContract = new ethers.Contract(
    OrderContractAddress,
    OrderContractABI,
    signer
  );
  return OrderContract;
};
