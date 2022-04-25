import {getAllCompanys} from "../api/CompanyService";
import {getBuyOrder} from "../smart-contract/ContractFunctions/OrderContractFunctions";
import formatEther from "./formatEther";

export const accountAddressSlice = (account: string | null): string => {
  return `${account?.slice(0, 5)} ... ${account?.slice(
    account.length - 6,
    account.length
  )}`;
};

export const formatAsset = (assets: any, companys: any) => {
  const res = assets.map((asset: any) => {
    const companySymbol = companys.filter(
      (el: any) => el._id === asset.company_id
    )[0].symbol;

    return {
      id: asset.id,
      symbol: companySymbol,
      price: formatEther(asset.price._hex),
      owner: asset.owner,
      company_id: asset.company_id,
      isListed: asset.isListed,
    };
  });

  return res;
};

export const formatOrder = (orders: any, companys: any) => {
  const res = orders.map((order: any) => {
    const companySymbol = companys.filter(
      (el: any) => el._id === order.company_id
    )[0].symbol;
    return {
      id: parseInt(order.id, 16),
      issuer:
        order.buyer !== "0x0000000000000000000000000000000000000000"
          ? order.buyer
          : order.seller,
      symbol: companySymbol,
      price: formatEther(order.price._hex),
      quantity: parseInt(order.quantity, 16),
      company_id: order.company_id,
      created_at: new Date(order.timestamp * 1000).toLocaleString(),
      isActive: order.isActive,
    };
  });
  return res;
};

export const formatNotif = async (notifications: any) => {
  console.log("notifications ,", notifications);

  const orderIds = notifications.map((el: any) => el.order_id);
  const orderList = orderIds.filter(
    (v: any, i: any, a: any) => a.indexOf(v) === i
  );
  const Orders = await Promise.all(
    orderList.map(async (order: any) => await getBuyOrder(parseInt(order)))
  );
  const companys = await getAllCompanys();
  // console.log("companys ", companys);
  // console.log("Orders ", Orders);

  const groups = notifications.reduce((notifications: any, item: any) => {
    const compSymbol = companys.filter(
      (el: any) => el._id === item.company_id
    )[0].symbol;

    return {
      ...notifications,

      [item.order_id]: {
        compSymbol,
        isBuyOrder: item.isBuyOrder,
        assets: [...(notifications[item.group] || []), item],
      },
    };
  }, {});
  return groups;
};
