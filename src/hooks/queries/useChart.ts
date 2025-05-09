import { GetMultipoolChartData, GetMultipoolChartStats } from "@/api/explore";
import { queryKeys } from "@/api/types";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import type { Time } from "lightweight-charts";
import { useState } from "react";

BigNumber.set({ EXPONENTIAL_AT: 1000, DECIMAL_PLACES: 20 });

type Cache = {
	portfolioCandlesData: {
		time: Time;
		open: number;
		high: number;
		low: number;
		close: number;
	}[];
	lineChartData: {
		time: Time;
		value: number;
	}[];
};

const twoPow96 = new BigNumber(2).pow(96);

export const useChart = () => {
	const { chartResolution } = useExplorePortfolio();
	const [_, setCachedCandles] = useState<Cache>();

	return useQuery({
		queryKey: [queryKeys.multipoolsList, chartResolution],
		queryFn: async () => {
			//@ts-ignore
			const cachedCandles = await getCachedCandles(true);
			const t = Math.floor(Date.now() / 1000).toString();
			if (!cachedCandles) {
				throw new Error("No cached candles data available");
			}

			const data = await GetMultipoolChartStats({
				m: "0x2ae0a75888014e01d2247fff2a8748c0a0c65f43",
				r: Number(chartResolution),
				t,
			});

			const currentCandle = data.cc;
			const previousCandle = data.pc;

			// check if we have any of current candle OR previous candle
			const isSynced = cachedCandles.portfolioCandlesData.some(
				//@ts-ignore
				(item) =>
					item.time === Number.parseInt(currentCandle.t) ||
					item.time === Number.parseInt(previousCandle.t),
			);

			if (!isSynced) {
				// refetch cached candles data

				//@ts-ignore
				const newCachedCandles = await getCachedCandles(false);
				if (!newCachedCandles) {
					throw new Error("No cached candles data available");
				}

				setCachedCandles(newCachedCandles);
			}

			// if we are in sync, set cached candles data to the new data, from previous candle and current candle
			const newCachedCandles = cachedCandles.portfolioCandlesData.map(
				//@ts-ignore

				(item) => {
					if (item.time === Number.parseInt(currentCandle.t)) {
						return {
							...item,
							open: Number.parseFloat(
								new BigNumber(currentCandle.o).div(twoPow96).toString(),
							),
							high: Number.parseFloat(
								new BigNumber(currentCandle.o).div(twoPow96).toString(),
							),
							low: Number.parseFloat(
								new BigNumber(currentCandle.o).div(twoPow96).toString(),
							),
							close: Number.parseFloat(
								new BigNumber(currentCandle.o).div(twoPow96).toString(),
							),
						};
					}
					if (item.time === Number.parseInt(previousCandle.t)) {
						return {
							...item,
							open: Number.parseFloat(
								new BigNumber(previousCandle.o).div(twoPow96).toString(),
							),
							high: Number.parseFloat(
								new BigNumber(previousCandle.h).div(twoPow96).toString(),
							),
							low: Number.parseFloat(
								new BigNumber(previousCandle.l).div(twoPow96).toString(),
							),
							close: Number.parseFloat(
								new BigNumber(previousCandle.c).div(twoPow96).toString(),
							),
						};
					}
					return item;
				},
			);

			const isCCPresent = newCachedCandles.some(
				//@ts-ignore

				(item) => item.time === Number.parseInt(currentCandle.t),
			);

			if (!isCCPresent) {
				newCachedCandles.push({
					time: Number.parseInt(currentCandle.t) as Time,
					open: Number.parseFloat(
						new BigNumber(currentCandle.o).div(twoPow96).toString(),
					),
					high: Number.parseFloat(
						new BigNumber(currentCandle.o).div(twoPow96).toString(),
					),
					low: Number.parseFloat(
						new BigNumber(currentCandle.o).div(twoPow96).toString(),
					),
					close: Number.parseFloat(
						new BigNumber(currentCandle.o).div(twoPow96).toString(),
					),
				});
			}

			const sortedCandles = newCachedCandles.sort(
				//@ts-ignore

				(a, b) => (a.time as number) - (b.time as number),
			);
			//@ts-ignore

			const formattedCandles = sortedCandles.map((item) => {
				return {
					time: item.time as Time,
					open: Number.parseFloat(new BigNumber(item.open).toString()),
					high: Number.parseFloat(new BigNumber(item.high).toString()),
					low: Number.parseFloat(new BigNumber(item.low).toString()),
					close: Number.parseFloat(new BigNumber(item.close).toString()),
				};
			});
			//@ts-ignore

			const lineChartData = sortedCandles.map((item) => {
				return {
					time: item.time as Time,
					value: Number.parseFloat(new BigNumber(item.close).toString()),
				};
			});

			setCachedCandles({
				portfolioCandlesData: formattedCandles,
				lineChartData: lineChartData.sort(
					//@ts-ignore

					(a, b) => (a.time as number) - (b.time as number),
				),
			});

			return {
				portfolioCandlesData: formattedCandles,
				lineChartData: cachedCandles.lineChartData.sort(
					//@ts-ignore

					(a, b) => (a.time as number) - (b.time as number),
				),
			};
		},
		refetchIntervalInBackground: true,
		refetchInterval: 1000,
		placeholderData: {
			portfolioCandlesData: [],
			lineChartData: [],
		},
		initialData: {
			portfolioCandlesData: [],
			lineChartData: [],
		},
	});
};

export const useHistory = () => {
	return useMutation({
		mutationKey: [queryKeys.multipoolsList, "history"],
		scope: { id: "history" },
		mutationFn: async ({
			countback,
			timestamp,
		}: { countback: number; timestamp: string }) => {
			const data = await GetMultipoolChartData({
				m: "0x2ae0a75888014e01d2247fff2a8748c0a0c65f43",
				r: 60,
				c: countback,
				t: timestamp,
			});

			return data.map((item) => {
				const formattedHigh = new BigNumber(item.h).div(twoPow96).toString();

				const formattedLow = new BigNumber(item.l).div(twoPow96).toString();

				const formattedClose = new BigNumber(item.c).div(twoPow96).toString();

				const formattedOpen = new BigNumber(item.o).div(twoPow96).toString();

				return {
					time: Number(item.t) as Time,
					open: Number.parseFloat(formattedOpen),
					high: Number.parseFloat(formattedHigh),
					low: Number.parseFloat(formattedLow),
					close: Number.parseFloat(formattedClose),
				};
			});
		},
	});
};
