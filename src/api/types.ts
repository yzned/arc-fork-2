export enum queryKeys {
	multipoolsList = "multipoolsList",
	multipoolsChart = "multipoolChart",
}

// export type ShortMultipoolData = {
// 	name: "MP";
// 	symbol: "MPMP";
// 	description: "asdsaf";
// 	chain_id: 421614;
// 	multipool: "0x46489e10e6e78eafe087fde1bc74e745182a2eab";
// 	change_24h: "10";
// 	low_24h: "5";
// 	high_24h: "250";
// 	current_price: "14.2200";
// 	total_supply: "1000000";
// };
export interface CandleDataRequest {
	t: string[]; // time: string[];
	o: string[]; // open: number;
	h: string[]; // high: number;
	l: string[]; // low: number;
	c: string[]; // close: number;
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

export interface ShortMultipoolData {
	logo?: string;
	name: string;
	symbol: string;
	description: string;
	chain_id: number;
	multipool: string;
	change_24h: string;
	low_24h: string;
	high_24h: string;
	current_price: string;
	total_supply: string;
}

export interface Price {
	timestamp: number;
	value: string | null;
}

export interface MultipoolAsset {
	symbol?: string;
	address: string;
	collected_cashbacks: string;
	price?: Price;
	price_data: string;
	quantity: string;
	share: number;
}

export interface MultipoolInfo {
	cache: {
		assets: MultipoolAsset[];
		base_fee: number;
		cashback_fee: number;
		chain_id: number;
		contract_address: string;
		deviation_increase_fee: number;
		deviation_limit: number;
		initial_share_price: string;
		management_fee: number;
		management_fee_receiver: string;
		oracle_address: string;
		owner: string;
		strategy_manager: string;
		total_supply: string;
		total_target_shares: number;
	};
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
