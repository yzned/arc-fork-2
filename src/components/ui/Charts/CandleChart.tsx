import type { CandleDataFormated } from "@/api/types";
import { cn } from "@/lib/utils";
import {
	CandlestickSeries,
	ColorType,
	type Time,
	createChart,
} from "lightweight-charts";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

type CandleChartProps = {
	data: CandleDataFormated[];

	backgroundColor?: string;
	mainLineColor?: string;
	gridColor?: string;
	textColor?: string;

	height?: number;
};

export const CandleChart = observer(
	({
		backgroundColor = "#17161B",
		gridColor = "#1F1F1F",
		mainLineColor = "#0148FE",
		textColor = "#8A8B8C",
		height = 400,
		data,
	}: CandleChartProps) => {
		const chartContainerRef = useRef<HTMLDivElement>(null);

		const [candleData, setCandleData] = useState<CandleDataFormated>(
			data[data?.length - 1],
		);

		useEffect(() => {
			if (chartContainerRef.current) {
				const chart = createChart(chartContainerRef.current, {
					timeScale: {
						tickMarkFormatter: (time: number) => {
							const date = new Date(time);
							return date.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								minute: "numeric",
								second: "numeric",
							});
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

				chart.timeScale().fitContent();

				const newSeries = chart.addSeries(CandlestickSeries, {
					upColor: "#12A610",
					downColor: "#D10F0F",
					borderDownColor: "#D10F0F",
					borderUpColor: "#12A610",
					wickDownColor: "#D10F0F",
					wickUpColor: "#12A610",
				});

				if (data) {
					newSeries.setData(
						data.map((item) => {
							return { ...item, time: item.time as Time };
						}),
					);
				}

				chart.subscribeCrosshairMove((item) => {
					const data = item.seriesData as Map<unknown, CandleDataFormated>;
					for (const [, value] of data) {
						setCandleData(value);
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
		}, [backgroundColor, mainLineColor, gridColor, textColor, data]);

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
