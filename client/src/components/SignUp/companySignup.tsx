import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Flex,
  Heading,
  // useToast,
  Input,
  Text,
} from "@chakra-ui/react";
import useForm from "../../hooks/useForm";
import {useContext} from "react";
import {AppContext} from "../../provider/AppProvider";
import {Link} from "react-router-dom";
import {COMPANY_LOGIN_URL} from "../../utils/NavUrls";
import {addCompany} from "../../api/CompanyService";

//@ts-ignore
const {ethereum} = window;

const Index = () => {
  const {setJWT} = useContext(AppContext);
  const [values, setValues] = useForm({
    name: "",
    password: "",
    website: "",
    symbol: "",
  });
  // const toast = useToast();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(e);
  };

  const SignUp = async () => {
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

    const res = await addCompany(values);
    console.log("sana ", res);
    setJWT(res.token);
  };

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
          Company Sign up
        </Heading>
        <FormControl>
          <FormLabel htmlFor="amount">Name</FormLabel>
          <Input
            placeholder="Name"
            name="name"
            size="md"
            onChange={onChange}
            mb={3}
          />
          <FormLabel htmlFor="amount">Symbol</FormLabel>
          <Input
            placeholder="Symbol"
            name="symbol"
            size="md"
            onChange={onChange}
            mb={3}
          />
          <FormLabel htmlFor="amount">Website</FormLabel>
          <Input
            placeholder="Website"
            name="website"
            size="md"
            onChange={onChange}
            mb={3}
          />
          <FormLabel htmlFor="amount">Password</FormLabel>
          <Input
            placeholder="Password"
            name="password"
            type={"password"}
            size="md"
            onChange={onChange}
            mb={3}
          />

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
              onClick={SignUp}
            >
              Sign Up
            </Button>
          </Flex>
        </FormControl>
      </Box>
      <Flex justify={"center"} align={"center"} my={5}>
        <Link to={COMPANY_LOGIN_URL}>
          <Text fontSize="xl" color={"red.400"}>
            Alerady have a company account ? Log IN
          </Text>
        </Link>
      </Flex>
    </div>
  );
};

export default Index;
