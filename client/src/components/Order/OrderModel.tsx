import {useState, useEffect} from "react";

import Modal from "@mui/material/Modal";
import {
  InputLabel,
  Box,
  Button,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  Paper,
} from "@mui/material";

import {getCompanyById} from "../../api/CompanyService";
import {useAppContext} from "../../provider/AppProvider";
import useForm from "../../hooks/useForm";
import {modifyBuyOrder} from "../../smart-contract/ContractFunctions/OrderContractFunctions";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function OrderModel(props: any) {
  console.log("model props ", props);

  const [amount, setAmount] = useState<number>(0.5);
  const [isBuyOrder, setIsBuyOrder] = useState<boolean>(true);
  const [company, setCompany] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {jwt, account, logout, updateAccountBalance, changeSnackBar} =
    useAppContext();
  const [values, setValues] = useForm({
    price: 0.5,
    amount: 1,
  });

  const onChange = (e: any) => {
    setValues(e);
  };

  useEffect(() => {
    if (props.orderToEdit)
      getCompanyById(props.orderToEdit.company_id).then((res: any) => {
        setCompany(res);
      });
  }, [props.orderToEdit]);

  const handleClose = () => props.setOpen(false);

  const ModifyOrder = async () => {
    if (
      await modifyBuyOrder(props.orderToEdit.id, values.price, values.amount)
    ) {
      props.toggleAction();
    }
  };

  return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper elevation={3}>
          <Box sx={style}>
            <Box sx={{width: "90%", margin: "auto"}}>
              <Typography variant="h4" align="center" sx={{margin: "50px"}}>
                Create Buy Order
              </Typography>
              <Typography variant="h5" sx={{m: 1}}>
                Company :
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="outlined-adornment-amount">
                  Company
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  label="Amount"
                  value={company.symbol}
                  disabled
                />
              </FormControl>
              <Typography variant="h5" sx={{m: 1}}>
                Amount :
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="outlined-adornment-amount">
                  Amount
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  label="Amount"
                  value={amount}
                  onChange={onChange}
                />
              </FormControl>
              <Typography variant="h5" sx={{m: 1}}>
                Max asset buy price :
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="outlined-adornment-amount">
                  Price
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  label="Price"
                  value={amount}
                  onChange={onChange}
                />
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  margin: "40px 0",
                }}
              >
                <Button variant="contained" onClick={ModifyOrder}>
                  Modify Order
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </div>
  );
}
