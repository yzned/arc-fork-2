import { GetMultipools } from "@/api/explore";
import { queryKeys } from "@/api/types";
import { ardb, arweave } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { formatUnits } from "viem";
import { useChainId } from "wagmi";

export async function getMultipoolsList(chainId?: number) {
	const txs = await ardb
		.search("transactions")
		.tag("Content-Type", "MpData")
		.limit(100)
		.find();
	const txData = txs.map((tx) => {
		//@ts-ignore
		const descOffset = tx._tags[3].value;
		//@ts-ignore
		const imageOffset = tx._tags[4].value;
		return {
			txId: tx.id,
			descOffset,
			imageOffset,
		};
	});
	const ardbData = await processMultipleArweaveData(txData);
	const shortData = await GetMultipools(chainId || 42161);
	const data = shortData?.map((item) => {
		const twoPow96 = new BigNumber(2).pow(96);
		const formattedCurrentPrice = new BigNumber(item?.s.c?.toString() || 0)
			.div(twoPow96)
			.toString();
		const t = new BigNumber(item.s.t || "0");
		const c = new BigNumber(item.s.c?.toString() || "0");
		const tvlRaw = t.multipliedBy(c).div(twoPow96);
		const tvl = formatUnits(BigInt(tvlRaw.toNumber()), 18);
		const absolutePriceChange = new BigNumber(item?.s?.c || 0)
			.minus(new BigNumber(item?.s?.o || 0).div(twoPow96))
			.toString();
		const relativePriceChange = new BigNumber(item?.s?.o || "0").isZero()
			? "0"
			: new BigNumber(absolutePriceChange)
					.multipliedBy(100)
					.dividedBy(new BigNumber(item.s.o || 1))
					.toString();
		const ardbItem = ardbData.find(
			(ardbItem) => ardbItem.mpAddress.toLowerCase() === item?.a?.toLowerCase(),
		);
		return {
			address: item.a,
			stats: {
				currentPrice: Number(formattedCurrentPrice),
				currentCandle: item.s.cc,
				high: item.s.h,
				name: item.s.n,
				open: item.s.o,
				previousCandle: item.s.pc,
				symbol: item.s.s,
				totalSuply: item.s.t,
			},
			tvl,
			absolutePriceChange,
			relativePriceChange,
			logo: ardbItem?.logo,
		};
	});
	return data;
}

export const useMultipoolsList = () => {
	const chainId = useChainId();

	return useQuery({
		queryKey: [queryKeys.multipoolsList, chainId],
		queryFn: async () => {
			return await getMultipoolsList(chainId);
		},
		enabled: !!chainId,
	});
};

export async function processMultipleArweaveData(
	txData: Array<{
		txId: string;
		descOffset: number;
		imageOffset: number;
	}>,
) {
	const transactions = await Promise.all(
		txData.map(({ txId }) => arweave.transactions.get(txId)),
	);

	return transactions.map((transaction, index) => {
		const { descOffset, imageOffset } = txData[index];
		const addressEncoded = Uint8Array.from(
			atob(transaction?.tags[1]?.value),
			(c) => c.charCodeAt(0),
		);

		const name = new TextDecoder("utf-8").decode(
			transaction.data.slice(0, descOffset),
		);

		const description = new TextDecoder("utf-8").decode(
			transaction.data.slice(descOffset, imageOffset),
		);

		const mpAddress = new TextDecoder("utf-8").decode(addressEncoded);

		const logoBytes = transaction.data.slice(imageOffset);
		//@ts-ignore
		const binaryString = String.fromCharCode.apply(null, logoBytes);
		const base64ImageString = window.btoa(binaryString);
		const logo = `data:image/png;base64,${base64ImageString}`;

		return {
			description,
			name,
			logo,
			mpAddress,
		};
	});
}
