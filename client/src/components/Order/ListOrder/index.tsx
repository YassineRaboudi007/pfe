import {useCallback, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import {
  getBuyOrders,
  getSellOrders,
} from "../../../smart-contract/ContractFunctions/OrderContractFunctions";
import {OrderContainer} from "./OrderContainer";
import {LIST_BUY_ORDERS, LIST_SELL_ORDERS} from "../../../utils/NavUrls";

export default function AssetIndex() {
  const {pathname} = useLocation();
  const [assets, setAssets] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [buy, setBuy] = useState<boolean>(true);
  const [list, setList] = useState<boolean>(false);
  const [isAction, setIsAction] = useState<boolean>(false);

  const toggleAction = () => {
    setIsAction(!isAction);
  };

  const onLoad = useCallback(async () => {
    if (pathname === LIST_BUY_ORDERS) {
      setAssets(await getBuyOrders());
      setBuy(false);
      setList(true);
    }
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    onLoad();
  }, [pathname, isAction, onLoad]);

  const sortData = (sortType: any) => {
    const mul = sortType === "asc" ? 1 : -1;
    const newAssets: any = assets.sort((a: any, b: any) =>
      a.price > b.price ? 1 * mul : b.price > a.price ? -1 * mul : 0
    );
    setAssets(newAssets);
  };

  const filterAssets = (searchTerm: any) => {
    if (!searchTerm) toggleAction();

    const filterdAssets: any = assets.filter((asset: any) =>
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setAssets(filterdAssets);
  };

  return (
    <>
      {assets && (
        <OrderContainer
          data={assets}
          toggleAction={toggleAction}
          buy={buy}
          list={list}
          sortData={sortData}
          filterAssets={filterAssets}
        />
      )}
    </>
  );
}
