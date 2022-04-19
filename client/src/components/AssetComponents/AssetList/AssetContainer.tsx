import * as React from "react";
import {alpha} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FilterListIcon from "@mui/icons-material/FilterList";
import {Button, Container, InputAdornment, TextField} from "@mui/material";

import {buyContractAsset} from "../../../smart-contract/ContractFunctions/TransactionContractFunctions";
import {useAppContext} from "../../../provider/AppProvider";
import {unlistContractAsset} from "../../../smart-contract/ContractFunctions/AssetContractFunctions";
import SearchIcon from "@mui/icons-material/Search";
import AssetModel from "../ListModel";

// import AssetsEmpty from "../../AssetsEmpty";
// import useCustomToast from "../../../hooks/useCustomToast";
// import {useState} from "react";
// import {getRoleFromJWT} from "../../../utils/decodeJWT";

interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

type Order = "asc" | "desc";

function EnhancedTableHead(props: any) {
  const {onSelectAllClick, numSelected, rowCount, list} = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount ? true : false}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        <TableCell>Company Symbol</TableCell>
        <TableCell>Price</TableCell>
        <TableCell>Owner</TableCell>
        {list && <TableCell>Actions</TableCell>}
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
        <Tooltip title="Delete">
          <Button
            onClick={() => {
              props.buy ? props.buyAssets() : props.sellAssets();
            }}
          >
            Buy
          </Button>
        </Tooltip>
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

