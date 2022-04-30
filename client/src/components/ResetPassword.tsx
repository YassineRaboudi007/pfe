import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useForm from "../hooks/useForm";
import { useAppContext } from "../provider/AppProvider";
import { userPasswordReset } from "../api/UserService";
import { companyPasswordReset } from "../api/CompanyService";
import {
  COMPANY_PASSWORD_RESET,
  USER_PASSWORD_RESET,
  USER_LOGIN_URL,
  COMPANY_LOGIN_URL,
} from "../utils/NavUrls";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  let navigate = useNavigate();
  const { pathname } = useLocation();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get("token");
  const userId = urlParams.get("id");

  const { changeSnackBar } = useAppContext();
  const [values, setValues] = useForm({
    password: null,
    confirm: null,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(e);
  };

  const resetPassword = async (e: any) => {
    e.preventDefault();
    if (!values.password || !values.confirm) {
      changeSnackBar(true, `Please Fill All Fields`, "warning");
      return;
    }
    let res = null;
    if (pathname === USER_PASSWORD_RESET) {
      res = await userPasswordReset({
        password: values.password,
        userId,
        token,
      });

      navigate(USER_LOGIN_URL);
    } else if (pathname === COMPANY_PASSWORD_RESET) {
      res = await companyPasswordReset({
        password: values.password,
        userId,
        token,
      });
      navigate(COMPANY_LOGIN_URL);
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
            Password Reset
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Enter Your Password"
              id="password"
              autoComplete="current-password"
              onChange={onChange}
              color="secondary"
            />
            <TextField
              margin="normal"
              fullWidth
              name="confirm"
              label="Confirm Password"
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
              Reset password
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
