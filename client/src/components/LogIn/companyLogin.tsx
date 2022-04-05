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
import {COMPANY_SIGNUP_URL} from "../../utils/NavUrls";
import {getCompany} from "../../api/CompanyService";
import useCustomToast from "../../hooks/useCustomToast";

//@ts-ignore
const {ethereum} = window;

const Index = () => {
  const {setJWT} = useContext(AppContext);
  const {toast} = useCustomToast();
  const [values, setValues] = useForm({
    name: "",
    password: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(e);
  };

  const LogIn = async () => {
    if (!values.name || !values.password) {
      toast(`Please Fill All Fields`, "warning");
      return;
    }

    ethereum.request({
      method: "eth_requestAccounts",
    });

    const res = await getCompany(values);
    if (res) toast("Logged In", "success");
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
          Company Log In
        </Heading>
        <FormControl>
          <FormLabel htmlFor="amount">Name</FormLabel>
          <Input
            placeholder="username"
            name="name"
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
              onClick={LogIn}
            >
              Log In
            </Button>
          </Flex>
        </FormControl>
      </Box>
      <Flex justify={"center"} align={"center"} my={5}>
        <Link to={COMPANY_SIGNUP_URL}>
          <Text fontSize="xl" color={"red.400"}>
            Alerady have a company account ? Log IN
          </Text>
        </Link>
      </Flex>
    </div>
  );
};

export default Index;
