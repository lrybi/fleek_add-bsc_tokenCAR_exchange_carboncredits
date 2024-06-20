"use client"

import { Modal, Image, InputNumber, message, Button, Skeleton } from 'antd';
import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { abiNftMarketplace, abiERC20 } from "../../constants/index";
import { parseEther, formatUnits } from 'viem';
import { useChainId } from 'wagmi';
import { config } from "../../helper-wagmi-config";
import { useAccount } from 'wagmi';
import { networkMappingAddresses } from "../../constants/index";

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
    imageURL,
    currentPrice,
    seller
}) {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0);
    const { address} = useAccount();
    const isOwnedByYou = (seller.toLowerCase() === address.toLowerCase());
    const chainId = useChainId();
    //const blockConfirmations = (chainId == 31337) ? 1 : 2;
    const blockConfirmations = (chainId == 31337) ? 1 : 1;
    // const blockConfirmations = (chainId == 31337) ? 2 : 1;
    const [messageApi, contextHolder] = message.useMessage();  
    const [isConfirmationsMessageApiLoading, setIsConfirmationsMessageApiLoading] = useState(false);
    
    const { isPending: isPendingWriteContract, writeContract } = useWriteContract();

    const approveAndBuy = async () => {
        const WriteContractApproveTokenCARVariables = {
            abi: abiERC20,
            address: networkMappingAddresses[chainId].TokenCAR[0],
            functionName: "approve",
            args: [marketplaceAddress, currentPrice],
        }
        const WriteContractBuyItemVariables = {
            abi: abiNftMarketplace,
            address: marketplaceAddress,
            functionName: "buyItem",
            args: [nftAddress, BigInt(tokenId)],
        }
        messageApi.open({
            type: 'loading',
            content: 'Waiting for confirmation...',
            duration: 0,
        });
        writeContract(
            WriteContractApproveTokenCARVariables,
            {
                onError: (error) => {
                    console.log(error.message ?? error.shortMessage);
                    messageApi.destroy();
                    messageApi.open({
                    type: 'error',
                    content: error.shortMessage,
                    });
                },
                onSuccess: async (hashApproveTokenCAR) => await handleApproveTokenCARSuccess(hashApproveTokenCAR)
            }
        )
        async function handleApproveTokenCARSuccess(hashApproveTokenCAR) {
            messageApi.destroy();
            setIsConfirmationsMessageApiLoading(true);
            messageApi.open({
                type: 'loading',
                content: 'Waiting for block Confirmations...',
                duration: 0,
            });
            // await waitForTransactionReceipt(config,
            //     {
            //         hash: hashApproveTokenCAR,
            //         confirmations: blockConfirmations,
            //     }
            // );
            if (chainId == 11155111) {
                // <just for test>
                await sleep(15000);
                // </just for test>
                //await waitForTransactionReceipt(config,
                waitForTransactionReceipt(config,
                    {
                        hash: hashApproveTokenCAR,
                        confirmations: blockConfirmations,
                    }
                );
            } else if (chainId == 97) {
                await waitForTransactionReceipt(config,
                    {
                        hash: hashApproveTokenCAR,
                        confirmations: blockConfirmations,
                    }
                );
            } else {
                await waitForTransactionReceipt(config,
                    {
                        hash: hashApproveTokenCAR,
                        confirmations: blockConfirmations,
                    }
                );
            }
            console.log(`Approve token CAR confirmed!`);
            messageApi.destroy();
            setIsConfirmationsMessageApiLoading(false);

            console.log('Ok! Now time to buy');
            messageApi.open({
                    type: 'loading',
                    content: 'Waiting for confirmation...',
                    duration: 0,
                });
            writeContract(
                WriteContractBuyItemVariables,
                {
                    onError: (error) => {
                        console.log(error.message ?? error.shortMessage);
                        messageApi.destroy();
                        messageApi.open({
                        type: 'error',
                        content: error.message.includes("NftMarketplace__PriceNotMet") ? ("Your balance is insufficient. - Or maybe the network is currently very busy, please try again later."):(error.shortMessage)
                        });
                    },
                    onSuccess: async (hashBuyItem) => await handleBuyItemSuccess(hashBuyItem)
                }
            )
        };

        async function handleBuyItemSuccess(hashBuyItem) {
            messageApi.destroy();
            setIsConfirmationsMessageApiLoading(true);
            messageApi.open({
                type: 'loading',
                content: 'Waiting for block Confirmations...',
                duration: 0,
            });
            // await waitForTransactionReceipt(config,
            //     {
            //         hash: hashBuyItem,
            //         confirmations: blockConfirmations,
            //     }
            // );
            if (chainId == 11155111) {
                // <just for test>
                await sleep(10000);
                // </just for test>
                //await waitForTransactionReceipt(config,
                waitForTransactionReceipt(config,
                    {
                        hash: hashBuyItem,
                        confirmations: blockConfirmations,
                    }
                );
            } else if (chainId == 97) {
                await waitForTransactionReceipt(config,
                    {
                        hash: hashBuyItem,
                        confirmations: blockConfirmations,
                    }
                );
            } else {
                await waitForTransactionReceipt(config,
                    {
                        hash: hashBuyItem,
                        confirmations: blockConfirmations,
                    }
                );
            }
            messageApi.destroy();
            setIsConfirmationsMessageApiLoading(false);
            onClose && onClose();
            messageApi.open({
                type: 'success',
                content: 'Buy Item confirmed!',
            });
        };
    }
    
    const WriteContractUpdateListingVariables = {
        abi: abiNftMarketplace,
        address: marketplaceAddress, 
        functionName: "updateListing",
        args: [nftAddress, BigInt(tokenId), BigInt(parseEther(String(priceToUpdateListingWith || '0')))],
    }

    const WriteContractCancelListingVariables = {
        abi: abiNftMarketplace,
        address: marketplaceAddress, 
        functionName: "cancelListing",
        args: [nftAddress, BigInt(tokenId)],
    }

    // <just for test>
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // </just for test>

    async function handleUpdateListingSuccess(hashUpdateListing) {
        messageApi.destroy();
        messageApi.open({
            type: 'loading',
            content: 'Waiting for block Confirmations...',
            duration: 0,
        });
        setIsConfirmationsMessageApiLoading(true);
        // await waitForTransactionReceipt(config,
        //     {
        //         hash: hashUpdateListing,
        //         confirmations: blockConfirmations,
        //     }
        // );
        if (chainId == 11155111) {
            // <just for test>
            await sleep(10000);
            // </just for test>
            //await waitForTransactionReceipt(config,
            waitForTransactionReceipt(config,
                {
                    hash: hashUpdateListing,
                    confirmations: blockConfirmations,
                }
            );
        } else if (chainId == 97) {
            await waitForTransactionReceipt(config,
                {
                    hash: hashUpdateListing,
                    confirmations: blockConfirmations,
                }
            );
        } else {
            await waitForTransactionReceipt(config,
                {
                    hash: hashUpdateListing,
                    confirmations: blockConfirmations,
                }
            );
        }
        messageApi.destroy();
        setIsConfirmationsMessageApiLoading(false);
        onClose && onClose();
        setPriceToUpdateListingWith('0');
    
        messageApi.open({
            type: 'success',
            content: 'Update Listing confirmed!',
        });
    }

    async function handleCancelListingSuccess(hashCancelListing) {
        messageApi.destroy();
        messageApi.open({
            type: 'loading',
            content: 'Waiting for block Confirmations...',
            duration: 0,
        });
        setIsConfirmationsMessageApiLoading(true);
        // await waitForTransactionReceipt(config,
        //     {
        //         hash: hashCancelListing,
        //         confirmations: blockConfirmations,
        //     }
        // );
        if (chainId == 11155111) {
            // <just for test>
            await sleep(10000);
            // </just for test>
            //await waitForTransactionReceipt(config,
            waitForTransactionReceipt(config,
                {
                    hash: hashCancelListing,
                    confirmations: blockConfirmations,
                }
            );
        } else if (chainId == 97) {
            await waitForTransactionReceipt(config,
                {
                    hash: hashCancelListing,
                    confirmations: blockConfirmations,
                }
            );
        } else {
            await waitForTransactionReceipt(config,
                {
                    hash: hashCancelListing,
                    confirmations: blockConfirmations,
                }
            );
        }
        messageApi.destroy();
        setIsConfirmationsMessageApiLoading(false);
        onClose && onClose();
       
        messageApi.open({
            type: 'success',
            content: 'Cancel Listing confirmed!',
        });
    }

    return (
        <>
            {contextHolder}
        
            <Modal
                open={isVisible}
                onCancel={() => { onClose(); setPriceToUpdateListingWith("0")}}
                onOk={isOwnedByYou ? (
                    () => {
                        messageApi.open({
                            type: 'loading',
                            content: 'Waiting for confirmation...',
                            duration: 0,
                        });
                        console.log("priceToUpdateListingWith:", priceToUpdateListingWith)
                        console.log("price:",BigInt(parseEther(String(priceToUpdateListingWith || '0'))))
                        writeContract(
                            WriteContractUpdateListingVariables,
                            {
                                onError: (error) => {
                                    console.log(error.message ?? error.shortMessage);
                                    messageApi.destroy();
                                    messageApi.open({
                                        type: 'error',
                                        content: error.shortMessage,
                                    });
                                },
                                onSuccess: async (hashUpdateListing) => await handleUpdateListingSuccess(hashUpdateListing)
                            }
                        )
                    }
                ) : (
                        approveAndBuy
                    )
                }
                title="NFT Details"
                okText={isOwnedByYou ? ("Save New Listing Price") : ("Buy NFT") }
                cancelText="Leave it"
                centered={true}
                confirmLoading={isPendingWriteContract || isConfirmationsMessageApiLoading}
                destroyOnClose={true}
            >
                <div
                    style={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <div className="flex flex-col items-center gap-4">
                        <p className="p-4 text-lg">
                            {isOwnedByYou ? ("This is your listing. You may either update the listing price or cancel it.") : ("You can buy this NFT Carbon Credit") }
                        </p>
                        <div className="flex flex-col items-end gap-2 border-solid border-2 border-gray-400 rounded p-2 w-fit">
                            <div>#{tokenId}</div>
                            {imageURL ? (
                                <Image
                                    alt='nft'
                                    src={imageURL}
                                    height={200}
                                    width={200}
                                />
                            ) : (
                                    <Skeleton.Image />
                                )
                            }
                            <div className="font-bold">
                                {formatUnits(currentPrice || 0, 18)} CAR
                            </div>
                        </div>
                        {isOwnedByYou && 
                            <div className='flex items-center'>
                                <span className='text-gray-500 flex-shrink-0'>Update listing price (CAR)：</span>

                                <InputNumber
                                    min={0}
                                    onChange={(value) => {
                                        setPriceToUpdateListingWith(value);
                                    }}
                                    
                                    size="large"
                                    addonAfter='CAR'
                                    disabled={isPendingWriteContract || isConfirmationsMessageApiLoading}
                                />
                            </div>
                        }
                        
                        {isOwnedByYou && 
                            <div>
                                <span className='text-gray-500 flex-shrink-0'>or </span>
                                <Button
                                    disabled={isPendingWriteContract || isConfirmationsMessageApiLoading}
                                    type="primary"
                                    size='large'
                                    onClick={() => {
                                        messageApi.open({
                                            type: 'loading',
                                            content: 'Waiting for confirmation...',
                                            duration: 0,
                                        });
                                        writeContract(
                                            WriteContractCancelListingVariables,
                                            {
                                                onError: (error) => {
                                                    console.log(error.message ?? error.shortMessage);
                                                    messageApi.destroy();
                                                    messageApi.open({
                                                    type: 'error',
                                                    content: error.shortMessage,
                                                    });
                                                },
                                                onSuccess: async (hashCancelListing) => await handleCancelListingSuccess(hashCancelListing)
                                            }
                                        )
                                    }
                                    }
                                >
                                    Cancel Listing
                                </Button>
                            </div>
                        }
                    </div>
                </div>
            </Modal>
        </>
    )
}