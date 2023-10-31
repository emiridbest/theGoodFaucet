"use client";
import React, { useState, useEffect, useCallback } from "react";
import SuperfluidWidget from "@superfluid-finance/widget";
import superTokenList from "@superfluid-finance/tokenlist";
import { WagmiConfig } from "wagmi";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import Web3 from "web3";
import { contractAddress, contractAbi } from "../abi/goodFaucet";
import { wagmiConfig, chains } from "../components/wagmi";
import { client, getOwnedBy } from "../components/utils";
import productDetails from "../components/productDetails";
import paymentDetails from "../components/paymentDetails";
import { Footer, Header } from "../components/Index";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [existingLensWallet, setExistingLensWallet] = useState("");
  const [nonExistingLensWallet, setNonExistingLensWallet] = useState("");
  const [lensHandleExists, setLensHandleExists] = useState("");
  const [sender, setSender] = useState("");
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState(0);
  const [blockTime, setBlockTime] = useState(0);
  const [requestResult, setRequestResult] = useState("");

  useEffect(() => {
    async function checkIfWalletIsConnected() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.log("MetaMask extension not found.");
      }
    }

    checkIfWalletIsConnected();
  }, []);

  const initializeWeb3 = useCallback(async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);

        const contract = new web3.eth.Contract(contractAbi, contractAddress);

        setContract(contract);
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    } else {
      console.log("MetaMask extension not found.");
    }
  }, [contractAddress]);

  useEffect(() => {
    if (account) {
      initializeWeb3();
    }
  }, [account, initializeWeb3]);

  async function fetchProfile() {
    try {
      console.log(walletAddress);
      const response = await client.query({
        query: getOwnedBy,
        variables: {
          address: walletAddress,
        },
      });

      if (response.data.defaultProfile == null) {
        setLensHandleExists("false");
        setNonExistingLensWallet(walletAddress);
        setExistingLensWallet("");
      } else {
        setLensHandleExists("true");
        setExistingLensWallet(walletAddress);
        setNonExistingLensWallet("");
      }
    } catch (e) {
      console.log("Error:", e);
    }
  }

  const handleChange = (e) => {
    setWalletAddress(e.target.value);
  };

  const handleSubmit = async () => {
    document.querySelector("#inputField").value = "";
    fetchProfile();
  };

    async function donate() {
      if (account) {
        console.log("Donating funds...");
          setSender("true");
        //  setExistingLensWallet(walletAddress);

          } else {
            return
          }
    }
  async function requestFunds() {
    setContract(contract);
        setWalletAddress(account);
        fetchProfile();
        if(lensHandleExists=="true"){
        const result = await contract.methods
          .requestTokens()
          .send({ from: account, gasLimit: 500000 });
        }
        // You can handle the result as needed
        setRequestResult("Funds received!");
      }


  const customPaymentDetails = paymentDetails.paymentOptions.map((option) => {
    return {
      ...option,
      receiverAddress: contractAddress,
    };
  });

  return (
    <main className="container mx-auto p-1 font-serif">
      <Header />
      <section className="container mx-auto flex flex-col items-center text-center">
      <p className="max-w-prose text-3xl">
      Empowering Lives Through Universal Basic Income
        </p>
  <p className="max-w-prose text-1xl">
    Universal Basic Income (UBI) is a social and economic concept where the government provides all citizens or residents of a country with a regular, unconditional sum of money, regardless of their income, employment status, or wealth. UBI is typically paid on a regular basis, such as monthly or annually, and is designed to cover basic living expenses. It is often seen as a means to address poverty, income inequality, and provide economic security to all members of society.
  </p>
</section>

      <section className="container mx-auto mt-10  flex justify-center items-center">
        <button
          onClick={requestFunds}
          className="bg-green-600 text-white hover:bg-green-500 h-16 px-12 font-medium outline-none my-6 border-none rounded-full cursor-pointer"
        >
          Request UBI
        </button>
      </section>
      <section className="container mx-auto flex justify-between items-center">
        <section className="">
          <input
            className="hidden"
            type="text"
            id="inputField"
            name="inputField"
            maxLength="120"
            required
            onChange={handleChange}
          />
          <button
            className="hidden"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </section>
        <section className="container m-auto flex justify-center items-center">
          <section className="text-black">
            {lensHandleExists === "true" && (
              <section className="text-black">
                <h2>
                  <span className="font-medium">{existingLensWallet}</span>{" "}
                  Identity confirmed!!!
                </h2>
              </section>
            )}
            {lensHandleExists === "false" && (
              <section>
                {nonExistingLensWallet} Identity cannot be ascertained!!1
              </section>
            )}
          </section>
        </section>
      </section>
      <section className="container mx-auto mt-6 flex justify-center items-center">
        <button
          onClick={donate}
          className="bg-green-600 text-white hover:bg-green-500 h-16 px-12 font-medium outline-none border-none rounded-full cursor-pointer"
        >
          Donate Funds
        </button>
      </section>
      <section className="h-20 flex justify-center items-center mt-6 mx-10">
        {sender === "true" && (
          <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
              <ConnectButton.Custom>
                {({ openConnectModal, connectModalOpen }) => {
                  const walletManager = {
                    open: async () => openConnectModal(),
                    isOpen: connectModalOpen,
                  };
                  return (
                    <section>
                      <SuperfluidWidget
                        productDetails={productDetails}
                        paymentDetails={{
                          paymentOptions: customPaymentDetails,
                        }}
                        tokenList={superTokenList}
                        type="dialog"
                        walletManager={walletManager}
                        eventListeners={{
                          onSuccess: () => {
                            setPlay(true);
                          },
                        }}
                      >
                        {({ openModal }) => (
                          <button
                            onClick={() => {
                              openModal();
                            }}
                            className="bg-green-600 hover:bg-green-500 text-white h-16 px-12 font-medium outline-none border-none rounded-full cursor-pointer"
                          >
                            Start Stream
                          </button>
                        )}
                      </SuperfluidWidget>
                    </section>
                  );
                }}
              </ConnectButton.Custom>
            </RainbowKitProvider>
          </WagmiConfig>
        )}
      </section>
      <Footer />
    </main>
  );
}
