import { GetMultipoolChartData } from "@/api/explore";
import { queryKeys } from "@/api/types";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useChart = () => {
	const { setPorfolioCandles, setPorfolioLinear, chartResolution } =
		useExplorePortfolio();

	const { mutateAsync } = useMutation({
		mutationKey: [queryKeys.multipoolsList],
		mutationFn: async () => {
			const to = Math.floor(Date.now() / 1000);

			const data = await GetMultipoolChartData({
				chain_id: 421614,
				multipool_address: "0x46489e10e6e78eafe087fde1bc74e745182a2eab",
				resolution: chartResolution,
				countback: 100,
				to,
			});

			const { c, h, l, o, t } = data;

			const chartData = t.map((timestamp, index) => ({
				time: Number(timestamp),
				open: Number.parseFloat(o[index]),
				high: Number.parseFloat(h[index]),
				low: Number.parseFloat(l[index]),
				close: Number.parseFloat(c[index]),
			}));

			const lineChartData = t.map((timestamp, index) => ({
				time: Number(timestamp),
				value: Number.parseFloat(c[index]),
			}));

			return { chartData, lineChartData };
		},
		onSuccess: (data) => {
			setPorfolioCandles(data.chartData);
			setPorfolioLinear(data.lineChartData);
		},
	});

	return useQuery({
		queryKey: [queryKeys.multipoolsList, chartResolution],
		queryFn: async () => {
			return await mutateAsync();
		},
	});
};
