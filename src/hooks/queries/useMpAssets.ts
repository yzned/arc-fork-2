import { GetMulpipools } from "@/api/explore";
import { queryKeys } from "@/api/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useMpAssets() {
	// const { setAllPortfolios } = useExplorePortfolio();

	const { mutateAsync } = useMutation({
		mutationKey: [queryKeys.multipoolsList],
		mutationFn: async () => {
			return await GetMulpipools();
		},
		onSuccess: (data) => {
			// setAllPortfolios(data);
		},
	});

	return useQuery({
		queryKey: [queryKeys.multipoolsList],
		queryFn: async () => {
			return await mutateAsync();
		},
	});
}
