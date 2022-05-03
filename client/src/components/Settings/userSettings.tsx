import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useForm from "../../hooks/useForm";
import { AppContext, useAppContext } from "../../provider/AppProvider";
import { addUser, getUserById, updateUser } from "../../api/UserService";
import { USER_LOGIN_URL } from "../../utils/NavUrls";
import { getIdFromJWT } from "../../utils/decodeJWT";

//@ts-ignore
const { ethereum } = window;

export default function UserSettings() {
  const { setJWT, connectWallet, changeSnackBar, jwt } = useAppContext();
  const [account, setAccount] = React.useState<any>({});
  const [values, setValues] = React.useState({
    id: "",
    username: null,
    password: "",
    email: null,
    wallet: null,
  });

  React.useEffect(() => {
    getUserById(getIdFromJWT(jwt)).then((res) => {
      const { username, email, wallet } = res;
      setValues({
        id: getIdFromJWT(jwt),
        username,
        email,
        wallet,
        password: "",
      });
      setAccount(res);
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const SignUp = async (e: any) => {
    e.preventDefault();

    if (!values.username || !values.password || !values.email) {
      changeSnackBar(true, `Fill All Fields`, "warning");

      return;
    }
    /*
    if (values.password.length < 8) {
      toast({
        title: `Password Length Must Be at least 8`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (
      values.password.toUpperCase() === values.password ||
      values.password.toLowerCase() === values.password
    ) {
      toast({
        title: `Password Contains Upper And Lower Case`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }*/

    const res = await updateUser(values);
    console.log(res);

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
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              value={values.username}
              type="text"
              autoComplete="current-password"
              onChange={onChange}
              color="secondary"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              value={values.email}
              autoComplete="email"
              onChange={onChange}
              color="secondary"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Wallet Address"
              name="wallet"
              value={values.wallet}
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
              Sign In
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
