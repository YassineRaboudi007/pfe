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
import { AppContext, useAppContext } from "../../provider/AppProvider";
import {
  addCompany,
  getCompanyById,
  updateCompany,
} from "../../api/CompanyService";
import { COMPANY_LOGIN_URL } from "../../utils/NavUrls";
import { getIdFromJWT } from "../../utils/decodeJWT";
import { getUserById } from "../../api/UserService";

//@ts-ignore
const { ethereum } = window;

export default function CompanySettings() {
  const { setJWT, connectWallet, changeSnackBar, jwt } = useAppContext();
  const [account, setAccount] = React.useState<any>({});
  const [values, setValues] = React.useState({
    id: "",
    name: null,
    symbol: null,
    website: null,
    password: "",
    email: null,
  });

  React.useEffect(() => {
    getCompanyById(getIdFromJWT(jwt)).then((res) => {
      const { name, website, symbol, email } = res;
      setValues({
        id: getIdFromJWT(jwt),
        name,
        website,
        symbol,
        password: "",
        email,
      });
      setAccount(res);
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const updateAccount = async (e: any) => {
    e.preventDefault();

    if (!values.name || !values.website || !values.symbol || !values.password) {
      changeSnackBar(true, `Please Fill All Fields`, "warning");
      return;
    }

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

    const res = await updateCompany(values);

    if (res) changeSnackBar(true, res.msg, "success");
    else {
      changeSnackBar(true, `Invalid Credentials`, "error");
    }
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
            Account Settings
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Name"
              value={!values.name ? account.name : values.name}
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
              value={!values.email ? account.email : values.email}
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
              value={!values.symbol ? account.symbol : values.symbol}
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
              value={!values.website ? account.website : values.website}
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
              onClick={updateAccount}
              color="secondary"
            >
              Update Account
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
