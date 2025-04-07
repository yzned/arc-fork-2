import {
	computePoolAddress,
	FeeAmount,
	Pool,
	Route,
	SwapOptions,
	SwapQuoter,
	SwapRouter,
	Trade,
} from "@uniswap/v3-sdk";
import {
	decodeAbiParameters,
	encodeFunctionData,
	getContract,
	parseUnits,
	type Address,
} from "viem";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";

import {
	CurrencyAmount,
	Ether,
	Percent,
	Token,
	TradeType,
} from "@uniswap/sdk-core";

import { arbitrumPublicClient, walletClient } from "@/lib/config";
import {
	ARBITRUM_CHAIN_ID,
	UNI_FEES,
	UNISWAP_POOL_FACTORY_CONTRACT_ADDRESS,
	UNISWAP_QUOTER_CONTRACT_ADDRESS,
	UNISWAP_SWAP_ROUTER_ADDRESS,
	wETH_ADDRESS,
} from "@/lib/constants";
import ERC20 from "@/lib/abi/ERC20";
import BigNumber from "bignumber.js";
import { simulateContract } from "viem/actions";

const externalTokens: Array<Address> = [
	"0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
	"0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
	"0x912CE59144191C1204E64559FE8253a0e49E6548",
	"0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
	"0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
	"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
	"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
	"0x2297aEbD383787A160DD0d9F71508148769342E3",
	"0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
	"0x371c7ec6D8039ff7933a2AA28EB827Ffe1F52f07",
	"0x6694340fc020c5E6B96567843da2df01b2CE1eb6",
	"0x5979D7b546E38E414F7E9822514be443A4800529",
	"0x3082CC23568eA640225c2467653dB90e9250AaA0",
	"0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
	"0x0341c0c0ec423328621788d4854119b97f44e391",
	"0x539bde0d7dbd336b79148aa742883198bbf60342",
	"0x51fc0f6660482ea73330e414efd7808811a57fa2",
	"0x0c880f6761f1af8d9aa9c466984b80dab9a8c9e8",
];

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

