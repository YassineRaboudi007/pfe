import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import {Link} from "react-router-dom";
import {
  USER_LOGIN_URL,
  USER_SIGNUP_URL,
  COMPANY_LOGIN_URL,
  COMPANY_SIGNUP_URL,
  TRANSACTION,
  USER_ASSETS,
  USER_ORDERS,
} from "../../utils/NavUrls";
import {useAppContext} from "../../provider/AppProvider";
import {accountAddressSlice} from "../../utils/helperFunctions";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import {Divider, Typography} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
export default function AccountMenu(props: any) {
  const {account, disconnect} = useAppContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{display: "flex", alignItems: "center", textAlign: "center"}}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ml: 2}}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{width: 32, height: 32}}>M</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{horizontal: "right", vertical: "top"}}
        anchorOrigin={{horizontal: "right", vertical: "bottom"}}
      >
        {!props.userConnected ? (
          <div>
            <Typography
              style={{margin: "0 10px", fontSize: "18px"}}
              variant="h6"
            >
              Log In
            </Typography>
            <Link
              to={`${USER_LOGIN_URL}`}
              style={{textDecoration: "none", color: "inherit"}}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                As User
              </MenuItem>
            </Link>
            <Link
              to={`${COMPANY_LOGIN_URL}`}
              style={{textDecoration: "none", color: "inherit"}}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <BusinessIcon fontSize="small" />
                </ListItemIcon>
                As Company
              </MenuItem>
            </Link>
            <Divider />
            <Typography style={{margin: "5px 10px", fontSize: "18px"}}>
              Sign Up
            </Typography>
            <Link
              to={`${USER_SIGNUP_URL}`}
              style={{textDecoration: "none", color: "inherit"}}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                As User
              </MenuItem>
            </Link>
            <Link
              to={`${COMPANY_SIGNUP_URL}`}
              style={{textDecoration: "none", color: "inherit"}}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <BusinessIcon fontSize="small" />
                </ListItemIcon>
                As Company
              </MenuItem>
            </Link>
          </div>
        ) : (
          <div>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <AccountBalanceWalletIcon fontSize="small" />
              </ListItemIcon>
              Address : {accountAddressSlice(account)}
            </MenuItem>
            <Link
              to={USER_ASSETS}
              style={{textDecoration: "none", color: "inherit"}}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <WebAssetIcon fontSize="small" />
                </ListItemIcon>
                My Assets
              </MenuItem>
            </Link>
            <Link
              to={USER_ORDERS}
              style={{textDecoration: "none", color: "inherit"}}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <BookmarkBorderIcon fontSize="small" />
                </ListItemIcon>
                My Orders
              </MenuItem>
            </Link>

            <Link
              to={TRANSACTION}
              style={{textDecoration: "none", color: "inherit"}}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <ManageSearchIcon fontSize="small" />
                </ListItemIcon>
                Transaction History
              </MenuItem>
            </Link>

            <MenuItem>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem
              onClick={() => {
                disconnect();
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </div>
        )}
      </Menu>
    </React.Fragment>
  );
}
