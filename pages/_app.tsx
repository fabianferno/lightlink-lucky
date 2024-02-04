import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { GlobalProvider } from "../context/GlobalContext";
import { http, createConfig, WagmiProvider } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";

const config = createConfig({
  chains: [polygonMumbai],
  connectors: [injected()],
  transports: {
    [polygonMumbai.id]: http(),
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
