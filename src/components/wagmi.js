import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { supportedNetworks } from "@superfluid-finance/widget";
import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const walletConnectProjectId = "6ab6f6619ba318beed3f073931527790";

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  supportedNetworks,
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Superfluid App",
  chains,
  projectId: walletConnectProjectId,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

