import type { Address } from "viem";
import { api } from "./api";
import type {
	CandleDataRequest,
	MultipoolInfo,
	ShortMultipoolData,
} from "./types";

export async function GetAssets() {
	return await api.get("/assets/list");
}

export async function GetMultipools(
	chain_id: number,
): Promise<ShortMultipoolData[]> {
	return await api.get("/portfolio/list", { chain_id: chain_id });
}

export async function GetMultipoolChartData(params: {
	to: number;
	countback: number;
	resolution: string;
	multipool_address: Address;
	chain_id: number;
}): Promise<CandleDataRequest> {
	return await api.get("/charts/history", params);
}

export async function GetMultipoolInfo(params: {
	multipool_address: Address;
}): Promise<MultipoolInfo> {
	return await api.get("/portfolio", params);
}
