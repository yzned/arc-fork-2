import type BigNumber from "bignumber.js";
import type { Address } from "viem";

export type priceFeedType =
	| "UniswapV3"
	| "UniswapV2"
	| "Chainlink"
	| "FixedPrice"
	| "RedStone";

export enum queryKeys {
	multipoolsList = "multipoolsList",
	multipoolsChart = "multipoolChart",
	tokensList = "tokensList",
}

export interface CandleDataRequest {
	t: string; // time: string;
	o: string; // open: number;
	h: string; // high: number;
	l: string; // low: number;
	c: string; // close: number;
}

export interface CandleDataFormated {
	time: number; // time: string[];
	open: number; // open: number;
	high: number; // high: number;
	low: number; // low: number;
	close: number; // close: number;
}

export interface LinearDataFormated {
	time: number;
	value: number;
}

// stats
// :
// {c: "0", cc: null, h: "0", l: "0", n: "TEST_ETF", o: "0", pc: null, s: "tETF", t: "0"}
// c
// :
// "0"
// cc
// :
// null
// h
// :
// "0"
// l
// :
// "0"
// n
// :
// "TEST_ETF"
// o
// :
// "0"
// pc
// :
// null
// s
// :
// "tETF"
// t
// :
// "0"

// export interface ShortMultipoolData {
// 	logo?: string;
// 	name: string;
// 	symbol: string;
// 	description: string;
// 	chain_id: number;
// 	multipool: string;
// 	change_24h: string;
// 	low_24h: string;
// 	high_24h: string;
// 	current_price: string;
// 	total_supply: string;
// }

export interface Price {
	timestamp: number;
	value: string | null;
}

// cache: {
// 	assets: MultipoolAsset[];
// 	base_fee: number;
// 	cashback_fee: number;
// 	chain_id: number;
// 	contract_address: string;
// 	deviation_increase_fee: number;
// 	deviation_limit: number;
// 	initial_share_price: string;
// 	management_fee: number;
// 	management_fee_receiver: string;
// 	oracle_address: string;
// 	owner: string;
// 	strategy_manager: string;
// 	total_supply: string;
// 	total_target_shares: number;
// };

export interface ShortMultipoolData {
	a?: string; //address
	s: {
		c?: number; //current_price
		cc?: number; //current_candle
		h?: string; // high
		n?: string; //name
		o?: string; /// open
		pc?: string; // previous_candle
		s?: string; //symbol
		t?: string; //total_suply
	};
}
export interface ShortMultipoolDataFormated {
	address?: string;
	stats: {
		currentPrice?: number;
		currentCandle?: number;
		high?: string;
		name?: string;
		open?: string;
		previousCandle?: string;
		symbol?: string;
		totalSuply?: string;
	};

	tvl?: string;
	absolutePriceChange?: string;
	relativePriceChange?: string;
	logo?: string;
}

export interface OnchainMultipoolAssetInfo {
	result?: {
		quantity: bigint;
		targetShare: bigint;
		collectedCashbacks: bigint;
		isUsed: boolean;
	};
	status: "success" | "failure" | "pending";
	error?: Error;
}

export interface OnchainMultipoolAssetPriceInfo {
	result?: bigint;
	status: "success" | "failure" | "pending";
	error?: Error;
}

export interface AvailableChainTokensData {
	n?: string; //name
	s?: string; //symbol
	a?: string; //address
	l?: string; //logo
	cm?: string; //cmc
	cg?: string; //coingecko
	t?: number[]; //tags
}

export interface AvailableChainTokensDataFormated {
	name?: string; //name
	symbol?: string; //symbol
	address?: string; //address
	logo?: string; //logo
	cmc?: string; //cmc
	coingecko?: string; //coingecko
	tags?: string[]; //tags

	quantityOnWallet?: BigNumber;
	price?: BigNumber;
	poolAddress?: Address;
	priceFeedType?: priceFeedType;
}
