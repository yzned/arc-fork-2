import { GetTokens } from "@/api/explore";
import { queryKeys } from "@/api/types";
import { useAccountStore } from "@/contexts/AccountContext";
import { TAGS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";

export const useTokensList = () => {
	const { currentChain, setCurrentChain } = useAccountStore();
	const chainId = useChainId();

	return useQuery({
		enabled: !!currentChain?.id,
		queryKey: [queryKeys.tokensList, currentChain?.id, chainId],
		queryFn: async () => {
			const rowData = await GetTokens({ chainId: currentChain?.id as number });

			const parsedData = rowData.map((token) => ({
				name: token.n,
				symbol: token.s,
				address: token.a,
				logo: token.l,
				cmc: token.cm,
				coingecko: token.cg,
				decimals: token.d ?? 18,
				tags: token.t?.map((index: number) => TAGS[index]) ?? [],
			}));

			if (currentChain?.id) {
				setCurrentChain({
					...currentChain,
					availableTokens: parsedData,
				});
			}

			return parsedData;
		},
	});
};
