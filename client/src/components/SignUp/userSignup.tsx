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
import {addUser} from "../../api/UserService";
import {USER_LOGIN_URL} from "../../utils/NavUrls";

//@ts-ignore
const {ethereum} = window;

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
  const {setJWT, connectWallet} = React.useContext(AppContext);
  const [values, setValues] = useForm({
    username: "",
    password: "",
    email: "",
    wallet: "",
  });
  // const toast = useToast();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(e);
    console.log(values);
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
    /*
    if (!values.username || !values.password || !values.email) {
      toast({
        title: ` Please Fill All Fields`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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

    ethereum.request({
      method: "eth_requestAccounts",
    });

    const res = await addUser(values);
    connectWallet();
    console.log("sana ", res);
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
            User Sign Up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              type="text"
              id="password"
              autoComplete="current-password"
              onChange={onChange}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={onChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Wallet Address"
              name="wallet"
              autoComplete="email"
              onChange={onChange}
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
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2}}
            >
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid> */}
              <Grid item>
                <Link href={USER_LOGIN_URL} variant="body2">
                  {"Already have An Account ? Sign In"}
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{mt: 5}} />
          </Box>
        </Box>
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
//   // useToast,
//   Input,
//   Text,
// } from "@chakra-ui/react";
// import useForm from "../../hooks/useForm";
// import {addUser} from "../../api/UserService";
// import {useContext} from "react";
// import {AppContext} from "../../provider/AppProvider";
// import {Link} from "react-router-dom";
// import {USER_LOGIN_URL} from "../../utils/NavUrls";

// //@ts-ignore
// const {ethereum} = window;

// const Index = () => {
//   const {setJWT, connectWallet} = useContext(AppContext);
//   const [values, setValues] = useForm({
//     username: "",
//     password: "",
//     email: "",
//     wallet: "",
//   });
//   // const toast = useToast();

//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValues(e);
//   };

//   const SignUp = async () => {
//     /*
//     if (!values.username || !values.password || !values.email) {
//       toast({
//         title: ` Please Fill All Fields`,
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     if (values.password.length < 8) {
//       toast({
//         title: `Password Length Must Be at least 8`,
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }
//     if (
//       values.password.toUpperCase() === values.password ||
//       values.password.toLowerCase() === values.password
//     ) {
//       toast({
//         title: `Password Contains Upper And Lower Case`,
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }*/

//     ethereum.request({
//       method: "eth_requestAccounts",
//     });

//     const res = await addUser(values);
//     connectWallet();
//     console.log("sana ", res);
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
//         mt="40"
//         p="5"
//       >
//         <Heading fontSize="2xl" my="5" textAlign={"center"}>
//           User Sign Up
//         </Heading>
//         <FormControl>
//           <FormLabel htmlFor="amount">Username</FormLabel>
//           <Input
//             placeholder="username"
//             name="username"
//             size="md"
//             onChange={onChange}
//             mb={3}
//           />
//           <FormLabel htmlFor="amount">Email</FormLabel>
//           <Input
//             placeholder="Email"
//             name="email"
//             size="md"
//             onChange={onChange}
//             mb={3}
//           />
//           <FormLabel htmlFor="amount">Wallet Address</FormLabel>
//           <Input
//             placeholder="Wallet Address"
//             name="wallet"
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
//               onClick={SignUp}
//             >
//               Sign Up
//             </Button>
//           </Flex>
//         </FormControl>
//       </Box>
//       <Flex justify={"center"} align={"center"} my={5}>
//         <Link to={USER_LOGIN_URL}>
//           <Text fontSize="xl" color={"red.400"}>
//             Alerady have a user account ? Log IN
//           </Text>
//         </Link>
//       </Flex>
//     </div>
//   );
// };

// export default Index;
