import * as React from "react";
import { Connector, useConnect } from "wagmi";

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <WalletOption
      key={connectors[0].uid}
      connector={connectors[0]}
      onClick={() => connect({ connector: connectors[0] })}
    />
  );
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <button
      className="text-white font-bold bg-indigo-400 p-2 rounded-2xl"
      disabled={!ready}
      onClick={onClick}
    >
      Connect
    </button>
  );
}
