import Image from "next/image";
import React from "react";
import { ConnectWallet } from "../components/Connect";

function Login() {
  return (
    <div className="bg-[#091B18] min-h-screen flex flex--col items-center justify-center text-center">
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/profile.png"
          alt="Profile Picture"
          width={224}
          height={224}
          className="rounded-full mb-10"
        />
        <h1 className="text-6xl text-white font-bold">The Lucky Draw</h1>
        <h2 className="text-white">
          Get Started By logging in with your MetaMask
        </h2>
        <ConnectWallet />
      </div>
    </div>
  );
}

export default Login;
