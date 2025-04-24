import { queryKeys } from "@/api/types";
import { useAccountStore } from "@/contexts/AccountContext";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import ERC20 from "@/lib/abi/ERC20";
import MultipoolRouter from "@/lib/abi/MultipoolRouter";
import { config } from "@/lib/config";
import { MULTIPOOL_ROUTER_ADDRESS } from "@/lib/constants";
import type { ChainId } from "@/lib/types";
import { useWallets } from "@privy-io/react-auth";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import {
	type Address,
	encodeAbiParameters,
	encodeFunctionData,
	formatUnits,
	maxUint256,
	parseUnits,
	zeroAddress,
} from "viem";
import {
	useChainId,
	useEstimateGas,
	usePublicClient,
	useReadContract,
	useWriteContract,
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

export const useMintBurn = () => {
	const { wallets } = useWallets();
	const {
		selectedAsset,
		rightSectionState,
		mintBurnAmount,
		setSwapNetworkFee,
	} = useExplorePortfolio();

	const queryClient = useQueryClient();

	const chainId = useChainId();
	const { currentChain } = useAccountStore();
	const client = usePublicClient();
	const { id: mpAddress } = useParams({ from: "/explore/$id" });

	const { data: hash, writeContract } = useWriteContract();

	const isMint = rightSectionState === "mint";

	const assetIn = isMint
		? (selectedAsset.address as Address) || zeroAddress
		: (mpAddress as Address) || zeroAddress;

	const swapAmount = parseUnits(
		mintBurnAmount?.toString() || "0",
		isMint ? 6 : 18,
	);

	const { data: allowance } = useReadContract({
		abi: ERC20,
		address: assetIn,
		functionName: "allowance",
		args: [(wallets[0]?.address as Address) || "0x", MULTIPOOL_ROUTER_ADDRESS],
		chainId: chainId as ChainId,
		query: {
			enabled: !!wallets[0]?.address,
		},
	});

	const swapArgs = {
		poolAddress: (mpAddress as Address) || zeroAddress,
		swapArgs: {
			oraclePrice: {
				contractAddress:
					"0x88888Aa374dBDe60d26433E275aD700B65872063" as Address, /// random address
				timestamp: BigInt(Math.floor(Date.now() / 1000)),
				sharePrice: BigInt(1e2),
				signature: "0x88888Aa374dBDe60d26433E275aD700B65872063" as Address, /// random address
			},
			assetIn,
			assetOut: isMint
				? (mpAddress as Address) || zeroAddress
				: (selectedAsset.address as Address) || zeroAddress,
			swapAmount,
			isExactInput: isMint,
			receiverData: {
				receiverAddress: (wallets[0]?.address as Address) || zeroAddress,
				refundAddress: (wallets[0]?.address as Address) || zeroAddress,
				refundEthToReceiver: true,
			},
			ethValue: BigInt(1e6),
		},
		callsBefore: [
			{
				callType: 0,
				data: encodeAbiParameters(
					[
						{ name: "token", type: "address" },
						{ name: "targetOrOrigin", type: "address" },
						{ name: "amount", type: "uint256" },
					],
					[
						assetIn || zeroAddress,
						(mpAddress as Address) || zeroAddress,
						swapAmount,
					],
				),
			},
		],
		callsAfter: [],
	};

	const { data: approveGasEstimate } = useEstimateGas({
		to: isMint
			? (selectedAsset.address as Address) || zeroAddress
			: (mpAddress as Address) || zeroAddress,
		data: encodeFunctionData({
			abi: ERC20,
			functionName: "approve",
			args: [
				(currentChain?.routerAddress as Address) || zeroAddress,
				BigInt(maxUint256),
			],
		}),
	});

	useEffect(() => {
		const estimateGas = async () => {
			try {
				const swapEstimateGas = await client.estimateContractGas({
					value: BigInt(1e6),
					address: MULTIPOOL_ROUTER_ADDRESS as Address,
					abi: MultipoolRouter,
					functionName: "swap",
					args: [
						swapArgs.poolAddress,
						swapArgs.swapArgs,
						swapArgs.callsBefore,
						swapArgs.callsAfter,
					],

					account: wallets[0]?.address as Address,
				});

				const totalGasWei =
					(swapEstimateGas || 0n) +
					(allowance && allowance < maxUint256 ? approveGasEstimate || 0n : 0n);

				const currentNetworkFee = formatUnits(
					totalGasWei,
					currentChain?.nativeCurrency?.decimals || 18,
				);

				setSwapNetworkFee(currentNetworkFee);
			} catch (err) {
				console.error("Error estimating gas:", err);
			}
		};
		if (mintBurnAmount) {
			estimateGas();
		}
	}, [swapArgs, wallets, client]);

	const handleSwap = async () => {
		try {
			const data = await writeContract({
				value: BigInt(1e6),
				address: MULTIPOOL_ROUTER_ADDRESS as Address,
				abi: MultipoolRouter,
				functionName: "swap",
				args: [
					swapArgs.poolAddress,
					swapArgs.swapArgs,
					swapArgs.callsBefore,
					swapArgs.callsAfter,
				],
				chainId: chainId as ChainId,
				account: wallets[0]?.address as Address,
			});

			await new Promise((resolve) => setTimeout(resolve, 10000));

			await queryClient.invalidateQueries({
				queryKey: [queryKeys.multipoolsList],
			});

			return data;
		} catch (error) {
			console.error("Simulation error: ", error);

			throw error;
		}
	};

	const handleMintBurn = async () => {
		try {
			if (allowance && allowance < maxUint256) {
				await writeContract({
					abi: ERC20,
					address: isMint
						? (selectedAsset.address as Address)
						: (mpAddress as Address),
					functionName: "approve",
					args: [MULTIPOOL_ROUTER_ADDRESS as Address, maxUint256],
					account: wallets[0]?.address as Address,
					chainId: chainId as ChainId,
				});
			}
			if (hash) {
				await waitForTransactionReceipt(config, {
					hash,
					chainId: chainId as ChainId,
				});
			}
			await handleSwap();
		} catch (error) {
			console.error("Simulation failed:", error);
		}
	};

	return { handleMintBurn };
};
