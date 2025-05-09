import type { Address } from "viem";
import { api } from "./api";

import type {
	AvailableChainTokensData,
	CandleDataRequest,
	CandleDataRequestStats,
	ShortMultipoolData,
} from "./types";

export async function GetAssets() {
	return await api.get("/assets/list");
}

export async function GetMultipools(
	chain_id: number,
): Promise<ShortMultipoolData[]> {
	return await api.getMsgpack("/portfolio/list", { chain_id: chain_id });
}

export async function GetMultipoolChartData(params: {
	// t - time from which to count back (inclusive)
	// c - countback (number of candles)
	// r - resolution (1 from [60, 900, 3600, 86400] )
	// m - multipool address
	r?: number;
	t?: string;
	m?: Address;
	c?: number;
}): Promise<CandleDataRequest[]> {
	return await api.getMsgpack("/portfolio/candles", params);
}

export async function GetMultipoolChartStats(params: {
	// t - time from which to count back (inclusive)
	// r - resolution (1 from [60, 900, 3600, 86400] )
	// m - multipool address
	r?: number;
	t?: string;
	m?: Address;
}): Promise<CandleDataRequestStats> {
	return await api.getMsgpack("/portfolio/stats", params);
}

// export async function GetMultipoolInfo(params: {
// 	multipool_address: Address;
// 	chain_id: number;
// }): Promise<MultipoolInfo> {
// 	return await api.get("/portfolio", params);
// }

export async function GetTokens({
	chainId,
}: {
	chainId: number;
}): Promise<AvailableChainTokensData[]> {
	const url = `https://token-list.arcanum.to/${chainId}.json`;

	const response = await fetch(url);
	const data = await response.json();

	return data;
}
