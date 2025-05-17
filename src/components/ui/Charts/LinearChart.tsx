import { GetMultipoolChartData, GetMultipoolChartStats } from "@/api/explore";
import {
	type CandleDataFormated,
	type CandleDataRequest,
	queryKeys,
} from "@/api/types";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useDebounceValue } from "@/hooks/use-debounce-value";
import { twoPow96 } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import BigNumber from "bignumber.js";
import {
	ColorType,
	type ISeriesApi,
	type LineData,
	LineSeries,
	type Time,
	type WhitespaceData,
	createChart,
} from "lightweight-charts";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import type { Address } from "viem";

type CandleChartProps = {
	backgroundColor?: string;
	mainLineColor?: string;
	gridColor?: string;
	textColor?: string;

	height?: number;
};

function formatPriceData(x: string): {
	result: number;
	exponent: number;
} {
	const formatedNumber = new BigNumber(x).div(twoPow96).toNumber();
	if (formatedNumber <= 0) {
		throw new Error("Input must be a positive number");
	}
	const exponent = Math.ceil(-Math.log10(formatedNumber));
	const multipliedBy = new BigNumber(10).pow(exponent);
	const result = new BigNumber(formatedNumber)
		.multipliedBy(multipliedBy)
		.toNumber();
	return { result, exponent };
}

