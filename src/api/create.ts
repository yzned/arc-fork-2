import { api } from "./api";

export async function CreateMultipool({
	chain_id,
	name,
	description,
	logo,
	multipool_address,
	symbol,
}: {
	logo?: File | Blob;
	name: string;
	chain_id: number;
	symbol: string;
	description: string;
	multipool_address: string;
}) {
	const formData = new FormData();

	if (logo) formData.append("logo", logo);

	formData.append("chain_id", chain_id.toString());
	formData.append("name", name);
	formData.append("description", description);
	formData.append("multipool_address", multipool_address);
	formData.append("symbol", symbol);

	return await api.postFormData("/portfolio/create", formData);
}
