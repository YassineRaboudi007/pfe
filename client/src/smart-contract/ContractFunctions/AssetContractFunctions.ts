import {ethers} from "ethers";
import {getAllCompanys} from "../../api/CompanyService";
import {formatAsset} from "../../utils/helperFunctions";
import {getAssetContract} from "../ContractInstance";

interface IFields {
  company: string;
  price: number;
  amount: string;
}

export const addAsset = async (fields: IFields) => {
  if (fields.company === "") {
    return false;
  }

  const AssetContract = getAssetContract();

  const transactionHash = await AssetContract.createAsset(
    ethers.utils.parseEther(fields.price.toString()),
    fields.amount,
    fields.company
  );
  const res = await transactionHash.wait();

  if (res) {
    return true;
  }
  return false;
};

export const getCompanyAssetsInfo = async (comp_id: string) => {
  const AssetContract = getAssetContract();
  const res = await AssetContract.getCompanyAssetsInfo(comp_id);
  return res;
};

export const getAllAssets = async () => {
  const comps = await getAllCompanys();
  const compsID: any = comps.map((el: any) => el._id);
  const AssetContract = getAssetContract();
  const res = await AssetContract.getAllAssets(compsID);

  return res;
};

export const getCompanyAssets = async (name: string) => {
  const comps = await getAllCompanys();
  const thisComp: any = comps.filter((el: any) => el.symbol === name)[0];
  const AssetContract = getAssetContract();

  const res = await AssetContract.getCompanyAssets(thisComp._id);
  return formatAsset(res, comps);
};

export const getOwnerAssets = async () => {
  const comps = await getAllCompanys();
  const compsID: any = comps.map((el: any) => el._id);
  const AssetContract = getAssetContract();
  const res = await AssetContract.getAssetsByOwner(compsID);
  return formatAsset(res, comps);
};

export const getMarketAssets = async () => {
  const comps = await getAllCompanys();
  const compsID: any = comps.map((el: any) => el._id);
  const AssetContract = getAssetContract();
  const res = await AssetContract.getMarketAssets(compsID);
  return formatAsset(res, comps);
};

export const listContractAsset = async (comp_id: string, asset_id: any) => {
  const AssetContract = getAssetContract();
  const assetId: number = parseInt(asset_id._hex, 16);
  const tx = await AssetContract.listAsset(comp_id, assetId);
  return await tx.wait();
};

export const unlistContractAsset = async (comp_id: string, asset_id: any) => {
  const AssetContract = getAssetContract();
  const assetId: number = parseInt(asset_id._hex, 16);
  const tx = await AssetContract.unlistAsset(comp_id, assetId);
  return await tx.wait();
};

export const ContractBuyOrderItems = async (
  company_id: string,
  price: number,
  owner: string
) => {
  const AssetContract = getAssetContract();
  const res = AssetContract.getBuyOrderItems(company_id, price);
  return res;
};

export const getCompanyMarketAssets = async () => {
  const AssetContract = getAssetContract();
  const comps = await getAllCompanys();
  const compsID: any = comps.map((el: any) => el._id);
  console.log("comps ", comps);

  const res = await AssetContract.getCompanyMarketAssets(compsID[2]);
  return res;
};
