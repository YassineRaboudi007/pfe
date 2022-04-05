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
  IconButton,
  Input,
} from "@chakra-ui/react";
import {
  LIST_BUY_ORDERS,
  LIST_SELL_ORDERS,
  CREATE_ORDER,
} from "../../../utils/NavUrls";
import {AddIcon, ArrowDownIcon, ArrowUpIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";
import {buyContractAsset} from "../../../smart-contract/ContractFunctions/TransactionContractFunctions";
import {useAppContext} from "../../../provider/AppProvider";
import {
  listContractAsset,
  unlistContractAsset,
} from "../../../smart-contract/ContractFunctions/AssetContractFunctions";
import useCustomToast from "../../../hooks/useCustomToast";
import {useState} from "react";

export const OrderContainer = (props: any) => {
  const {data, buy, list, toggleAction, sortData, filterAssets} = props;
  const {currentBalance} = useAppContext();
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
    if (await listContractAsset(company_id, id)) {
      toast("Item is Listed", "success");

      toggleAction();
    } else {
      toast("Some Error Occured", "error");
    }
  };

  const unlistAsset = async (asset: any) => {
    const {company_id, id} = asset;
    if (await unlistContractAsset(company_id, id)) {
      toast("Item is unlisted", "success");
      toggleAction();
    } else {
      toast("Some Error Occured", "error");
    }
  };

  const togglePriceSort = () => {
    if (!priceSort) {
      setPriceSort("asc");
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
          <Flex justify={"space-between"} my={5}>
            <Box>
              <Link to={`${CREATE_ORDER}`}>
                <Button
                  variant="solid"
                  mt={5}
                  bgColor={"red.500"}
                  _hover={{
                    bg: "red.600",
                  }}
                  color={"white"}
                >
                  Create Order
                </Button>
              </Link>
            </Box>
            <Box>
              <Link to={LIST_SELL_ORDERS}>
                <Button
                  variant="solid"
                  mt={5}
                  mx={5}
                  bgColor={"red.500"}
                  _hover={{
                    bg: "red.600",
                  }}
                  color={"white"}
                >
                  Sell Orders
                </Button>
              </Link>

              <Link to={`${LIST_BUY_ORDERS}`}>
                <Button
                  variant="solid"
                  mt={5}
                  bgColor={"red.500"}
                  _hover={{
                    bg: "red.600",
                  }}
                  color={"white"}
                >
                  Buy Orders
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
              mt={5}
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
                    </Flex>
                  </Th>
                </Tr>
                <Tr>
                  <Th>
                    <Checkbox
                      isIndeterminate={
                        selected.length > 0 && selected.length !== data.length
                      }
                      isChecked={selected.length === data.length}
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
                  <Th>Issuer</Th>
                  <Th>Quantity</Th>
                  <Th>Created At</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data &&
                  data.map((order: any, key: number) => (
                    <Tr key={key}>
                      <Td>
                        <Checkbox
                          isChecked={isSelected(order)}
                          onChange={() => handleClick(order)}
                        />
                      </Td>
                      <Td>{order.symbol}</Td>
                      <Td>{order.price}</Td>
                      <Td>{order.issuer}</Td>
                      <Td>{order.quantity}</Td>
                      <Td>{order.created_at}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
        </Container>
      </>
    </div>
  );
};
