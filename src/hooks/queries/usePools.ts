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

		const poolsResult = await Promise.all(
			pools.map(async (pool, index) => {
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
		console.error("e: ", e);
		return [];
	}
};
