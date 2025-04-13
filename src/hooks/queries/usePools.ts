import { getPoolsData } from "@/api/uniswap";
import type { ShortPoolData } from "@/lib/types";
import { Pool } from "@uniswap/v3-sdk";
import BigNumber from "bignumber.js";
import type { Address } from "viem";

const UNI_FEES = [500, 1000, 3000];

export const usePools = async (
	addressA: string,
	addressB: string,
): Promise<ShortPoolData[]> => {
	try {
		const pools = await getPoolsData(addressA as Address, addressB as Address);

		// const inputToken = new Token(
		// 	ARBITRUM_CHAIN_ID,
		// 	"0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
		// 	18,
		// );

		// const outputToken = new Token(
		// 	ARBITRUM_CHAIN_ID,
		// 	"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
		// 	6,
		// );

		// const swapRoute = await createRoute(pools, inputToken, outputToken);
		// const inputAmount = new BigNumber(1000000000000);

		// const { amountOut } = await getAmountOut(
		// 	swapRoute,
		// 	inputAmount.multipliedBy(0.995),
		// );

		// const trade = createTrade(swapRoute, inputAmount, amountOut);

		// console.log("trade: ", trade);

		const poolsResult = await Promise.all(
			pools.map(async (pool, index) => {
				// const priceConverted = priceInNativeToken(
				// 	BigInt(pool.sqrtRatioX96.toString()),
				// 	Number(decimals[pool.token0.address === wETH_ADDRESS ? 1 : 0]),
				// 	Number(decimals[pool.token0.address === wETH_ADDRESS ? 0 : 1]),
				// );

				const liquidity = new BigNumber(pool.liquidity.toString());

				const liquidityInToken0 = liquidity
					.div(new BigNumber(10).pow(18))
					.multipliedBy(1);

				const poolAddress = Pool.getAddress(pool.token0, pool.token1, pool.fee);

				return {
					priceFeedType: "UniswapV3",
					poolAddress: poolAddress,
					liquidity: liquidityInToken0.toString() || "0",
					fee: UNI_FEES[index],
				};
			}),
		);

		return poolsResult;
	} catch (e) {
		console.log("e: ", e);
		return [];
	}
};
