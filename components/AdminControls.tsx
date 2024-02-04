import React from "react";
import {
  StarIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowUturnDownIcon,
} from "@heroicons/react/24/solid";
import Contract from "../contract/artifacts/Lottery.sol/Lottery.json";
import { useEffect } from "react";

import { useReadContract, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import { currency } from "../constants";
import toast from "react-hot-toast";

function AdminControls() {
  const { data: totalCommission }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi: Contract.abi,
    functionName: "operatorTotalCommission",
  });
  // console.log(totalCommission);

  const { data: DrawWinnerTicketHash, writeContract: DrawWinnerTicket } =
    useWriteContract();
  const { data: WithdrawCommissionHash, writeContract: WithdrawCommission } =
    useWriteContract();
  const {
    data: restartDrawHash,
    writeContract: restartDraw,
    error: restartDrawError,
  } = useWriteContract();
  const { data: RefundAllHash, writeContract: RefundAll } = useWriteContract();

  useEffect(() => {
    console.log(DrawWinnerTicketHash, WithdrawCommissionHash, restartDrawHash);
  }, [
    DrawWinnerTicketHash,
    WithdrawCommissionHash,
    restartDrawHash,
    RefundAllHash,
  ]);

  const drawWinner = async () => {
    const notification = toast.loading("Picking a Lucky Winner...");
    try {
      const data = await DrawWinnerTicket({
        address: process.env
          .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
        abi: Contract.abi,
        functionName: "DrawWinnerTicket",
      });
      toast.success("A Winner has been selected!", {
        id: notification,
      });
      console.info("Contract call success", data);
    } catch (err) {
      toast.error("Whoops, something went wrong!", {
        id: notification,
      });
      console.error("Contract call error", err);
    }
  };

  const onWithdrawCommission = async () => {
    const notification = toast.loading("Withdrawing Commission...");
    try {
      const data = await WithdrawCommission({
        address: process.env
          .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
        abi: Contract.abi,
        functionName: "WithdrawCommission",
      });
      toast.success("Your commission has been withdrawn successfully!", {
        id: notification,
      });
      console.info("Contract call success", data);
    } catch (err) {
      toast.error("Whoops, something went wrong!", {
        id: notification,
      });
      console.error("Contract call error", err);
    }
  };

  const onRestartDraw = async () => {
    const notification = toast.loading("Restarting draw...");
    try {
      const data = restartDraw({
        address: process.env
          .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
        abi: Contract.abi,
        functionName: "RestartDraw",
      });
      toast.success("Draw restarted successfully!", {
        id: notification,
      });
      console.info("Contract call success", data, restartDrawError);
    } catch (err) {
      toast.error("Whoops, something went wrong!", {
        id: notification,
      });
      console.error("Contract call error", err);
    }
  };

  const onRefundAll = async () => {
    const notification = toast.loading("Refunding All...");
    try {
      const data = await RefundAll({
        address: process.env
          .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
        abi: Contract.abi,
        functionName: "RefundAll",
      });
      toast.success("All refunded successfully!", {
        id: notification,
      });
      console.info("Contract call success", data);
    } catch (err) {
      toast.error("Whoops, something went wrong!", {
        id: notification,
      });
      console.error("Contract call error", err);
    }
  };

  return (
    <div className="text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border">
      <h2 className="font-bold">Admin Controls</h2>
      <p className="mb-5">
        Total Commission to be withdrawn:{" "}
        {parseInt(totalCommission) &&
          ethers.utils.formatEther(totalCommission?.toString())}{" "}
        {currency}
      </p>
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <button onClick={drawWinner} className="adminBtn">
          <StarIcon className="h-6 mx-auto mb-2" />
          Draw Winner
        </button>
        <button onClick={onWithdrawCommission} className="adminBtn">
          <CurrencyDollarIcon className="h-6 mx-auto mb-2" />
          Withdraw Commission
        </button>
        <button onClick={onRestartDraw} className="adminBtn">
          <ArrowPathIcon className="h-6 mx-auto mb-2" />
          Restart Draw
        </button>
        <button onClick={onRefundAll} className="adminBtn">
          <ArrowUturnDownIcon className="h-6 mx-auto mb-2" />
          Refund All
        </button>
      </div>
    </div>
  );
}

export default AdminControls;
