import React, { useState } from "react";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig, chains } from "../components/wagmi";
import { WagmiConfig } from "wagmi";

const Header = () => {
  const [isConnected] = useState("");

  return (
    <header className="p-5 sm:p-10">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex text-2xl font-bold text-green-500 shrink-0">
          The Good Faucet
        </div>
        <nav className="order-3 w-full sm:order-2 sm:w-auto mt-4 sm:mt-0">
          <ul className="flex flex-wrap justify-center space-x-1 sm:space-x-6 text-black">
            <li className="cursor-pointer hover:text-green-500">Home</li>
            <li className="cursor-pointer hover:text-green-500">About Us</li>
            <li className="cursor-pointer hover:text-green-500">What We Do</li>
            <li className="cursor-pointer hover:text-green-500">Mission</li>
            <li className="cursor-pointer hover:text-green-500">Impact</li>
          </ul>
        </nav>
        {!isConnected && (
          <div className="flex justify-center items-center pr-5 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <WagmiConfig config={wagmiConfig}>
              <RainbowKitProvider chains={chains}>
                <ConnectButton />
              </RainbowKitProvider>
            </WagmiConfig>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
