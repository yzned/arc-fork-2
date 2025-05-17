import ArDB from "ardb";
import Arweave from "arweave";

export const arweave = Arweave.init({
	host: "arweave.net",
	port: 443,
	protocol: "https",
	timeout: 20000,
	logging: false,
});
export const ardb = new ArDB(arweave);
