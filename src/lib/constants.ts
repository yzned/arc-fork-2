import BigNumber from "bignumber.js";
import type { ChainMetadata, ExtendedChain, Token } from "./types";
import { arbitrum, arbitrumSepolia, monadTestnet } from "wagmi/chains";
import type { Chain } from "@rainbow-me/rainbowkit";

export const chains = [arbitrum, arbitrumSepolia, monadTestnet] as [
	Chain,
	...Chain[],
];

export const chainsMetadata: ChainMetadata[] = [
	{
		id: 421614,
		color: "#2D374B",
		logo: "/icons/chains/arbitrum.svg",
		nativeTokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",

		traderAddress: "0xF69ae94063f4671Ea4e4b9f8c97eb1aAC1731cb8",
		mpImplAddress: "0x14090b42338e02C786cDd6F29Bb83553FDe8f084",
		oracleAddress: "0x97CD13624bB12D4Ec39469b140f529459d5d369d",
		factoryAddress: "0x7eFe6656d08f2d6689Ed8ca8b5A3DEA0efaa769f",
		factoryImplAddress: "0x3F8fFaB5e44E49B191aeD313a41497A99e2F075c",
		routerAddress: "0xF48BCEfbb755F658E7766Aff961885B0B9052628",
		creationTemplates: [],
	},
	{
		id: 10143,
		color: "#836EF9",
		logo: "/icons/chains/monad.svg",
		nativeTokenAddress: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",

		traderAddress: "0xF69ae94063f4671Ea4e4b9f8c97eb1aAC1731cb8",
		mpImplAddress: "0x14090b42338e02C786cDd6F29Bb83553FDe8f084",
		oracleAddress: "0x97CD13624bB12D4Ec39469b140f529459d5d369d",
		factoryAddress: "0x7eFe6656d08f2d6689Ed8ca8b5A3DEA0efaa769f",
		factoryImplAddress: "0x3F8fFaB5e44E49B191aeD313a41497A99e2F075c",
		routerAddress: "0x213E9D23C795F7E44DabD007176554c6bB2d3fCA",
		uniswapV3FactoryAddress: "0x961235a9020B05C44DF1026D956D1F4D78014276",

		creationTemplates: [
			{
				name: "TEMPLATE 1",
				description: "ASDJKL",
				categories: [
					{
						name: "Infrastructure",
						share: 50,
						tokens: [
							"0xb2f82D0f38dc453D596Ad40A37799446Cc89274A",
							"0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
							"0xcf5a6076cfa32686c0Df13aBaDa2b40dec133F1d",
						],
					},
					{
						name: "Meme",
						tokens: [
							"0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
							"0xb2f82D0f38dc453D596Ad40A37799446Cc89274A",
						],
						share: 25,
					},
					{
						name: "Other",
						tokens: ["0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714"],
						share: 25,
					},
				],
			},
			{
				name: "TEMPLATE 2",
				description: "ASDJKL",
				categories: [
					{
						name: "Infrastructure",
						share: 50,
						tokens: [
							"0xb2f82D0f38dc453D596Ad40A37799446Cc89274A",
							"0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
						],
					},
					{
						name: "Meme",
						tokens: [
							"0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
							"0xb2f82D0f38dc453D596Ad40A37799446Cc89274A",
						],
						share: 25,
					},
					{ name: "Other", tokens: [], share: 25 },
				],
			},
		],
	},
	{
		id: 42161,
		color: "#2D374B",
		logo: "/icons/chains/arbitrum.svg",
		nativeTokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",

		traderAddress: "0xF69ae94063f4671Ea4e4b9f8c97eb1aAC1731cb8",
		mpImplAddress: "0x14090b42338e02C786cDd6F29Bb83553FDe8f084",
		oracleAddress: "0x97CD13624bB12D4Ec39469b140f529459d5d369d",
		factoryAddress: "0x7eFe6656d08f2d6689Ed8ca8b5A3DEA0efaa769f",
		factoryImplAddress: "0x3F8fFaB5e44E49B191aeD313a41497A99e2F075c",
		routerAddress: "0xF48BCEfbb755F658E7766Aff961885B0B9052628",

		creationTemplates: [],
	},
];

