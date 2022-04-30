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
import { useAppContext } from "../../provider/AppProvider";
import {
  COMPANY_SIGNUP_URL,
  COMPANY_FORGOT_PASSWORD,
  ADD_ASSETS_URL,
} from "../../utils/NavUrls";
import { getCompany } from "../../api/CompanyService";
import { useNavigate } from "react-router-dom";

//@ts-ignore
const { ethereum } = window;

export default function SignInSide() {
  let navigate = useNavigate();

  const { setJWT, changeSnackBar, connectWallet } = useAppContext();
  const [values, setValues] = useForm({
    name: "",
    password: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(e);
  };

  const LogIn = async (e: any) => {
    e.preventDefault();
    if (!values.name || !values.password) {
      changeSnackBar(true, `Please Fill All Fields`, "warning");
      return;
    }

    ethereum.request({
      method: "eth_requestAccounts",
    });

    const res = await getCompany(values);
    //@ts-ignore
    changeSnackBar(true, res.msg, res.status);

    connectWallet();

    if (res.status === "success") setJWT(res.token.token);
    navigate(ADD_ASSETS_URL);
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
            Company Log In
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Name"
              name="name"
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
              onClick={LogIn}
              color="secondary"
            >
              Log In
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  href={COMPANY_SIGNUP_URL}
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
                  href={COMPANY_FORGOT_PASSWORD}
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
// import {useContext} from "react";
// import {AppContext} from "../../provider/AppProvider";
// import {Link} from "react-router-dom";
// import {COMPANY_SIGNUP_URL} from "../../utils/NavUrls";
// import {getCompany} from "../../api/CompanyService";
// import useCustomToast from "../../hooks/useCustomToast";

// //@ts-ignore
// const {ethereum} = window;

// const Index = () => {
//   const {setJWT} = useContext(AppContext);
//   const {toast} = useCustomToast();
//   const [values, setValues] = useForm({
//     name: "",
//     password: "",
//   });

//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValues(e);
//   };

//   const LogIn = async () => {
//     if (!values.name || !values.password) {
//       toast(`Please Fill All Fields`, "warning");
//       return;
//     }

//     ethereum.request({
//       method: "eth_requestAccounts",
//     });

//     const res = await getCompany(values);
//     if (res) toast("Logged In", "success");
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
//           Company Log In
//         </Heading>
//         <FormControl>
//           <FormLabel htmlFor="amount">Name</FormLabel>
//           <Input
//             placeholder="username"
//             name="name"
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
//               onClick={LogIn}
//             >
//               Log In
//             </Button>
//           </Flex>
//         </FormControl>
//       </Box>
//       <Flex justify={"center"} align={"center"} my={5}>
//         <Link to={COMPANY_SIGNUP_URL}>
//           <Text fontSize="xl" color={"red.400"}>
//             Alerady have a company account ? Log IN
//           </Text>
//         </Link>
//       </Flex>
//     </div>
//   );
// };

// export default Index;
