import { createConfig } from "@privy-io/wagmi";
import { createPublicClient, createWalletClient } from "viem";
import { http } from "wagmi";
import { arbitrum, arbitrumSepolia, mainnet, monadTestnet } from "wagmi/chains";
import {
	coinbaseWallet,
	metaMask,
	safe,
	walletConnect,
} from "wagmi/connectors";

export const arbitrumPublicClient = createPublicClient({
	chain: arbitrum,
	transport: http(),
});

export const arbitrumSepoliaPublicClient = createPublicClient({
	chain: arbitrumSepolia,
	transport: http(),
});

export const walletClient = createWalletClient({
	chain: arbitrum,
	transport: http(),
});

export const config = createConfig({
	multiInjectedProviderDiscovery: true,
	chains: [mainnet, arbitrum, arbitrumSepolia, monadTestnet],
	connectors: [
		coinbaseWallet(),
		metaMask(),
		safe(),
		walletConnect({ projectId: "b9a8d6b8da0f74e66dd8093ec7bb713a" }),
	],
	transports: {
		[mainnet.id]: http(),
		[arbitrum.id]: http(),
		[arbitrumSepolia.id]: http(),
		[monadTestnet.id]: http(),
	},
});

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}
