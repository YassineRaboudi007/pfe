import {ethers} from "ethers";
import {getLdtContract} from "../ContractInstance";

export const getContractAccountBalance = async (adr: string | null) => {
  const LDTokenContract = getLdtContract();
  const x = await LDTokenContract.balances(adr);
  return parseInt(x._hex, 16);
};

export const buyLDTTokens = async (amount: number) => {
  const LDTokenContract = getLdtContract();
  const transactionHash = await LDTokenContract.buyTokens(
    ethers.utils.parseUnits(amount.toString(), "ether"),
    {value: ethers.utils.parseUnits(amount.toString(), "ether")}
  );
  await transactionHash.wait();
};

export const sellLDTokens = async (amount: number) => {
  const LDTokenContract = getLdtContract();
  const transactionHash = await LDTokenContract.sellTokens(
    ethers.utils.parseUnits(amount.toString(), "ether")
  );
  await transactionHash.wait();
};
