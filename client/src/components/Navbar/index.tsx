import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import CustomMenuList from "./MenuList";

import {
  GET_ASSETS_URL,
  MARKET_ORDERS,
  SWAP_TOKENS_URL,
  ADD_ASSETS_URL,
  COMPANY_ASSETS,
  COMPANY_LOGIN_URL,
  COMPANY_SIGNUP_URL,
  CREATE_ORDER,
  USER_LOGIN_URL,
  USER_SIGNUP_URL,
  TRANSACTION,
} from "../../utils/NavUrls";
import {useAppContext} from "../../provider/AppProvider";
import {Link} from "react-router-dom";
import {accountAddressSlice} from "../../utils/helperFunctions";
import {Button, Tooltip} from "@mui/material";
import logo from "../../assets/linedatalogo.jpg";
import AccountMenu from "./MenuDropDown";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import StorefrontIcon from "@mui/icons-material/Storefront";

const pages = [
  {
    name: "Assets",
    listItems: [
      {
        name: "Add Asset",
        url: ADD_ASSETS_URL,
        icon: <AddIcon />,
      },
      {
        name: "Company Assets",
        url: COMPANY_ASSETS,
        icon: <BusinessIcon />,
      },
      {
        name: "Market Assets",
        url: GET_ASSETS_URL,
        icon: <StorefrontIcon />,
      },
    ],
  },
  {
    name: "Orders",
    listItems: [
      {
        name: "Create Order",
        url: CREATE_ORDER,
        icon: <AddIcon />,
      },
      {
        name: "Market Orders",
        url: MARKET_ORDERS,
        icon: <StorefrontIcon />,
      },
    ],
  },
];

