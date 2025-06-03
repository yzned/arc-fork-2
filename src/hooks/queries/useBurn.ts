import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import ERC20 from "@/lib/abi/ERC20";
import MultipoolRouter from "@/lib/abi/MultipoolRouter";
import { type Hash, maxUint256 } from "viem";
import { useWriteContract } from "wagmi";
import { useCurrentPortfolio } from "../use-current-portfolio";
import { useMetadataChain } from "../use-metadata-chain";
import { useSwapArgs } from "./useSwapArgs";

interface UseMintReturnType {
	callStep: () => void;
}

// step 0 -> approve
// step 1 -> mint
export function useBurn({
	step,
	onApprove,
	onSwap,
}: {
	step: 0 | 1 | 2;
	onApprove?: (hash: Hash) => void;
	onSwap?: (hash: Hash) => void;
}): UseMintReturnType {
	const { selectedAsset, mintBurnAmount } = useExplorePortfolio();
	const { writeContract } = useWriteContract();
	const { chain } = useMetadataChain();
	const swapArgs = useSwapArgs();
	const { address: mpAddress } = useCurrentPortfolio();

	if (!selectedAsset) {
		return { callStep: () => {} };
	}

	if (!mintBurnAmount) {
		return { callStep: () => {} };
	}

	if (step === 0) {
		return {
			callStep: () =>
				writeContract(
					{
						abi: ERC20,
						address: mpAddress,
						functionName: "approve",
						args: [chain.routerAddress, maxUint256],
						chainId: chain.id,
					},
					{
						onSuccess: (data) => {
							if (onApprove) {
								onApprove(data);
							}
						},
					},
				),
		};
	}

	if (!swapArgs) {
		return {
			callStep: () => {},
		};
	}

	return {
		callStep: () =>
			writeContract(
				{
					abi: MultipoolRouter,
					address: chain.routerAddress,
					functionName: "swap",
					value: BigInt(1e16),
					args: [
						swapArgs.poolAddress,
						swapArgs.swapArgs,
						swapArgs.callsBefore,
						swapArgs.callsAfter,
					],
					chainId: chain.id,
				},
				{
					onSuccess: (data) => {
						if (onSwap) {
							onSwap(data);
						}
					},
					onError: (error) => {
						console.error("Error burning minting swap:", error);
						throw new Error(`Minting swap failed: ${error.message}`);
					},
				},
			),
	};
}
