import type { Address } from "viem";
import { api } from "./api";

import type {
	AvailableChainTokensData,
	CandleDataRequest,
	CandleDataRequestStats,
	Metadata,
	PositionHistoryResponce,
	PositionsResponse,
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

export async function GetMultipoolInfo(params: {
	multipoolAddresses: Address[];
}): Promise<Metadata[]> {
	return await api.getMsgpack("/portfolio/metadata", {
		m: params.multipoolAddresses,
	});
}

/**
 * Retrieves the positions associated with a specific user address.
 *
 * Each position object contains:
 * - multipool: The address of the multipool.
 * - q: PnL absolute in native token (string).
 * - p: PnL percent (string).
 * - o: Open position price (number).
 * - c: Close position price (number).
 *
 * @param params - An object containing the user's address.
 * @param params.userAddress - The address of the user whose positions are to be fetched.
 * @returns A promise that resolves to an array of user's positions data from the API.
 */
export async function GetPositions({
	userAddress,
}: {
	userAddress: Address;
}): Promise<PositionsResponse> {
	return await api.getMsgpack("/account/positions", {
		a: userAddress,
	});
}

/**
 * Retrieves the historical positions for a given user address.
 *
 * @param params - An object containing the user's address.
 * @param params.userAddress - The address of the user whose positions history is to be fetched.
 * @returns A promise resolving to an array of position history objects, each containing:
 * - `m`: Multipool address.
 * - `q`: Multipool share quantity.
 * - `p`: Profit.
 * - `l`: Loss.
 * - `o`: Open time.
 *
 * The API request maps the `userAddress` to the `a` query parameter.
 */
export async function GetPositionsHistory({
	userAddress,
}: {
	userAddress: Address;
}): Promise<PositionHistoryResponce> {
	return await api.getMsgpack("/account/positions_history", {
		a: userAddress,
	});
}

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
