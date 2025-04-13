import { GetMultipoolInfo } from "@/api/explore";
import {
	type OnchainMultipoolAssetInfo,
	type OnchainMultipoolAssetPriceInfo,
	queryKeys,
} from "@/api/types";
import { useAccountStore } from "@/contexts/AccountContext";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import ERC20 from "@/lib/abi/ERC20";
import Multipool from "@/lib/abi/Multipool";
import { useWallets } from "@privy-io/react-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import type { Address } from "viem";

export const useMultipoolInfo = (multipool_address: Address) => {
	const { setPortfolioAssets, setSelectedAsset } = useExplorePortfolio();
	const { wallets } = useWallets();

	const { nativeToken, currentClient, currentChain } = useAccountStore();

	// const { data: quantities } = useReadContracts({
	// 	contracts: portfolioAssets?.map((asset) => ({
	// 		abi: ERC20,
	// 		address: asset.address as Address,
	// 		functionName: "balanceOf",
	// 		args: [wallets[0]?.address],
	// 		chainId: currentChain.id as 1 | 42161 | 421614,
	// 	})),
	// });

	const { mutateAsync } = useMutation({
		mutationKey: [queryKeys.multipoolsList, multipool_address, currentClient],
		mutationFn: async () => {
			const data = await GetMultipoolInfo({
				multipool_address,
				chain_id: currentChain.id,
			});

			return { data };
		},
		onError: (error) => {
			console.log(error);
		},
		onSuccess: async (data) => {
			try {
				const baseAssets = data.data.cache.assets.slice(0, -1).map((item) => ({
					...item,
				}));

				setPortfolioAssets(baseAssets);

				if (baseAssets.length > 0) {
					const assetInfo = await currentClient?.multicall({
						contracts: baseAssets.map((item) => ({
							abi: Multipool,
							address: multipool_address,
							functionName: "getAsset",
							args: [item.address],
							chainId: nativeToken.chainId,
						})),
					});

					const prices = await currentClient?.multicall({
						contracts: baseAssets.map((item) => ({
							abi: Multipool,
							address: multipool_address,
							functionName: "getPrice",
							args: [item.address],
							chainId: nativeToken.chainId,
						})),
					});

					const walletBalaces = await currentClient?.multicall({
						contracts: baseAssets.map((asset) => ({
							abi: ERC20,
							address: asset.address as Address,
							functionName: "balanceOf",
							args: [wallets[0]?.address],
							chainId: currentChain.id as 1 | 42161 | 421614,
						})),
					});

					const updatedAssets = baseAssets.map((item, index) => {
						const assetData = assetInfo[index] as OnchainMultipoolAssetInfo;
						const priceData = prices[index] as OnchainMultipoolAssetPriceInfo;
						const walletBalacesData = walletBalaces[
							index
						] as OnchainMultipoolAssetPriceInfo;

						return {
							...item,
							price: {
								price:
									new BigNumber(Number(priceData?.result) || 0)
										.multipliedBy(
											new BigNumber(10).pow(-(nativeToken?.decimals || 0)),
										)
										.toString() || "",
								timestamp: 0,
							},
							quantity: assetData?.result?.quantity?.toString() || "0",
							targetShare: assetData?.result?.targetShare || 0n,
							collectedCashbacks: assetData?.result?.collectedCashbacks || 0n,
							walletBalance: walletBalacesData.result || 0n,
						};
					});

					setPortfolioAssets(updatedAssets);
					setSelectedAsset({
						...updatedAssets,
						address: updatedAssets[0].address as Address,
					});
				}
			} catch (error) {
				console.error("Multicall error:", error);
			}
		},
	});

	return useQuery({
		queryKey: [queryKeys.multipoolsList],
		queryFn: async () => {
			return await mutateAsync();
		},
	});
};
