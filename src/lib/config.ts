import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { arbitrum, arbitrumSepolia, monadTestnet } from "wagmi/chains";
import {
	coinbaseWallet,
	metaMask,
	safe,
	walletConnect,
} from "wagmi/connectors";

export const config = createConfig({
	multiInjectedProviderDiscovery: true,
	chains: [arbitrum, monadTestnet, arbitrumSepolia],

	connectors: [
		coinbaseWallet(),
		metaMask(),
		safe(),
		walletConnect({ projectId: "b9a8d6b8da0f74e66dd8093ec7bb713a" }),
	],

	transports: {
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
