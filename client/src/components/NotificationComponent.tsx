// @ts-nocheck
import * as React from "react";
import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AvatarBadge,
  Button,
} from "@chakra-ui/react";
import {useAppContext} from "../provider/AppProvider";
import {
  getBuyOrder,
  getBuyOrders,
} from "../smart-contract/ContractFunctions/OrderContractFunctions";
import {getAllCompanys} from "../api/CompanyService";
import {formatNotif} from "../utils/helperFunctions";

export default function NotificationComponent() {
  const {notifications} = useAppContext();
  const [formatedNotifications, setFormatedNotifications] = React.useState<any>(
    []
  );

  async function sana() {
    const orderIds = notifications.map((el: any) => el.order_id);
    const orderList = orderIds.filter((v, i, a) => a.indexOf(v) === i);
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
      console.log("res ", res);

      setFormatedNotifications(res);
    });
    // sana().then((res: any) => console.log(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  return (
    <div>
      <Menu>
        <MenuButton mx={10}>
          <Avatar size="sm">
            <AvatarBadge
              borderColor="papayawhip"
              bg="tomato"
              boxSize="1.25em"
            />
          </Avatar>
        </MenuButton>
        <MenuList mr={-5}>
          {Object.keys(formatedNotifications).map((key, index) => (
            <>
              <MenuItem
                key={key}
                display={"flex"}
                flexDirection={"column"}
                my={5}
              >
                {formatedNotifications[key].isBuyOrder
                  ? "Buy Order"
                  : "Sell Order"}{" "}
                of {formatedNotifications[key].compSymbol} can be fullfield(
                {formatedNotifications[key].assets.length} Items)
                <Button>Execute Order</Button>
              </MenuItem>
            </>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
}
