import {Box, Button, Flex} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {USER_SIGNUP_URL} from "../utils/NavUrls";

const AssetsEmpty = () => {
  return (
    <Box
      maxW="lg"
      borderWidth="1px"
      borderRadius="lg"
      mx="auto"
      p="5"
      flex="1 1 auto"
      mt={40}
    >
      <Flex justify={"center"} flexDir={"column"} alignItems={"center"}>
        There are no assets here
      </Flex>
    </Box>
  );
};

export default AssetsEmpty;