export const arcanumChains: ExtendedChain[] = chains.map((chain) => {
	const metadata = chainsMetadata.find((meta) => meta.id === chain.id);

	if (metadata) {
		return {
			...chain,
			...metadata,
		};
	}

	return chain;
});

export const twoPow96 = new BigNumber(2).pow(96);

export const TAGS = [
	"Infrastructure",
	"DeFi",
	"LST",
	"AI",
	"AMM Dex",
	"Stablecoins",
	"Memecoins",
];

// {
// 	logo: "/icons/chains/ethereum.svg",
// 	name: "Ethereum",
// 	id: 1,
// 	color: "#627EEA",
// },
// {
// 	logo: "/icons/chains/optimism.svg",
// 	name: "Optimism",
// 	id: 10,
// 	color: "#FF0420",
// },
// {
// 	logo: "/icons/chains/zkSync.svg",
// 	name: "zkSync",
// 	id: 324,
// 	color: "#1E68FF",
// },
// {
// 	logo: "/icons/chains/base.svg",
// 	name: "Base",
// 	id: 8453,
// 	color: "#0052FF",
// },
// {
// 	logo: "/icons/chains/bsc.svg",
// 	name: "BSC",
// 	id: 56,
// 	color: "#F0B90B",
// },
// {
// 	logo: "/icons/chains/polygon.svg",
// 	name: "Polygon",
// 	id: 137,
// 	color:
// 		"linear-gradient(99.46deg, #9731CE 1.22%, #7B3FE3 99.46%), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))",
// },
// {
// 	logo: "/icons/chains/gnosis.svg",
// 	name: "Gnosis",
// 	id: 100,
// 	color: "#047A5B",
// },
// {
// 	logo: "/icons/chains/avalanche.svg",
// 	name: "Avalanche",
// 	id: 43114,
// 	color: "#E84142",
// },
// {
// 	logo: "/icons/chains/fantom.svg",
// 	name: "Fantom",
// 	id: 146,
// 	color: "#1969FF",
// },
// {
// 	logo: "/icons/chains/kaia.svg",
// 	name: "Kaia",
// 	id: 8217,
// 	color: "#BFF007",
// },
// {
// 	logo: "/icons/chains/aurora.svg",
// 	name: "Aurora",
// 	id: 1313161554,
// 	color: "#1A373D",
// },

export const ARBITRUM_SEPOLIA_CHAIN_ID = 421614 as const;
export const ARBITRUM_CHAIN_ID = 42161 as const;
export const ARBITRUM_RPC = "https://arb1.arbitrum.io/rpc";

export const UNI_FEES = [100, 500, 3000, 10000];

export const MAX_FEE_PER_GAS = 100000000000;
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000;

export const wETH_ADDRESS = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";

