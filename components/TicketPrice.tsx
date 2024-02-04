import React, { useContext, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import { currency } from "../constants";
import toast from "react-hot-toast";
import Contract from "../contract/artifacts/Lottery.sol/Lottery.json";

function TicketPrice() {
  const { countdownEnded, quantity, setQuantity, userTickets, setUserTickets } =
    useContext(GlobalContext);

  const { address } = useAccount();

  const { data: ticketPrice }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi: Contract.abi,
    functionName: "ticketPrice",
  });
  const { data: ticketCommission }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi: Contract.abi,
    functionName: "ticketCommission",
  });
  const { data: remainingTickets }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi: Contract.abi,
    functionName: "RemainingTickets",
  });
  const { data: tickets }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi: Contract.abi,
    functionName: "getTickets",
  });

  const {
    data: BuyTicketsHash,
    writeContract: BuyTickets,
    error: BuyTicketsError,
  } = useWriteContract();

  useEffect(() => {
    if (!tickets) return;
    const totalTickets: string[] = tickets;
    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );
    setUserTickets(noOfUserTickets);
  }, [tickets, address]);
  // console.log(userTickets);

  const handleClick = async () => {
    if (!ticketPrice) return;
    const notification = toast.loading("Buying your tickets...");
    try {
      const ticketAmt: any = ethers.utils.parseEther(
        (Number(ethers.utils.formatEther(ticketPrice)) * quantity).toString()
      );
      const data = BuyTickets({
        address: process.env
          .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
        abi: Contract.abi,
        functionName: "BuyTickets",
        value: ticketAmt,
      });
      toast.success("Tickets purchased successfully!", { id: notification });
      console.log("Contract call success!", data, BuyTicketsError, quantity);
      setQuantity(1);
    } catch (err) {
      toast.error("Whoops, something went wrong!", { id: notification });
      console.log("Contract call failure!", err);
    }
  };

  return (
    <div className="stats-container h-[400px] bg-slate-900 ">
      <div className="stats-container bg-slate-900 border-none">
        <div className="flex justify-between items-center text-white pb-2">
          <h2>Price per ticket</h2>
          <p>
            {ticketPrice && ethers.utils.formatEther(ticketPrice.toString())}{" "}
            {currency}
          </p>
        </div>
        <div className="flex text-white items-center space-x-2 bg-slate-900  border-[#004337] border p-4">
          <p>TICKETS</p>
          <input
            type="number"
            className="flex w-full bg-transparent text-right outline-none"
            min={1}
            max={10}
            value={quantity}
            //   onChange={(e) => setQuantity(parseInt(e.target.value))}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2 mt-5 ">
          <div className="fees font-extrabold text-sm">
            <p className="text-white">Total cost of tickets</p>
            <p>
              {ticketPrice &&
                Number(ethers.utils.formatEther(ticketPrice?.toString())) *
                  quantity}{" "}
              {currency}
            </p>
          </div>
          <div className="fees">
            <p className="text-white">Service fees</p>
            <p>
              {" "}
              {ticketCommission &&
                ethers.utils.formatEther(ticketCommission.toString())}{" "}
              {currency}
            </p>
          </div>
          <div className="fees">
            <p className="text-white">+ Network Fees</p>
            <p>TBC</p>
          </div>
        </div>
        <button
          onClick={handleClick}
          disabled={countdownEnded || remainingTickets?.toNumber === 0}
          className="mt-20 w-full bg-gradient-to-br from-black to-slate-600 px-10 py-5 rounded-md font-semibold text-white shadow-xl disabled:from-gray-600 disabled:to-gray-100 disabled:text-gray-100 disabled:cursor-not-allowed"
        >
          Buy {quantity} tickets for{" "}
          {ticketPrice &&
            Number(ethers.utils.formatEther(ticketPrice.toString())) *
              quantity}{" "}
          {currency}
        </button>
      </div>
      {userTickets > 0 && (
        <div className="stats">
          <p className="text-lg mb-2">
            You have {userTickets} Tickets in this draw
          </p>
          <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
            {Array(userTickets)
              .fill("")
              .map((_, index) => (
                <p
                  key={index}
                  className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                >
                  {index + 1}
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketPrice;
