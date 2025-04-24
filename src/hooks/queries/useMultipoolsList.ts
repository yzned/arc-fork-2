import { GetMultipools } from "@/api/explore";
import { queryKeys } from "@/api/types";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";

export const useMultipoolsList = () => {
	const { setAllPortfolios } = useExplorePortfolio();
	const chainId = useChainId();

	return useQuery({
		queryKey: [queryKeys.multipoolsList, chainId],
		queryFn: async () => {
			const data = await GetMultipools(chainId || 42161);
			setAllPortfolios(data);
			return data;
		},
		enabled: !!chainId,
	});
};
