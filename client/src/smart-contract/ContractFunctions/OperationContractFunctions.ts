import {getOpreationContract} from "../ContractInstance";

export const getUserOperations = async () => {
  const OpreationContract = getOpreationContract();
  const res = await OpreationContract.getUserOperations();
  return res;
};
