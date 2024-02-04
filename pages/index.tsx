import type { NextPage } from "next";
import Head from "next/head";
import {
  AdminControls,
  Footer,
  Header,
  Loading,
  Login,
  NextDraw,
  Winnings,
} from "../components";
import Marquee from "react-fast-marquee";
import { ethers } from "ethers";
import { currency } from "../constants";
import { useAccount, useReadContract } from "wagmi";
import { abi } from "../contract/artifacts/Lottery.sol/Lottery.json";

const Home: NextPage = () => {
  const { address } = useAccount();
  // console.log(address);

  const { data: winnings, isLoading: isGetWinningsForAddressLoading }: any =
    useReadContract({
      address: process.env
        .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "getWinningsForAddress",
      args: [address],
    });

  const { data: lastWinner, isLoading: isLastWinnerLoading }: any =
    useReadContract({
      address: process.env
        .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "lastWinner",
    });

  const { data: lastWinnerAmount, isLoading: isLastWinnerAmountLoading }: any =
    useReadContract({
      address: process.env
        .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "lastWinnerAmount",
    });

  const { data: isLotteryOperator, isLoading: isLotteryOperatorLoading }: any =
    useReadContract({
      address: process.env
        .NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "lotteryOperator",
    });

  if (
    isGetWinningsForAddressLoading ||
    isLastWinnerLoading ||
    isLastWinnerAmountLoading ||
    isLotteryOperatorLoading
  )
    return <Loading />;
  if (!address) return <Login />;

  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>Crypto Lottery</title>
      </Head>
      <div className="flex-1">
        <Header />
        <Marquee className="bg-[#0A1F1C] p-5 mb-5" gradient={false} speed={100}>
          <div className="flex space-x-2 mx-10">
            <h4 className="text-white font-bold">
              Last Winner: {lastWinner?.toString()}
            </h4>
            <h4 className="text-white font-bold">
              Previous winnings:{" "}
              {parseInt(lastWinnerAmount) &&
                ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}
              {currency}{" "}
            </h4>
          </div>
        </Marquee>
        {isLotteryOperator === address && (
          <div className="flex justify-center">
            <AdminControls />
          </div>
        )}

        {winnings > 0 && <Winnings winnings={winnings} />}
        <NextDraw />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
