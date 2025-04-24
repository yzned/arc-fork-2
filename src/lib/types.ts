import type BigNumber from "bignumber.js";
import type { Address, Chain } from "viem";

export type ChainId = 42161 | 421614 | 10143;
//after backend will be created change types to correct
export type Token = {
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
};

export type ChainMetadata = {
	logo: string;
	id: number;
	color: string;
	nativeTokenAddress: string;
	traderAddress?: string;
	mpImplAddress?: string;
	oracleAddress?: string;
	factoryAddress?: string;
	factoryImplAddress?: string;
	routerAddress?: string;
};

export type ExtendedChain = Chain & Partial<ChainMetadata>;

export type ShortPoolData = {
	priceFeedType?: string;
	poolAddress: string;
	liquidity?: string;
	fee: number;
};

export type BalancesToken = {
	logo?: string;
	symbol?: string;
	quantityOnWallet?: BigNumber;
	priceFeedAddress?: Address;
	price?: BigNumber;
	address?: Address;
};

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
	priceFeedType?:
		| "UniswapV3"
		| "UniswapV2"
		| "Chainlink"
		| "FixedPrice"
		| "RedStone";

	creationState?: "new" | "edited" | "readed" | "deleted";
	share?: string;
	shareGrowing?: number;
	poolAddress?: string;
}
