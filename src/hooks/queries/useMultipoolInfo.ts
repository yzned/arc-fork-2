import { GetMultipoolInfo } from "@/api/explore";
import {
	type OnchainMultipoolAssetInfo,
	type OnchainMultipoolAssetPriceInfo,
	queryKeys,
} from "@/api/types";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import ERC20 from "@/lib/abi/ERC20";
import Multipool from "@/lib/abi/Multipool";
import { useWallets } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import type { Address } from "viem";
import { useChainId, usePublicClient } from "wagmi";

export const useMultipoolInfo = (multipool_address: Address) => {
	const { setPortfolioAssets, setSelectedAsset, setShortPortfolioData } =
		useExplorePortfolio();
	const { wallets } = useWallets();
	const chainId = useChainId();

	const client = usePublicClient();
	return useQuery({
		queryKey: [
			queryKeys.multipoolsList,
			multipool_address,
			client,
			wallets[0]?.address,
		],
		enabled: !!multipool_address && !!client,
		queryFn: async () => {
			try {
				const data = await GetMultipoolInfo({
					multipool_address,
					chain_id: chainId || 42161,
				});

				const baseAssets = data.cache.assets.slice(0, -1).map((item) => ({
					...item,
				}));

				setPortfolioAssets(baseAssets);
				setShortPortfolioData(data);

				if (baseAssets.length > 0 && client && wallets[0]?.address) {
					const assetInfo = await client?.multicall({
						contracts: baseAssets.map((item) => ({
							abi: Multipool,
							address: multipool_address,
							functionName: "getAsset",
							args: [item.address],
							chainId,
						})),
					});

					const prices = await client?.multicall({
						contracts: baseAssets.map((item) => ({
							abi: Multipool,
							address: multipool_address,
							functionName: "getPrice",
							args: [item.address],
							chainId,
						})),
					});

					const walletBalances = await client?.multicall({
						contracts: baseAssets.map((asset) => ({
							abi: ERC20,
							address: asset.address as Address,
							functionName: "balanceOf",
							args: [wallets[0]?.address],
							chainId: chainId,
						})),
					});

					const updatedAssets = baseAssets.map((item, index) => {
						const assetData = assetInfo[index] as OnchainMultipoolAssetInfo;
						const priceData = prices[index] as OnchainMultipoolAssetPriceInfo;
						const walletBalancesData = walletBalances[
							index
						] as OnchainMultipoolAssetPriceInfo;

						return {
							...item,
							price: {
								price:
									new BigNumber(BigInt(priceData?.result || 0).toString())
										.dividedBy(new BigNumber(2).pow(96))
										.toString() || "",
								timestamp: 0,
							},
							quantity: assetData?.result?.quantity?.toString() || "0",
							targetShare: assetData?.result?.targetShare || 0n,
							collectedCashbacks: assetData?.result?.collectedCashbacks || 0n,
							walletBalance: walletBalancesData.result || 0n,
						};
					});

					setPortfolioAssets(updatedAssets);
					setSelectedAsset({
						...updatedAssets,
						address: updatedAssets[0].address as Address,
					});
				}

				return data;
			} catch (error) {
				console.error("useMultipoolInfo error:", error);
				throw error;
			}
		},
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
};
