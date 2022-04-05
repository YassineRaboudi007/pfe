import {useToast} from "@chakra-ui/react";

type status = "info" | "warning" | "success" | "error" | undefined;

const useCustomToast = () => {
  const toast = useToast();
  return {
    toast: (message: string, status: status) => {
      toast({
        title: message,
        status: status,
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },
  };
};

export default useCustomToast;
