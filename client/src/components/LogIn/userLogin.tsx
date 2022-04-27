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
import {createTheme, ThemeProvider} from "@mui/material/styles";
import useForm from "../../hooks/useForm";
import {AppContext} from "../../provider/AppProvider";
import {addUser, getUser} from "../../api/UserService";
import {USER_SIGNUP_URL, USER_FORGOT_PASSWORD} from "../../utils/NavUrls";

//@ts-ignore

export default function SignInSide() {
  const {setJWT, connectWallet} = React.useContext(AppContext);
  const {changeSnackBar} = React.useContext(AppContext);

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
    if (res.status === "success") setJWT(res.token.token);
  };

  return (
    <Grid container sx={{height: "93vh", backgroundColor: "red"}}>
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
          <Box component="form" noValidate sx={{mt: 1}}>
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
              sx={{mt: 3, mb: 2}}
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
                  sx={{color: "black"}}
                >
                  {"Dont have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Grid container style={{margin: "10px 0"}}>
              <Grid item>
                <Link
                  href={USER_FORGOT_PASSWORD}
                  variant="body2"
                  sx={{color: "black"}}
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

// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Flex,
//   Heading,
//   Input,
//   Text,
// } from "@chakra-ui/react";
// import useForm from "../../hooks/useForm";
// import {getUser} from "../../api/UserService";
// import {useContext} from "react";
// import {AppContext} from "../../provider/AppProvider";
// import {Link} from "react-router-dom";
// import {USER_SIGNUP_URL} from "../../utils/NavUrls";
// import useCustomToast from "../../hooks/useCustomToast";

// const Index = () => {
//   const {setJWT, connectWallet} = useContext(AppContext);

//   const [values, setValues] = useForm({
//     password: "",
//     email: "",
//   });

//   const {toast} = useCustomToast();
//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValues(e);
//   };

//   const Login = async () => {
//     if (!values.password || !values.email) {
//       toast(`Please Fill All Fields`, "warning");
//       return;
//     }

//     const res = await getUser(values);
//     if (res) toast("Logged In", "success");

//     connectWallet();

//     setJWT(res.token);
//   };

//   return (
//     <div>
//       <Box
//         maxW="md"
//         borderWidth="1px"
//         borderRadius="lg"
//         overflow="hidden"
//         mx="auto"
//         mt="48"
//         p="5"
//       >
//         <Heading fontSize="2xl" my="5" textAlign={"center"}>
//           User Log In
//         </Heading>
//         <FormControl>
//           <FormLabel htmlFor="amount">Email</FormLabel>
//           <Input
//             placeholder="Email"
//             name="email"
//             size="md"
//             onChange={onChange}
//             mb={3}
//           />
//           <FormLabel htmlFor="amount">Password</FormLabel>
//           <Input
//             placeholder="Password"
//             name="password"
//             type={"password"}
//             size="md"
//             onChange={onChange}
//             mb={3}
//           />

//           <Flex align={"center"} justify={"center"}>
//             <Button
//               variant="solid"
//               mt={5}
//               size="lg"
//               bgColor={"red.500"}
//               _hover={{
//                 bg: "red.600",
//               }}
//               color={"white"}
//               px={10}
//               onClick={Login}
//             >
//               Log In
//             </Button>
//           </Flex>
//         </FormControl>
//       </Box>
//       <Flex justify={"center"} align={"center"} my={5}>
//         <Link to={USER_SIGNUP_URL}>
//           <Text fontSize="xl" color={"red.400"}>
//             Dont have a user account ? Sign Up
//           </Text>
//         </Link>
//       </Flex>
//     </div>
//   );
// };

// export default Index;
