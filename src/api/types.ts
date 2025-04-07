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
export type CandleDataRequest = {
	t: string[]; // time: string[];
	o: string[]; // open: number;
	h: string[]; // high: number;
	l: string[]; // low: number;
	c: string[]; // close: number;
};

export type CandleDataFormated = {
	time: number; // time: string[];
	open: number; // open: number;
	high: number; // high: number;
	low: number; // low: number;
	close: number; // close: number;
};

export type LinearDataFormated = {
	time: number;
	value: number;
};

export type ShortMultipoolData = {
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
};
