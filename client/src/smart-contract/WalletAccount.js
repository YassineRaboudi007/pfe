import {ethers} from "ethers";
import {AssetContractAddress, AssetContractABI} from "./constantes";
import {getAllAssets} from "./ContractFunctions/AssetContractFunctions";
const {ethereum} = window;

export const checkIfWalletAccountIsConnected = async () => {
  if (!ethereum || !ethereum.isMetaMask)
    return alert("Please install metamask");
  const accounts = await ethereum.request({method: "eth_accounts"});
  if (accounts.length) {
    return accounts[0];
  }
};

export const connectWalletAccounts = async () => {
  try {
    if (!ethereum) return alert("Please install metamask");
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (err) {
    console.error(err);
    throw new Error("No Ethereum account");
  }
};
