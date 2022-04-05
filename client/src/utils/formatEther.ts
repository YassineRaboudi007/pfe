import {ethers} from "ethers";

const formatEther = (value: number): number => {
  return parseFloat(
    (value / parseInt(ethers.utils.parseUnits("1.0")._hex, 16)).toFixed(3)
  );
};

export default formatEther;
