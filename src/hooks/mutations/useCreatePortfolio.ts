import { useAccountStore } from "@/contexts/AccountContext";
import { useCreatePortfolio as useCreatePortfolioContext } from "@/contexts/CreatePortfolioContext";
import ERC20 from "@/lib/abi/ERC20";
import MultipoolRouter from "@/lib/abi/MultipoolRouter";

import { encodeUniV3PriceData, getMultipoolContractAddress } from "@/lib/utils";
import { useWallets } from "@privy-io/react-auth";
import { useEffect } from "react";
import {
	type Address,
	encodeAbiParameters,
	encodeFunctionData,
	formatUnits,
	maxUint256,
	zeroAddress,
} from "viem";
import {
	useChainId,
	useEstimateGas,
	useReadContract,
	useWriteContract,
} from "wagmi";

export const useCreatePortfolio = () => {
	const {
		name,
		symbol,
		initialSharePrice,
		deviationFee,
		deviationLimit,
		cashbackFeeShare,
		baseFee,
		// logo,
		// description,
		isDisabled,
		// managementFeeRecepient,
		managementFee,
		tokens,
		// initialLiquidityToken,
		// initialLiquidityAmount,
		setNetworkFee,
	} = useCreatePortfolioContext();

	const { wallets } = useWallets();
	const { writeContract } = useWriteContract();
	const { currentChain } = useAccountStore();
	const chainId = useChainId();

	const assetAddresses = tokens?.map(
		(token) => (token.address as Address) || zeroAddress,
	);
	const targetShares = tokens?.map((token) => Number(token.share || 0) * 100);

	const priceData = tokens?.map((token) =>
		encodeUniV3PriceData(
			(token?.poolAddress as Address) || zeroAddress,
			true,
			BigInt(0),
		),
	);

	const { nonce, contractAddress: multipoolAddress } =
		getMultipoolContractAddress({
			chainId: chainId || 42161,
		});

	const { data: allowance } = useReadContract({
		abi: ERC20,
		address: tokens[0]?.address,
		functionName: "allowance",
		args: [
			(wallets[0]?.address as Address) || "0x",
			(currentChain?.routerAddress as Address) || ("0x" as Address),
		],
		chainId,
		query: {
			enabled: !!wallets[0]?.address && !!tokens[0]?.address,
		},
	});

	const { data: approveGasEstimate } = useEstimateGas({
		to: tokens[0]?.address || zeroAddress,

		data: encodeFunctionData({
			abi: ERC20,
			functionName: "approve",
			args: [currentChain?.routerAddress as Address, BigInt(maxUint256)],
		}),
	});

	const { data: createMultipoolGasEstimate } = useEstimateGas({
		to: currentChain?.routerAddress as Address,
		value: BigInt(1e6),
		query: { enabled: !isDisabled && !!wallets[0]?.address },
		data: encodeFunctionData({
			abi: MultipoolRouter,
			functionName: "createMultipool",
			args: [
				{
					name: name || "",
					symbol: symbol || "",
					initialSharePrice: BigInt(initialSharePrice || 0),
					deviationIncreaseFee: Number(deviationFee || 0),
					deviationLimit: Number(deviationLimit || 0),
					feeToCashbackRatio: Number(cashbackFeeShare || 0),
					baseFee: Number(baseFee || 0),
					managementFee: Number(managementFee || 0),
					assetAddresses,
					targetShares,
					initialLiquidityAsset: zeroAddress,
					managementFeeRecepient:
						(wallets[0]?.address as Address) || zeroAddress,
					oracleAddress:
						(currentChain?.oracleAddress as Address) || zeroAddress,
					strategyManager: (wallets[0]?.address as Address) || zeroAddress,
					priceData,
					nonce: BigInt(nonce),
					owner: (wallets[0]?.address as Address) || zeroAddress,
				},
				[
					{
						callType: 0,
						data: encodeAbiParameters(
							[
								{ name: "token", type: "address" },
								{ name: "targetOrOrigin", type: "address" },
								{ name: "amount", type: "uint256" },
							],
							[
								tokens[0]?.address ||
									"0x0000000000000000000000000000000000000000",
								multipoolAddress as Address,
								BigInt(1e6),
							],
						),
					},
				],
				[], // calls after
			],
		}),
		account: (wallets[0]?.address as Address) || zeroAddress,
	});

	const totalGasWei =
		(approveGasEstimate || 0n) + (createMultipoolGasEstimate || 0n);

	const currentNetworkFee = formatUnits(
		totalGasWei,
		currentChain?.nativeCurrency?.decimals || 18,
	);

	useEffect(() => {
		setNetworkFee(currentNetworkFee);
	}, [currentNetworkFee]);

	const createPortfolio = async () => {
		if (allowance && allowance < maxUint256) {
			await writeContract({
				abi: ERC20,
				address: tokens[0]?.address as Address,
				functionName: "approve",
				args: [currentChain?.routerAddress as Address, BigInt(maxUint256)],
			});
		}

		try {
			if (name && symbol && initialSharePrice && tokens) {
				await writeContract({
					abi: MultipoolRouter,
					address: currentChain?.routerAddress as Address,
					functionName: "createMultipool",
					value: BigInt(1e6),
					args: [
						{
							name,
							symbol,
							initialSharePrice: BigInt(initialSharePrice),
							deviationIncreaseFee: Number(deviationFee), //Deviation fee,
							deviationLimit: Number(deviationLimit),
							feeToCashbackRatio: Number(cashbackFeeShare), ///Cashback fee share
							baseFee: Number(baseFee),
							managementFee: Number(managementFee),
							assetAddresses,
							targetShares,
							initialLiquidityAsset:
								"0x0000000000000000000000000000000000000000",
							managementFeeRecepient: wallets[0].address as Address,
							oracleAddress: currentChain?.oracleAddress as Address,
							strategyManager: wallets[0].address as Address,
							priceData,
							nonce: BigInt(nonce),
							owner: wallets[0].address as Address,
						},
						[
							{
								callType: 0,
								data: encodeAbiParameters(
									[
										{ name: "token", type: "address" },
										{ name: "targetOrOrigin", type: "address" },
										{ name: "amount", type: "uint256" },
									],
									[
										tokens[0]?.address || "0x",
										multipoolAddress as Address,
										BigInt(1e6),
									],
								),
							},
						],
						[], ///calls after
					],
					account: wallets[0].address as Address,
				});
			}
		} catch (e) {
			console.error("e: ", e);
		}
	};

	return { createPortfolio };
};
