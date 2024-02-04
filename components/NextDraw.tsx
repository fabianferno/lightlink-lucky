import React from "react";
import CountdownTimer from "./CountdownTimer";
import { useReadContract } from "wagmi";
import { ethers } from "ethers";
import { currency } from "../constants";
import TicketPrice from "./TicketPrice";
import Contract from "../contract/artifacts/Lottery.sol/Lottery.json";

function NextDraw() {
  const { data: remainingTickets }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi: Contract.abi,
    functionName: "RemainingTickets",
  });
  const { data: currentWinningReward }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi: Contract.abi,
    functionName: "CurrentWinningReward",
  });

  return (
    <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
      <div className="stats-container bg-gray-900">
        <h1 className="text-2xl mb-3 text-white font-semibold text-center">
          Upcoming draws
        </h1>
        <div className="flex justify-between p-2 space-x-2">
          <div className="stats rounded-2xl">
            <h2 className="text-sm">Total Pool</h2>
            <p className="text-xl font-bold">
              {currentWinningReward &&
                ethers.utils.formatEther(currentWinningReward.toString())}{" "}
              {currency}
            </p>
          </div>
          <div className="stats rounded-2xl">
            <h2 className="text-sm">Tickets Remaing</h2>
            <p className="text-xl font-bold">{parseInt(remainingTickets)}</p>
          </div>
        </div>
        <CountdownTimer />
      </div>
      <TicketPrice />
    </div>
  );
}

export default NextDraw;
