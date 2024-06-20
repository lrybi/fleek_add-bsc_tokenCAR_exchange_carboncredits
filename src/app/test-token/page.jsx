"use client";

import { useAccount } from 'wagmi';
import { useChainId } from 'wagmi';
import { abiERC20, networkMappingAddresses } from "../../../constants";
import { useState, useEffect, useRef } from 'react';
import { message, Button } from 'antd';
import { config } from "../../../helper-wagmi-config";
import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { parseEther, formatUnits } from "viem";
import { readContract } from '@wagmi/core';
  
export default function TestToken() {
  const { isConnected, isDisconnected, address /*, addresses */ } = useAccount()
  console.log(`address: ${address}`);
  const chainId = useChainId();
  const initialChainId = useRef(chainId);
  console.log(`(initialChainId: ${chainId})`);
  useEffect(() => {
    // if (initialChainId.current !== undefined && chainId !== initialChainId.current) {
    if (chainId !== initialChainId.current) {
      window.location.reload();
    }
  }, [chainId]);
  const addressTokenCAR = chainId in networkMappingAddresses ? networkMappingAddresses[chainId].TokenCAR[0] : null;
  //const blockConfirmations = (chainId == 31337) ? 1 : 2;
  const blockConfirmations = (chainId == 31337) ? 1 : 1;
  // const blockConfirmations = (chainId == 31337) ? 2 : 1;
  const [balance, setBalance] = useState('0');
  const [messageApi, contextHolder] = message.useMessage();
  const { isPending: isPendingWriteContract, writeContract } = useWriteContract();

  // <just for test>
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // </just for test>
  
  const WriteContractCARfaucetVariables = {
    abi: abiERC20,
    address: addressTokenCAR, 
    functionName: "CARfaucet",
    args: [],
  }
  const handleCARfaucetSuccess = async (hashCARfaucet) => {
    messageApi.destroy();
    console.log("Waiting for block Confirmations...");
    console.log(hashCARfaucet);
    messageApi.open({
      type: 'loading',
      content: 'Waiting for block Confirmations...',
      duration: 0,
    });
    // await waitForTransactionReceipt(config,
    //   {
    //     hash: hashCARfaucet,
    //     confirmations: blockConfirmations,
    //   }
    // );
    if (chainId == 11155111) {
      // <just for test>
      await sleep(10000);
      // </just for test>
      //await waitForTransactionReceipt(config,
      waitForTransactionReceipt(config,
          {
              hash: hashCARfaucet,
              confirmations: blockConfirmations,
          }
      );
    } else if (chainId == 97) {
      await waitForTransactionReceipt(config,
          {
              hash: hashCARfaucet,
              confirmations: blockConfirmations,
          }
      );
    } else {
      await waitForTransactionReceipt(config,
        {
            hash: hashCARfaucet,
            confirmations: blockConfirmations,
        }
    );
    }
    console.log(`CARfaucet confirmed! (with ${blockConfirmations} blockConfirmations)`);
    messageApi.destroy();
    
    updateBalanceUI()
    messageApi.open({
      type: 'success',
      content: 'Received 10 CAR!',
    });
  }

  async function updateBalanceUI() {
    //if (chainId == 11155111 || chainId == 31337) {
    if (chainId == 11155111 || chainId == 97) {
      const returnedBalance = await readContract(config, {
        abi: abiERC20,
        address: addressTokenCAR, 
        functionName: "balanceOf",
        args: [address],
      });
      //console.log("Balance:", returnedBalance);
  
      setBalance(returnedBalance.toString());
    }
  }

  useEffect(() => {
    if (isConnected) {
      updateBalanceUI();
    }
  }, [ address, isConnected, chainId ]);
    
  return (
    <>
      {contextHolder}
      
    <div className="w-full">
      <div className=" flex flex-col items-center justify-center h-screen space-y-10">
        <h1 className=" text-4xl font-mono font-bold text-rose-500">
          {isDisconnected && ("Connet your wallet (with sepolia network / bscTestnet)")}
          {/* {(isConnected && (chainId != 11155111 && chainId != 31337)) && ("Please switch to sepolia nerwork")} */}
          {(isConnected && (chainId != 11155111 && chainId != 97)) && ("Please switch to sepolia network / bscTestnet")}
        </h1> 
        {(isConnected && (chainId == 11155111 || chainId == 97)) && (
          <div>
            <h1 className=" text-4xl font-mono font-bold text-rose-500">TokenCarbonCre FAUCET</h1>
            <h1 className=" text-2xl italic font-mono font-bold text-rose-400"> Token CAR Address: {addressTokenCAR}</h1>
            {chainId == 97 && (<h1 className=" text-2xl italic font-mono font-bold text-blue-400"> Your Curent Balance: {formatUnits(balance, 18)} CAR</h1>)}
            <h1 className=" text-2xl italic font-mono font-bold text-gray-400"> Get 10 CAR For Testing.</h1>
            <Button
                  type="primary"
                  size='large'
                  disabled={isPendingWriteContract}
                  loading={isPendingWriteContract}
                  shape='round'
                  onClick={() => {
                    messageApi.open({
                      type: 'loading',
                      content: 'Waiting for confirmation...',
                      duration: 0,
                    });
                    writeContract(
                      WriteContractCARfaucetVariables,
                      {
                        onError: (error) => {
                          console.log(error.message ?? error.shortMessage);
                          messageApi.destroy();
                          messageApi.open({
                            type: 'error',
                            content: error.shortMessage,
                          });
                        },
                        onSuccess: async (hashCARfaucet) => { await handleCARfaucetSuccess(hashCARfaucet) }
                      }
                    );
                  }}
                >
                  GET
                </Button>
          </div>
        )}        
      </div>
    </div>
    </>
  );
}
