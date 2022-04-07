import React, {useState, useEffect, useCallback, useContext} from "react";
import {
  checkIfWalletAccountIsConnected,
  connectWalletAccounts,
} from "../smart-contract/WalletAccount";
import {getContractAccountBalance} from "../smart-contract/ContractFunctions/TokenContractFunctions";
import formatEther from "../utils/formatEther";
import useContractListner from "../hooks/useContractListner";
import {getReadyBuyOrders} from "../smart-contract/ContractFunctions/OrderContractFunctions";
import {getCompanyMarketAssets} from "../smart-contract/ContractFunctions/AssetContractFunctions";

type LogoutType = "LogedOut" | "LogedIn" | null;
type accountValue = string | null;

interface IAppContext {
  account: accountValue;
  logout: LogoutType;
  currentBalance: number;
  jwt: string | null;
  disconnect: () => void;
  connectWallet: () => void;
  getAccountBalance: (account: accountValue) => Promise<void>;
  setJWT: React.Dispatch<React.SetStateAction<string | null>>;
  notifications: any;
  handleClose: any;
  handleClick: any;
  open: boolean;
}

export const AppContext = React.createContext<IAppContext>({
  account: "",
  currentBalance: 0,
  logout: "LogedOut",
  jwt: null,
  disconnect: () => {},
  connectWallet: () => {},
  getAccountBalance: async () => {},
  setJWT: () => {},
  notifications: null,
  handleClose: null,
  handleClick: null,
  open: false,
});

const AppProvider: React.FC = ({children}) => {
  const [notifications, setNotifications] = useState<any>([]);
  const listnerNotifications = useContractListner();

  const [account, setAccount] = useState<accountValue>(null);
  const [logout, setLogout] = useState<LogoutType>(null);
  const [jwt, setJWT] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    notifications.map((notif: any) => {
      listnerNotifications.map((listnotif: any) => {
        if (
          notif.asset_id !== listnotif.asset_id &&
          notif.company_id !== listnotif.company_id &&
          notif.order_id !== listnotif.order_id
        ) {
          setNotifications([...notifications, listnotif]);
        }
      });
    });
  }, [listnerNotifications, notifications]);

  const connectWallet = (): void => {
    connectWalletAccounts().then((acc) => {
      setAccount(acc);
      setLogout("LogedIn");
    });
  };

  const disconnect = (): void => {
    setAccount(null);
    setJWT(null);
    setLogout("LogedOut");
  };

  const getAccountBalance = async (account: string | null) => {
    const balanceInWei: number = await getContractAccountBalance(account);
    setCurrentBalance(formatEther(balanceInWei));
  };

  const setAccVal = useCallback(async () => {
    if (logout !== "LogedOut") {
      const res = await checkIfWalletAccountIsConnected();
      if (res) {
        setAccount(res);
        setLogout("LogedIn");
        if (account) {
          getAccountBalance(account);
        }
      } else {
        setLogout("LogedOut");
      }
    }
  }, [account, logout]);

  const onLoad = useCallback(async () => {
    await setAccVal();
    if (account) await getAccountBalance(account);
  }, [setAccVal, account]);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  useEffect(() => {
    getReadyBuyOrders().then((res: any) => setNotifications(res));
  }, []);

  const appContext: IAppContext = {
    account,
    currentBalance,
    logout,
    jwt,
    disconnect,
    connectWallet,
    getAccountBalance,
    setJWT,
    notifications,
    handleClose,
    handleClick,
    open,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppProvider;
