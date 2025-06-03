import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import Multipool from "@/lib/abi/Multipool";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { type Address, formatUnits, parseUnits, zeroAddress } from "viem";
import { useBalance, usePublicClient } from "wagmi";
import { useCallsBefore } from "./useCallsBefore";

interface useMinimumReceive {
	tokensReceive: string;
	minimumReceive: string;
}

export function useMinimumReceive() {
	const { id: mpAddress } = useParams({ from: "/explore/$id" });
	const client = usePublicClient();
	const { data: balance } = useBalance();
	const { data: calls } = useCallsBefore();

	if (!client) {
		throw Error(
			"Public client is not available. Ensure you are connected to a network.",
		);
	}

	const { rightSectionState, selectedAsset, slippage, mintBurnAmount } =
		useExplorePortfolio();

	const isMint = rightSectionState === "mint";

	return useQuery({
		queryKey: [
			"estimateSwap",
			mpAddress,
			selectedAsset,
			isMint,
			mintBurnAmount,
		],
		queryFn: async () => {
			if (!selectedAsset) {
				throw new Error(
					"Selected asset is required for estimating swap. Please select an asset before proceeding.",
				);
			}
			if (balance !== undefined) {
				throw new Error(
					"Balance is required for estimating swap. Please ensure you have a balance before proceeding.",
				);
			}
			const oraclePrice = {
				contractAddress: zeroAddress as Address, /// random address
				timestamp: BigInt(Math.floor(Date.now() / 1000)),
				sharePrice: BigInt(1e2),
				signature: zeroAddress as Address, /// random address
			};

			const swapAmount = parseUnits(
				mintBurnAmount || "0",
				isMint ? selectedAsset.decimals : 18,
			);

			if (!calls) {
				throw new Error(
					"Calls before are required for estimating swap. Please ensure you have the necessary calls before proceeding.",
				);
			}

			const { callsBefore, optional } = calls;

			if (callsBefore[0].callType === 0) {
				const assetIn = isMint
					? (selectedAsset.address as Address)
					: (mpAddress as Address);
				const assetOut = isMint ? mpAddress : selectedAsset.address;

				const result = await client.readContract({
					abi: Multipool,
					address: mpAddress as Address,
					functionName: "checkSwap",
					args: [
						oraclePrice,
						assetIn as Address,
						assetOut as Address,
						swapAmount,
						isMint,
					],
				});

				const tokensReceive = formatUnits(
					result[1],
					isMint ? 18 : selectedAsset.decimals,
				);

				const minimumReceive = (
					Number(tokensReceive) -
					(Number(tokensReceive) * Number(slippage)) / 100
				).toString();

				return {
					tokensReceive: tokensReceive,
					minimumReceive: minimumReceive,
				};
			}

			const assetIn = isMint
				? (optional?.returnEstimate.token as Address)
				: (mpAddress as Address);
			const assetOut = isMint
				? (mpAddress as Address)
				: (optional?.returnEstimate.token as Address);

			const result = await client.readContract({
				abi: Multipool,
				address: mpAddress as Address,
				functionName: "checkSwap",
				args: [
					oraclePrice,
					assetIn as Address,
					assetOut as Address,
					swapAmount,
					isMint,
				],
			});

			const tokensReceive = formatUnits(
				result[1],
				isMint ? 18 : selectedAsset.decimals,
			);
			const minimumReceive = (
				Number(tokensReceive) -
				(Number(tokensReceive) * Number(slippage)) / 100
			).toString();

			return {
				tokensReceive: tokensReceive,
				minimumReceive: minimumReceive,
			} as useMinimumReceive;
		},
		enabled: balance && mintBurnAmount !== "0" && !!selectedAsset && !!calls,
	});
}