export default function PrimarySearchAppBar() {
  const {jwt, account, currentBalance, disconnect} = useAppContext();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const menuId = "primary-search-account-menu";
  // const renderMenu = (

  // );

  const mobileMenuId = "primary-search-account-menu-mobile";

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <img src={logo} alt="Logo" height={65} width={150} />

          <Box sx={{flexGrow: 1, display: {xs: "flex", md: "none"}}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: {xs: "block", md: "none"},
              }}
            >
              {pages.map((page, key) => (
                <CustomMenuList key={key} page={page} />
              ))}
            </Menu>
          </Box>

          <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
            {pages.map((page, key) => (
              <CustomMenuList key={key} page={page} />
            ))}
          </Box>

          <Box sx={{display: {xs: "none", md: "flex", alignItems: "center"}}}>
            {jwt ? (
              <Tooltip title="Swap Tokens">
                <Link
                  to={SWAP_TOKENS_URL}
                  style={{color: "inherit", textDecoration: "none"}}
                >
                  <Button variant="contained" color="secondary">
                    Balance : {currentBalance} LDT{" "}
                  </Button>
                </Link>
              </Tooltip>
            ) : (
              ""
            )}

            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <AccountMenu
              userConnected={jwt ? true : false}
              currentBalance={currentBalance}
            />
            {/* <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              
               <AccountCircle /> 
            </IconButton> */}
          </Box>
          <Box sx={{display: {xs: "flex", md: "none"}}}>
            <Tooltip title="Swap Tokens">
              <Link
                to={SWAP_TOKENS_URL}
                style={{color: "inherit", textDecoration: "none"}}
              >
                <Button variant="contained" color="secondary">
                  Balance : {currentBalance} LDT{" "}
                </Button>
              </Link>
            </Tooltip>

            <AccountMenu
              userConnected={jwt ? true : false}
              currentBalance={currentBalance}
            />

            {/* <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton> */}
          </Box>
        </Toolbar>
      </AppBar>
      {jwt ? (
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            Address : {accountAddressSlice(account)}
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            Balance : {currentBalance} LDT{" "}
          </MenuItem>
          <Link
            to={TRANSACTION}
            style={{textDecoration: "none", color: "inherit"}}
          >
            <MenuItem onClick={handleMenuClose}>Transaction History</MenuItem>
          </Link>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              disconnect();
            }}
          >
            Disonnect Account
          </MenuItem>
        </Menu>
      ) : (
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          id={mobileMenuId}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        >
          <Link
            to={`${USER_LOGIN_URL}`}
            style={{textDecoration: "none", color: "inherit"}}
          >
            <MenuItem onClick={handleMenuClose}>Log In As User</MenuItem>
          </Link>
          <Link
            to={`${COMPANY_LOGIN_URL}`}
            style={{textDecoration: "none", color: "inherit"}}
          >
            <MenuItem onClick={handleMenuClose}>Log In As Company</MenuItem>
          </Link>

          <Link
            to={`${USER_SIGNUP_URL}`}
            style={{textDecoration: "none", color: "inherit"}}
          >
            <MenuItem onClick={handleMenuClose}>Sign Up As User</MenuItem>
          </Link>
          <Link
            to={`${COMPANY_SIGNUP_URL}`}
            style={{textDecoration: "none", color: "inherit"}}
          >
            <MenuItem onClick={handleMenuClose}>Sign Up As Company</MenuItem>
          </Link>
        </Menu>
      )}
      {jwt ? (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          id={menuId}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            Address : {accountAddressSlice(account)}
          </MenuItem>

          <Link
            to={TRANSACTION}
            style={{textDecoration: "none", color: "inherit"}}
          >
            <MenuItem onClick={handleMenuClose}>Transaction History</MenuItem>
          </Link>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              disconnect();
            }}
          >
            Disonnect Account
          </MenuItem>
        </Menu>
      ) : (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          id={menuId}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <Link
            to={`${USER_LOGIN_URL}`}
            style={{textDecoration: "none", color: "inherit"}}
          >
            <MenuItem onClick={handleMenuClose}>Log In As User</MenuItem>
          </Link>
          <Link
            to={`${COMPANY_LOGIN_URL}`}
            style={{textDecoration: "none", color: "inherit"}}
          >
            <MenuItem onClick={handleMenuClose}>Log In As Company</MenuItem>
          </Link>

          <Link
            to={`${USER_SIGNUP_URL}`}
            style={{textDecoration: "none", color: "inherit"}}
          >
            <MenuItem onClick={handleMenuClose}>Sign Up As User</MenuItem>
          </Link>
          <Link
            to={`${COMPANY_SIGNUP_URL}`}
            style={{textDecoration: "none", color: "inherit"}}
          >
            <MenuItem onClick={handleMenuClose}>Sign Up As Company</MenuItem>
          </Link>
        </Menu>
      )}
    </Box>
  );
}

// import {
//   Box,
//   Flex,
//   Avatar,
//   HStack,
//   IconButton,
//   Button,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   MenuDivider,
//   useDisclosure,
//   useColorModeValue,
//   Stack,
//   Heading,
//   Text,
//   AvatarBadge,
//   MenuGroup,
// } from "@chakra-ui/react";
// import {HamburgerIcon, CloseIcon} from "@chakra-ui/icons";
// import {Link} from "react-router-dom";
// import {useAppContext} from "../../provider/AppProvider";
// import {accountAddressSlice} from "../../utils/helperFunctions";
// import {BellIcon} from "@chakra-ui/icons";
// import {
//   COMPANY_LOGIN_URL,
//   COMPANY_SIGNUP_URL,
//   GET_ASSETS_URL,
//   SWAP_TOKENS_URL,
//   USER_LOGIN_URL,
//   USER_SIGNUP_URL,
//   LIST_BUY_ORDERS,
// } from "../../utils/NavUrls";
// import useCustomToast from "../../hooks/useCustomToast";
// import NotificationComponent from "../NotificationComponent";

// const Links = [
//   {
//     name: "Swap Tokens",
//     url: SWAP_TOKENS_URL,
//   },
//   {
//     name: "Assets",
//     url: GET_ASSETS_URL,
//   },
//   {
//     name: "Orders",
//     url: LIST_BUY_ORDERS,
//   },
// ];

