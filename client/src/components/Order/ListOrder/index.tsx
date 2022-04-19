import {useCallback, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import {
  getMarketBuyOrders,
  getUserBuyOrders,
} from "../../../smart-contract/ContractFunctions/OrderContractFunctions";
import {OrderContainer} from "./OrderContainer";
import {MARKET_ORDERS, USER_ORDERS} from "../../../utils/NavUrls";
import Loading from "../../Loading";

export default function AssetIndex() {
  const {pathname} = useLocation();
  const [assets, setAssets] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cancel, setCancel] = useState<boolean>(false);
  const [isAction, setIsAction] = useState<boolean>(false);

  const toggleAction = () => {
    setIsAction(!isAction);
  };

  const onLoad = useCallback(async () => {
    if (pathname === MARKET_ORDERS) {
      setAssets(await getMarketBuyOrders());
      setCancel(false);
    } else if (pathname === USER_ORDERS) {
      setAssets(await getUserBuyOrders());
      setCancel(true);
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {assets && (
        <OrderContainer
          data={assets}
          toggleAction={toggleAction}
          cancel={cancel}
          sortData={sortData}
          filterAssets={filterAssets}
        />
      )}
    </>
  );
}
