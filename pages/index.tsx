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
import Contract from "../contract/artifacts/Lottery.sol/Lottery.json";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { address } = useAccount();
  // console.log(address);

  const {
    data: winnings,
    isLoading: isGetWinningsForAddressLoading,
    error: GettingWinningsForAddressError,
  }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi: Contract.abi,
    functionName: "getWinningsForAddress",
    args: [address],
  });

  const {
    data: lastWinner,
    isLoading: isLastWinnerLoading,
    error: LastWinnerError,
  }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi: Contract.abi,
    functionName: "lastWinner",
  });

  const {
    data: lastWinnerAmount,
    isLoading: isLastWinnerAmountLoading,
    error: LastWinnerAmountError,
  }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi: Contract.abi,
    functionName: "lastWinnerAmount",
  });

  const {
    data: isLotteryOperator,
    isLoading: isLotteryOperatorLoading,
    error: LotteryOperatorError,
  }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi: Contract.abi,
    functionName: "lotteryOperator",
  });

  useEffect(() => {
    if (
      isGetWinningsForAddressLoading ||
      isLastWinnerLoading ||
      isLastWinnerAmountLoading ||
      isLotteryOperatorLoading
    ) {
      return;
    } else {
      console.log({
        GettingWinningsForAddressError,
        LastWinnerError,
        LastWinnerAmountError,
        LotteryOperatorError,
      });
      console.log({
        winnings,
        lastWinner,
        lastWinnerAmount,
        isLotteryOperator,
      });
    }
  }, []);

  if (
    isGetWinningsForAddressLoading ||
    isLastWinnerLoading ||
    isLastWinnerAmountLoading ||
    isLotteryOperatorLoading
  )
    return <Loading />;
  if (!address) return <Login />;

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Head>
        <title>Crypto Lottery</title>
      </Head>
      <div className="flex-1">
        <Header />
        <Marquee className="bg-zinc-900 p-5 mb-5" gradient={false} speed={100}>
          <div className="flex space-x-2 mx-10">
            <h4 className="text-white font-bold">
              {lastWinner?.toString() ===
              "0x0000000000000000000000000000000000000000"
                ? "No winner yet"
                : `Last Winner: ${lastWinner?.toString()}`}
            </h4>
            <h4 className="text-white font-bold">
              ~{" "}
              {parseInt(lastWinnerAmount) &&
                ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}
              {currency} in winnings
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
