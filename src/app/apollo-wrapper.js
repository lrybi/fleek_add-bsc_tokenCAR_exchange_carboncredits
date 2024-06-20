"use client";

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
  NextSSRApolloClient
} from "@apollo/experimental-nextjs-app-support/ssr";
import { useChainId } from 'wagmi';

function makeClient(subGraphUrl) {
  const httpLink = new HttpLink({
      uri: subGraphUrl,
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

export function ApolloWrapper({ children }) {
  const chainId = useChainId();
  console.log("chainId: ", chainId);
  
  let subGraphUrl = undefined;
  if (chainId == 11155111) {
    console.log("chainId: ", chainId );
    subGraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
    console.log("subGraphUrl for chainId: ", chainId );
  } else if (chainId == 97) {
    console.log("chainId: ", chainId );
    subGraphUrl = process.env.NEXT_PUBLIC_SUBGRAPH_URL_BSC_TESTNET;
    console.log("subGraphUrl for chainId: ", chainId );
  } else {
    console.log("chainId: ", chainId );
    subGraphUrl = undefined;
    console.log("subGraphUrl undefined" );
  }
  
  const makeClientWrapper = () => makeClient(subGraphUrl);

  return (
    <ApolloNextAppProvider makeClient={makeClientWrapper}>
      {children}
    </ApolloNextAppProvider>
  );
}