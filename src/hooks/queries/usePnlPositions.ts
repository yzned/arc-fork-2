import { GetPositions } from "@/api/explore";
import {
	type PositionsResponse,
	queryKeys,
	type ShortMultipoolDataFormated,
} from "@/api/types";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { useAccount, useChainId } from "wagmi";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import type { PositionsAsset } from "@/lib/types";

interface PnlPositionsResult {
	absoluteCommonPnl: BigNumber;
	relativeCommonPnl: BigNumber;
	positionsTableData: PositionsAsset[];
}

const calculatePnl = (
	positions: PositionsResponse,
	allPortfolios: ShortMultipoolDataFormated[],
) => {
	const pnlData = positions
		.map(({ l, m, p, q }) => {
			const currentPrice = allPortfolios.find(
				(item) => item.address.toLowerCase() === m.toLowerCase(),
			)?.stats.currentPrice;

			const absolutePnl = new BigNumber(p)
				.minus(l)
				.plus(q)
				.multipliedBy(currentPrice || 0);

			const relativePnl =
				l === "0"
					? new BigNumber(0)
					: absolutePnl.multipliedBy(new BigNumber(100).div(l));

			return { absolutePnl, relativePnl };
		})
		.reduce(
			(sums, { absolutePnl, relativePnl }) => ({
				absolutePnl: sums.absolutePnl.plus(absolutePnl),
				relativePnl: sums.relativePnl.plus(relativePnl),
			}),
			{ absolutePnl: new BigNumber(0), relativePnl: new BigNumber(0) },
		);

	const absoluteCommonPnl = pnlData.absolutePnl.div(new BigNumber(10).pow(18));

	const relativeCommonPnl = pnlData.relativePnl;

	return { absoluteCommonPnl, relativeCommonPnl };
};

const getPositionsTableData = (
	positions: PositionsResponse,
	allPortfolios: ShortMultipoolDataFormated[],
) => {
	const positionsTableData = positions.map((position) => {
		const portfolio = allPortfolios.find(
			(item) => item.address.toLowerCase() === position.m.toLowerCase(),
		);
		const quantity = new BigNumber(position.q).div(new BigNumber(10).pow(18));
		const price = new BigNumber(portfolio?.stats.currentPrice || 0);

		return {
			price: price,
			address: portfolio?.address,
			logo: portfolio?.logo,
			symbol: portfolio?.stats.symbol,
			quantity: quantity,
			tvl: portfolio?.tvl,
		};
	});

	return positionsTableData;
};

export function usePnlPositions() {
	const { address: userAddress } = useAccount();

	const chainId = useChainId();
	const { allPortfolios } = useExplorePortfolio();

	return useQuery({
		queryKey: [queryKeys.positions, userAddress, chainId],
		queryFn: async (): Promise<PnlPositionsResult> => {
			if (!userAddress)
				return {
					absoluteCommonPnl: new BigNumber(0),
					relativeCommonPnl: new BigNumber(0),
					positionsTableData: [],
				};

			const positions = await GetPositions({ userAddress });

			const { absoluteCommonPnl, relativeCommonPnl } = calculatePnl(
				positions,
				allPortfolios,
			);

			const positionsTableData = getPositionsTableData(
				positions,
				allPortfolios,
			);

			return {
				absoluteCommonPnl,
				relativeCommonPnl,
				positionsTableData,
			};
		},
		enabled: !!userAddress,
	});
}
