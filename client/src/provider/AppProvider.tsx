import React, {useState, useEffect, useCallback, useContext} from "react";
import {
  checkIfWalletAccountIsConnected,
  connectWalletAccounts,
} from "../smart-contract/WalletAccount";
import {getContractAccountBalance} from "../smart-contract/ContractFunctions/TokenContractFunctions";
import formatEther from "../utils/formatEther";
import useContractListner from "../hooks/useContractListner";
import {getReadyBuyOrders} from "../smart-contract/ContractFunctions/OrderContractFunctions";

type LogoutType = "LogedOut" | "LogedIn" | null;
type accountValue = string | null;

interface IAppContext {
  account: accountValue;
  logout: LogoutType;
  currentBalance: number;
  jwt: string | null;
  disconnect: () => void;
  connectWallet: () => void;
  updateAccountBalance: () => Promise<void>;
  setJWT: React.Dispatch<React.SetStateAction<string | null>>;
  notifications: any;
  handleClose: any;
  handleClick: any;
  open: boolean;
  snackbar: any;
  changeSnackBar: (
    open: boolean,
    message: string,
    severity: "warning" | "success" | "info" | "error" | ""
  ) => void;
}

export const AppContext = React.createContext<IAppContext>({
  account: "",
  currentBalance: 0,
  logout: "LogedOut",
  jwt: null,
  disconnect: () => {},
  connectWallet: () => {},
  updateAccountBalance: async () => {},
  setJWT: () => {},
  notifications: null,
  handleClose: null,
  handleClick: null,
  open: false,
  changeSnackBar: () => {},
  snackbar: null,
});

const AppProvider: React.FC = ({children}) => {
  const [notifications, setNotifications] = useState<any>([]);
  const [account, setAccount] = useState<accountValue>(null);
  const [logout, setLogout] = useState<LogoutType>(null);
  const [jwt, setJWT] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [open, setOpen] = React.useState(false);
  const [snackbar, setSnackBar] = React.useState({
    open: false,
    message: "",
    severity: "",
  });

  const listnerNotifications = useContractListner();

  useEffect(() => {
    notifications.map((notif: any) => {
      listnerNotifications.map((listnotif: any) => {
        if (
          notif.asset_id !== listnotif.asset_id &&
          notif.company_id !== listnotif.company_id &&
          notif.order_id !== listnotif.order_id
        ) {
          setNotifications((notifications: any) => [
            ...notifications,
            listnotif,
          ]);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listnerNotifications]);

  const changeSnackBar = (
    open: boolean,
    message: string,
    severity: "warning" | "success" | "info" | "error" | ""
  ) => {
    if (open) {
      setSnackBar({
        open,
        message,
        severity,
      });
    } else {
      setSnackBar({...snackbar, open: false});
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

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

  const updateAccountBalance = useCallback(async () => {
    const balanceInWei: number = await getContractAccountBalance(account);
    setCurrentBalance(formatEther(balanceInWei));
  }, [account]);

  const setAccVal = useCallback(async () => {
    if (logout !== "LogedOut") {
      const res = await checkIfWalletAccountIsConnected();
      if (res) {
        setAccount(res);
        setLogout("LogedIn");
        if (account) {
          updateAccountBalance();
        }
      } else {
        setLogout("LogedOut");
      }
    }
  }, [account, logout, updateAccountBalance]);

  const onLoad = useCallback(async () => {
    await setAccVal();
    if (account) await updateAccountBalance();
  }, [setAccVal, account, updateAccountBalance]);

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
    updateAccountBalance,
    setJWT,
    notifications,
    handleClose,
    handleClick,
    open,
    changeSnackBar,
    snackbar,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppProvider;
