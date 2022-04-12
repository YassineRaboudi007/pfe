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
import {Container} from "@mui/material";

import {AddIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";
import {ADD_ASSETS_URL} from "../../utils/NavUrls";
import {getAllCompanys} from "../../api/CompanyService";
import {getCompanyAssetsInfo} from "../../smart-contract/ContractFunctions/AssetContractFunctions";
import formatEther from "../../utils/formatEther";
import {getUserTransactions} from "../../smart-contract/ContractFunctions/TransactionContractFunctions";

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
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const [company, setCompany] = React.useState<any>();
  const [companyInfo, setCompanyInfo] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [keys, setKeys] = React.useState<string[]>([]);

  const onLoad = async () => {
    const comps = await getAllCompanys();
    setCompany(comps);

    const compsID: any = comps.map((el: any) => el._id);
    const arr: any[] = await Promise.all(
      compsID.map(async (id: any) => await getCompanyAssetsInfo(id))
    );
    setCompanyInfo(arr);

    setKeys(
      Object.keys(arr[0]).slice(
        Object.keys(arr[0]).length / 2,
        Object.keys(arr[0]).length
      )
    );
    setIsLoading(false);
  };

  React.useEffect(() => {
    onLoad();
  }, []);

  return (
    <TableHead>
      <TableRow>
        {keys.map((key, i) => (
          <TableCell key={i} align={i > 0 ? "right" : "left"}>
            {key.toUpperCase()}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
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
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
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

export default function Transaction() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("calories");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [company, setCompany] = React.useState<any>();
  const [companyInfo, setCompanyInfo] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [keys, setKeys] = React.useState<string[]>([]);

  const onLoad = async () => {
    const comps = await getAllCompanys();
    setCompany(comps);

    const compsID: any = comps.map((el: any) => el._id);
    const arr: any[] = await Promise.all(
      compsID.map(async (id: any) => await getCompanyAssetsInfo(id))
    );
    setCompanyInfo(arr);

    setKeys(
      Object.keys(arr[0]).slice(
        Object.keys(arr[0]).length / 2,
        Object.keys(arr[0]).length
      )
    );
    setIsLoading(false);
  };

  React.useEffect(() => {
    getUserTransactions().then((res) => console.log("lol", res));
  }, []);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - companyInfo.length) : 0;

  return (
    <Container maxWidth="lg">
      <Box sx={{width: "100%", marginTop: "20px"}}>
        <Paper sx={{width: "100%", mb: 2}}>
          <EnhancedTableToolbar numSelected={selected.length} />
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
                rowCount={companyInfo.length}
              />
              <TableBody>
                {companyInfo?.map((row: any, index: any) => {
                  const isItemSelected = isSelected(row.company_id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.company_id}
                    >
                      <TableCell>
                        <Link
                          to={`/asset/market/${
                            company.filter(
                              (el: any) => el._id === row.company_id
                            )[0].symbol
                          }`}
                          style={{textDecoration: "none", color: "inherit"}}
                        >
                          {
                            company.filter(
                              (el: any) => el._id === row.company_id
                            )[0].symbol
                          }
                        </Link>
                      </TableCell>
                      <TableCell align="right">
                        {formatEther(row.lowPrice)}
                      </TableCell>
                      <TableCell align="right">
                        {formatEther(row.midPrice)}
                      </TableCell>
                      <TableCell align="right">
                        {formatEther(row.highPrice)}
                      </TableCell>
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
