"use client"

import { abiERC721 } from "../../constants/index";
import { config } from "../../helper-wagmi-config";
import { readContract } from '@wagmi/core';
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi';
import { Card, Image, Skeleton } from 'antd';
import { formatUnits } from 'viem';
// import UpdateListingModal from './UpdateListingModal';
import { useChainId } from 'wagmi';
import Link from 'next/link'


export default function NFTBox({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isConnected, address} = useAccount();
    const chainId = useChainId();
    const [imageURL, setImageURL] = useState("");
    const [tokenName, setTokenName] = useState('');
    const [tokenDescription, setTokenDescription] = useState('');
    const [tokenLevel, setTokenLevel] = useState('');
    const [tokenType, setTokenType] = useState('');
    const [showModal, setShowModal] = useState(false);
    const hideModal = () => setShowModal(false);
    const { Meta } = Card;
    
    async function updateUI() {
        const tokenURI = await readContract(config, {
            abi: abiERC721,
            address: nftAddress, 
            functionName: "tokenURI",
            args: [tokenId],
        });
        
        if (tokenURI) {
            console.log(`The token URI is: ${tokenURI}`);

            const requestURL = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
            const tokenURIResponse = await (await fetch(requestURL)).json();
            console.log(tokenURIResponse);
            const imageURI = tokenURIResponse.image;
            const imageURIURL = imageURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
            console.log(imageURIURL);
            setImageURL(imageURIURL);
            setTokenName(tokenURIResponse.name);
            setTokenDescription(tokenURIResponse.description);
            setTokenLevel(tokenURIResponse.attributes[0].level);
            setTokenType(tokenURIResponse.attributes[0]["type"]);
        }
    }

    useEffect(() => {
        if (isConnected) {
            updateUI();
        }
    }, [isConnected]);
    
    
    return (
        <div>
            <div>
                {imageURL ? (
                    <div>
                        {/* <UpdateListingModal
                            isVisible={showModal}
                            tokenId={tokenId}
                            nftAddress={nftAddress}
                            marketplaceAddress={marketplaceAddress}
                            onClose={hideModal}
                            imageURL={imageURL}
                            currentPrice={price}
                            seller={seller}
                        /> */}
                        <Card
                            hoverable
                            style={{ width: 200 }}  
                            cover={<Image alt='nft' src={imageURL} height={200} width={200} preview={false} />}
                            onClick={() => { setShowModal(true)}}
                        >
                            <Meta
                                title={tokenName.replace("Carbon Credits", "CAR")}
                                description={tokenDescription}
                            />
                            <div className=" p-2">
                                <div className=" flex flex-col items-end gap-2">
                                    <div className="italic text-sm">Level: {tokenLevel}</div>
                                    <div className="italic text-sm">Type: {tokenType}</div>
                                    <div>#{tokenId}</div>
                                    <div style={{ wordWrap: 'break-word', maxWidth: '150px' }} className="italic text-sm">NFT Address: {nftAddress}</div>
                                    <div className="italic text-sm">Owned by you</div>
                                    {/* <div className=" font-bold">{formatUnits(price, 18)} ETH</div> */}
                                </div>
                                </div>
                        </Card>
                    </div>
                ) : (
                    <div> 
                        <Skeleton.Image /> 
                    </div>
                )}
            </div>
        </div>
    ); 
}
        
