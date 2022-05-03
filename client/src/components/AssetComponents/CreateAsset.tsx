import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Button, FormControl, TextField, Typography } from "@mui/material";
import useForm from "../../hooks/useForm";
import { useAppContext } from "../../provider/AppProvider";
import { getCompanyById } from "../../api/CompanyService";
import { addAsset } from "../../smart-contract/ContractFunctions/AssetContractFunctions";
import { getIdFromJWT, getRoleFromJWT } from "../../utils/decodeJWT";
import Loading from "../Loading";

export default function SimplePaper() {
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<any>(true);
  const { jwt, changeSnackBar } = useAppContext();
  const [values, setValues] = useForm({
    price: null,
    amount: null,
  });

  useEffect(() => {
    const compId = getIdFromJWT(jwt);
    getCompanyById(compId).then((res) => {
      setCompany(res);
      setIsLoading(false);
    });
  }, [jwt]);

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setValues(e);
  };

  const createEquity = async () => {
    if (!values.price || !values.amount) {
      changeSnackBar(true, `Please Fill All Fields`, "warning");
      return;
    }

    (await addAsset({ company: company._id, ...values }))
      ? changeSnackBar(true, `Asset Created`, "success")
      : changeSnackBar(true, `Error Occured`, "error");
  };
  if (isLoading) {
    return <Loading />;
  } else if (!jwt || (jwt && getRoleFromJWT(jwt) !== "company"))
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "90vh",
        }}
      >
        <Paper elevation={3} sx={{ textAlign: "center", padding: "10vh 15vw" }}>
          <Box sx={{ color: "error.main" }}>
            {" "}
            <Typography variant="h5">
              You Are Not Authorized. You Must Be A Company
            </Typography>
          </Box>
        </Paper>
      </div>
    );

  return (
    <Box
      sx={{
        width: "45vw",
        margin: "auto",
      }}
    >
      <Paper
        elevation={3}
        sx={{ width: "100%", marginTop: "10%", padding: "20px" }}
      >
        <Box sx={{ width: "90%", margin: "auto" }}>
          <Typography variant="h4" align="center" sx={{ margin: "50px" }}>
            Create Asset
          </Typography>
          <Typography variant="subtitle1" sx={{ m: 1 }}>
            Company :
          </Typography>
          <FormControl fullWidth margin="normal">
            <TextField
              label={company.symbol}
              disabled
              value={company.symbol}
              color="secondary"
              variant="outlined"
            />
          </FormControl>
          <Typography variant="subtitle1" sx={{ m: 1 }}>
            Amount :
          </Typography>
          <FormControl fullWidth margin="normal">
            <TextField
              id="outlined-adornment-amount"
              label="Amount"
              name="amount"
              onChange={setValues}
              color="secondary"
              variant="outlined"
            />
          </FormControl>
          <Typography variant="subtitle1" sx={{ m: 1 }}>
            Price :
          </Typography>
          <FormControl fullWidth margin="normal">
            <TextField
              id="outlined-adornment-amount"
              label="Price"
              name="price"
              onChange={setValues}
              color="secondary"
              variant="outlined"
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
            <Button variant="contained" color="secondary">
              Create Asset
            </Button>
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
