import {Flex, Spinner} from "@chakra-ui/react";

const Loading = () => {
  return (
    <Flex align={"center"} justify={"center"} h={"93vh"}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Flex>
  );
};

export default Loading;
