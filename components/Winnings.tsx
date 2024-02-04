import React from "react";
import { useWriteContract } from "wagmi";
import { currency } from "../constants";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import Contract from "../contract/artifacts/Lottery.sol/Lottery.json";
interface Props {
  winnings: string;
}
function Winnings({ winnings }: Props) {
  const { data: WithdrawWinningsHash, writeContract: WithdrawWinnings } =
    useWriteContract();

  const onWithdrawWinnings = async () => {
    const notification = toast.loading("Withdrawing winnings...");
    try {
      const data = await WithdrawWinnings({
        address: process.env
          .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
        abi: Contract.abi,
        functionName: "WithdrawWinnings",
        args: [],
      });
      toast.success("Winnings withdrawn successfully!", { id: notification });
      console.log("Contract call successful!", data);
    } catch (err) {
      toast.error("Whoops, something went wrong!", { id: notification });
      console.log("Contract call failure!", err);
    }
  };

  return (
    <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
      <button
        onClick={onWithdrawWinnings}
        className="p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full"
      >
        <p className="font-bold">Winner Winner Chicken Dinner!</p>
        <p>
          Total Winnings:{ethers.utils.formatEther(winnings.toString())}{" "}
          {currency}
        </p>
        <br />
        <p className="font-bold">Click here to withdraw</p>
      </button>
    </div>
  );
}
export default Winnings;
