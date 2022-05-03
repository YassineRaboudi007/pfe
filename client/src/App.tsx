import Navbar from "./components/Navbar";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import SwapContainer from "./components/SwapTokens";
import AppProvider from "./provider/AppProvider";
import UserSignUp from "./components/SignUp/userSignup";
import CompanySignUp from "./components/SignUp/companySignup";
import UserLogIn from "./components/LogIn/userLogin";
import CompanyLogIn from "./components/LogIn/companyLogin";
import AssetIndex from "./components/AssetComponents/AssetList/index";
import CreateAsset from "./components/AssetComponents/CreateAsset";
import CompanyAssets from "./components/AssetComponents/CompanyAssets";
import CreateBuyOrder from "./components/Order/CreateOrder";
import OrderList from "./components/Order/ListOrder";

import {
  GET_ASSETS_URL,
  COMPANY_LOGIN_URL,
  COMPANY_SIGNUP_URL,
  SWAP_TOKENS_URL,
  USER_LOGIN_URL,
  USER_SIGNUP_URL,
  ADD_ASSETS_URL,
  COMPANY_ASSETS,
  CREATE_ORDER,
  MARKET_ORDERS,
  USER_ORDERS,
  USER_ASSETS,
  TRANSACTION,
  OPERATIONS,
  COMPANY_FORGOT_PASSWORD,
  USER_FORGOT_PASSWORD,
  USER_PASSWORD_RESET,
  COMPANY_PASSWORD_RESET,
  USER_SETTINGS,
  COMPANY_SETTINGS,
} from "./utils/NavUrls";
import CustomizedSnackbars from "./components/Snackbar";
import Transaction from "./components/Transaction/index";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/system";
import Operations from "./components/Opeartions";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import UserSettings from "./components/Settings/userSettings";
import CompanySettings from "./components/Settings/companySettings";

const outerTheme = createTheme({
  palette: {
    primary: {
      main: "#FFFFFF",
    },
    secondary: {
      main: "#dd0031",
    },
  },
});

function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={outerTheme}>
        <Router>
          <Navbar />
          <Box
            sx={{
              backgroundColor: "#ededed",
              height: "92.5vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              margin: "auto",
              width: "100%",
            }}
          >
            <CustomizedSnackbars />
            <Routes>
              <Route path={SWAP_TOKENS_URL} element={<SwapContainer />} />
              <Route path={USER_SIGNUP_URL} element={<UserSignUp />} />
              <Route path={USER_LOGIN_URL} element={<UserLogIn />} />
              <Route path={COMPANY_SIGNUP_URL} element={<CompanySignUp />} />
              <Route path={COMPANY_LOGIN_URL} element={<CompanyLogIn />} />
              <Route path={COMPANY_ASSETS} element={<CompanyAssets />} />
              <Route
                path={`${GET_ASSETS_URL}/:name`}
                element={<AssetIndex />}
              />
              <Route path={GET_ASSETS_URL} element={<AssetIndex />} />
              <Route path={USER_ASSETS} element={<AssetIndex />} />
              <Route path={ADD_ASSETS_URL} element={<CreateAsset />} />
              <Route path={CREATE_ORDER} element={<CreateBuyOrder />} />
              <Route path={MARKET_ORDERS} element={<OrderList />} />
              <Route path={USER_ORDERS} element={<OrderList />} />
              <Route path={TRANSACTION} element={<Transaction />} />
              <Route path={OPERATIONS} element={<Operations />} />
              <Route
                path={COMPANY_FORGOT_PASSWORD}
                element={<ForgotPassword />}
              />
              <Route
                path={COMPANY_PASSWORD_RESET}
                element={<ResetPassword />}
              />
              <Route path={USER_FORGOT_PASSWORD} element={<ForgotPassword />} />
              <Route path={USER_PASSWORD_RESET} element={<ResetPassword />} />
              <Route path={USER_SETTINGS} element={<UserSettings />} />
              <Route path={COMPANY_SETTINGS} element={<CompanySettings />} />
              <Route path="*" element={<SwapContainer />} />
            </Routes>
          </Box>
        </Router>
      </ThemeProvider>

      {/* </ChakraProvider> */}
    </AppProvider>
  );
}

export default App;
