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
  Flex,
  Checkbox,
  // Text,
  IconButton,
  Input,
} from "@chakra-ui/react";
import {
  ADD_ASSETS_URL,
  COMPANY_ASSETS,
  USER_ASSETS,
} from "../../../utils/NavUrls";
import {AddIcon, ArrowDownIcon, ArrowUpIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";
import {buyContractAsset} from "../../../smart-contract/ContractFunctions/TransactionContractFunctions";
import {useAppContext} from "../../../provider/AppProvider";
import {
  listContractAsset,
  unlistContractAsset,
} from "../../../smart-contract/ContractFunctions/AssetContractFunctions";
// import AssetsEmpty from "../../AssetsEmpty";
import useCustomToast from "../../../hooks/useCustomToast";
import {useState} from "react";
import {getRoleFromJWT} from "../../../utils/decodeJWT";

export const AssetContainer = (props: any) => {
  const {data, buy, list, toggleAction, sortData, filterAssets, company} =
    props;

  const {currentBalance, jwt} = useAppContext();
  const userRole = getRoleFromJWT(jwt);

  const {toast} = useCustomToast();
  const [selected, setSelected] = useState<any[]>([]);

  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);
  const isSelected = (name: any) => selected.indexOf(name) !== -1;

  const selectAll = (event: any) => {
    if (event.target.checked) {
      setSelected(data);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name: any) => {
    //@ts-ignore
    const selectedIndex = selected.indexOf(name);

    let newSelected: any[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const buyAssets = async () => {
    const totalPrice = selected.reduce(
      (prev, current) => prev + current.price,
      0
    );
    const buyParams = selected.map((item) => {
      return {
        company_id: item.company_id,
        asset_id: parseInt(item.id._hex, 16),
      };
    });

    if (currentBalance < totalPrice) {
      toast(`Not Enough Tokens LDT Tokens.`, "error");
      return;
    }

    if (await buyContractAsset(buyParams, currentBalance)) {
      toast("Items are Bought", "success");
      toggleAction();
    } else {
      toast("Some Error Occured", "error");
    }
  };

  const sellAssets = () => {};

  const listAsset = async (asset: any) => {
    const {company_id, id} = asset;
    if (!company) {
      if (await listContractAsset(company_id, id)) {
        toast("Item is Listed", "success");

        toggleAction();
      } else {
        toast("Some Error Occured", "error");
      }
    }
  };

  const unlistAsset = async (asset: any) => {
    const {company_id, id} = asset;
    if (!company) {
      if (await unlistContractAsset(company_id, id)) {
        toast("Item is unlisted", "success");
        toggleAction();
      } else {
        toast("Some Error Occured", "error");
      }
    }
  };

  const togglePriceSort = () => {
    if (!priceSort) {
      setPriceSort("asc");
      sortData(priceSort);
      return;
    }
    priceSort === "asc" ? setPriceSort("desc") : setPriceSort("asc");
    sortData(priceSort);
  };

  const filterData = (e: any) => {
    filterAssets(e.target.value);
  };

  return (
    <div>
      <>
        <Container maxW="container.xl">
          <Flex justify={"space-between"}>
            <Box my={5}>
              <Link to={ADD_ASSETS_URL}>
                {userRole === "company" && (
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
                )}
              </Link>
            </Box>
            <Box my={5}>
              <Link to={`${COMPANY_ASSETS}`}>
                <Button
                  variant="solid"
                  mt={5}
                  bgColor={"red.500"}
                  _hover={{
                    bg: "red.600",
                  }}
                  color={"white"}
                >
                  Company Info
                </Button>
              </Link>
              <Link to={`${USER_ASSETS}`}>
                <Button
                  variant="solid"
                  mt={5}
                  ml={5}
                  bgColor={"red.500"}
                  _hover={{
                    bg: "red.600",
                  }}
                  color={"white"}
                >
                  My Assets
                </Button>
              </Link>
            </Box>
          </Flex>
          <Box>
            <Table
              variant="striped"
              colorScheme="cyan"
              border={"2px solid black"}
              borderRadius={"3xl"}
            >
              <Thead>
                <Tr>
                  <Th w={"100%"} colSpan={10}>
                    <Flex
                      w={"100%"}
                      justify={"space-between"}
                      alignItems={"center"}
                    >
                      <Input
                        placeholder="search by symbol"
                        size="xs"
                        width={"20%"}
                        border={"2px solid black"}
                        onChange={(e) => filterData(e)}
                      />
                      <Button
                        disabled={selected.length > 0 ? false : true}
                        onClick={() => {
                          buy ? buyAssets() : sellAssets();
                        }}
                      >
                        {buy ? "Buy" : "Sell"}
                      </Button>
                    </Flex>
                  </Th>
                </Tr>
                <Tr>
                  <Th>
                    <Checkbox
                      isIndeterminate={
                        selected.length > 0 && selected.length !== data.length
                      }
                      isChecked={data.length && selected.length === data.length}
                      onChange={(e) => selectAll(e)}
                    />
                  </Th>
                  <Th>Company Symbol</Th>
                  <Th
                    display={"flex"}
                    alignItems={"center"}
                    justifyItems={"center"}
                  >
                    <IconButton
                      size={"xs"}
                      aria-label="Search database"
                      icon={
                        priceSort && priceSort === "asc" ? (
                          <ArrowDownIcon />
                        ) : (
                          <ArrowUpIcon />
                        )
                      }
                      onClick={togglePriceSort}
                      mr={1}
                    />
                    Price(LDT)
                  </Th>
                  <Th>Owner</Th>
                  {list && <Th>Actions</Th>}
                </Tr>
              </Thead>
              {data.length ? (
                <>
                  <Tbody>
                    {data &&
                      data.map((asset: any, key: number) => (
                        <Tr key={key}>
                          {asset.isListed && buy && (
                            <>
                              <Td>
                                <Checkbox
                                  isChecked={isSelected(asset)}
                                  onChange={() => handleClick(asset)}
                                />
                              </Td>
                              <Td>{asset.symbol}</Td>

                              <Td display={"flex"}>
                                <div style={{opacity: "0"}}>$nbi</div>
                                {asset.price}
                              </Td>
                              <Td>{asset.owner}</Td>
                            </>
                          )}
                          {list && (
                            <>
                              <Td>
                                <Checkbox
                                  isChecked={isSelected(asset)}
                                  onChange={() => handleClick(asset)}
                                />
                              </Td>
                              <Td>{asset.symbol}</Td>
                              <Td>{asset.price}</Td>
                              <Td>{asset.owner}</Td>
                              {asset.isListed ? (
                                <Td>
                                  <Button
                                    onClick={() => unlistAsset(asset)}
                                    disabled={company}
                                  >
                                    {company ? "Unlisted" : "Unlist"}
                                  </Button>
                                </Td>
                              ) : (
                                <>
                                  <Button
                                    onClick={() => listAsset(asset)}
                                    disabled={company}
                                  >
                                    {company ? "Listed" : "List"}
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </Tr>
                      ))}
                  </Tbody>
                </>
              ) : (
                <Tbody>
                  <Tr>
                    <Td colSpan={10}>
                      <Flex align={"center"} justify={"center"}>
                        There are no items
                      </Flex>
                    </Td>
                  </Tr>
                </Tbody>
              )}
            </Table>
          </Box>
        </Container>
      </>
    </div>
  );
};
