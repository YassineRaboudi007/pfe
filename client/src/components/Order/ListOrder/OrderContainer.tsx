import * as React from "react";
import {alpha} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import {visuallyHidden} from "@mui/utils";
import {Button, Container, InputAdornment, TextField} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  ADD_ASSETS_URL,
  COMPANY_ASSETS,
  USER_ASSETS,
} from "../../../utils/NavUrls";
import {AddIcon, ArrowDownIcon, ArrowUpIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";
import {buyContractAsset} from "../../../smart-contract/ContractFunctions/TransactionContractFunctions";
import {useAppContext} from "../../../provider/AppProvider";
import {
  listContractAsset,
  unlistContractAsset,
} from "../../../smart-contract/ContractFunctions/AssetContractFunctions";
import SearchIcon from "@mui/icons-material/Search";

// import AssetsEmpty from "../../AssetsEmpty";
import useCustomToast from "../../../hooks/useCustomToast";
import {useState} from "react";
import {getRoleFromJWT} from "../../../utils/decodeJWT";
import {
  activateBuyOrder,
  cancelBuyOrder,
} from "../../../smart-contract/ContractFunctions/OrderContractFunctions";
import OrderModel from "../OrderModel";

interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): Data {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: {[key in Key]: number | string},
  b: {[key in Key]: number | string}
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: any) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    list,
  } = props;

  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell>Company Symbol</TableCell>
        <TableCell>Price</TableCell>
        <TableCell>Issuer</TableCell>
        <TableCell>Created At</TableCell>
        {props.cancel && <TableCell>Actions</TableCell>}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableToolbar = (props: any) => {
  const {numSelected} = props;

  return (
    <Toolbar
      sx={{
        pl: {sm: 2},
        pr: {xs: 1, sm: 1},
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{flex: "1 1 100%"}}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{flex: "1 1 100%"}}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Data
        </Typography>
      )}
      {numSelected > 0 && props.buy ? (
        ""
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export function OrderContainer(props: any) {
  const {currentBalance, jwt} = useAppContext();
  const [openModel, setOpenModel] = React.useState<any>(false);
  const [orderToEdit, setOrderToEdit] = React.useState<any>(null);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("calories");
  const [selected, setSelected] = React.useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [companyInfo, setCompanyInfo] = React.useState<any>([]);

  const handleClick = (event: React.MouseEvent<unknown>, name: any) => {
    const selectedIndex = isSelected(name.id);

    let newSelected: any = [];

    if (selectedIndex[0] === undefined) {
      newSelected = newSelected.concat(selected, name);
    } else if (parseInt(selectedIndex[0].id) === parseInt(selected[0].id)) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (
      parseInt(selectedIndex[0].id) ===
      parseInt(selected[selected.length - 1].id)
    ) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = props.data.map((n: any) => n);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const isSelected = (name: string) => {
    return selected.filter((el: any) => parseInt(name) === parseInt(el.id));
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - companyInfo.length) : 0;

  const cancelOrder = async (id: any) => {
    await cancelBuyOrder(id);
    props.toggleAction();
  };

  const activateOrder = async (id: any) => {
    await activateBuyOrder(id);
    props.toggleAction();
  };

  const EditOrder = async (order: any) => {
    setOrderToEdit(order);
    setOpenModel(true);
  };

  return (
    <Container maxWidth="lg">
      <OrderModel
        open={openModel}
        setOpen={setOpenModel}
        orderToEdit={orderToEdit}
        toggleAction={props.toggleAction}
      />
      <Box sx={{width: "100%", marginTop: "20px"}}>
        <TextField
          id="outlined-basic"
          label="Search By Name"
          variant="filled"
          sx={{width: "100%", margin: "20px 0"}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => props.filterAssets(e.target.value)}
        />
        <Paper sx={{width: "100%", mb: 2}}>
          <EnhancedTableToolbar numSelected={selected.length} buy={props.buy} />
          <TableContainer>
            <Table
              sx={{minWidth: 750}}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={props.data.length}
                cancel={props.cancel}
              />
              <TableBody>
                {props.data.map((item: any, index: number) => {
                  console.log("item ", item);

                  const isItemSelected = isSelected(
                    parseInt(item.id).toString()
                  );

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      onClick={(event) => handleClick(event, item)}
                      tabIndex={-1}
                      aria-checked={isItemSelected}
                      key={item.id}
                      selected={isItemSelected.length > 0 ? true : false}
                    >
                      <TableCell>{item.symbol}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.issuer}</TableCell>
                      <TableCell>{item.created_at}</TableCell>
                      {props.cancel && (
                        <TableCell>
                          {item.isActive ? (
                            <Button
                              variant="outlined"
                              onClick={() => cancelOrder(parseInt(item.id))}
                            >
                              Cancel Order
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              onClick={() => activateOrder(parseInt(item.id))}
                            >
                              Activate Order
                            </Button>
                          )}
                          <Tooltip title="Edit" sx={{margin: "0 15px"}}>
                            <IconButton
                              aria-label="Edit"
                              onClick={() => EditOrder(item)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
}

// import {
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Container,
//   Box,
//   Button,
//   Flex,
//   Checkbox,
//   IconButton,
//   Input,
// } from "@chakra-ui/react";
// import {
//   LIST_BUY_ORDERS,
//   LIST_SELL_ORDERS,
//   CREATE_ORDER,
// } from "../../../utils/NavUrls";
// import {AddIcon, ArrowDownIcon, ArrowUpIcon} from "@chakra-ui/icons";
// import {Link} from "react-router-dom";
// import {buyContractAsset} from "../../../smart-contract/ContractFunctions/TransactionContractFunctions";
// import {useAppContext} from "../../../provider/AppProvider";
// import {
//   listContractAsset,
//   unlistContractAsset,
// } from "../../../smart-contract/ContractFunctions/AssetContractFunctions";
// import useCustomToast from "../../../hooks/useCustomToast";
// import {useState} from "react";

// export const OrderContainer = (props: any) => {
//   const {data, buy, list, toggleAction, sortData, filterAssets} = props;
//   const {currentBalance} = useAppContext();
//   const {toast} = useCustomToast();
//   const [selected, setSelected] = useState<any[]>([]);
//   const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);
//   const isSelected = (name: any) => selected.indexOf(name) !== -1;

//   const selectAll = (event: any) => {
//     if (event.target.checked) {
//       setSelected(data);
//       return;
//     }
//     setSelected([]);
//   };

//   const handleClick = (name: any) => {
//     //@ts-ignore
//     const selectedIndex = selected.indexOf(name);

//     let newSelected: any[] = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, name);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1)
//       );
//     }
//     setSelected(newSelected);
//   };

//   const buyAssets = async () => {
//     const totalPrice = selected.reduce(
//       (prev, current) => prev + current.price,
//       0
//     );
//     const buyParams = selected.map((item) => {
//       return {
//         company_id: item.company_id,
//         asset_id: parseInt(item.id._hex, 16),
//       };
//     });

//     if (currentBalance < totalPrice) {
//       toast(`Not Enough Tokens LDT Tokens.`, "error");
//       return;
//     }

//     if (await buyContractAsset(buyParams, currentBalance)) {
//       toast("Items are Bought", "success");
//       toggleAction();
//     } else {
//       toast("Some Error Occured", "error");
//     }
//   };

//   const sellAssets = () => {};

//   const listAsset = async (asset: any) => {
//     const {company_id, id} = asset;
//     if (await listContractAsset(company_id, id)) {
//       toast("Item is Listed", "success");

//       toggleAction();
//     } else {
//       toast("Some Error Occured", "error");
//     }
//   };

//   const unlistAsset = async (asset: any) => {
//     const {company_id, id} = asset;
//     if (await unlistContractAsset(company_id, id)) {
//       toast("Item is unlisted", "success");
//       toggleAction();
//     } else {
//       toast("Some Error Occured", "error");
//     }
//   };

//   const togglePriceSort = () => {
//     if (!priceSort) {
//       setPriceSort("asc");
//       return;
//     }
//     priceSort === "asc" ? setPriceSort("desc") : setPriceSort("asc");
//     sortData(priceSort);
//   };

//   const filterData = (e: any) => {
//     filterAssets(e.target.value);
//   };

//   return (
//     <div>
//       <>
//         <Container maxW="container.xl">
//           <Flex justify={"space-between"} my={5}>
//             <Box>
//               <Link to={`${CREATE_ORDER}`}>
//                 <Button
//                   variant="solid"
//                   mt={5}
//                   bgColor={"red.500"}
//                   _hover={{
//                     bg: "red.600",
//                   }}
//                   color={"white"}
//                 >
//                   Create Order
//                 </Button>
//               </Link>
//             </Box>
//             <Box>
//               <Link to={LIST_SELL_ORDERS}>
//                 <Button
//                   variant="solid"
//                   mt={5}
//                   mx={5}
//                   bgColor={"red.500"}
//                   _hover={{
//                     bg: "red.600",
//                   }}
//                   color={"white"}
//                 >
//                   Sell Orders
//                 </Button>
//               </Link>

//               <Link to={`${LIST_BUY_ORDERS}`}>
//                 <Button
//                   variant="solid"
//                   mt={5}
//                   bgColor={"red.500"}
//                   _hover={{
//                     bg: "red.600",
//                   }}
//                   color={"white"}
//                 >
//                   Buy Orders
//                 </Button>
//               </Link>
//             </Box>
//           </Flex>
//           <Box>
//             <Table
//               variant="striped"
//               colorScheme="cyan"
//               border={"2px solid black"}
//               borderRadius={"3xl"}
//               mt={5}
//             >
//               <Thead>
//                 <Tr>
//                   <Th w={"100%"} colSpan={10}>
//                     <Flex
//                       w={"100%"}
//                       justify={"space-between"}
//                       alignItems={"center"}
//                     >
//                       <Input
//                         placeholder="search by symbol"
//                         size="xs"
//                         width={"20%"}
//                         border={"2px solid black"}
//                         onChange={(e) => filterData(e)}
//                       />
//                     </Flex>
//                   </Th>
//                 </Tr>
//                 <Tr>
//                   <Th>
//                     <Checkbox
//                       isIndeterminate={
//                         selected.length > 0 && selected.length !== data.length
//                       }
//                       isChecked={selected.length === data.length}
//                       onChange={(e) => selectAll(e)}
//                     />
//                   </Th>
//                   <Th>Company Symbol</Th>
//                   <Th
//                     display={"flex"}
//                     alignItems={"center"}
//                     justifyItems={"center"}
//                   >
//                     <IconButton
//                       size={"xs"}
//                       aria-label="Search database"
//                       icon={
//                         priceSort && priceSort === "asc" ? (
//                           <ArrowDownIcon />
//                         ) : (
//                           <ArrowUpIcon />
//                         )
//                       }
//                       onClick={togglePriceSort}
//                       mr={1}
//                     />
//                     Price(LDT)
//                   </Th>
//                   <Th>Issuer</Th>
//                   <Th>Quantity</Th>
//                   <Th>Created At</Th>
//                 </Tr>
//               </Thead>
//               <Tbody>
//                 {data &&
//                   data.map((order: any, key: number) => (
//                     <Tr key={key}>
//                       <Td>
//                         <Checkbox
//                           isChecked={isSelected(order)}
//                           onChange={() => handleClick(order)}
//                         />
//                       </Td>
//                       <Td>{order.symbol}</Td>
//                       <Td>{order.price}</Td>
//                       <Td>{order.issuer}</Td>
//                       <Td>{order.quantity}</Td>
//                       <Td>{order.created_at}</Td>
//                     </Tr>
//                   ))}
//               </Tbody>
//             </Table>
//           </Box>
//         </Container>
//       </>
//     </div>
//   );
// };
