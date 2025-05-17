import ERC20 from "@/lib/abi/ERC20";
import { UNI_FEES } from "@/lib/constants";
// import { config } from "@/main";
import { Token } from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
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
	//@ts-ignore

	const client = getPublicClient(config);

	let poolAddresses: string[] = [];
	const resultPools: Array<Pool> = [];

	const decimals = await getDecimals({ addresses: [addressA, addressB] });

	const tokenA = new Token(client.chain.id, addressA, Number(decimals[0]));

	const tokenB = new Token(client.chain.id, addressB, Number(decimals[1]));

	UNI_FEES.map((fee) => {
		const currentPoolAddress = computePoolAddress({
			factoryAddress,
			tokenA,
			tokenB,
			fee,
		});

		poolAddresses = [...poolAddresses, currentPoolAddress];
	});

	const [contracts] = [
		poolAddresses.map((address) => [
			{
				address: address as Address,
				abi: IUniswapV3PoolABI.abi as Abi,
				functionName: "token0",
			},
			{
				address: address as Address,
				abi: IUniswapV3PoolABI.abi as Abi,
				functionName: "token1",
			},
			{
				address: address as Address,
				abi: IUniswapV3PoolABI.abi as Abi,
				functionName: "fee",
			},
			{
				address: address as Address,
				abi: IUniswapV3PoolABI.abi as Abi,
				functionName: "liquidity",
			},
			{
				address: address as Address,
				abi: IUniswapV3PoolABI.abi as Abi,
				functionName: "slot0",
			},
		]),
	];

	const rawResult = await client.multicall({
		contracts: contracts.flat(),
	});

	for (let i = 0; i < rawResult.length; i += 5) {
		const poolData = {
			token0:
				rawResult[i]?.status === "success" ? rawResult[i].result : undefined,
			token1:
				rawResult[i + 1]?.status === "success"
					? rawResult[i + 1].result
					: undefined,
			fee:
				rawResult[i + 2]?.status === "success"
					? rawResult[i + 2].result
					: undefined,
			liquidity:
				rawResult[i + 3]?.status === "success"
					? rawResult[i + 3].result
					: undefined,
			slot0:
				rawResult[i + 4]?.status === "success"
					? (rawResult[i + 4].result as number[])
					: undefined,
		};

		if (poolData.token0 && poolData.token1 && poolData.slot0) {
			const tick = poolData.slot0[1];

			const sqrtPriceX96 = poolData.slot0[0].toString();

			const decimals = await getDecimals({
				addresses: [poolData.token0 as Address, poolData.token1 as Address],
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

export const getDecimals = async ({ addresses }: { addresses?: Address[] }) => {
	//@ts-ignore

	const client = getPublicClient(config);

	try {
		const decimals = await client.multicall({
			contracts:
				addresses?.map((address) => ({
					address: address as Address,
					abi: ERC20 as Abi,
					functionName: "decimals",
				})) ?? [],
		});
		//@ts-ignore

		const decimalsResult = decimals.map((item) => {
			return item.result;
		});

		return decimalsResult;
	} catch (err) {
		console.error(err);
		return [];
	}
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
	//@ts-ignore
	const client = getPublicClient(config);

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
		abi: IUniswapV3PoolABI.abi,
		eventName: "Swap",
		fromBlock: startBlock,
		toBlock: latestBlock,
	});

	return swapEvents.length;
};

export const isGoodPool = async (poolAddress: string): Promise<boolean> => {
	//@ts-ignore
	const client = getPublicClient(config);

	const code = await client.getCode({
		address: poolAddress as Address,
	});

	const swapsCount = await getSwapCount(poolAddress);

	return code !== "0x" && swapsCount > 1;
};
export const getPoolData = async () => {};
// export const getPoolInfo = async (poolAddress: Address) => {
// 	const client = getPublicClient(config);

// 	const contracts = [
// 		{
// 			address: poolAddress,
// 			abi: IUniswapV3PoolABI.abi as Abi,
// 			functionName: "token0",
// 		},
// 		{
// 			address: poolAddress,
// 			abi: IUniswapV3PoolABI.abi as Abi,
// 			functionName: "token1",
// 		},
// 		{
// 			address: poolAddress,
// 			abi: IUniswapV3PoolABI.abi as Abi,
// 			functionName: "fee",
// 		},
// 		{
// 			address: poolAddress,
// 			abi: IUniswapV3PoolABI.abi as Abi,
// 			functionName: "liquidity",
// 		},
// 		{
// 			address: poolAddress,
// 			abi: IUniswapV3PoolABI.abi as Abi,
// 			functionName: "slot0",
// 		},
// 	];

// 	const rawResult = await client.multicall({ contracts });

// 	if (rawResult.some((res) => res.status !== "success")) {
// 		throw new Error("Ошибка получения данных пула");
// 	}

// 	const [token0, token1, fee, liquidity, slot0] = rawResult.map(
// 		(res) => res.result,
// 	);
// 	const slot0Number = slot0 as number[];

// 	if (!token0 || !token1 || !slot0) {
// 		throw new Error("Uncorrect pool data");
// 	}

// 	const tick = slot0Number[1];
// 	const sqrtPriceX96 = slot0Number[0].toString();

// 	const decimals = await getDecimals({
// 		addresses: [token0 as Address, token1 as Address],
// 	});

// 	const token0Asset: Token = new Token(
// 		ARBITRUM_SEPOLIA_CHAIN_ID,
// 		token0.toString(),
// 		Number(decimals[0]),
// 	);
// 	const token1Asset: Token = new Token(
// 		ARBITRUM_SEPOLIA_CHAIN_ID,
// 		token1.toString(),
// 		Number(decimals[1]),
// 	);

// 	const pool = new Pool(
// 		token0Asset,
// 		token1Asset,
// 		Number(fee) ?? FeeAmount.LOW,
// 		sqrtPriceX96,
// 		liquidity?.toString() || "0",
// 		tick,
// 	);

// 	return pool;
// };

// export const createPoolsRoute = async (
// 	addressIn: Address,
// 	addressOut: Address,
// ) => {
// 	const decimals = await getDecimals({ addresses: [addressIn, addressOut] });

// 	const tokenIn = new Token(
// 		ARBITRUM_SEPOLIA_CHAIN_ID,
// 		addressIn,
// 		Number(decimals[0]),
// 	);
// 	const tokenOut = new Token(
// 		ARBITRUM_SEPOLIA_CHAIN_ID,
// 		addressOut,
// 		Number(decimals[1]),
// 	);

// 	let directPoolAddress: string | undefined;

// 	for (const fee of UNI_FEES) {
// 		try {
// 			const poolAddress = Pool.getAddress(tokenIn, tokenOut, fee);
// 			const _isGoodPool = await isGoodPool(poolAddress);

// 			if (_isGoodPool) {
// 				directPoolAddress = poolAddress;
// 				const pool = await getPoolInfo(poolAddress as Address);

// 				const swapRoute = new Route([pool], tokenIn, tokenOut);

// 				return swapRoute;
// 			}
// 		} catch (e) {
// 			console.error(`Error checking pool for fee ${fee}:`, e);
// 		}
// 	}

// 	if (!directPoolAddress) {
// 		const WETH = new Token(ARBITRUM_SEPOLIA_CHAIN_ID, wETH_ADDRESS, 18);

// 		let bestPool1: Pool | undefined;

// 		for (const fee of UNI_FEES) {
// 			try {
// 				const poolAddress = Pool.getAddress(tokenIn, WETH, fee);

// 				if (await isGoodPool(poolAddress)) {
// 					const pool1 = await getPoolInfo(poolAddress as Address);
// 					bestPool1 = pool1;

// 					break;
// 				}
// 			} catch (e) {
// 				console.error(`Error checking pool1 (/ARC) for fee ${fee}:`, e);
// 			}
// 		}

// 		let bestPool2: Pool | undefined;

// 		for (const fee of UNI_FEES) {
// 			try {
// 				const poolAddress = Pool.getAddress(WETH, tokenOut, fee);

// 				if (await isGoodPool(poolAddress)) {
// 					const pool2 = await getPoolInfo(poolAddress as Address);

// 					bestPool2 = pool2;
// 					break;
// 				}
// 			} catch (e) {
// 				console.error(`Error checking pool2 (LUAUSD) for fee ${fee}:`, e);
// 			}
// 		}

// 		if (bestPool1 && bestPool2) {
// 			const swapRoute = new Route([bestPool1, bestPool2], tokenIn, tokenOut);

// 			return swapRoute;
// 		}

// 		throw new Error("No valid pools found for any fee tier");
// 	}
// };

// export const getOutputQuote = async (
// 	route: Route<Token | Ether, Token>,
// 	amountIn: BigNumber,
// ) => {
// 	const client = getPublicClient(config);

// 	const { calldata, value } = await SwapQuoter.quoteCallParameters(
// 		route,
// 		CurrencyAmount.fromRawAmount(
// 			route.input,
// 			parseUnits(
// 				amountIn.toFixed(0).toString(),
// 				route.input.decimals,
// 			).toString(),
// 		),
// 		TradeType.EXACT_INPUT,
// 		{
// 			useQuoterV2: true,
// 		},
// 	);

// 	const { data } = await client.call({
// 		to: UNISWAP_QUOTER_CONTRACT_ADDRESS,
// 		data: calldata as Address,
// 	});

// 	if (data) {
// 		const [outValue] = decodeAbiParameters(
// 			[{ name: "amountOut", type: "uint256" }],
// 			data,
// 		);

// 		return {
// 			amountOut: new BigNumber(outValue.toString()),
// 			ethValue: new BigNumber(value),
// 		};
// 	}
// };

// export const createUnckeckedTrade = (
// 	route: Route<Token | Ether, Token>,
// 	amountIn: BigNumber,
// 	amountOut: BigNumber,
// ) => {
// 	const uncheckedTrade = Trade.createUncheckedTrade({
// 		route: route,
// 		inputAmount: CurrencyAmount.fromRawAmount(route.input, amountIn.toFixed(0)),
// 		outputAmount: CurrencyAmount.fromRawAmount(
// 			route.output,
// 			amountOut.toFixed(0),
// 		),
// 		tradeType: TradeType.EXACT_OUTPUT,
// 	});

// 	return uncheckedTrade;
// };
