import { GetMultipoolChartData } from "@/api/explore";
import { type CandleDataRequest, queryKeys } from "@/api/types";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";

export const useChart = () => {
	const {
		setPorfolioCandles,
		setPorfolioLinear,
		chartResolution,
		portfolioLinearData,
		portfolioCandlesData,
	} = useExplorePortfolio();

	return useQuery({
		queryKey: [queryKeys.multipoolsList, chartResolution],
		queryFn: async () => {
			const t = Math.floor(Date.now() / 1000).toString();
			if (portfolioLinearData.length > 0) {
				// const newCandle = await GetMultipoolChartData({
				// 	m: "0x2ae0a75888014e01d2247fff2a8748c0a0c65f43",
				// 	r: Number(chartResolution),
				// 	c: 1,
				// 	t,
				// });

				// const candleData = newCandle.map((item) => {
				// 	const twoPow96 = new BigNumber(2).pow(96);
				// 	const formattedHigh = new BigNumber(item?.h?.toString() || 0)
				// 		.div(twoPow96)
				// 		.toString();

				// 	const formattedLow = new BigNumber(item?.l?.toString() || 0)
				// 		.div(twoPow96)
				// 		.toString();

				// 	const formattedClose = new BigNumber(item?.c?.toString() || 0)
				// 		.div(twoPow96)
				// 		.toString();

				// 	const formattedOpen = new BigNumber(item?.o?.toString() || 0)
				// 		.div(twoPow96)
				// 		.toString();

				// 	return {
				// 		time: Number(item.t),
				// 		open: Number.parseFloat(formattedOpen),
				// 		high: Number.parseFloat(formattedHigh),
				// 		low: Number.parseFloat(formattedLow),
				// 		close: Number.parseFloat(formattedClose),
				// 	};
				// });

				setPorfolioCandles([...portfolioCandlesData]);
			}
			// if (portfolioLinearData.length === 0) {
			const data = await GetMultipoolChartData({
				m: "0x2ae0a75888014e01d2247fff2a8748c0a0c65f43",
				r: Number(chartResolution),
				t,
			});

			const sortedData = [...data].sort((a, b) => Number(a.t) - Number(b.t));

			const uniqueData = sortedData.reduce<CandleDataRequest[]>(
				(acc, current) => {
					const existing = acc.find((item) => item.t === current.t);
					if (!existing) {
						acc.push(current);
					} else {
						const index = acc.indexOf(existing);
						acc[index] = current;
					}
					return acc;
				},
				[],
			);

			const candleData = uniqueData.map((item) => {
				const twoPow96 = new BigNumber(2).pow(96);
				const formattedHigh = new BigNumber(item?.h?.toString() || 0)
					.div(twoPow96)
					.toString();

				const formattedLow = new BigNumber(item?.l?.toString() || 0)
					.div(twoPow96)
					.toString();

				const formattedClose = new BigNumber(item?.c?.toString() || 0)
					.div(twoPow96)
					.toString();

				const formattedOpen = new BigNumber(item?.o?.toString() || 0)
					.div(twoPow96)
					.toString();

				return {
					time: Number(item.t),
					open: Number.parseFloat(formattedOpen),
					high: Number.parseFloat(formattedHigh),
					low: Number.parseFloat(formattedLow),
					close: Number.parseFloat(formattedClose),
				};
			});

			const lineChartData = uniqueData.map((item) => {
				const twoPow96 = new BigNumber(2).pow(96);

				const formattedClose = new BigNumber(item?.c?.toString() || 0)
					.div(twoPow96)
					.toString();

				return {
					time: Number(item.t),
					value: Number.parseFloat(formattedClose),
				};
			});

			setPorfolioCandles(candleData);
			setPorfolioLinear(lineChartData);

			return { candleData, lineChartData };
			// }
		},
		refetchInterval: 2000,
	});
};

// 93
// :
// {t: '1746044111', o: '18446744073709551616', c: '18446744073709551616', l: '18446744073709551616', h: '18446744073709551616'}
// 94
// :
// {t: '1746044113', o: '18446744073709551616', c: '18446744073709551616', l: '18446744073709551616', h: '18446744073709551616'}
// 95
// :
// {t: '1746044118', o:
