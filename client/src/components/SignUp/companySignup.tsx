import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useForm from "../../hooks/useForm";
import { AppContext } from "../../provider/AppProvider";
import { addCompany } from "../../api/CompanyService";
import { COMPANY_LOGIN_URL } from "../../utils/NavUrls";

//@ts-ignore
const { ethereum } = window;

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignInSide() {
  const { setJWT, connectWallet, changeSnackBar } =
    React.useContext(AppContext);
  const [values, setValues] = useForm({
    name: "",
    symbol: "",
    website: "",
    password: "",
    email: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(e);
    console.log(values);
  };

  const SignUp = async (e: any) => {
    e.preventDefault();

    // if (!values.name || !values.website || !values.symbol) {
    //   changeSnackBar(true, `Please Fill All Fields`, "warning");
    //   return;
    // }

    // if (values.password.length < 8) {
    //   changeSnackBar(true, `Password Length Must Be at least 8`, "warning");
    //   return;
    // }
    // if (
    //   values.password.toUpperCase() === values.password ||
    //   values.password.toLowerCase() === values.password
    // ) {
    //   changeSnackBar(true, `Password Contains Upper And Lower Case`, "warning");

    //   return;
    // }

    ethereum.request({
      method: "eth_requestAccounts",
    });

    const res = await addCompany(values);
    console.log(res);

    connectWallet();
    if (res) changeSnackBar(true, `Logged In`, "success");
    else {
      changeSnackBar(true, `Invalid Credentials`, "error");
    }
    setJWT(res.token);
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        height: "92vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CssBaseline />
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Company Sign Up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Name"
              type="text"
              id="password"
              autoComplete="current-password"
              onChange={onChange}
              color="secondary"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              type="text"
              id="password"
              autoComplete="current-password"
              onChange={onChange}
              color="secondary"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Symbol"
              name="symbol"
              autoComplete="email"
              onChange={onChange}
              color="secondary"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Website"
              name="website"
              autoComplete="email"
              onChange={onChange}
              color="secondary"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
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
              onClick={SignUp}
              color="secondary"
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  href={COMPANY_LOGIN_URL}
                  variant="body2"
                  sx={{ color: "black" }}
                >
                  {"Already have An Account ? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