export const getPoolsData = async (addressA: Address, addressB: Address) => {
	let poolAddresses: string[] = [];
	const resultPools: Array<Pool> = [];

	const decimals = await getDecimals({ addresses: [addressA, addressB] });

	const tokenA = new Token(ARBITRUM_CHAIN_ID, addressA, Number(decimals[0]));
	const tokenB = new Token(ARBITRUM_CHAIN_ID, addressB, Number(decimals[1]));

	UNI_FEES.map((fee) => {
		const currentPoolAddress = computePoolAddress({
			factoryAddress: UNISWAP_POOL_FACTORY_CONTRACT_ADDRESS,
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
				abi: IUniswapV3PoolABI.abi,
				functionName: "token0",
			},
			{
				address: address as Address,
				abi: IUniswapV3PoolABI.abi,
				functionName: "token1",
			},
			{
				address: address as Address,
				abi: IUniswapV3PoolABI.abi,
				functionName: "fee",
			},
			{
				address: address as Address,
				abi: IUniswapV3PoolABI.abi,
				functionName: "liquidity",
			},
			{
				address: address as Address,
				abi: IUniswapV3PoolABI.abi,
				functionName: "slot0",
			},
		]),
	];

	const rawResult = await arbitrumPublicClient.multicall({
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
					? rawResult[i + 4].result
					: undefined,
		};

		if (poolData.token0 && poolData.token1 && poolData.slot0) {
			const tick = poolData.slot0[1];

			const sqrtPriceX96 = poolData.slot0[0].toString();

			const decimals = await getDecimals({
				addresses: [poolData.token0 as Address, poolData.token1 as Address],
			});

			const token0Asset: Token = new Token(
				ARBITRUM_CHAIN_ID,
				poolData.token0.toString(),
				Number(decimals[0]),
			);
			const token1Asset: Token = new Token(
				ARBITRUM_CHAIN_ID,
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
	try {
		const decimals = await arbitrumPublicClient.multicall({
			contracts: addresses?.map((address) => {
				return {
					address: address as Address,
					abi: ERC20,
					functionName: "decimals",
				};
			}),
		});

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
	const latestBlock = await arbitrumPublicClient.getBlockNumber();
	const latestBlockData = await arbitrumPublicClient.getBlock({
		blockNumber: latestBlock,
	});

	const oneDayAgoTimestamp = latestBlockData.timestamp - BigInt(86400);

	let low = latestBlock - BigInt(50000);
	let high = latestBlock;
	let startBlock = low;

	while (low <= high) {
		const mid = low + (high - low) / BigInt(2);
		const midBlock = await arbitrumPublicClient.getBlock({ blockNumber: mid });

		if (midBlock.timestamp < oneDayAgoTimestamp) {
			low = mid + BigInt(1);
		} else {
			startBlock = mid;
			high = mid - BigInt(1);
		}
	}

	const swapEvents = await arbitrumPublicClient.getContractEvents({
		address: poolAddress as Address,
		abi: IUniswapV3PoolABI.abi,
		eventName: "Swap",
		fromBlock: startBlock,
		toBlock: latestBlock,
	});

	return swapEvents.length;
};

export const isGoodPool = async (poolAddress: string): Promise<boolean> => {
	const code = await arbitrumPublicClient.getCode({
		address: poolAddress as Address,
	});

	const swapsCount = await getSwapCount(poolAddress);

	return code !== "0x" && swapsCount > 1;
};

export const getPoolInfo = async (poolAddress: Address) => {
	const contracts = [
		{
			address: poolAddress,
			abi: IUniswapV3PoolABI.abi,
			functionName: "token0",
		},
		{
			address: poolAddress,
			abi: IUniswapV3PoolABI.abi,
			functionName: "token1",
		},
		{
			address: poolAddress,
			abi: IUniswapV3PoolABI.abi,
			functionName: "fee",
		},
		{
			address: poolAddress,
			abi: IUniswapV3PoolABI.abi,
			functionName: "liquidity",
		},
		{
			address: poolAddress,
			abi: IUniswapV3PoolABI.abi,
			functionName: "slot0",
		},
	];

	const rawResult = await arbitrumPublicClient.multicall({ contracts });

	if (rawResult.some((res) => res.status !== "success")) {
		throw new Error("Ошибка получения данных пула");
	}

	const [token0, token1, fee, liquidity, slot0] = rawResult.map(
		(res) => res.result,
	);

	if (!token0 || !token1 || !slot0) {
		throw new Error("Некорректные данные пула");
	}

	const tick = slot0[1];
	const sqrtPriceX96 = slot0[0].toString();

	const decimals = await getDecimals({
		addresses: [token0 as Address, token1 as Address],
	});

	const token0Asset: Token = new Token(
		ARBITRUM_CHAIN_ID,
		token0.toString(),
		Number(decimals[0]),
	);
	const token1Asset: Token = new Token(
		ARBITRUM_CHAIN_ID,
		token1.toString(),
		Number(decimals[1]),
	);

	const pool = new Pool(
		token0Asset,
		token1Asset,
		Number(fee) ?? FeeAmount.LOW,
		sqrtPriceX96,
		liquidity?.toString() || "0",
		tick,
	);

	return pool;
};

export const createPoolsRoute = async (
	addressIn: Address,
	addressOut: Address,
) => {
	const decimals = await getDecimals({ addresses: [addressIn, addressOut] });

	const tokenIn = new Token(ARBITRUM_CHAIN_ID, addressIn, Number(decimals[0]));
	const tokenOut = new Token(
		ARBITRUM_CHAIN_ID,
		addressOut,
		Number(decimals[1]),
	);

	let directPoolAddress: string;

	for (const fee of UNI_FEES) {
		try {
			const poolAddress = Pool.getAddress(tokenIn, tokenOut, fee);
			const _isGoodPool = await isGoodPool(poolAddress);

			if (_isGoodPool) {
				directPoolAddress = poolAddress;
				const pool = await getPoolInfo(poolAddress as Address);

				const swapRoute = new Route([pool], tokenIn, tokenOut);

				return swapRoute;
			}
		} catch (e) {
			console.error(`Error checking pool for fee ${fee}:`, e);
		}
	}

	if (!directPoolAddress) {
		const WETH = new Token(ARBITRUM_CHAIN_ID, wETH_ADDRESS, 18);

		let bestPool1: Pool;

		for (const fee of UNI_FEES) {
			try {
				const poolAddress = Pool.getAddress(tokenIn, WETH, fee);

				if (await isGoodPool(poolAddress)) {
					const pool1 = await getPoolInfo(poolAddress as Address);
					bestPool1 = pool1;

					break;
				}
			} catch (e) {
				console.error(`Error checking pool1 (/ARC) for fee ${fee}:`, e);
			}
		}

		let bestPool2: Pool;

		for (const fee of UNI_FEES) {
			try {
				const poolAddress = Pool.getAddress(WETH, tokenOut, fee);

				if (await isGoodPool(poolAddress)) {
					const pool2 = await getPoolInfo(poolAddress as Address);

					bestPool2 = pool2;
					break;
				}
			} catch (e) {
				console.error(`Error checking pool2 (LUAUSD) for fee ${fee}:`, e);
			}
		}

		if (bestPool1 && bestPool2) {
			const swapRoute = new Route([bestPool1, bestPool2], tokenIn, tokenOut);

			return swapRoute;
		}

		throw new Error("No valid pools found for any fee tier");
	}
};

export const getOutputQuote = async (
	route: Route<Token | Ether, Token>,
	amountIn: BigNumber,
) => {
	const { calldata, value } = await SwapQuoter.quoteCallParameters(
		route,
		CurrencyAmount.fromRawAmount(
			route.input,
			parseUnits(
				amountIn.toFixed(0).toString(),
				route.input.decimals,
			).toString(),
		),
		TradeType.EXACT_INPUT,
		{
			useQuoterV2: true,
		},
	);

	const { data } = await arbitrumPublicClient.call({
		to: UNISWAP_QUOTER_CONTRACT_ADDRESS,
		data: calldata as Address,
	});

	const [outValue] = decodeAbiParameters(
		[{ name: "amountOut", type: "uint256" }],
		data,
	);

	return {
		amountOut: new BigNumber(outValue.toString()),
		ethValue: new BigNumber(value),
	};
};

export const createUnckeckedTrade = (
	route: Route<Token | Ether, Token>,
	amountIn: BigNumber,
	amountOut: BigNumber,
) => {
	const uncheckedTrade = Trade.createUncheckedTrade({
		route: route,
		inputAmount: CurrencyAmount.fromRawAmount(route.input, amountIn.toFixed(0)),
		outputAmount: CurrencyAmount.fromRawAmount(
			route.output,
			amountOut.toFixed(0),
		),
		tradeType: TradeType.EXACT_OUTPUT,
	});

	return uncheckedTrade;
};

// export const getAmountOut = async (
// 	route: Route<Token | Ether, Token>,

// 	amountIn: BigNumber,
// ) => {
// 	const { calldata, value } = SwapQuoter.quoteCallParameters(
// 		route,
// 		CurrencyAmount.fromRawAmount(route.input, amountIn.toFixed(0)),
// 		TradeType.EXACT_INPUT,
// 		{
// 			useQuoterV2: true,
// 		},
// 	);

// 	const { data } = await arbitrumPublicClient.call({
// 		to: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
// 		data: calldata as Address,
// 	});

// 	const [outValue] = decodeAbiParameters(
// 		[{ name: "amountOut", type: "uint256" }],
// 		data!,
// 	);

// 	return {
// 		amountOut: new BigNumber(outValue.toString()),
// 		ethValue: new BigNumber(value),
// 	};
// };

// export const createRoute = (
// 	pools: Array<Pool>,
// 	inputToken: Token | Ether,
// 	outputToken: Token,
// ) => {
// 	if (inputToken.equals(outputToken)) {
// 		throw new Error("Input token equals output token");
// 	}

// 	if (inputToken.isNative) {
// 		const pool = pools.find((pool) => {
// 			return pool.token0.equals(outputToken) || pool.token1.equals(outputToken);
// 		});

// 		if (!pool) {
// 			throw new Error("Pool not found");
// 		}

// 		const route = new Route([pool], inputToken, outputToken);

// 		return route;
// 	}

// 	// easy case for weth as output
// 	if (
// 		outputToken.address.toLocaleLowerCase() === wETH_ADDRESS.toLocaleLowerCase()
// 	) {
// 		const pool = pools.find((pool) => {
// 			return pool.token0.equals(inputToken) || pool.token1.equals(inputToken);
// 		});

// 		if (!pool) {
// 			throw new Error("Pool not found");
// 		}

// 		const route = new Route([pool], inputToken, outputToken);
// 		// console.log("HUY");
// 		return route;
// 	}

// 	// easy case for weth as input
// 	if (
// 		inputToken.address.toLocaleLowerCase() === wETH_ADDRESS.toLocaleLowerCase()
// 	) {
// 		const pool = pools.find((pool) => {
// 			return pool.token0.equals(outputToken) || pool.token1.equals(outputToken);
// 		});

// 		if (!pool) {
// 			throw new Error("Pool not found");
// 		}

// 		const route = new Route([pool], inputToken, outputToken);

// 		return route;
// 	}
// 	// pools contains all the pools also those that are not used in the route
// 	// so we need to filter them
// 	const poolsUsed = pools.filter((pool) => {
// 		return (
// 			Same(pool.token0.address, inputToken.address) ||
// 			Same(pool.token1.address, inputToken.address) ||
// 			Same(pool.token0.address, outputToken.address) ||
// 			Same(pool.token1.address, outputToken.address)
// 		);
// 	});

// 	// sort pools so first pool contains input token
// 	poolsUsed.sort((a, b) => {
// 		if (a.token0.equals(inputToken) || a.token1.equals(inputToken)) {
// 			return -1;
// 		}
// 		if (b.token0.equals(inputToken) || b.token1.equals(inputToken)) {
// 			return 1;
// 		}
// 		return 0;
// 	});

// 	const route = new Route(poolsUsed, inputToken, outputToken);

// 	return route;
// };

// export const createTrade = (
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

// export const swapToCalldata = async (
// 	inputAsset: Address,
// 	outputAsset: Address,
// 	inputAmount: BigNumber,
// 	multipoolAddress: Address,
// ): Promise<Calls> => {
// 	const pools = await getPoolsData(inputAsset, outputAsset);

// 	const inputDecimals = await getDecimals({
// 		addresses: [inputAsset.toLocaleLowerCase() as Address],
// 	});

// 	if (!inputDecimals) {
// 		throw new Error("Decimals not found");
// 	}
// 	const inputToken =
// 		inputAsset.toLocaleLowerCase() !==
// 		"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLocaleLowerCase()
// 			? new Token(42161, inputAsset, Number(inputDecimals[0]))
// 			: new Token(42161, wETH_ADDRESS, Number(inputDecimals[0]));

// 	const outputDecimals = await getDecimals({
// 		addresses: [outputAsset.toLocaleLowerCase() as Address],
// 	});

// 	if (!outputDecimals) {
// 		throw new Error("Decimals not found");
// 	}

// 	const outputToken = new Token(42161, outputAsset, Number(outputDecimals[0]));

// 	const swapRoute = createRoute(pools, inputToken, outputToken);

// 	const { amountOut } = await getAmountOut(
// 		swapRoute,
// 		inputAmount.multipliedBy(0.995),
// 	);
// 	const trade = createTrade(swapRoute, inputAmount, amountOut);

// 	const options: SwapOptions = {
// 		slippageTolerance: new Percent(70, 10_000), // 50 bips, or 0.50%
// 		deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
// 		recipient: multipoolAddress,
// 	};

// 	const methodParameters = SwapRouter.swapCallParameters([trade], options);

// 	return {
// 		data: methodParameters.calldata,
// 		to: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
// 		value: methodParameters.value,
// 		asset: outputAsset,
// 		amountOut: amountOut,
// 		note: `Swap ${inputAmount.toString()} ${inputToken.symbol} to ${amountOut.toString()} ${outputToken.symbol}`,
// 	};
// };

// export const create = async (
// 	targetShares: Map<Address, BigNumber>,
// 	shares: Map<Address, BigNumber>,
// 	inputAsset: Address,
// 	amountIn: BigNumber,
// 	multipoolAddress: Address,
// ) => {
// 	if (amountIn === undefined) {
// 		throw new Error("AmountIn is undefined");
// 	}

// 	// filter out shares with 0
// 	shares.forEach((value, key) => {
// 		if (value.isEqualTo(0)) {
// 			shares.delete(key);
// 		}
// 	});

// 	for (const [_, amount] of shares.entries()) {
// 		if (amount.isLessThanOrEqualTo(0)) {
// 			throw new Error("Amount is less than or equal to 0");
// 		}
// 	}

// 	if (shares.values().next().value === new BigNumber(0)) {
// 		throw new Error("Shares is empty");
// 	}

// 	// move shares to targetShares
// 	for (const [address, amount] of targetShares.entries()) {
// 		if (shares.has(address)) {
// 			shares.set(address, amount);
// 		}
// 	}

// 	const pools = await getPoolsData(wETH_ADDRESS, inputAsset);

// 	const inputDecimals = await getDecimals({
// 		addresses: [inputAsset.toLocaleLowerCase() as Address],
// 	});

// 	if (!inputDecimals) {
// 		throw new Error("Decimals not found");
// 	}
// 	const inputToken =
// 		inputAsset.toLocaleLowerCase() !==
// 		"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLocaleLowerCase()
// 			? new Token(42161, inputAsset, Number(inputDecimals[0]))
// 			: new Token(42161, wETH_ADDRESS, Number(inputDecimals[0]));

// 	const callDatas: Array<Calls> = [];
// 	const outs: Map<Address, BigNumber> = new Map();

// 	for (const [address, amount] of shares.entries()) {
// 		const outDecimal = await getDecimals({
// 			addresses: [address.toLocaleLowerCase() as Address],
// 		});

// 		if (!outDecimal) {
// 			throw new Error("Decimals not found");
// 		}
// 		const outputToken = new Token(
// 			42161,
// 			address as Address,
// 			Number(outDecimal[0]),
// 		);

// 		const swapRoute = createRoute(pools, inputToken, outputToken);

// 		const amountInShare = amountIn.multipliedBy(amount).dividedBy(100);
// 		const { amountOut } = await getAmountOut(
// 			swapRoute,
// 			amountInShare.multipliedBy(0.995),
// 		);
// 		const trade = createTrade(swapRoute, amountInShare, amountOut);

// 		outs.set(address, amountOut);

// 		const options: SwapOptions = {
// 			slippageTolerance: new Percent(70, 10_000), // 50 bips, or 0.50%
// 			deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
// 			recipient: multipoolAddress,
// 		};

// 		const methodParameters = SwapRouter.swapCallParameters([trade], options);

// 		const tx = {
// 			data: methodParameters.calldata,
// 			to: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
// 			value: methodParameters.value,
// 			asset: address,
// 			amountOut: amountOut,
// 			note: `Swap ${amountInShare.toString()} ${inputToken.symbol} to ${amountOut.toString()} ${outputToken.symbol}`,
// 		};

// 		callDatas.push(tx);
// 	}

// 	return {
// 		calldata: callDatas,
// 		selectedAssets: outs,
// 	};
// };
