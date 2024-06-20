"use client"

import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function Navbar() {
    const links = [
        { id: 0, title: "Home", url: "/" },
        { id: 1, title: "Sell NFTs CAR", url: "/sell-nft" },
        { id: 2, title: "Credit owner", url: "/credit-owner" },
        { id: 3, title: "Get CAR", url: "/test-token" },
    ];
    return (
        <div className="bg-green-400 h-20 flex items-center justify-between px-5">
            <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-4">
                    <h1 className="text-white text-3xl font-bold hover:text-black transition duration-200">Exchange CarbonCredits</h1>
                </Link>
            </div>
            <div className="flex items-center space-x-8">
                <div className="flex justify-center space-x-8">
                    {links.map((link) => (
                        <div
                            key={link.id}
                            className="text-white font-semibold hover:text-black transition duration-150"
                        >
                            <Link key={link.id} href={link.url}>
                                {link.title}
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="flex items-center space-x-4">
                    <ConnectButton showBalance={false} />
                </div>
            </div>
        </div>
    );
};