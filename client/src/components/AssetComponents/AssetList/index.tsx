import {useCallback, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import {
  getOwnerAssets,
  getMarketAssets,
  getAllAssets,
  getCompanyAssets,
} from "../../../smart-contract/ContractFunctions/AssetContractFunctions";
import {AssetContainer} from "./AssetContainer";
import {USER_ASSETS, GET_ASSETS_URL} from "../../../utils/NavUrls";
import Loading from "../../Loading";

export default function AssetIndex() {
  const {pathname} = useLocation();

  const [assets, setAssets] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [buy, setBuy] = useState<boolean>(true);
  const [list, setList] = useState<boolean>(false);
  const [isAction, setIsAction] = useState<boolean>(false);
  const [isCompany, setIsCompany] = useState<boolean>(false);

  const toggleAction = () => {
    setIsAction(!isAction);
  };

  const onLoad = useCallback(async () => {
    if (pathname === USER_ASSETS) {
      setAssets(await getOwnerAssets());
      setBuy(false);
      setList(true);
    } else if (pathname === GET_ASSETS_URL) {
      setAssets(await getMarketAssets());
      setBuy(true);
      setList(false);
    } else {
      const compSymbol = pathname.substring(pathname.lastIndexOf("/") + 1);
      setAssets(await getCompanyAssets(compSymbol));
      setBuy(false);
      setList(true);
      setIsCompany(true);
    }
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    onLoad();
  }, [pathname, isAction, onLoad]);

  // if (isLoading) {
  //   return <p>wait</p>;
  // }

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
        <AssetContainer
          data={assets}
          toggleAction={toggleAction}
          buy={buy}
          list={list}
          company={isCompany}
          sortData={sortData}
          filterAssets={filterAssets}
        />
      )}
    </>
  );
}
