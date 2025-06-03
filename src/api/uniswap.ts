import ERC20 from "@/lib/abi/ERC20";
import IUniswapV3PoolABI from "@/lib/abi/IUniswapV3Pool";
import { UNI_FEES } from "@/lib/constants";
import { config } from "@/main";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount, Pool, computePoolAddress } from "@uniswap/v3-sdk";
import BigNumber from "bignumber.js";
import type { Abi, Address } from "viem";
import { getPublicClient } from "wagmi/actions";

export interface Calls {
	data: string;
	to: string;
	value: string;
	asset: Address;
	amountOut: BigNumber;
	note: string;
}

export const Same = (a: Address | string, b: Address | string): boolean => {
	return a.toLocaleLowerCase() === b.toLocaleLowerCase();
};

export const getPoolsData = async (
	addressA: Address,
	addressB: Address,
	factoryAddress: Address,
) => {
	const client = getPublicClient(config);
	if (!client) {
		throw new Error("Client is not initialized");
	}

	const resultPools: Array<Pool> = [];

	const decimals = await getDecimals({ addresses: [addressA, addressB] });

	const tokenA = new Token(client.chain.id, addressA, decimals[0]);
	const tokenB = new Token(client.chain.id, addressB, decimals[1]);

	const poolAddresses = UNI_FEES.map((fee) =>
		computePoolAddress({
			factoryAddress,
			tokenA,
			tokenB,
			fee,
		}),
	);

	const [contracts] = [
		poolAddresses.map((address) => [
			{
				address: address as Address,
				abi: IUniswapV3PoolABI,
				functionName: "token0",
			},
			{
				address: address as Address,
				abi: IUniswapV3PoolABI,
				functionName: "token1",
			},
			{
				address: address as Address,
				abi: IUniswapV3PoolABI,
				functionName: "fee",
			},
			{
				address: address as Address,
				abi: IUniswapV3PoolABI,
				functionName: "liquidity",
			},
			{
				address: address as Address,
				abi: IUniswapV3PoolABI,
				functionName: "slot0",
			},
		]),
	];

	const rawResult = await client.multicall({
		contracts: contracts.flat(),
	});

	for (let i = 0; i < rawResult.length; i += 5) {
		const poolData = {
			token0: rawResult[i].result as Address,
			token1: rawResult[i + 1].result as Address,
			fee: rawResult[i + 2].result as bigint,
			liquidity: rawResult[i + 3].result as bigint,
			slot0: rawResult[i + 4].result as [
				bigint,
				number,
				number,
				number,
				number,
				number,
				boolean,
			],
		};

		if (poolData.token0 && poolData.token1 && poolData.slot0) {
			const tick = poolData.slot0[1];
			const sqrtPriceX96 = poolData.slot0[0].toString();

			const decimals = await getDecimals({
				addresses: [poolData.token0, poolData.token1],
			});

			const token0Asset: Token = new Token(
				client.chain.id,
				poolData.token0.toString(),
				Number(decimals[0]),
			);
			const token1Asset: Token = new Token(
				client.chain.id,
				poolData.token1.toString(),
				Number(decimals[1]),
			);

			const pool = new Pool(
				token0Asset,
				token1Asset,
				Number(poolData.fee) ?? FeeAmount.LOW,
				sqrtPriceX96,
				poolData.liquidity?.toString() || "0",
				tick,
			);

			resultPools.push(pool);
		}
	}

	return resultPools;
};

export const getDecimals = async ({ addresses }: { addresses: Address[] }) => {
	const client = getPublicClient(config);
	if (!client) {
		throw new Error("Client is not initialized");
	}

	const decimals = await client.multicall({
		contracts: addresses.map((address) => ({
			address: address as Address,
			abi: ERC20 as Abi,
			functionName: "decimals",
		})),
	});

	const decimalsResult = decimals.map((item) => {
		return item.result as number;
	});

	return decimalsResult;
};

export const priceInNativeToken = (
	sqrtPriceX96: bigint,
	token0Decimals: number,
	token1Decimals: number,
) => {
	const q96 = new BigNumber(2).pow(96);

	const price = new BigNumber(sqrtPriceX96.toString())
		.pow(2)
		.multipliedBy(new BigNumber(10).pow(token1Decimals))
		.div(q96.pow(2))
		.div(new BigNumber(10).pow(token0Decimals));

	const priceInNative = new BigNumber(1).div(price);

	return Number.parseFloat(priceInNative.toString());
};

export const getSwapCount = async (poolAddress: string): Promise<number> => {
	const client = getPublicClient(config);
	if (!client) {
		throw new Error("Client is not initialized");
	}

	const latestBlock = await client.getBlockNumber();
	const latestBlockData = await client.getBlock({
		blockNumber: latestBlock,
	});

	const oneDayAgoTimestamp = latestBlockData.timestamp - BigInt(86400);

	let low = latestBlock - BigInt(50000);
	let high = latestBlock;
	let startBlock = low;

	while (low <= high) {
		const mid = low + (high - low) / BigInt(2);
		const midBlock = await client.getBlock({ blockNumber: mid });

		if (midBlock.timestamp < oneDayAgoTimestamp) {
			low = mid + BigInt(1);
		} else {
			startBlock = mid;
			high = mid - BigInt(1);
		}
	}

	const swapEvents = await client.getContractEvents({
		address: poolAddress as Address,
		abi: IUniswapV3PoolABI,
		eventName: "Swap",
		fromBlock: startBlock,
		toBlock: latestBlock,
	});

	return swapEvents.length;
};

export const isGoodPool = async (poolAddress: string): Promise<boolean> => {
	const client = getPublicClient(config);
	if (!client) {
		throw new Error("Client is not initialized");
	}

	const code = await client.getCode({
		address: poolAddress as Address,
	});

	const swapsCount = await getSwapCount(poolAddress);

	return code !== "0x" && swapsCount > 1;
};
