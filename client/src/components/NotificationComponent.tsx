import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {useAppContext} from "../provider/AppProvider";
import {
  executeOrderContract,
  getBuyOrder,
} from "../smart-contract/ContractFunctions/OrderContractFunctions";
import {getAllCompanys} from "../api/CompanyService";
import {formatNotif} from "../utils/helperFunctions";
import {Badge, Button} from "@mui/material";
import {getAsset} from "../smart-contract/ContractFunctions/AssetContractFunctions";
import formatEther from "../utils/formatEther";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function AccountMenu() {
  const {notifications, currentBalance, changeSnackBar, updateAccountBalance} =
    useAppContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [formatedNotifications, setFormatedNotifications] = React.useState<any>(
    []
  );

  async function sana() {
    const orderIds = notifications.map((el: any) => el.order_id);
    const orderList = orderIds.filter(
      (v: any, i: any, a: any) => a.indexOf(v) === i
    );
    const Orders = await Promise.all(
      orderList.map(async (order: any) => await getBuyOrder(parseInt(order)))
    );
    // setOrderNotifications(Orders);
    const companys = await getAllCompanys();
    // setCompanys(companys);
    // console.log("notif sana ", notifications);

    return Orders;
  }

  React.useEffect(() => {
    formatNotif(notifications).then((res: any) => {
      let totalPrice = 0;
      res.map((order: any) => {
        console.log("order  ", order.assets);
        Promise.all(
          order.assets.map(async (asset: any) => {
            const assetInfo = await getAsset(asset.company_id, asset.asset_id);
            totalPrice += formatEther(parseFloat(assetInfo.price));
          })
        ).then(async () => {
          console.log(totalPrice);
          if (currentBalance < totalPrice) {
            setFormatedNotifications([
              ...formatedNotifications,
              {...order, totalPrice},
            ]);
            return;
          }
        });
      });
    });

    // sana().then((res: any) => console.log("sanaaa", res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  const buyAssets = async (order: any) => {
    const {assets, order_id} = order;
    console.log("order ", order);

    let totalPrice = 0;
    Promise.all(
      assets.map(async (asset: any) => {
        const assetInfo = await getAsset(asset.company_id, asset.asset_id);
        totalPrice += formatEther(parseFloat(assetInfo.price));
      })
    ).then(async () => {
      console.log(totalPrice);
      if (currentBalance < totalPrice) {
        changeSnackBar(true, "Not Enough LDT Token", "error");
        return;
      }
      if (
        await executeOrderContract(assets, currentBalance, totalPrice, order_id)
      ) {
        updateAccountBalance();
        changeSnackBar(true, "Item Bough With Success", "success");
      }
    });
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
            <Badge badgeContent={formatedNotifications.length} color="error">
              <NotificationsIcon />
            </Badge>
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
        {formatedNotifications.map((order: any) => (
          <MenuItem
            key={order.order_id}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <p>
              {order.compSymbol} Buy Order of {order.assets.length} asset is
              ready
            </p>
            <p>Total Price : {order.totalPrice}</p>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => buyAssets(order)}
            >
              Execute Order
            </Button>
          </MenuItem>
        ))}
        {formatedNotifications.length === 0 && <h5>No Notifications</h5>}
      </Menu>
    </React.Fragment>
  );
}
