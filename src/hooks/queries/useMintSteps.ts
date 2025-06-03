import type { Step } from "@/components/ui/stepper";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import ERC20 from "@/lib/abi/ERC20";
import { useState } from "react";
import { type Hash, parseUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useMetadataChain } from "../use-metadata-chain";

export interface UseMintStepsType {
	steps: Step[];
	currentStep: 0 | 1 | 2;
	setApproveHash?: (hash: Hash | undefined) => void;
	setMintHash: (hash: Hash | undefined) => void;
}

export function useMintSteps(): UseMintStepsType {
	const [approveHash, setApproveHash] = useState<Hash | undefined>();
	const [mintHash, setMintHash] = useState<Hash | undefined>();

	const { chain } = useMetadataChain();
	const { address } = useAccount();
	const { selectedAsset, mintBurnAmount } = useExplorePortfolio();

	if (!address) {
		throw new Error(
			"Ensure you are connected to a wallet before using this hook. Wallet address is required for minting steps.",
		);
	}

	if (!selectedAsset) {
		throw new Error(
			"Selected asset is required for minting steps. Please select an asset before proceeding.",
		);
	}

	if (!mintBurnAmount) {
		throw new Error(
			"Mint burn amount is required for minting steps. Please set the mint burn amount before proceeding.",
		);
	}

	const { data: allowance } = useReadContract({
		abi: ERC20,
		address: selectedAsset.address,
		functionName: "allowance",
		args: [address, chain.routerAddress],
		query: {
			refetchInterval: 1000, // Refetch every 10 seconds
		},
	});

	if (allowance === undefined) {
		return {
			steps: [
				{ id: "step1", title: "Approve", txnHash: approveHash },
				{ id: "step2", title: "Mint", txnHash: mintHash },
			],
			currentStep: 0,
			setApproveHash,
			setMintHash,
		};
	}

	const mintAmount = parseUnits(mintBurnAmount, selectedAsset.decimals);

	if (allowance < mintAmount) {
		return {
			steps: [
				{ id: "step1", title: "Approve", txnHash: approveHash },
				{ id: "step2", title: "Mint", txnHash: mintHash },
			],
			currentStep: 0,
			setApproveHash,
			setMintHash,
		};
	}

	if (approveHash) {
		return {
			steps: [
				{ id: "step1", title: "Approve", txnHash: approveHash },
				{ id: "step2", title: "Mint", txnHash: mintHash },
			],
			currentStep: 1,
			setApproveHash,
			setMintHash,
		};
	}

	if (!mintHash) {
		return {
			steps: [
				{ id: "step1", title: "Approve", txnHash: approveHash },
				{ id: "step2", title: "Mint", txnHash: mintHash },
			],
			currentStep: 1,
			setApproveHash,
			setMintHash,
		};
	}

	return {
		steps: [
			{ id: "step1", title: "Approve", txnHash: approveHash },
			{ id: "step2", title: "Mint", txnHash: mintHash },
		],
		currentStep: 2,
		setApproveHash,
		setMintHash,
	};
}

export function useMintStepsNative(): UseMintStepsType {
	const [mintHash, setMintHash] = useState<Hash | undefined>();

	const { address } = useAccount();
	const { selectedAsset, mintBurnAmount } = useExplorePortfolio();

	if (!address) {
		throw new Error(
			"Ensure you are connected to a wallet before using this hook. Wallet address is required for minting steps.",
		);
	}

	if (!selectedAsset) {
		throw new Error(
			"Selected asset is required for minting steps. Please select an asset before proceeding.",
		);
	}

	if (!mintBurnAmount) {
		throw new Error(
			"Mint burn amount is required for minting steps. Please set the mint burn amount before proceeding.",
		);
	}

	if (!mintHash) {
		return {
			steps: [{ id: "step2", title: "Mint", txnHash: mintHash }],
			currentStep: 0,
			setMintHash,
		};
	}

	return {
		steps: [{ id: "step2", title: "Mint", txnHash: mintHash }],
		currentStep: 1,
		setMintHash,
	};
}
