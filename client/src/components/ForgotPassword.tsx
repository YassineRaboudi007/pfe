import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useForm from "../hooks/useForm";
import { useAppContext } from "../provider/AppProvider";
import { requestUserResetPassword } from "../api/UserService";
import {
  COMPANY_FORGOT_PASSWORD,
  USER_FORGOT_PASSWORD,
} from "../utils/NavUrls";
import { requestCompanyResetPassword } from "../api/CompanyService";
import { useLocation } from "react-router-dom";

export default function ForgotPassword() {
  const { pathname } = useLocation();

  const { setJWT, changeSnackBar, connectWallet } = useAppContext();
  const [values, setValues] = useForm({
    email: null,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(e);
  };

  const resetPassword = async (e: any) => {
    e.preventDefault();
    if (!values.email) {
      changeSnackBar(true, `Please Fill All Fields`, "warning");
      return;
    }
    let res = null;
    if (pathname === USER_FORGOT_PASSWORD) {
      res = await requestUserResetPassword(values.email);
    } else if (pathname === COMPANY_FORGOT_PASSWORD) {
      res = await requestCompanyResetPassword(values.email);
    }
    // @ts-ignore
    changeSnackBar(true, res.msg, res.status);
  };

  return (
    <Grid container component="main" sx={{ height: "93vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        component={Paper}
        square
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#ededed",
        }}
      >
        <Paper
          sx={{
            my: 20,
            mx: 4,
            padding: "20px 30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          elevation={6}
        >
          <Typography component="h1" variant="h5">
            Forgot Password ?
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              name="email"
              label="Enter Your Email"
              id="password"
              autoComplete="current-password"
              onChange={onChange}
              color="secondary"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={resetPassword}
              color="secondary"
            >
              Send Reset Email
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
