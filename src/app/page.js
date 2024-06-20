"use client";

import Image from "next/image";
import { useAccount } from 'wagmi';
import NFTBox from "@/components/NFTBox";
import { useChainId } from 'wagmi';
import { networkMappingAddresses } from "../../constants/index";
import GET_ACTIVE_ITEMS from "../../constants/subgraphQueries"
import { useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";
  
export default function Home() {
  const { isConnected, isDisconnected /*, address, addresses */ } = useAccount()
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
  //const { loading: loadingQuery, error, data: listedNftQuery } = useQuery(GET_ACTIVE_ITEMS);
  //let listedNfts = listedNftQuery;
  //let loading = loadingQuery;
  // if (chainId == 31337) {
  //   listedNfts = [
  //     {
  //       price: "10000000000000000000",
  //       nftAddress:"0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  //       tokenId:0,
  //       marketplaceAddress:"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  //       seller:"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  //     },
  //     {
  //       price: "10000000000000000000",
  //       nftAddress:"0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  //       tokenId:0,
  //       marketplaceAddress:"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  //       seller:"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  //     },
  //     {
  //       price: "10000000000000000000",
  //       nftAddress:"0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  //       tokenId:0,
  //       marketplaceAddress:"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  //       seller:"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  //     },
  //   ]
  //   loading = false;
  // }
  const { loading, error, data, refetch } = useQuery(GET_ACTIVE_ITEMS);
  console.log(data);

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
          // <div className="flex flex-wrap gap-7">
          // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-7">
          <div>
            {
              loading || !data ? (
                <div>Loading...</div>
              ) : (
                <div className={data.activeItems.length < 5 ? ("flex flex-wrap gap-7") : ("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-7")}>
                    {
                      data.activeItems.map((nft) => {
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
          </div>
        )}
        {/* {(isConnected && (chainId == 31337)) && (
          // <div className="flex flex-wrap gap-7">
          // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-7">
          <div>
            {
              loading || !listedNfts ? (
                <div>Loading...</div>
              ) : (
                <div className={listedNfts.length < 5 ? ("flex flex-wrap gap-7") : ("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-7")}>
                    {
                      listedNfts.map((nft) => {
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
          </div>
        )}         */}
      </div>
    </div>
  );
}
