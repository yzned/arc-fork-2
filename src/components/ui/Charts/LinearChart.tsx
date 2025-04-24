import type { LinearDataFormated } from "@/api/types";
import {
	AreaSeries,
	ColorType,
	type Time,
	createChart,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

type LinearChartProps = {
	data: LinearDataFormated[];

	backgroundColor?: string;
	mainLineColor?: string;
	gridColor?: string;
	textColor?: string;

	height?: number;
};

export const LinearChart = ({
	backgroundColor = "#17161B",
	gridColor = "#1F1F1F",
	mainLineColor = "#0148FE",
	textColor = "#8A8B8C",
	height = 400,
	data,
}: LinearChartProps) => {
	const chartContainerRef = useRef<HTMLDivElement>(null);

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

			const newSeries = chart.addSeries(AreaSeries, {
				lineColor: mainLineColor,
				topColor: mainLineColor,
				bottomColor: "transparent",
			});

			if (data) {
				newSeries.setData(
					data.map((item) => {
						return { ...item, time: item.time as Time };
					}),
				);
			}

			const handleResize = () => {
				chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
			};

			window.addEventListener("resize", handleResize);

			return () => {
				window.removeEventListener("resize", handleResize);
				chart.remove();
			};
		}
	}, [backgroundColor, mainLineColor, gridColor, textColor, data]);

	return (
		<div className="h-full w-full">
			<div ref={chartContainerRef} className="h-full w-full" />
		</div>
	);
};
