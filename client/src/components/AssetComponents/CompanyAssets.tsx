import {useEffect, useState} from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Box,
  Button,
} from "@chakra-ui/react";

// import {AppContext} from "../../provider/AppProvider";
import {AddIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";
import {ADD_ASSETS_URL} from "../../utils/NavUrls";
import {getAllCompanys} from "../../api/CompanyService";
import {getCompanyAssetsInfo} from "../../smart-contract/ContractFunctions/AssetContractFunctions";
import formatEther from "../../utils/formatEther";

export default function Index() {
  const [company, setCompany] = useState<any>();
  const [companyInfo, setCompanyInfo] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [keys, setKeys] = useState<string[]>([]);

  const onLoad = async () => {
    const comps = await getAllCompanys();
    setCompany(comps);

    const compsID: any = comps.map((el: any) => el._id);
    const arr: any[] = await Promise.all(
      compsID.map(async (id: any) => await getCompanyAssetsInfo(id))
    );
    setCompanyInfo(arr);
    console.log(arr);

    setKeys(
      Object.keys(arr[0]).slice(
        Object.keys(arr[0]).length / 2,
        Object.keys(arr[0]).length
      )
    );
    setIsLoading(false);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <>
      <Container maxW="container.lg">
        <Box my={5}>
          <Link to={ADD_ASSETS_URL}>
            <Button
              leftIcon={<AddIcon />}
              variant="solid"
              mt={5}
              bgColor={"red.500"}
              _hover={{
                bg: "red.600",
              }}
              color={"white"}
            >
              Create Asset
            </Button>
          </Link>
        </Box>

        <Box>
          <Table variant="simple" bg="red.50" borderRadius={"xl"}>
            <Thead>
              <Tr>
                {keys.map((key, i) => (
                  <Th key={i}>{key}</Th>
                ))}
                {/* <Th>Actions</Th> */}
              </Tr>
            </Thead>
            <Tbody>
              {!isLoading &&
                companyInfo.map((asset: any, key: number) => (
                  <Tr key={key}>
                    <Td>
                      <Link
                        to={`/asset/${
                          company.filter(
                            (el: any) => el._id === asset.company_id
                          )[0].symbol
                        }`}
                      >
                        {
                          company.filter(
                            (el: any) => el._id === asset.company_id
                          )[0].symbol
                        }
                      </Link>
                    </Td>
                    <Td>{formatEther(asset.lowPrice)}</Td>
                    <Td>{formatEther(asset.midPrice)}</Td>
                    <Td>{formatEther(asset.highPrice)}</Td>
                    {/* <Td>
                      <Button>Buy</Button>
                    </Td> */}
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
      </Container>
    </>
  );
}