export default function EnhancedTable(props: any) {
  const {currentBalance, updateAccountBalance, changeSnackBar} =
    useAppContext();
  const [openModel, setOpenModel] = React.useState<any>(false);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("calories");
  const [selected, setSelected] = React.useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [companyInfo, setCompanyInfo] = React.useState<any>([]);
  const [assetToList, setAssetToList] = React.useState<any>(null);

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

  const listAsset = (asset: any) => {
    setAssetToList(asset);
    setOpenModel(true);
    // if (!props.company) {
    //   if (await listContractAsset(company_id, id)) {
    //     props.toggleAction();
    //   }
    // }
  };

  const unlistAsset = async (asset: any) => {
    const {company_id, id} = asset;
    if (!props.company) {
      if (await unlistContractAsset(company_id, id)) {
        props.toggleAction();
      }
    }
  };

  const buyAssets = async () => {
    const totalPrice = selected.reduce(
      (prev: any, current: any) => prev + current.price,
      0
    );
    const buyParams = selected.map((item: any) => {
      return {
        company_id: item.company_id,
        asset_id: parseInt(item.id._hex, 16),
      };
    });

    if (currentBalance < totalPrice) {
      changeSnackBar(true, "Not Enough LDT Token", "error");
      return;
    }

    if (await buyContractAsset(buyParams, currentBalance)) {
      props.toggleAction();
      updateAccountBalance();
      changeSnackBar(true, "Item Bough With Success", "success");
      setSelected([]);
    }
  };

  const sellAssets = () => {};

  return (
    <Container maxWidth="lg">
      <AssetModel
        open={openModel}
        setOpen={setOpenModel}
        assetToList={assetToList}
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
          <EnhancedTableToolbar
            numSelected={selected.length}
            buy={props.buy}
            buyAssets={buyAssets}
            sellAssets={sellAssets}
          />
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
                list={props.list}
              />
              <TableBody>
                {props.data.map((item: any, index: number) => {
                  const isItemSelected = isSelected(
                    parseInt(item.id).toString()
                  );

                  const labelId = `enhanced-table-checkbox-${index}`;
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
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected.length > 0 ? true : false}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell>{item.symbol}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.owner}</TableCell>
                      {props.list && item.isListed && (
                        <TableCell>
                          <Button
                            onClick={() => unlistAsset(item)}
                            variant="outlined"
                          >
                            Unlist
                          </Button>
                        </TableCell>
                      )}
                      {props.list && !item.isListed && (
                        <TableCell>
                          <Button
                            onClick={() => listAsset(item)}
                            variant="outlined"
                          >
                            List
                          </Button>
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
//   // Text,
//   IconButton,
//   Input,
// } from "@chakra-ui/react";
// import {
//   ADD_ASSETS_URL,
//   COMPANY_ASSETS,
//   USER_ASSETS,
// } from "../../../utils/NavUrls";
// import {AddIcon, ArrowDownIcon, ArrowUpIcon} from "@chakra-ui/icons";
// import {Link} from "react-router-dom";
// import {buyContractAsset} from "../../../smart-contract/ContractFunctions/TransactionContractFunctions";
// import {useAppContext} from "../../../provider/AppProvider";
// import {
//   listContractAsset,
//   unlistContractAsset,
// } from "../../../smart-contract/ContractFunctions/AssetContractFunctions";
// // import AssetsEmpty from "../../AssetsEmpty";
// import useCustomToast from "../../../hooks/useCustomToast";
// import {useState} from "react";
// import {getRoleFromJWT} from "../../../utils/decodeJWT";

// const AssetContainer = (props: any) => {
//   const {data, buy, list, toggleAction, sortData, filterAssets, company} =
//     props;

//   const {currentBalance, jwt} = useAppContext();
//   const userRole = getRoleFromJWT(jwt);

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
//     if (!company) {
//       if (await listContractAsset(company_id, id)) {
//         toast("Item is Listed", "success");

//         toggleAction();
//       } else {
//         toast("Some Error Occured", "error");
//       }
//     }
//   };

//   const unlistAsset = async (asset: any) => {
//     const {company_id, id} = asset;
//     if (!company) {
//       if (await unlistContractAsset(company_id, id)) {
//         toast("Item is unlisted", "success");
//         toggleAction();
//       } else {
//         toast("Some Error Occured", "error");
//       }
//     }
//   };

//   const togglePriceSort = () => {
//     if (!priceSort) {
//       setPriceSort("asc");
//       sortData(priceSort);
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
//           <Flex justify={"space-between"}>
//             <Box my={5}>
//               <Link to={ADD_ASSETS_URL}>
//                 {userRole === "company" && (
//                   <Button
//                     leftIcon={<AddIcon />}
//                     variant="solid"
//                     mt={5}
//                     bgColor={"red.500"}
//                     _hover={{
//                       bg: "red.600",
//                     }}
//                     color={"white"}
//                   >
//                     Create Asset
//                   </Button>
//                 )}
//               </Link>
//             </Box>
//             <Box my={5}>
//               <Link to={`${COMPANY_ASSETS}`}>
//                 <Button
//                   variant="solid"
//                   mt={5}
//                   bgColor={"red.500"}
//                   _hover={{
//                     bg: "red.600",
//                   }}
//                   color={"white"}
//                 >
//                   Company Info
//                 </Button>
//               </Link>
//               <Link to={`${USER_ASSETS}`}>
//                 <Button
//                   variant="solid"
//                   mt={5}
//                   ml={5}
//                   bgColor={"red.500"}
//                   _hover={{
//                     bg: "red.600",
//                   }}
//                   color={"white"}
//                 >
//                   My Assets
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
//                       <Button
//                         disabled={selected.length > 0 ? false : true}
//                         onClick={() => {
//                           buy ? buyAssets() : sellAssets();
//                         }}
//                       >
//                         {buy ? "Buy" : "Sell"}
//                       </Button>
//                     </Flex>
//                   </Th>
//                 </Tr>
//                 <Tr>
//                   <Th>
//                     <Checkbox
//                       isIndeterminate={
//                         selected.length > 0 && selected.length !== data.length
//                       }
//                       isChecked={data.length && selected.length === data.length}
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
//                   <Th>Owner</Th>
//                   {list && <Th>Actions</Th>}
//                 </Tr>
//               </Thead>
//               {data.length ? (
//                 <>
//                   <Tbody>
//                     {data &&
//                       data.map((asset: any, key: number) => (
//                         <Tr key={key}>
//                           {asset.isListed && buy && (
//                             <>
//                               <Td>
//                                 <Checkbox
//                                   isChecked={isSelected(asset)}
//                                   onChange={() => handleClick(asset)}
//                                 />
//                               </Td>
//                               <Td>{asset.symbol}</Td>

//                               <Td display={"flex"}>
//                                 <div style={{opacity: "0"}}>$nbi</div>
//                                 {asset.price}
//                               </Td>
//                               <Td>{asset.owner}</Td>
//                             </>
//                           )}
//                           {list && (
//                             <>
//                               <Td>
//                                 <Checkbox
//                                   isChecked={isSelected(asset)}
//                                   onChange={() => handleClick(asset)}
//                                 />
//                               </Td>
//                               <Td>{asset.symbol}</Td>
//                               <Td>{asset.price}</Td>
//                               <Td>{asset.owner}</Td>
//                               {asset.isListed ? (
//                                 <Td>
//                                   <Button
//                                     onClick={() => unlistAsset(asset)}
//                                     disabled={company}
//                                   >
//                                     {company ? "Unlisted" : "Unlist"}
//                                   </Button>
//                                 </Td>
//                               ) : (
//                                 <>
//                                   <Button
//                                     onClick={() => listAsset(asset)}
//                                     disabled={company}
//                                   >
//                                     {company ? "Listed" : "List"}
//                                   </Button>
//                                 </>
//                               )}
//                             </>
//                           )}
//                         </Tr>
//                       ))}
//                   </Tbody>
//                 </>
//               ) : (
//                 <Tbody>
//                   <Tr>
//                     <Td colSpan={10}>
//                       <Flex align={"center"} justify={"center"}>
//                         There are no items
//                       </Flex>
//                     </Td>
//                   </Tr>
//                 </Tbody>
//               )}
//             </Table>
//           </Box>
//         </Container>
//       </>
//     </div>
//   );
// };

// export default AssetContainer;
