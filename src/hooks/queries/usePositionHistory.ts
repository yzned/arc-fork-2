import { GetPositionsHistory } from "@/api/explore";
import { queryKeys } from "@/api/types";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useChainId } from "wagmi";

export function usePositions() {
	const { address: userAddress } = useAccount();
	const chainId = useChainId();

	return useQuery({
		queryKey: [queryKeys.positions, userAddress, chainId],
		queryFn: async () => {
			if (!userAddress) return [];
			const positions = await GetPositionsHistory({ userAddress });
			return positions;
		},
		enabled: !!userAddress,
		refetchInterval: 10000,
	});
}
