import { Account } from "./Account";
import { WalletOptions } from "./WalletOptions";
import { useAccount } from "wagmi";

export function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}
