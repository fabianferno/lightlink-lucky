import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { GlobalProvider } from "../context/GlobalContext";
import { http, createConfig, WagmiProvider } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";
import { Chain } from "wagmi/chains";

const LightLinkPegasus: Chain = {
  id: 1891,
  name: "LightLink Pegasus",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://replicator.pegasus.lightlink.io/rpc/v1"] },
    default: { http: ["https://replicator.pegasus.lightlink.io/rpc/v1"] },
  },
  testnet: true,
};
const config = createConfig({
  chains: [LightLinkPegasus],
  connectors: [injected()],
  transports: {
    [LightLinkPegasus.id]: http(),
  },
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <Component {...pageProps} />
          <Toaster />
        </GlobalProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
