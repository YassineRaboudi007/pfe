import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { InputLabel, Paper, TextField } from "@mui/material";
import { listContractAsset } from "../../smart-contract/ContractFunctions/AssetContractFunctions";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props: any) {
  const [price, setPrice] = React.useState<number>(0);
  const handleClose = () => props.setOpen(false);
  const listAsset = async () => {
    if (
      await listContractAsset(
        props.assetToList.company_id,
        props.assetToList.id,
        price
      )
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
        <Box sx={style}>
          <InputLabel
            htmlFor="outlined-adornment-amount"
            sx={{ marginBottom: "10px" }}
          >
            Listing Price
          </InputLabel>

          <TextField
            id="outlined-basic"
            label="Price"
            variant="outlined"
            margin="normal"
            onChange={(e) => {
              setPrice(parseFloat(e.target.value));
            }}
            fullWidth
          />
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            sx={{ margin: "20px" }}
            onClick={listAsset}
          >
            <Button variant="contained">List Asset</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
