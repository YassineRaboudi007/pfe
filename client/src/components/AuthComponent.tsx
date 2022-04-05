import {Box, Button, Flex} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {USER_SIGNUP_URL} from "../utils/NavUrls";

const ConnectWalletComponent = () => {
  return (
    <Flex height={"90vh"} align="center">
      <Box
        maxW="lg"
        borderWidth="1px"
        borderRadius="lg"
        mx="auto"
        mt="5"
        p="5"
        flex="1 1 auto"
      >
        <Flex justify={"center"} flexDir={"column"} alignItems={"center"}>
          You Must have An Account
          <Link to={USER_SIGNUP_URL}>
            <Button colorScheme="red" variant="solid" mt={5} size="lg">
              Sign Up
            </Button>
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
};

export default ConnectWalletComponent;
