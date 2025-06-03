import MultipoolRouter from "@/lib/abi/MultipoolRouter";
import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";
import { useMetadataChain } from "../use-metadata-chain";
import { useSwapArgs } from "./useSwapArgs";

export function useNetworkFee() {
	const swapArgs = useSwapArgs();
	const { chain } = useMetadataChain();
	const client = usePublicClient();
	const { address } = useAccount();

	const { data: swapEstimateGas } = useQuery({
		queryKey: ["estimateNetworkFee", swapArgs],
		queryFn: async () => {
			if (!client) {
				return 0n;
			}

			if (!swapArgs) {
				return 0n;
			}

			return await client.estimateContractGas({
				value: BigInt(1e16),
				address: chain.routerAddress,
				abi: MultipoolRouter,
				functionName: "swap",
				args: [
					swapArgs.poolAddress,
					swapArgs.swapArgs,
					swapArgs.callsBefore,
					swapArgs.callsAfter,
				],
				account: address,
			});
		},
	});

	return swapEstimateGas;
}
