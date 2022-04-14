import formatEther from "../../utils/formatEther";
import {getAssetContract, getTransactionContract} from "../ContractInstance";

export const buyContractAsset = async (
  buyParams: any[],
  currentBalance: number
) => {
  const TransactionContract = getTransactionContract();
  const AssetContract = getAssetContract();

  let totalPrice: number = 0;
  Promise.all(
    buyParams.map(async (param: any) => {
      const {asset_id, company_id} = param;
      const asset = await AssetContract.getAsset(company_id, asset_id);
      totalPrice += formatEther(asset.price);
    })
  );

  if (totalPrice > currentBalance) {
    return false;
  }

  const tx = await TransactionContract.buyAsset(buyParams);
  return await tx.wait();
};

const reduceArray = (tab: any, field: any) => {
  return tab.reduce((group: any, tx: any) => {
    const value = tx[field];
    group[value] = group[value] ?? [];
    group[value].push(tx);
    return group;
  }, {});
};

export const getUserTransactions = async () => {
  const TransactionContract = getTransactionContract();
  const res = await TransactionContract.getUserTransactions();

  const groupByDate = res.reduce((group: any, tx: any) => {
    const {timestamp} = tx;
    const date = new Date(timestamp * 1000).toLocaleString();
    group[date] = group[date] ?? [];
    group[date].push(tx);
    return group;
  }, {});

  const groupByDateAndAsset = Object.keys(groupByDate).reduce(
    (group: any, tx: any) => {
      const res = reduceArray(groupByDate[tx], "company_id");
      group[tx] = group[tx] ?? [];
      group[tx].push(res);
      return group;
    },
    {}
  );

  const sanaInspiration = Object.keys(groupByDateAndAsset).map((date: any) => {
    const sanares = Object.keys(groupByDateAndAsset[date][0]).map(
      (company_id: any) => {
        const res = reduceArray(
          groupByDateAndAsset[date][0][company_id],
          "sellPrice"
        );

        const finalRes = Object.keys(res).map((reskey) => {
          return {
            quantity: res[reskey].length,
            prix: reskey,
            position: res[reskey][0].isBuyer,
          };
        })[0];

        return {company_id, ...finalRes, date};
      }
    );

    return sanares;

    // const company_id = Object.keys(groupByDateAndAsset[date][0])[0];
    // console.log();

    // const res = reduceArray(
    //   groupByDateAndAsset[date][0][company_id],
    //   "sellPrice"
    // );

    // const finalRes = Object.keys(res).map((reskey) => {
    //   return {
    //     quantity: res[reskey].length,
    //     prix: reskey,
    //     position: res[reskey][0].isBuyer,
    //   };
    // })[0];
    // return {company_id, ...finalRes, date};
  });

  // const x = res.map((el: any) =>
  //   new Date(el.timestamp * 1000).toLocaleString()
  // );
  // console.log("orignal data ", x);

  return sanaInspiration;
};
