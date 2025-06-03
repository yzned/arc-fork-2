import type { AvailableChainTokensDataFormated } from "@/api/types";
import type BigNumber from "bignumber.js";
import type { Address, Chain } from "viem";

export type ChainId = 42161 | 421614 | 10143;
//after backend will be created change types to correct
export interface Token {
	name?: string;
	symbol?: string;
	address: Address;
	description?: string;
	decimals?: number;
	logo?: string;
	tags?: string[];
	links?: string[];
	creationId?: string;
	chainId?: 1 | 42161 | 421614;
	priceFeedType?:
		| "UniswapV3"
		| "UniswapV2"
		| "Chainlink"
		| "FixedPrice"
		| "RedStone";
	quantity?: string;
	share?: string;
	targetShare?: string;
	currentShare?: string;
	current_price?: string;
	price?: string;
	txnLink?: string;
	priceFeedAddress?: Address;
	poolAddress?: string;
}

export interface Category {
	name: string;
	tokens: string[];
	share: number;
	selectToken?: AvailableChainTokensDataFormated | null;
}
export interface Template {
	name?: string;
	description?: string;
	categories?: Category[];
}
export interface ChainMetadata {
	logo: string;
	name: string;
	id: number;
	color: string;
	nativeTokenAddress: Address;
	traderAddress?: string;
	mpImplAddress: string;
	oracleAddress: string;
	factoryAddress: Address;
	factoryImplAddress: string;
	routerAddress: Address;
	uniswapV3FactoryAddress?: string;
	uniswapQuoterAddress: Address;

	availableTokens?: AvailableChainTokensDataFormated[];
	creationTemplates?: Template[];

	blockExplorers?: {
		[key: string]: {
			name: string;
			url: string;
		};
	};

	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
}

export type ExtendedChain = Chain & Partial<ChainMetadata>;

export interface ShortPoolData {
	priceFeedType?: string;
	poolAddress: string;
	liquidity?: string;
	fee: number;
	price?: string;
}

export interface BalancesToken {
	logo?: string;
	symbol?: string;
	quantityOnWallet?: BigNumber;
	priceFeedAddress?: Address;
	price?: BigNumber;
	address?: Address;
}

export interface UniswapPriceData {
	0: bigint; // roundId
	1: bigint; // answer
	2: bigint; // startedAt
	3: bigint; // updatedAt
	4: bigint; // answeredInRound
}

export interface TokenPriceData {
	address: Address;
	price: bigint;
}

export interface SetupToken {
	id: string;
	name: string;
	symbol: string;
	address?: Address;
	logo?: string;
	priceFeedType?: string;

	creationState?: "new" | "edited" | "readed" | "deleted";
	targetShare?: string;
	share?: string;
	shareGrowing?: number;
	poolAddress?: string;
	decimals?: number;
}

export interface OnChainResultAssetInformation {
	collectedCashbacks: bigint;
	isUsed: boolean;
	quantity: bigint;
	targetShare: bigint | number;
}

export interface MultipoolSuplyChangelyPriceData {
	tvl: BigNumber;
	absolute24hPriceChange: BigNumber;
	relative24hPriceChange: BigNumber;
	open?: BigNumber;
	close?: BigNumber;
	price?: BigNumber;
}

export interface PorfolioAsset {
	image?: string;
	symbol?: string;
	address: Address;
	quantity: string;
	price?: string;
	decimal?: number;
	currentShare: string;
	priceFeedData?: string;
	targetShare: number;
	poolAddress?: string;
}

export type AssetData = [boolean, bigint, bigint, bigint];
