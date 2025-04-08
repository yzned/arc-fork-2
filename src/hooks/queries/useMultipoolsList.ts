import { GetMultipools } from "@/api/explore";
import { queryKeys } from "@/api/types";
import { useAccountStore } from "@/contexts/AccountContext";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useQuery } from "@tanstack/react-query";

export const useMultipoolsList = () => {
	const { setAllPortfolios } = useExplorePortfolio();
	const { currentChain } = useAccountStore();

	return useQuery({
		queryKey: [queryKeys.multipoolsList, currentChain.id],
		queryFn: async () => {
			const data = await GetMultipools(currentChain.id);
			setAllPortfolios(data);
			return data;
		},
		enabled: !!currentChain.id,
	});
};
