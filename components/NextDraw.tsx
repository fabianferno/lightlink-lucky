import React from "react";
import CountdownTimer from "./CountdownTimer";
import { useReadContract } from "wagmi";
import { ethers } from "ethers";
import { currency } from "../constants";
import TicketPrice from "./TicketPrice";
import { abi } from "../contract/artifacts/Lottery.sol/Lottery.json";

function NextDraw() {
  const { data: remainingTickets }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "RemainingTickets",
  });
  const { data: currentWinningReward }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "CurrentWinningReward",
  });

  return (
    <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
      <div className="stats-container">
        <h1 className="text-5xl text-white font-semibold text-center">
          The Next Draw
        </h1>
        <div className="flex justify-between p-2 space-x-2">
          <div className="stats">
            <h2 className="text-sm">Total Pool</h2>
            <p className="text-xl">
              {currentWinningReward &&
                ethers.utils.formatEther(currentWinningReward.toString())}{" "}
              {currency}
            </p>
          </div>
          <div className="stats">
            <h2 className="text-sm">Tickets Remaing</h2>
            <p className="text-xl">{remainingTickets?.toNumber()}</p>
          </div>
        </div>
        <CountdownTimer />
      </div>
      <TicketPrice />
    </div>
  );
}

export default NextDraw;
