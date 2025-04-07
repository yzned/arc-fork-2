import { api } from "./api";

export async function CreateMultipool({
	chaid_id,
	name,
	description,
	logo,
	multipool_address,
	symbol,
}: {
	logo: string;
	name: string;
	chaid_id: number;
	symbol: string;
	description: string;
	multipool_address: string;
}) {
	return await api.post("/portfolio/create", {
		chaid_id,
		name,
		description,
		logo,
		multipool_address,
		symbol,
	});
}
