
import { http, createConfig } from '@wagmi/core'
import { sepolia, bscTestnet, hardhat } from '@wagmi/core/chains'

export const config = createConfig({
    chains: [sepolia, bscTestnet, hardhat],
    transports: {
        [sepolia.id]: http(),
        [bscTestnet.id]: http(),
        [hardhat.id]: http(),
    },
})