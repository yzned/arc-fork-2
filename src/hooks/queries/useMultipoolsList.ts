import { GetMultipoolInfo, GetMultipools } from "@/api/explore";
import { queryKeys } from "@/api/types";
import Multipool from "@/lib/abi/Multipool";
import { arweave } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import type { Address, PublicClient } from "viem";
import { useChainId, usePublicClient } from "wagmi";

export async function getMultipoolsList(
	client: PublicClient,
	chainId?: number,
) {
	// const txs = await ardb
	// 	.search("transactions")
	// 	.tag("Content-Type", "MpData")
	// 	.limit(100)
	// 	.find();

	// const txData = txs.map((tx) => {
	// 	// @ts-ignore
	// 	const descOffset = tx._tags[3].value;
	// 	// @ts-ignore
	// 	const imageOffset = tx._tags[4].value;
	// 	return {
	// 		txId: tx.id,
	// 		// @ts-ignore
	// 		tags: tx._tags,
	// 		descOffset,
	// 		imageOffset,
	// 	};
	// });

	// const ardbItem = ardbData.find(
	// 	(ardbItem) => ardbItem.mpAddress.toLowerCase() === item?.a?.toLowerCase(),
	// );

	// const ardbData = await processMultipleArweaveData(txData);

	const shortData = await GetMultipools(chainId || 42161);

	const multipoolAddresses = shortData.map(
		({ a }) => a?.toLowerCase() as Address,
	);

	const metadata = await GetMultipoolInfo({
		multipoolAddresses,
	});

	console.log("metadata: ", metadata);

	const data = shortData.map((item) => {
		const twoPow96 = new BigNumber(2).pow(96);

		const close = new BigNumber(item.s.c?.toString() || "0").div(twoPow96);
		const open = new BigNumber(item.s.o?.toString() || "0").div(twoPow96);

		const totalSuply = new BigNumber(item.s.t || "0").div(twoPow96);

		const tvl = totalSuply.multipliedBy(close);

		const absolutePriceChange = close.minus(
			new BigNumber(item.s.o || 0).div(twoPow96),
		);

		const relativePriceChange = new BigNumber(
			open.isZero()
				? "0"
				: new BigNumber(absolutePriceChange)
						.multipliedBy(100)
						.dividedBy(close)
						.toString(),
		);
		const logo = metadata?.find(({ m }) => item.a === m.toLowerCase())?.l;

		return {
			address: item.a as Address,
			stats: {
				currentPrice: close.toNumber(),
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
			logo: logo ? `data:image/png;base64,${logo}` : "",
		};
	});

	// add decimals for each item
	const dataWithDecimals = await Promise.all(
		data.map(async (item) => {
			try {
				const decimals = await client.readContract({
					address: item.address as `0x${string}`,
					abi: Multipool,
					functionName: "decimals",
				});
				return {
					...item,
					decimals,
				};
			} catch {
				return {
					...item,
					decimals: 18, // default to 18 if error occurs
				};
			}
		}),
	);

	return dataWithDecimals;
}

export const useMultipoolsList = () => {
	const client = usePublicClient();
	if (!client) {
		throw new Error("Public client is not available");
	}
	const chainId = useChainId();

	return useQuery({
		queryKey: [queryKeys.multipoolsList, chainId],
		queryFn: async () => {
			return await getMultipoolsList(client, chainId);
		},
		enabled: !!chainId,
	});
};

export async function processMultipleArweaveData(
	txData: Array<{
		txId: string;
		descOffset: number;
		imageOffset: number;
		tags: Array<{
			name: string;
			value: string;
		}>;
	}>,
) {
	const transactionsData = await Promise.all(
		txData.map(({ txId }) => arweave.api.get(txId)),
	);
	const transactions = transactionsData.map((transaction, index) => {
		const { tags } = txData[index];
		return {
			data: transaction.data as string,
			tags,
		};
	});

	return transactions.map((transaction, index) => {
		const { descOffset, imageOffset } = txData[index];
		const address = transaction.tags[1].value;

		const data: ArrayBuffer = new TextEncoder().encode(transaction.data);

		const name = new TextDecoder("utf-8").decode(data.slice(0, descOffset));

		const description = new TextDecoder("utf-8").decode(
			data.slice(descOffset, imageOffset),
		);

		const logoBytes = data.slice(imageOffset);
		//@ts-ignore
		const binaryString = String.fromCharCode.apply(null, logoBytes);
		const base64ImageString = window.btoa(binaryString);
		const logo = `data:image/png;base64,${base64ImageString}`;

		return {
			description,
			name,
			logo,
			mpAddress: address,
		};
	});
}
