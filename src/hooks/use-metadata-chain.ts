import { chainsMetadata } from "@/lib/constants";
import type { ChainMetadata } from "@/lib/types";
import { useChainId } from "wagmi";
import { useTokensList } from "./queries/useTokensList";

export function useMetadataChain(): { chain: ChainMetadata } {
	const chainId = useChainId();
	const chain = chainsMetadata.find((chain) => chain.id === chainId);
	const { data } = useTokensList();

	if (!chain) {
		throw new Error(`Chain with ID ${chainId} not found in metadata.`);
	}

	return {
		chain: { ...chain, availableTokens: data },
	};
}