export const LinearChart = observer(
	({
		backgroundColor = "#17161B",
		gridColor = "#1F1F1F",
		textColor = "#8A8B8C",
		height = 400,
	}: CandleChartProps) => {
		const { id } = useParams({ from: "/explore/$id" });

		const { chartResolution } = useExplorePortfolio();
		const chartContainerRef = useRef<HTMLDivElement>(null);

		const [previousCandleState, setPreviousCandle] =
			useState<CandleDataRequest>();
		const [currentFrom, setCurrentFrom] = useDebounceValue(0, 500);
		const [chartOHLC, setChartOHLC] = useState<ISeriesApi<
			"Line",
			Time,
			LineData<Time> | WhitespaceData<Time>
		> | null>(null);
		const [candleData, setCandleData] = useState<CandleDataFormated>({
			time: Date.now().toString(),
			open: 0,
			high: 0,
			low: 0,
			close: 0,
		});

		const { mutate: getCachedCandles, mutateAsync: getCachedCandlesAsync } =
			useMutation({
				mutationKey: [queryKeys.multipoolsList, chartResolution],
				mutationFn: async () => {
					const data = await GetMultipoolChartData({
						m: id as Address,
						r: Number(chartResolution),
					});

					const sortedData = [...data].sort(
						(a, b) => Number(a.t) - Number(b.t),
					);

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
						const { result: formattedClose } = formatPriceData(item.c);

						return {
							time: Number(item.t) as Time,
							value: formattedClose,
						};
					});

					return candleData;
				},
			});

		useQuery({
			queryKey: [queryKeys.multipoolsList, chartResolution, currentFrom],
			queryFn: async () => {
				if (currentFrom >= -15) {
					return [];
				}
				if (!chartOHLC) {
					return [];
				}

				const currentData = chartOHLC.data();
				const earliestTimestamp =
					Number.parseInt(currentData[0].time.toString()) - 1;
				const countback = Number.parseInt((50 - currentFrom).toString());

				const data = await GetMultipoolChartData({
					m: id as Address,
					r: Number(chartResolution),
					c: countback,
					t: earliestTimestamp.toString(),
				});

				const history = data.map((item) => {
					const { result: formattedClose } = formatPriceData(item.c);

					return {
						time: Number(item.t) as Time,
						value: formattedClose,
					};
				});

				// combine existing data with history
				const combinedData = [...history, ...currentData].sort(
					(a, b) => Number(a.time) - Number(b.time),
				);

				chartOHLC.setData(combinedData as LineData<Time>[]);

				return combinedData;
			},
		});

		useQuery({
			queryKey: [queryKeys.multipoolsList, chartResolution],
			queryFn: async () => {
				if (!chartOHLC) {
					return;
				}
				const currentData = chartOHLC.data();

				const data = await GetMultipoolChartStats({
					m: id as Address,
					r: Number(chartResolution),
				});

				const currentCandle = data.cc;
				const previousCandle = data.pc;

				if (!previousCandleState) {
					setPreviousCandle(previousCandle);
				}

				if (chartResolution === "60") {
					// check if we have any of current candle OR previous candle
					const isSynced = currentData.some(
						(item) =>
							item.time === Number.parseInt(currentCandle.t) ||
							item.time === Number.parseInt(previousCandle.t),
					);

					if (!isSynced) {
						// refetch cached candles data
						const newCachedCandles = await getCachedCandlesAsync();
						if (!newCachedCandles) {
							throw new Error("No cached candles data available");
						}

						chartOHLC.setData(newCachedCandles);
					}
				} else {
					// check if we have any of current candle OR previous candle
					const isSynced = [previousCandleState, currentCandle].some(
						(item) =>
							Number.parseInt(item?.t || "0") ===
								Number.parseInt(currentCandle.t) ||
							Number.parseInt(item?.t || "0") ===
								Number.parseInt(previousCandle.t),
					);

					if (!isSynced) {
						// refetch cached candles data
						const newCachedCandles = await getCachedCandlesAsync();
						if (!newCachedCandles) {
							throw new Error("No cached candles data available");
						}

						chartOHLC.setData(newCachedCandles);
					}
				}
				const { result: close } = formatPriceData(currentCandle.c);

				switch (chartResolution) {
					case "60":
						{
							const timeToUpdate = Number.parseInt(currentCandle.t);
							chartOHLC.update({
								time: timeToUpdate as Time,
								value: close,
							});
						}
						break;
					case "900":
						{
							// 15mins candle, calculate the time to update
							const timeToUpdate =
								Number.parseInt(currentCandle.t) -
								(Number.parseInt(currentCandle.t) % 900) +
								900;
							chartOHLC.update({
								time: timeToUpdate as Time,
								value: close,
							});
						}
						break;
					case "3600":
						{
							// 1 hour candle, calculate the time to update
							const timeToUpdate =
								Number.parseInt(currentCandle.t) -
								(Number.parseInt(currentCandle.t) % 3600) +
								3600;
							chartOHLC.update({
								time: timeToUpdate as Time,
								value: close,
							});
						}
						break;
					case "86400":
						{
							// 1 day candle, calculate the time to update
							const timeToUpdate =
								Number.parseInt(currentCandle.t) -
								(Number.parseInt(currentCandle.t) % 86400) +
								86400;
							chartOHLC.update({
								time: timeToUpdate as Time,
								value: close,
							});
						}
						break;
				}

				return currentCandle;
			},
			enabled: chartOHLC !== null,
			refetchInterval: 1000,
			refetchIntervalInBackground: true,
			refetchOnWindowFocus: false,
		});

		useEffect(() => {
			if (chartContainerRef.current) {
				const chart = createChart(chartContainerRef.current, {
					timeScale: {
						tickMarkFormatter: (time: number) => {
							switch (chartResolution) {
								case "60":
									return new Date(time * 1000).toLocaleTimeString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
									});
								case "900":
									return new Date(time * 1000).toLocaleTimeString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
									});
								case "3600":
									return new Date(time * 1000).toLocaleDateString("en-US", {
										day: "2-digit",
										month: "2-digit",
										year: "2-digit",
									});
								default:
									return new Date(time * 1000).toLocaleDateString("en-US", {
										day: "2-digit",
										month: "2-digit",
										year: "2-digit",
									});
							}
						},
					},
					layout: {
						fontFamily: "/fonts/droid/droid-mono.ttf",
						fontSize: 14,
						attributionLogo: false,
						background: {
							type: ColorType.Solid,
							color: backgroundColor,
						},
						textColor: textColor,
					},
					grid: {
						vertLines: { color: gridColor },
						horzLines: { color: gridColor },
					},
					width: chartContainerRef.current.clientWidth,
					height: height,
				});

				const ohlc = chart.addSeries(LineSeries, { color: "#2962FF" });

				setChartOHLC(ohlc);
				getCachedCandles(undefined, {
					onSuccess: (data) => {
						ohlc.setData(data as LineData<Time>[]);
					},
				});

				chart.timeScale().fitContent();
				chart.timeScale().scrollToPosition(5, false);

				chart.subscribeCrosshairMove((item) => {
					const data = item.seriesData as Map<unknown, CandleDataFormated>;
					for (const [, value] of data) {
						setCandleData(value);
					}
				});

				chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
					if (range) {
						setCurrentFrom(range.from);
					}
				});

				const handleResize = () => {
					chart.applyOptions({
						width: chartContainerRef?.current?.clientWidth,
					});
				};

				window.addEventListener("resize", handleResize);

				return () => {
					window.removeEventListener("resize", handleResize);
					chart.remove();
				};
			}
		}, [chartResolution]);

		return (
			<div className="relative h-full w-full ">
				<div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-transparent font-droid text-[10px] text-text-secondary sm:text-[14px]">
					<div className="hidden flex-row gap-4 md:flex">
						<span>
							O{" "}
							<span
								className={cn(
									candleData?.open > candleData?.close &&
										"text-negative-secondary",
									candleData?.open < candleData?.close &&
										"text-positive-primary",
								)}
							>
								{candleData?.open}
							</span>
						</span>
						<span>
							H{" "}
							<span
								className={cn(
									candleData?.open > candleData?.close &&
										"text-negative-secondary",
									candleData?.open < candleData?.close &&
										"text-positive-primary",
								)}
							>
								{candleData?.high}
							</span>
						</span>
						<span>
							L{" "}
							<span
								className={cn(
									candleData?.open > candleData?.close &&
										"text-negative-secondary",
									candleData?.open < candleData?.close &&
										"text-positive-primary",
								)}
							>
								{candleData?.low}
							</span>
						</span>
						<span>
							C{" "}
							<span
								className={cn(
									candleData?.open > candleData?.close &&
										"text-negative-secondary",
									candleData?.open < candleData?.close &&
										"text-positive-primary",
								)}
							>
								{candleData?.close}
							</span>
						</span>
					</div>
					<div className="flex gap-4">
						{/* <span>
							Base volume{" "}
							<span className="text-text-brand-primary">87654.77</span>
						</span>
						<span>
							Quote volume{" "}
							<span className="text-text-brand-primary">87654.77</span>
						</span> */}
					</div>
				</div>
				<div ref={chartContainerRef} className="h-full w-full " />
			</div>
		);
	},
);
