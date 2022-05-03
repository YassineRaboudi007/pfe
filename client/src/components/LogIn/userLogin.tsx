import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useForm from "../../hooks/useForm";
import { AppContext, useAppContext } from "../../provider/AppProvider";
import { getUser } from "../../api/UserService";
import {
  USER_SIGNUP_URL,
  USER_FORGOT_PASSWORD,
  GET_ASSETS_URL,
} from "../../utils/NavUrls";
import { useNavigate } from "react-router-dom";

//@ts-ignore

export default function SignInSide() {
  let navigate = useNavigate();

  const { setJWT, connectWallet, changeSnackBar } = useAppContext();

  const [values, setValues] = useForm({
    password: "",
    email: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(e);
  };

  const Login = async (e: any) => {
    e.preventDefault();
    if (!values.password || !values.email) {
      changeSnackBar(true, `Please Fill All Fields`, "warning");
      return;
    }

    const res = await getUser(values);
    // @ts-ignore
    changeSnackBar(true, res.msg, res.status);

    connectWallet();
    if (res.status === "success") {
      setJWT(res.token.token);
      navigate(GET_ASSETS_URL);
    }
  };

  return (
    <Grid container sx={{ height: "93vh", backgroundColor: "red" }}>
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
          elevation={3}
        >
          <Typography component="h1" variant="h5">
            User Log In
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
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
              onClick={Login}
              color="secondary"
            >
              Log In
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  href={USER_SIGNUP_URL}
                  variant="body2"
                  sx={{ color: "black" }}
                >
                  {"Dont have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Grid container style={{ margin: "10px 0" }}>
              <Grid item>
                <Link
                  href={USER_FORGOT_PASSWORD}
                  variant="body2"
                  sx={{ color: "black" }}
                >
                  {"Forgot Password ?"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