export const ARBITRUM_TOKENS: Token[] = [
	{
		name: "Tether USDt",
		symbol: "USDT",
		address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
		description:
			"Tether USDt (USDT) is a cryptocurrency and operates on the Ethereum platform. Tether USDt has a current supply of 141,576,929,750.81678524 with 138,937,765,636.77655689 in circulation. The last known price of Tether USDt is 1.0000492 USD and is up 0.06 over the last 24 hours. It is currently trading on 114550 active market(s) with $159,794,126,209.99 traded over the last 24 hours. More information can be found at https://tether.to.",
		logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
		tags: ["stablecoin", "asset-backed-stablecoin", "ethereum-ecosystem"],
		priceFeedType: "UniswapV3",
		priceFeedAddress: "0x3f3f5dF88dC9F13eac63DF89EC16ef6e7E25DdE7",
		chainId: ARBITRUM_CHAIN_ID,
	},
	{
		name: "USDC",
		symbol: "USDC",
		address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
		logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
		tags: ["stablecoin", "asset-backed-stablecoin", "ethereum-ecosystem"],
		priceFeedType: "UniswapV3",
		priceFeedAddress: "0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3",

		description:
			"USDC (USDC) is a cryptocurrency and operates on the Ethereum platform. USDC has a current supply of 52,018,652,352.2424801. The last known price of USDC is 1.00006168 USD and is up 0.01 over the last 24 hours. It is currently trading on 25132 active market(s) with $18,939,362,023.57 traded over the last 24 hours. More information can be found at https://www.usdc.com/.",
		chainId: ARBITRUM_CHAIN_ID,
	},
	{
		name: "Chainlink",
		symbol: "LINK",
		address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
		logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
		tags: ["oracles", "ethereum-ecosystem", "defi"],
		priceFeedType: "Chainlink",
		priceFeedAddress: "0x86E53CF1B870786351Da77A57575e79CB55812CB",

		description:
			"Chainlink (LINK) is a cryptocurrency and operates on the Ethereum platform. Chainlink has a current supply of 1,000,000,000 with 638,099,970.45278671 in circulation. The last known price of Chainlink is 26.25026348 USD and is up 7.82 over the last 24 hours. It is currently trading on 1921 active market(s) with $1,260,823,962.73 traded over the last 24 hours. More information can be found at https://chain.link/.",
		chainId: ARBITRUM_CHAIN_ID,
	},
	{
		name: "Uniswap",
		symbol: "UNI",
		address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
		logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
		tags: ["decentralized-exchange-dex-token", "defi", "ethereum-ecosystem"],
		priceFeedType: "UniswapV3",
		priceFeedAddress: "0x9C917083fDb403ab5ADbEC26Ee294f6EcAda2720",

		description:
			"Uniswap (UNI) is a cryptocurrency launched in 2020 and operates on the Ethereum platform. Uniswap has a current supply of 1,000,000,000 with 600,518,037.71 in circulation. The last known price of Uniswap is 12.96270404 USD and is up 2.85 over the last 24 hours. It is currently trading on 1160 active market(s) with $283,056,821.58 traded over the last 24 hours. More information can be found at https://uniswap.org/blog/uni/.",
		chainId: ARBITRUM_CHAIN_ID,
	},
	{
		name: "Ethena USDe",
		symbol: "USDe",
		address: "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
		logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/29470.png",
		tags: ["stablecoin", "asset-backed-stablecoin", "ethereum-ecosystem"],
		priceFeedType: "UniswapV3",
		priceFeedAddress: "0x88AC7Bca36567525A866138F03a6F6844868E0Bc",

		description:
			"Ethena USDe (USDe) is a cryptocurrency and operates on the Ethereum platform. Ethena USDe has a current supply of 5,759,075,046.03073935. The last known price of Ethena USDe is 0.99962019 USD and is up 0.04 over the last 24 hours. It is currently trading on 99 active market(s) with $110,753,883.19 traded over the last 24 hours. More information can be found at https://www.ethena.fi/.",
		chainId: ARBITRUM_CHAIN_ID,
	},
	{
		name: "Dai",
		symbol: "DAI",
		address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
		logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png",
		tags: ["stablecoin", "defi", "ethereum-ecosystem"],
		priceFeedType: "UniswapV3",
		priceFeedAddress: "0xc5C8E77B397E531B8EC06BFb0048328B30E9eCfB",

		description:
			"Dai (DAI) is a cryptocurrency and operates on the Ethereum platform. Dai has a current supply of 5,365,382,702.664872. The last known price of Dai is 1.00008069 USD and is up -0.00 over the last 24 hours. It is currently trading on 3451 active market(s) with $357,346,642.60 traded over the last 24 hours. More information can be found at https://makerdao.com/.",
		chainId: ARBITRUM_CHAIN_ID,
	},
	{
		name: "Arbitrum",
		symbol: "ARB",
		address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
		logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png",
		tags: ["layer-2", "ethereum-ecosystem", "scaling"],
		priceFeedType: "UniswapV3",
		priceFeedAddress: "0xb2A824043730FE05F3DA2efaFa1CBbe83fa548D6",

		description:
			"Arbitrum (ARB) is a cryptocurrency launched in 2023and operates on the Ethereum platform. Arbitrum has a current supply of 10,000,000,000 with 4,343,862,574 in circulation. The last known price of Arbitrum is 0.72837254 USD and is up 4.87 over the last 24 hours. It is currently trading on 1084 active market(s) with $424,524,808.04 traded over the last 24 hours. More information can be found at https://arbitrum.foundation.",
		chainId: ARBITRUM_CHAIN_ID,
	},
	{
		name: "Bonk",
		symbol: "BONK",
		address: "0x09199d9a5f4448d0848e4395d065e1ad9c4a1f74",
		logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
		tags: ["memes", "ethereum-ecosystem"],
		priceFeedType: "UniswapV3",
		priceFeedAddress: "0xb2A824043730FE05F3DA2efaFa1CBbe83fa548D6",

		description:
			"Bonk (BONK) is a cryptocurrency launched in 2022and operates on the Ethereum platform. Bonk has a current supply of 90,929,338,276,993.890625 with 76,501,895,208,872.0625 in circulation. The last known price of Bonk is 0.00003125 USD and is up 0.98 over the last 24 hours. It is currently trading on 648 active market(s) with $376,437,900.56 traded over the last 24 hours. More information can be found at https://www.bonkcoin.com/.",
		chainId: ARBITRUM_CHAIN_ID,
	},
	{
		name: "Lido DAO",
		symbol: "LDO",
		address: "0x13Ad51ed4F1B7e9Dc168d8a00cB3f4dDD85EfA60",
		logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png",
		tags: ["defi", "dao", "ethereum-ecosystem"],
		priceFeedType: "UniswapV3",
		priceFeedAddress: "0xA43A34030088E6510FecCFb77E88ee5e7ed0fE64",

		description:
			"Lido DAO (LDO) is a cryptocurrency and operates on the Ethereum platform. Lido DAO has a current supply of 1,000,000,000 with 896,046,961.4578881 in circulation. The last known price of Lido DAO is 2.04695475 USD and is up 15.19 over the last 24 hours. It is currently trading on 486 active market(s) with $252,393,522.11 traded over the last 24 hours. More information can be found at https://lido.fi/.",
		chainId: ARBITRUM_CHAIN_ID,
	},
	{
		name: "The Graph",
		symbol: "GRT",
		address: "0x9623063377AD1B27544C965cCd7342f7EA7e88C7",
		logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png",
		tags: ["indexing", "ethereum-ecosystem", "web3"],
		priceFeedType: "UniswapV3",
		priceFeedAddress: "0x0F38D86FceF4955B705F35c9e41d1A16e0637c73",

		description:
			"The Graph (GRT) is a cryptocurrency launched in 2018 and operates on the Ethereum platform. The Graph has a current supply of 10,799,706,720.163599 with 9,548,531,509.165474 in circulation. The last known price of The Graph is 0.1930909 USD and is up 2.15 over the last 24 hours. It is currently trading on 531 active market(s) with $110,488,070.84 traded over the last 24 hours. More information can be found at https://thegraph.com.",
		chainId: ARBITRUM_CHAIN_ID,
	},
	{
		name: "Curve DAO Token",
		symbol: "CRV",
		priceFeedAddress: "0xaebDA2c976cfd1eE1977Eac079B4382acb849325",
		address: "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978",
		logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/6538.png",
		tags: ["defi", "dao", "ethereum-ecosystem"],
		priceFeedType: "UniswapV3",
		description:
			"Curve DAO Token (CRV) is a cryptocurrency and operates on the Ethereum platform. Curve DAO Token has a current supply of 2,218,387,353.03091831 with 1,273,339,453 in circulation. The last known price of Curve DAO Token is 0.80452328 USD and is up 5.47 over the last 24 hours. It is currently trading on 806 active market(s) with $218,988,363.74 traded over the last 24 hours. More information can be found at https://www.curve.fi/.",
		chainId: ARBITRUM_CHAIN_ID,
	},
] as const;
