import { GetTokens } from "@/api/explore";
import { type AvailableChainTokensDataFormated, queryKeys } from "@/api/types";
import ERC20 from "@/lib/abi/ERC20";
import { TAGS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { formatUnits, type Address } from "viem";
import { useAccount, useChainId, usePublicClient } from "wagmi";
import { useNativeToken } from "./useNativeToken";
import BigNumber from "bignumber.js";

export const useTokensList = () => {
	const chainId = useChainId();

	// native token
	const nativeToken = useNativeToken();
	const { address } = useAccount();
	const client = usePublicClient();

	return useQuery({
		queryKey: [queryKeys.tokensList, chainId, address],
		refetchInterval: 1000 * 60,
		queryFn: async () => {
			const rowData = await GetTokens({ chainId: chainId });

			const quantitiesOnWallet = await client?.multicall({
				contracts: rowData?.map((token) => ({
					abi: ERC20,
					address: token.a as Address,
					functionName: "balanceOf",
					args: [address],
					chainId,
				})),
			});

			const nativeBalanceRow = await client?.getBalance({
				address: address as Address,
			});

			const nativeBalance = formatUnits(
				nativeBalanceRow || 0n,
				nativeToken.decimals,
			);

			const parsedData: AvailableChainTokensDataFormated[] = rowData.map(
				(token, index) => {
					const resultQuantities = quantitiesOnWallet?.[index]?.result;

					const quantityOnWallet = resultQuantities
						? new BigNumber(resultQuantities.toString()).multipliedBy(
								new BigNumber(10).pow(-(token?.d ?? 18)),
							)
						: new BigNumber(0);

					return {
						name: token.n,
						symbol: token.s,
						address: token.a as Address,
						logo: token.l,
						cmc: token.cm,
						coingecko: token.cg,
						decimals: token.d ?? 18,
						tags: token.t?.map((index: number) => TAGS[index]) ?? [],
						quantityOnWallet: quantityOnWallet,
					};
				},
			);

			parsedData.unshift({
				...nativeToken,
				quantityOnWallet: new BigNumber(nativeBalance?.toString() || 0),
			});

			return parsedData;
		},
	});
};
