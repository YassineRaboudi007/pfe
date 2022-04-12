import formatEther from "../../utils/formatEther";
import {getAssetContract, getTransactionContract} from "../ContractInstance";

export const buyContractAsset = async (
  buyParams: any[],
  currentBalance: number
) => {
  const TransactionContract = getTransactionContract();
  const AssetContract = getAssetContract();

  let canBuy: boolean = true;
  let totalPrice: number = 0;
  Promise.all(
    buyParams.map(async (param: any) => {
      const {asset_id, company_id} = param;
      const asset = await AssetContract.getAsset(company_id, asset_id);
      if (!asset.isListed) canBuy = false;
      totalPrice += formatEther(asset.price);
    })
  ).then(() => {
    console.log("totalPrice sana ", totalPrice);
  });

  if (totalPrice > currentBalance) {
    return false;
  }

  const tx = await TransactionContract.buyAsset(buyParams);
  return await tx.wait();
};

export const getUserTransactions = async () => {
  const TransactionContract = getTransactionContract();
  const res = await TransactionContract.getUserTransactions();
  return res;
};
