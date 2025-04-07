import type { PrivyClientConfig } from "@privy-io/react-auth";

export const privyConfig: PrivyClientConfig = {
	appearance: {
		accentColor: "#0148FE",
		theme: "#17161B",
		logo: "/icons/logo.svg",
		showWalletLoginFirst: true,
		walletChainType: "ethereum-only",
		walletList: [
			"detected_ethereum_wallets",
			"metamask",
			"coinbase_wallet",
			"rainbow",
			"phantom",
			"zerion",
			"cryptocom",
			"uniswap",
			"okx_wallet",
			"universal_profile",
		],
	},
	loginMethods: ["wallet"],
};
