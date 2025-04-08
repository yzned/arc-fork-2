import { GetMultipoolInfo } from "@/api/explore";
import { queryKeys } from "@/api/types";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Address } from "viem";

export const useMultipoolInfo = (multipool_address: Address) => {
	const { setMultipoolAssets } = useExplorePortfolio();

	const { mutateAsync } = useMutation({
		mutationKey: [queryKeys.multipoolsList, multipool_address],
		mutationFn: async () => {
			const data = await GetMultipoolInfo({ multipool_address });

			return { data };
		},
		onSuccess: (data) => {
			setMultipoolAssets(
				data.data.assets.map((item) => ({
					...item,
					price: {
						price: item.price.value,
						timestamp: item.price.timestamp,
					},
				})),
			);
		},
	});

	return useQuery({
		queryKey: [queryKeys.multipoolsList],
		queryFn: async () => {
			return await mutateAsync();
		},
	});
};
