import Navbar from "./components/Navbar";
import "./App.css";
import {Routes, Route, BrowserRouter as Router} from "react-router-dom";
import {ChakraProvider} from "@chakra-ui/react";
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
} from "./utils/NavUrls";
import CustomizedSnackbars from "./components/Snackbar";
import Transaction from "./components/Transaction/index";

function App() {
  return (
    <AppProvider>
      {/* <ChakraProvider> */}
      <Router>
        <Navbar />
        <CustomizedSnackbars />

        <Routes>
          <Route path={SWAP_TOKENS_URL} element={<SwapContainer />} />
          <Route path={USER_SIGNUP_URL} element={<UserSignUp />} />
          <Route path={USER_LOGIN_URL} element={<UserLogIn />} />
          <Route path={COMPANY_SIGNUP_URL} element={<CompanySignUp />} />
          <Route path={COMPANY_LOGIN_URL} element={<CompanyLogIn />} />
          <Route path={COMPANY_ASSETS} element={<CompanyAssets />} />
          <Route path={`${GET_ASSETS_URL}/:name`} element={<AssetIndex />} />
          <Route path={GET_ASSETS_URL} element={<AssetIndex />} />
          <Route path={USER_ASSETS} element={<AssetIndex />} />
          <Route path={ADD_ASSETS_URL} element={<CreateAsset />} />
          <Route path={CREATE_ORDER} element={<CreateBuyOrder />} />
          <Route path={MARKET_ORDERS} element={<OrderList />} />
          <Route path={USER_ORDERS} element={<OrderList />} />
          <Route path={TRANSACTION} element={<Transaction />} />
          <Route path="*" element={<SwapContainer />} />
        </Routes>
      </Router>
      {/* </ChakraProvider> */}
    </AppProvider>
  );
}

export default App;
