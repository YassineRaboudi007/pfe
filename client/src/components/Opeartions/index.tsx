// @ts-nocheck
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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import {Alert, Container} from "@mui/material";

import {getAllCompanys} from "../../api/CompanyService";
import formatEther from "../../utils/formatEther";
import {getUserTransactions} from "../../smart-contract/ContractFunctions/TransactionContractFunctions";
import {getUserOperations} from "../../smart-contract/ContractFunctions/OperationContractFunctions";

interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

type Order = "asc" | "desc";

function EnhancedTableHead(props: any) {
  return (
    <TableHead>
      <TableRow>
        <TableCell>From </TableCell>
        <TableCell>To</TableCell>
        <TableCell>Quantity</TableCell>
        <TableCell>Position</TableCell>
        <TableCell>Date</TableCell>
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
    </Toolbar>
  );
};

export default function Operations(props) {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [operations, setOperations] = React.useState([]);
  React.useEffect(() => {
    getUserOperations().then((res) => {
      console.log("sana is here ", res);
      setOperations(res);
    });
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactions.length) : 0;

  return (
    <Container maxWidth="lg" sx={{position: "absolute", top: "10%"}}>
      <Box sx={{width: "100%", marginTop: "20px"}}>
        <Paper sx={{width: "100%", mb: 2}}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table sx={{minWidth: 750}} aria-labelledby="tableTitle">
              <EnhancedTableHead />
              <TableBody>
                {operations?.map((row: any, index: any) => {
                  console.log("row ", row);

                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell>
                        {row.from ===
                        "0x0000000000000000000000000000000000000000"
                          ? "Linedata MarketPlace"
                          : row.from}
                      </TableCell>
                      <TableCell>
                        {row.to === "0x0000000000000000000000000000000000000000"
                          ? "Linedata MarketPlace"
                          : row.to}
                      </TableCell>
                      <TableCell align="right">
                        {formatEther(row.quantity)} LDT
                      </TableCell>

                      <TableCell>
                        <Alert
                          icon={false}
                          severity={row.isBuyer ? "success" : "error"}
                        >
                          {row.isBuyer ? "Buyer" : "Seller"}
                        </Alert>
                      </TableCell>
                      <TableCell align="right">
                        {new Date(row.timestamp * 1000).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {operations?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <h3
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        Empty For The Moment
                      </h3>
                    </TableCell>
                  </TableRow>
                )}
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
