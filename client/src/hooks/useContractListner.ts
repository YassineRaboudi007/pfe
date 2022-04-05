import {useCallback, useEffect, useState} from "react";
import formatEther from "../utils/formatEther";
import {
  getAssetContract,
  getOrderContract,
} from "../smart-contract/ContractInstance";
import {getAllCompanys} from "../api/CompanyService";
import {ContractBuyOrderItems} from "../smart-contract/ContractFunctions/AssetContractFunctions";
import {getCurrentCompanyBuyOrder} from "../smart-contract/ContractFunctions/OrderContractFunctions";

const useContractListner = () => {
  const [notifications, setNotifications] = useState<any>([]);

  const Listners = useCallback(async () => {
    const AssetContract = getAssetContract();
    const companys = await getAllCompanys();
    AssetContract.on(
      "AssetStateChanged",
      async (
        id: any,
        price: any,
        company_id: any,
        owner: any,
        isListed: any
      ) => {
        const assetCompany = companys.filter(
          (comp: any) => comp._id === company_id
        )[0];

        const OrderContract = getOrderContract();
        const buyOrders = await OrderContract.getAllBuyOrders();

        let concernedOrder: any;

        for (let i = 0; i < buyOrders.length; i++) {
          if (
            buyOrders[i].company_id === assetCompany._id &&
            formatEther(buyOrders[i].price) <= formatEther(price) &&
            buyOrders[i].buyer !== owner
          ) {
            concernedOrder = buyOrders[i];
            break;
          }
        }

        const res = await ContractBuyOrderItems(
          concernedOrder.company_id,
          concernedOrder.price,
          owner
        );

        if (res.length - 1 >= parseInt(concernedOrder.quantity._hex, 16)) {
          const formatedArray = res
            .slice(0, parseInt(concernedOrder.quantity._hex, 16))
            .map((el: any) => {
              return {
                asset_id: parseInt(el.asset_id),
                company_id: el.company_id,
                isBuyOrder: true,
                order_id: parseInt(concernedOrder.id),
              };
            });

          setNotifications(formatedArray);
        }
      }
    );

    const OrderContract = getOrderContract();
    OrderContract.on(
      "BuyOrder",
      async (
        id: any,
        company_id: any,
        price: any,
        quantity: any,
        timestamp: any,
        seller: any,
        buyer: any
      ) => {
        const currentOrder = await getCurrentCompanyBuyOrder(company_id);

        if (parseInt(currentOrder.id) === parseInt(id)) {
          const res = await ContractBuyOrderItems(
            company_id,
            price,
            currentOrder.buyer
          );
          if (res.length >= parseInt(quantity)) {
            const formatedArray = res
              .slice(0, parseInt(quantity))
              .map((el: any) => {
                return {
                  asset_id: parseInt(el.asset_id),
                  company_id: el.company_id,
                  isBuyOrder: true,
                  order_id: parseInt(id),
                };
              });
            setNotifications(formatedArray);
          }
        }
      }
    );
  }, []);

  useEffect(() => {
    Listners();
  }, [Listners]);

  return notifications;
};

export default useContractListner;
