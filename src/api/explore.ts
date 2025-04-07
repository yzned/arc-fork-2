import type { Address } from "viem";
import { api } from "./api";
import type { CandleDataRequest, ShortMultipoolData } from "./types";

export async function GetAssets() {
	return await api.get("/assets/list");
}

export async function GetMulpipools(): Promise<ShortMultipoolData[]> {
	return await api.get("/portfolio/list");
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
