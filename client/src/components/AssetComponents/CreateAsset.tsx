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
import useForm from "../../hooks/useForm";
import {AppContext} from "../../provider/AppProvider";
import {getAllCompanys} from "../../api/CompanyService";
import {
  addAsset,
  getAllAssets,
} from "../../smart-contract/ContractFunctions/AssetContractFunctions";
import {getRoleFromJWT} from "../../utils/decodeJWT";

export default function SimplePaper() {
  const [companys, setCompanys] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {jwt} = useContext(AppContext);

  const [values, setValues] = useForm({
    company: "ok",
    price: 0.5,
    amount: 1,
  });

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setValues(e);
    console.log(values);
  };

  useEffect(() => {
    getAllCompanys().then((res) => {
      setCompanys(res);
      setIsLoading(false);
    });
  }, []);

  const createEquity = async () => {
    console.log("values ,", values);

    if (!values.company || !values.price || !values.amount) {
      return;
    }

    console.log("ok");

    await addAsset(values);
  };

  // if (!jwt || (jwt && getRoleFromJWT(jwt) !== "company"))
  //   return (
  //     <Box height={"90vh"} align="center" sx={{display:"flex",alignItems:"center",justfyContent:"center"}}>
  //       <Box
  //         maxW="lg"
  //         borderWidth="1px"
  //         borderRadius="lg"
  //         mx="auto"
  //         mt="5"
  //         p="5"
  //         alignItems={"center"}
  //         justify={"center"}
  //       >
  //         You Are Not Authorized , You must be a Company
  //       </Box>
  //     </Box>
  //   );

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
        <Box sx={{width: "90%", margin: "auto"}}>
          <Typography variant="h4" align="center" sx={{margin: "50px"}}>
            Create Asset
          </Typography>
          <Typography variant="h5" sx={{m: 1}}>
            Company :
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="outlined-adornment-amount">Company</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              label="Company"
              onChange={setValues}
              name="company"
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
              onChange={setValues}
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
              onChange={setValues}
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
            onClick={createEquity}
          >
            <Button variant="contained">Create Asset</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Flex,
//   Heading,
//   useToast,
//   Input,
//   Select,
//   InputGroup,
//   NumberInputField,
//   NumberInput,
//   NumberDecrementStepper,
//   NumberIncrementStepper,
//   NumberInputStepper,
//   Text,
// } from "@chakra-ui/react";
// import useForm from "../../hooks/useForm";
// import {useContext, useEffect, useState} from "react";
// import {AppContext} from "../../provider/AppProvider";
// import {getAllCompanys} from "../../api/CompanyService";
// import {
//   addAsset,
//   getAllAssets,
// } from "../../smart-contract/ContractFunctions/AssetContractFunctions";
// import {getRoleFromJWT} from "../../utils/decodeJWT";

// const Index = () => {
//   const [companys, setCompanys] = useState<any>();
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const toast = useToast();
//   const {jwt} = useContext(AppContext);

//   const [values, setValues] = useForm({
//     company: null,
//     price: 0.5,
//     amount: 1,
//   });

//   const onChange = (
//     e:
//       | React.ChangeEvent<HTMLInputElement>
//       | React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setValues(e);
//     console.log(values);
//   };

//   useEffect(() => {
//     getAllCompanys().then((res) => {
//       setCompanys(res);
//       setIsLoading(false);
//     });
//   }, []);

//   const createEquity = async () => {
//     if (!values.company || !values.price || !values.amount) {
//       toast({
//         title: `Please Fill All Fields`,
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     await addAsset(values);
//   };

//   if (!jwt || (jwt && getRoleFromJWT(jwt) !== "company"))
//     return (
//       <Flex height={"90vh"} align="center">
//         <Flex
//           maxW="lg"
//           borderWidth="1px"
//           borderRadius="lg"
//           mx="auto"
//           mt="5"
//           p="5"
//           alignItems={"center"}
//           justify={"center"}
//         >
//           You Are Not Authorized , You must be a Company
//         </Flex>
//       </Flex>
//     );

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
//           Create Asset
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
//           <FormLabel htmlFor="amount">Price (LDT)</FormLabel>
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
//               onClick={createEquity}
//             >
//               Create Asset
//             </Button>
//           </Flex>
//         </FormControl>
//       </Box>
//     </div>
//   );
// };

// export default Index;
