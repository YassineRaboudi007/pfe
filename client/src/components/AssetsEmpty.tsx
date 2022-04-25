import {Box, Flex} from "@chakra-ui/react";

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
        No Data To Show
      </Flex>
    </Box>
  );
};

export default AssetsEmpty;
