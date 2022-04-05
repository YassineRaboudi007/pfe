import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Flex,
  Heading,
  useToast,
  Input,
  Select,
  InputGroup,
  NumberInputField,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import useForm from "../../hooks/useForm";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../provider/AppProvider";
import {getAllCompanys} from "../../api/CompanyService";
import {
  addAsset,
  getAllAssets,
} from "../../smart-contract/ContractFunctions/AssetContractFunctions";
import {getRoleFromJWT} from "../../utils/decodeJWT";

const Index = () => {
  const [companys, setCompanys] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toast = useToast();
  const {jwt} = useContext(AppContext);

  const [values, setValues] = useForm({
    company: null,
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
    if (!values.company || !values.price || !values.amount) {
      toast({
        title: `Please Fill All Fields`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await addAsset(values);
  };

  if (!jwt || (jwt && getRoleFromJWT(jwt) !== "company"))
    return (
      <Flex height={"90vh"} align="center">
        <Flex
          maxW="lg"
          borderWidth="1px"
          borderRadius="lg"
          mx="auto"
          mt="5"
          p="5"
          alignItems={"center"}
          justify={"center"}
        >
          You Are Not Authorized , You must be a Company
        </Flex>
      </Flex>
    );

  return (
    <div>
      <Box
        maxW="md"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        mx="auto"
        mt="40"
        p="5"
      >
        <Heading fontSize="2xl" my="5" textAlign={"center"}>
          Create Asset
        </Heading>
        <FormControl>
          <FormLabel htmlFor="country">Company</FormLabel>
          <Select
            id="country"
            placeholder="Select Company"
            name="company"
            onChange={onChange}
            mb={3}
          >
            {!isLoading &&
              companys.map((comp: any) => (
                <option value={comp._id} key={comp._id}>
                  {comp.symbol}
                </option>
              ))}
          </Select>
          <FormLabel htmlFor="amount">Price (LDT)</FormLabel>
          <InputGroup>
            <NumberInput
              min={0.5}
              step={0.01}
              defaultValue={values.price}
              w="100%"
              mb={3}
            >
              <NumberInputField
                id="amount"
                name="price"
                type={"number"}
                onChange={setValues}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </InputGroup>
          <FormLabel htmlFor="amount">Amount</FormLabel>
          <InputGroup>
            <NumberInput min={1} defaultValue={values.amount} w="100%" mb={3}>
              <NumberInputField
                id="amount"
                name="amount"
                type={"number"}
                onChange={setValues}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </InputGroup>
          <Flex align={"center"} justify={"center"}>
            <Button
              variant="solid"
              mt={5}
              size="lg"
              bgColor={"red.500"}
              _hover={{
                bg: "red.600",
              }}
              color={"white"}
              px={10}
              onClick={createEquity}
            >
              Create Asset
            </Button>
          </Flex>
        </FormControl>
      </Box>
    </div>
  );
};

export default Index;