// const NavLink = (props: any) => (
//   <Link to={props.url}>
//     <Box
//       px={2}
//       py={1}
//       rounded={"md"}
//       color={"white"}
//       _hover={{
//         textDecoration: "none",
//         color: "black",
//         bg: "white",
//       }}
//     >
//       {props.name}
//     </Box>
//   </Link>
// );

// export default function Index() {
//   const {isOpen, onOpen, onClose} = useDisclosure();
//   const {jwt, account, currentBalance, disconnect} = useAppContext();
//   const {toast} = useCustomToast();
//   // getContractAccountBalance(account).then((x) => console.log(x));

//   return (
//     <>
//       <Box bg={useColorModeValue("Black", "red.900")} px={4} h={"7vh"}>
//         <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
//           <IconButton
//             size={"md"}
//             icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
//             aria-label={"Open Menu"}
//             display={{md: "none"}}
//             onClick={isOpen ? onClose : onOpen}
//             bgColor={"red.300"}
//             _hover={{backgroundColor: "red.400"}}
//           />
//           <HStack spacing={8} alignItems={"center"}>
//             <Box>
//               <Heading variant={"1xl"} color={"white"}>
//                 Linedata
//               </Heading>
//             </Box>
//             <HStack as={"nav"} spacing={4} display={{base: "none", md: "flex"}}>
//               {Links.map((link, key) => (
//                 <NavLink url={link.url} name={link.name} key={key} />
//               ))}
//             </HStack>
//           </HStack>
//           <Flex alignItems={"center"}>
//             {jwt ? <NotificationComponent /> : null}

//             <Menu>
//               <MenuButton
//                 as={Button}
//                 rounded={"full"}
//                 variant={"link"}
//                 cursor={"pointer"}
//                 minW={0}
//               >
//                 <Avatar size={"sm"} />
//               </MenuButton>
//               <MenuList>
//                 {jwt ? (
//                   <>
//                     <MenuItem closeOnSelect={false}>
//                       <Text borderRadius={5}>
//                         Address : {accountAddressSlice(account)}
//                       </Text>
//                     </MenuItem>
//                     <MenuItem closeOnSelect={false}>
//                       Balance : {currentBalance} LDT{" "}
//                     </MenuItem>
//                   </>
//                 ) : (
//                   <>
//                     <MenuGroup title="Log In">
//                       <Link to={`${USER_LOGIN_URL}`}>
//                         <MenuItem>As User</MenuItem>
//                       </Link>
//                       <Link to={`${COMPANY_LOGIN_URL}`}>
//                         <MenuItem>As Company</MenuItem>
//                       </Link>
//                     </MenuGroup>
//                     <MenuDivider />
//                     <MenuGroup title="Sign Up">
//                       <Link to={`${USER_SIGNUP_URL}`}>
//                         <MenuItem>As User</MenuItem>
//                       </Link>
//                       <Link to={`${COMPANY_SIGNUP_URL}`}>
//                         <MenuItem>As Company</MenuItem>
//                       </Link>
//                     </MenuGroup>
//                   </>
//                 )}

//                 {jwt ? (
//                   <>
//                     <MenuDivider />
//                     <Link to="/logIn">
//                       <MenuItem
//                         onClick={() => {
//                           disconnect();
//                           toast("Disconnected", "info");
//                         }}
//                       >
//                         Disonnect Account
//                       </MenuItem>
//                     </Link>
//                   </>
//                 ) : (
//                   ""
//                 )}
//               </MenuList>
//             </Menu>
//           </Flex>
//         </Flex>

//         {isOpen ? (
//           <Box pb={4} display={{md: "none"}}>
//             <Stack as={"nav"} spacing={4} bgColor={"black"}>
//               {Links.map((link, key) => (
//                 <NavLink url={link.url} name={link.name} key={key} />
//               ))}
//             </Stack>
//           </Box>
//         ) : null}
//       </Box>
//     </>
//   );
// }
