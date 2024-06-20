"use client";

import { useAccount } from 'wagmi';
import { useChainId } from 'wagmi';
import { abiERC721, networkMappingAddresses, abiNftMarketplace } from "../../../constants";
import { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, message, Button } from 'antd';
import NFTBox from "@/components/NFTBoxBought";
import GET_OWNER_BOUGHT_ITEMS from "../../../constants/subgraphBoughtQueries"
import { useQuery } from "@apollo/client";
  
export default function TestOwner() {
  const { isConnected, isDisconnected, address /*, addresses */ } = useAccount()
  console.log(`address: ${address}`);
  const addressQuery = isConnected ? (address) : ("");
  console.log(`addressQuery: ${addressQuery}`);
  const chainId = useChainId();
  const initialChainId = useRef(chainId);
  console.log(`(initialChainId: ${chainId})`);
  useEffect(() => {
    // if (initialChainId.current !== undefined && chainId !== initialChainId.current) {
    if (chainId !== initialChainId.current) {
      window.location.reload();
    }
  }, [chainId]);
  const marketplaceAddress = chainId in networkMappingAddresses ? networkMappingAddresses[chainId].NftMarketplace[0] : null;
  const { loading, error, data: listedNftOwnerBoughtQuery } = useQuery(GET_OWNER_BOUGHT_ITEMS(addressQuery.toLowerCase()));
  console.log(listedNftOwnerBoughtQuery);


  return (
    <div className="w-full">
      {/* <div className=" flex flex-col items-center justify-center h-screen space-y-10"> */}
      <div className=" flex flex-col items-center justify-center min-h-screen space-y-20">
        <h1 className=" text-4xl font-mono font-bold text-rose-500">
          {isDisconnected && ("Connet your wallet (with sepolia network / bscTestnet)")}
          {/* {(isConnected && (chainId != 11155111 && chainId != 31337)) && ("Please switch to sepolia nerwork")} */}
          {(isConnected && (chainId != 11155111 && chainId != 97)) && ("Please switch to sepolia network / bscTestnet")}
        </h1> 
        {(isConnected && (chainId == 11155111 || chainId == 97)) && (
          <div>
            <h1 className=" text-4xl font-mono font-bold text-rose-500">Your Carbon Credits</h1>
            {/* <div className="flex flex-wrap gap-7"> */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-7"> */}
            {
              loading || !listedNftOwnerBoughtQuery ? (
                <div>Loading...</div>
              ) : (
                <div className={listedNftOwnerBoughtQuery.activeItems.length < 5 ? ("flex flex-wrap gap-7") : ("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-7")}>
                    {
                      listedNftOwnerBoughtQuery.activeItems.map((nft) => {
                        const { price, nftAddress, tokenId, seller } = nft
                        return marketplaceAddress ? (
                          <NFTBox
                            price={price}
                            nftAddress={nftAddress}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            seller={seller}
                            key={`${nftAddress}${tokenId}`}
                          />
                        ) : (
                          <div>Network error, please switch to a supported network. </div>
                        )
                      })
                    }
                </div>
              )
            }  
            {
              ((!loading || listedNftOwnerBoughtQuery) && listedNftOwnerBoughtQuery.activeItems.length == 0) ? (
                <h1 className=" text-2xl italic font-mono font-bold text-gray-400">
                    Not Found. (Maybe You are listing them or You do not have any credits yet...)
                </h1>
              ) : ("")
            }
          {/* </div> */}
          </div>
        )}        
      </div>
    </div>
  );
}
