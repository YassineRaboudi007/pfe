import {ethers} from "ethers";
import {getAllCompanys} from "../../api/CompanyService";
import {formatOrder} from "../../utils/helperFunctions";
import {getOrderContract} from "../ContractInstance";

interface IFields {
  company: string;
  price: number;
  amount: string;
}

export const createContractBuyOrder = async (values: IFields) => {
  const {company: companyId, price, amount} = values;
  const OrderContract = getOrderContract();
  const tx = await OrderContract.createBuyOrder(
    companyId,
    ethers.utils.parseEther(price.toString()),
    amount
  );
  return await tx.wait();
};

export const createContractSellOrder = async (values: IFields) => {
  const {company: companyId, price, amount} = values;
  const OrderContract = getOrderContract();
  const tx = await OrderContract.createSellOrder(
    companyId,
    ethers.utils.parseEther(price.toString()),
    amount
  );
  return await tx.wait();
};

export const getSellOrders = async () => {
  const comps = await getAllCompanys();
  const OrderContract = getOrderContract();
  const res = await OrderContract.getAllSellOrders();
  return formatOrder(res, comps);
};

export const getBuyOrders = async () => {
  const comps = await getAllCompanys();
  const OrderContract = getOrderContract();
  const res = await OrderContract.getAllBuyOrders();
  return formatOrder(res, comps);
};

export const getCurrentCompanyBuyOrder = async (company_id: any) => {
  const OrderContract = getOrderContract();
  const res = await OrderContract.getCurrentCompanyBuyOrder(company_id);
  return res;
};

export const getReadyBuyOrders = async () => {
  const OrderContract = getOrderContract();
  const res = await OrderContract.getReadyBuyOrders();
  return res;
};

export const getBuyOrder = async (id: number) => {
  const OrderContract = getOrderContract();
  const res = await OrderContract.getBuyOrder(id);

  return res;
};
