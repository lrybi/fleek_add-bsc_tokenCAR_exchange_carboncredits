"use client"

import React from "react";
import { useState, useEffect } from "react";   
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http, WagmiProvider } from "wagmi";
import { sepolia, bscTestnet, hardhat } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const chains = [sepolia, bscTestnet, hardhat];       
const AppInfo = {
    appName: "My RainbowKit App",
  };
const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    autoConnect: true,
    projectId: projectId,
    chains: [sepolia, bscTestnet,hardhat],
    transports: {
        [sepolia.id]: http(),
        [bscTestnet.id]: http(),
        [hardhat.id]: http(),
    },
})

import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
const queryClient = new QueryClient();

const Providers = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    chains={chains}
                    appInfo={AppInfo}
                    modalSize="compact"
                >
                    {mounted && children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default Providers;