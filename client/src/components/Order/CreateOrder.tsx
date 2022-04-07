import {useState, useContext, useEffect} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import {AppContext} from "../../provider/AppProvider";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import useCustomToast from "../../hooks/useCustomToast";
import {
  createContractBuyOrder,
  createContractSellOrder,
} from "../../smart-contract/ContractFunctions/OrderContractFunctions";
import ConnectWalletComponent from "../AuthComponent";
import {ArrowRightIcon, ArrowLeftIcon} from "@chakra-ui/icons";
import {getAllCompanys} from "../../api/CompanyService";
import useForm from "../../hooks/useForm";

export default function SimplePaper() {
  const [amount, setAmount] = useState<number>(0.5);
  const [isBuyOrder, setIsBuyOrder] = useState<boolean>(true);
  const [companys, setCompanys] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {jwt, account, logout, getAccountBalance} = useContext(AppContext);
  const {toast} = useCustomToast();
  const [values, setValues] = useForm({
    company: null,
    price: 0.5,
    amount: 1,
  });

  const switchPosition = () => {
    setIsBuyOrder(!isBuyOrder);
  };

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setValues(e);
  };

  useEffect(() => {
    getAllCompanys().then((res: any) => {
      setCompanys(res);
      setIsLoading(false);
    });
  }, []);

  const placeOrder = () => {
    if (!values.company || !values.price || !values.amount) {
      toast("Please Fill All Fields", "warning");
      return;
    }
    isBuyOrder ? createBuyOrder() : createSellOrder();
  };

  const createBuyOrder = () => {
    createContractBuyOrder(values);
  };
  const createSellOrder = async () => {
    createContractSellOrder(values);
  };

  return (
    <Box
      sx={{
        width: "45vw",
        margin: "auto",
      }}
    >
      <Paper
        elevation={3}
        sx={{width: "100%", marginTop: "10%", padding: "20px"}}
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
            disabled={isBuyOrder ? true : false}
            onClick={switchPosition}
          >
            Buy Order
          </Button>
          <Button
            variant="contained"
            startIcon={<ArrowBackIosNewIcon />}
            onClick={switchPosition}
            disabled={isBuyOrder ? false : true}
          >
            Sell Order
          </Button>
        </Box>
        <Box sx={{width: "90%", margin: "auto"}}>
          <Typography variant="h4" align="center" sx={{margin: "50px"}}>
            {isBuyOrder ? "Max" : "Min"} Asset {isBuyOrder ? "Buy" : "Sell"}{" "}
            Price (LDT)
          </Typography>
          <Typography variant="h5" sx={{m: 1}}>
            Company :
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="outlined-adornment-amount">Company</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              label="Company"
              value="MST"
            />
          </FormControl>
          <Typography variant="h5" sx={{m: 1}}>
            Amount :
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              label="Amount"
              value={amount}
            />
          </FormControl>
          <Typography variant="h5" sx={{m: 1}}>
            Price :
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              label="Price"
              value={amount}
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
            <Button variant="contained" onClick={placeOrder}>
              Place Order
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

// export default Index;

// import {useState, useContext, useEffect} from "react";
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
//   InputGroup,
//   Select,
// } from "@chakra-ui/react";
// import {AppContext} from "../../provider/AppProvider";
// import useCustomToast from "../../hooks/useCustomToast";
// import {
//   createContractBuyOrder,
//   createContractSellOrder,
// } from "../../smart-contract/ContractFunctions/OrderContractFunctions";
// import ConnectWalletComponent from "../AuthComponent";
// import {ArrowRightIcon, ArrowLeftIcon} from "@chakra-ui/icons";
// import {getAllCompanys} from "../../api/CompanyService";
// import useForm from "../../hooks/useForm";

// const Index = () => {
//   const [amount, setAmount] = useState<number>(0.5);
//   const [isBuyOrder, setIsBuyOrder] = useState<boolean>(true);
//   const [companys, setCompanys] = useState<any>();
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const {jwt, account, logout, getAccountBalance} = useContext(AppContext);
//   const {toast} = useCustomToast();
//   const [values, setValues] = useForm({
//     company: null,
//     price: 0.5,
//     amount: 1,
//   });

//   const switchPosition = () => {
//     setIsBuyOrder(!isBuyOrder);
//   };

//   const onChange = (
//     e:
//       | React.ChangeEvent<HTMLInputElement>
//       | React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setValues(e);
//   };

//   useEffect(() => {
//     getAllCompanys().then((res: any) => {
//       setCompanys(res);
//       setIsLoading(false);
//     });
//   }, []);

//   const placeOrder = () => {
//     if (!values.company || !values.price || !values.amount) {
//       toast("Please Fill All Fields", "warning");
//       return;
//     }
//     isBuyOrder ? createBuyOrder() : createSellOrder();
//   };

//   const createBuyOrder = () => {
//     createContractBuyOrder(values);
//   };
//   const createSellOrder = async () => {
//     createContractSellOrder(values);
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
//             isDisabled={isBuyOrder ? true : false}
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
//             isDisabled={isBuyOrder ? false : true}
//             onClick={switchPosition}
//             color={"white"}
//           >
//             Sell
//           </Button>
//         </Flex>
//         <Heading fontSize="2xl" my="5" textAlign={"center"}>
//           Place {isBuyOrder ? "Buy" : "Sell"} Tokens
//         </Heading>
//         <FormControl>
//           <FormLabel htmlFor="country">Company</FormLabel>
//           <Select
//             id="country"
//             placeholder="Select Company"
//             name="company"
//             onChange={onChange}
//             mb={3}
//           >
//             {!isLoading &&
//               companys.map((comp: any) => (
//                 <option value={comp._id} key={comp._id}>
//                   {comp.symbol}
//                 </option>
//               ))}
//           </Select>
//           <FormLabel htmlFor="amount">
//             {isBuyOrder ? "Max" : "Min"} Asset {isBuyOrder ? "Buy" : "Sell"}{" "}
//             Price (LDT)
//           </FormLabel>
//           <InputGroup>
//             <NumberInput
//               min={0.5}
//               step={0.01}
//               defaultValue={values.price}
//               w="100%"
//               mb={3}
//             >
//               <NumberInputField
//                 id="amount"
//                 name="price"
//                 type={"number"}
//                 onChange={setValues}
//               />
//               <NumberInputStepper>
//                 <NumberIncrementStepper />
//                 <NumberDecrementStepper />
//               </NumberInputStepper>
//             </NumberInput>
//           </InputGroup>
//           <FormLabel htmlFor="amount">Amount</FormLabel>
//           <InputGroup>
//             <NumberInput min={1} defaultValue={values.amount} w="100%" mb={3}>
//               <NumberInputField
//                 id="amount"
//                 name="amount"
//                 type={"number"}
//                 onChange={setValues}
//               />
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
//               px={10}
//               onClick={placeOrder}
//             >
//               Place Order
//             </Button>
//           </Flex>
//         </FormControl>
//       </Box>
//     </div>
//   );
// };

// export default Index;
