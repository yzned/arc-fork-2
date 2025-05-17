// import { GetMultipoolInfo } from "@/api/explore";
import { GetMultipoolChartStats, GetMultipoolInfo } from "@/api/explore";
import { queryKeys } from "@/api/types";
import { useAccountStore } from "@/contexts/AccountContext";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import ERC20 from "@/lib/abi/ERC20";
import Multipool from "@/lib/abi/Multipool";
import { twoPow96 } from "@/lib/constants";
import type {
	ChainId,
	OnChainResultAssetInformation,
	PorfolioAsset,
} from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import BigNumber from "bignumber.js";
import { maxUint256, type Address } from "viem";
import { useChainId, usePublicClient, useReadContract } from "wagmi";

export const useMultipoolInfo = () => {
	const client = usePublicClient();
	const chainId = useChainId();

	const { setMultipoolSupplyPriceData, setPortfolioAssets } =
		useExplorePortfolio();
	const { currentChain } = useAccountStore();

	const { id } = useParams({ from: "/explore/$id" });

	const { data: assetsAddresses } = useReadContract({
		abi: Multipool,
		functionName: "getUsedAssets",
		address: id as Address,
		args: [BigInt(maxUint256), BigInt(0)],
		chainId: chainId as ChainId,
	});

	useQuery({
		queryKey: [queryKeys.portfolioPriceData, id, chainId],
		queryFn: async () => {
			const etfData = await GetMultipoolChartStats({
				m: id as Address,
				r: 86400,
			});
			const totalSuply = new BigNumber(BigInt(etfData.t).toString()).div(
				twoPow96,
			);

			const price = new BigNumber(etfData.c.toString()).div(twoPow96);

			/// what will i do with this?()
			const tvl = totalSuply.multipliedBy(price);

			const open = new BigNumber(etfData.o || 0).div(twoPow96);
			const close = new BigNumber(etfData.c || 0).div(twoPow96);

			const absolute24hPriceChange = price.minus(
				new BigNumber(etfData.o || 0).div(twoPow96),
			);

			const relative24hPriceChange = new BigNumber(
				open.isZero()
					? "0"
					: new BigNumber(absolute24hPriceChange)
							.multipliedBy(100)
							.dividedBy(close)
							.toString(),
			);

			setMultipoolSupplyPriceData({
				absolute24hPriceChange,
				relative24hPriceChange,
				tvl,
				close,
				open,
				price,
			});

			return {};
		},
		enabled: !!id && !!chainId,
		refetchInterval: 1000,
	});

	useQuery({
		queryKey: [queryKeys.porfolioAssets, id, client],
		enabled:
			!!id && !!client && !!assetsAddresses && !!currentChain?.availableTokens,
		queryFn: async () => {
			try {
				if (assetsAddresses) {
					const data = await GetMultipoolInfo({
						multipoolAddresses: [id as Address],
					});

					console.log("data: ", data);

					const results = await client?.multicall({
						contracts: assetsAddresses[0].flatMap((address) => [
							{
								abi: Multipool,
								address: id as Address,
								functionName: "getAsset",
								args: [address],
								chainId,
							},
							{
								abi: Multipool,
								address: id as Address,
								functionName: "getPrice",
								args: [address],
								chainId,
							},
							{
								abi: ERC20,
								address,
								functionName: "decimals",
								chainId,
							},
						]),
					});

					const combinedAssets = assetsAddresses[0]
						.map((address, index) => {
							const image = currentChain?.availableTokens?.find(
								(item) => item.address === address,
							)?.logo;
							const symbol = currentChain?.availableTokens?.find(
								(item) => item.address === address,
							)?.symbol;

							const baseIndex = index * 3;

							if (
								results?.[baseIndex].status !== "success" ||
								results?.[baseIndex + 1].status !== "success" ||
								results?.[baseIndex + 2].status !== "success"
							) {
								console.warn(`Skipping asset ${address} due to failed calls`);
								return null;
							}

							const assetData = results?.[baseIndex]
								.result as unknown as OnChainResultAssetInformation;

							const price = new BigNumber(
								BigInt(results?.[baseIndex + 1].result || 0).toString(),
							)
								.div(twoPow96)
								.toString();

							const quantity = new BigNumber(assetData.quantity.toString())
								.div(twoPow96)
								.toString();
							const decimal = results?.[baseIndex + 2].result || 18;

							return {
								image,
								symbol,
								address,
								assetData: { ...assetData, quantity },
								price,
								decimal: Number(decimal),
							};
						})
						.filter(
							(a) => a !== null && a.assetData.targetShare !== BigInt(0),
						) as PorfolioAsset[];

					setPortfolioAssets(combinedAssets);

					return combinedAssets;
				}
			} catch (error) {
				console.error("useMultipoolInfo error:", error);
				throw error;
			}
		},
	});

	return {};
};
