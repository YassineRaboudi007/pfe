import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import {AppContext} from "../../provider/AppProvider";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  buyLDTTokens,
  sellLDTokens,
} from "../../smart-contract/ContractFunctions/TokenContractFunctions";

export default function SimplePaper() {
  const [amount, setAmount] = React.useState<number>(0.5);
  const [isBuying, setIsBuying] = React.useState<boolean>(true);

  const {updateAccountBalance, changeSnackBar, currentBalance} =
    React.useContext(AppContext);

  const tokenStep: number = 0.01;

  const changedAmount = (e: any): void => {
    console.log(e.target.value);
    e.target.value ? setAmount(parseFloat(e.target.value)) : setAmount(0);
  };

  const switchPosition = () => {
    setIsBuying(!isBuying);
  };

  const swaptTokens = async () => {
    if (isBuying) {
      (await buyLDTTokens(amount))
        ? changeSnackBar(true, "Bought Tokens", "success")
        : changeSnackBar(true, "Error Occured", "error");
    } else {
      if (currentBalance < amount) {
        changeSnackBar(true, "You Dont Have Enough Tokens", "error");
        return;
      }
      (await sellLDTokens(amount))
        ? changeSnackBar(true, "Sold Tokens", "success")
        : changeSnackBar(true, "Error Occured", "error");
    }
    updateAccountBalance();
  };

  return (
    <Grid container>
      <Grid item xs={12} md={9} lg={6} sx={{margin: "auto"}}>
        <Paper
          elevation={3}
          sx={{
            padding: "40px 20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              endIcon={<ArrowForwardIosIcon />}
              disabled={isBuying ? true : false}
              onClick={switchPosition}
              color="secondary"
            >
              Buy Tokens
            </Button>
            <Button
              variant="contained"
              startIcon={<ArrowBackIosNewIcon />}
              disabled={isBuying ? false : true}
              onClick={switchPosition}
              color="secondary"
            >
              Sell Tokens
            </Button>
          </Box>
          <Box sx={{width: "90%", margin: "auto"}}>
            <Typography variant="h4" align="center" sx={{margin: "30px"}}>
              {isBuying ? "Buy" : "Sell"} Tokens
            </Typography>
            <Typography variant="h5" sx={{m: 1}}>
              Ethereum :
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="outlined-adornment-amount">
                Amount
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                value={amount}
                label="Amount"
                onChange={changedAmount}
                disabled={isBuying ? false : true}
                color="secondary"
              />
            </FormControl>
            <Typography variant="h5" sx={{m: 1}}>
              LDToken :
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="outlined-adornment-amount">
                Amount
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                label="Amount"
                value={amount}
                onChange={changedAmount}
                disabled={isBuying ? true : false}
                color="secondary"
              />
            </FormControl>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                margin: "40px 0",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={swaptTokens}
              >
                Swap Tokens
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

// import {useState, useContext} from "react";
// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   NumberInput,
//   NumberInputField,
//   NumberInputStepper,
//   NumberIncrementStepper,
//   NumberDecrementStepper,
//   Flex,
//   Heading,
//   InputLeftAddon,
//   InputGroup,
//   useToast,
// } from "@chakra-ui/react";
// import {AppContext} from "../../provider/AppProvider";
// import {
//   buyLDTTokens,
//   sellLDTokens,
// } from "../../smart-contract/ContractFunctions/TokenContractFunctions";
// import ConnectWalletComponent from "../AuthComponent";
// import {ArrowRightIcon, ArrowLeftIcon} from "@chakra-ui/icons";
// import Loading from "../Loading";

// const Index = () => {
//   const [amount, setAmount] = useState<number>(0.5);
//   const [isBuying, setIsBuying] = useState<boolean>(true);

//   const {jwt, account, logout, getAccountBalance} = useContext(AppContext);
//   const toast = useToast();

//   const tokenStep: number = 0.01;

//   const changedAmount = (e: string): void => {
//     setAmount(parseFloat(e));
//   };

//   const switchPosition = () => {
//     setIsBuying(!isBuying);
//   };

//   const swaptTokens = async () => {
//     isBuying ? await buyLDTTokens(amount) : await sellLDTokens(amount);
//     console.log("account balance", await getAccountBalance(account));
//     toast({
//       title: `${isBuying ? "Bought" : "Sold"} ${amount} of LDT Tokens.`,
//       description: "We've created your account for you.",
//       status: "success",
//       duration: 3000,
//       isClosable: true,
//     });
//   };

//   if (logout === null) return <Loading />;
//   if (logout === "LogedOut" || !jwt) return <ConnectWalletComponent />;

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
//         <Flex justifyContent={"space-between"}>
//           <Button
//             rightIcon={<ArrowRightIcon />}
//             size="sm"
//             bgColor={"red.400"}
//             _hover={{
//               bg: "red.500",
//             }}
//             onClick={switchPosition}
//             color={"white"}
//             isDisabled={isBuying ? true : false}
//           >
//             Buy
//           </Button>
//           <Button
//             leftIcon={<ArrowLeftIcon />}
//             size="sm"
//             bgColor={"red.400"}
//             _hover={{
//               bg: "red.500",
//             }}
//             isDisabled={isBuying ? false : true}
//             onClick={switchPosition}
//             color={"white"}
//           >
//             Sell
//           </Button>
//         </Flex>
//         <Heading fontSize="2xl" my="5" textAlign={"center"}>
//           {isBuying ? "Buy" : "Sell"} Tokens
//         </Heading>
//         <FormControl>
//           <FormLabel htmlFor="amount">Ethereum</FormLabel>
//           <InputGroup size="lg" justifyContent={"center"}>
//             <InputLeftAddon children="Eth" />
//             <NumberInput
//               min={0.5}
//               step={tokenStep}
//               defaultValue={0.5}
//               value={amount}
//               onChange={changedAmount}
//               isDisabled={isBuying ? false : true}
//               bgColor={isBuying ? "" : "gray.100"}
//             >
//               <NumberInputField id="amount" />
//               <NumberInputStepper>
//                 <NumberIncrementStepper />
//                 <NumberDecrementStepper />
//               </NumberInputStepper>
//             </NumberInput>
//           </InputGroup>

//           <FormLabel htmlFor="amount" mt={5}>
//             LDT
//           </FormLabel>
//           <InputGroup size="lg" justifyContent={"center"}>
//             <InputLeftAddon children="LDT" />
//             <NumberInput
//               min={0.5}
//               step={tokenStep}
//               defaultValue={0.5}
//               value={amount}
//               onChange={changedAmount}
//               isDisabled={isBuying ? true : false}
//               bgColor={isBuying ? "gray.100" : ""}
//             >
//               <NumberInputField id="amount" />
//               <NumberInputStepper>
//                 <NumberIncrementStepper />
//                 <NumberDecrementStepper />
//               </NumberInputStepper>
//             </NumberInput>
//           </InputGroup>

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
//               onClick={swaptTokens}
//             >
//               Swap Tokens
//             </Button>
//           </Flex>
//         </FormControl>
//       </Box>
//     </div>
//   );
// };

// export default Index;
