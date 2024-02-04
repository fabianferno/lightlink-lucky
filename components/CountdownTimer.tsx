import React, { useContext } from "react";
import { useContractRead, useReadContract } from "wagmi";
import Countdown from "react-countdown";
import GlobalContext from "../context/GlobalContext";
import { abi } from "../contract/artifacts/Lottery.sol/Lottery.json";
interface Props {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

function CountdownTimer() {
  const { setCountdownEnded } = useContext(GlobalContext);

  const { data: expiration }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "expiration",
  });
  const { data: duration }: any = useReadContract({
    address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "duration",
  });

  // Avoid reloading timer
  // const startDate = useRef(Date.now());
  // const timer = startDate.current + 5000; // 5 seconds
  // const timer = startDate.current + expiration * 1000;
  // const timer = startDate.current + duration * 1000;
  const timer = new Date(parseInt(expiration) * 1000);

  const renderer = ({ hours, minutes, seconds, completed }: Props) => {
    if (completed) {
      setCountdownEnded(completed);
      // console.log(completed);

      // Render a completed state
      return (
        <div>
          <h2 className="text-white text-xl text-center mb-2 animate-bounce">
            Ticket Sales have now CLOSED for this draw
          </h2>
          <div className="flex space-x-6">
            <div className="flex-1">
              <div className="countdown animate-pulse">{hours}</div>
              <div className="countdown-label">hours</div>
            </div>
            <div className="flex-1">
              <div className="countdown animate-pulse">{minutes}</div>
              <div className="countdown-label">minutes</div>
            </div>
            <div className="flex-1">
              <div className="countdown animate-pulse">{seconds}</div>
              <div className="countdown-label">seconds</div>
            </div>
          </div>
        </div>
      );
    } else {
      // Render a countdown
      return (
        <div>
          <h3 className="text-white text-sm mb-2 italic">Time Remaining</h3>
          <div className="flex space-x-6">
            <div className="flex-1">
              <div className="countdown">{hours}</div>
              <div className="countdown-label">hours</div>
            </div>
            <div className="flex-1">
              <div className="countdown">{minutes}</div>
              <div className="countdown-label">minutes</div>
            </div>
            <div className="flex-1">
              <div className="countdown">{seconds}</div>
              <div className="countdown-label">seconds</div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="mt-5 mb-3">
      <div>
        {duration ? <Countdown date={timer} renderer={renderer} /> : null}
      </div>
    </div>
  );
}

export default CountdownTimer;
