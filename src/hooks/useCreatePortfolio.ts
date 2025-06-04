import { useCreatePortfolio as useCreatePortfolioContext } from "@/contexts/CreatePortfolioContext";
import ERC20 from "@/lib/abi/ERC20";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";

import { Same } from "@/api/uniswap";
import MultipoolFactory from "@/lib/abi/MultipoolFactory";
import {
	encodePriceData,
	generateNonce,
	getMultipoolContractAddress,
	getValidAddress,
	toBase64,
} from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
	type Address,
	encodeAbiParameters,
	maxUint256,
	parseUnits,
	zeroAddress,
} from "viem";
import {
	useAccount,
	useChainId,
	usePublicClient,
	useReadContract,
	useWriteContract,
} from "wagmi";

import { PRICE_FEEDS, feesCoefficients } from "@/lib/constants";
import { useMetadataChain } from "./use-metadata-chain";
import { useToast } from "./use-toast";
import { CreateMultipool } from "@/api/create";
import MultipoolRouter from "@/lib/abi/MultipoolRouter";
import type { ChainId } from "@/lib/types";

export const useCreatePortfolio = () => {
	const {
		name,
		description,
		symbol,
		deviationFee,
		deviationLimit,
		cashbackFeeShare,
		baseFee,
		logo,
		managementFeeRecepient,
		managementFee,
		tokens,
		initialLiquidityToken,
		initialLiquidityAmount,
		setCurrentCreateModalState,
		setCreateTxHash,
		setErrorStepInCreation,
		setFutureMpAddress,
		futureMultipoolAddress,
		setMintTxHash,
	} = useCreatePortfolioContext();

	const { address } = useAccount();
	const { writeContractAsync, isPending, isError } = useWriteContract();

	const { t } = useTranslation(["main"]);
	const { toast } = useToast();
	const { chain } = useMetadataChain();

	const chainId = useChainId();
	const client = usePublicClient();

	const { data: allowance } = useReadContract({
		abi: ERC20,
		address: tokens[0]?.address || zeroAddress,
		functionName: "allowance",
		args: [
			address || zeroAddress,
			(chain?.routerAddress as Address) || zeroAddress,
		],
		chainId,
		query: {
			enabled: !!address && !!tokens[0]?.address,
		},
	});

	const assetAddresses = tokens?.map(
		(token) => (token.address as Address) || zeroAddress,
	);

	const targetShares = tokens?.map((token) => Number(token.share || 0) * 100);

	const mpCreationArgs = {
		name: name || "",
		symbol: symbol || "",
		initialSharePrice: BigInt(1),
		priceData: [],
		deviationIncreaseFee: Math.round(
			Number(deviationFee || 0) / 100 / feesCoefficients[1],
		),

		deviationLimit: Math.round(
			Number(deviationLimit || 0) / 100 / feesCoefficients[2],
		),

		feeToCashbackRatio: Math.round(
			Number(cashbackFeeShare || 0) / 100 / feesCoefficients[1],
		),

		baseFee: Math.round(Number(baseFee || 0) / 100 / feesCoefficients[0]),

		managerFee: Math.round(
			Number(managementFee || 0) / 100 / feesCoefficients[1],
		),

		assetAddresses,
		targetShares,
		initialLiquidityAsset: zeroAddress,
		_managerFeeReceiver: getValidAddress(
			managementFeeRecepient || "",
			address || zeroAddress,
		),
		oracleAddress: (chain?.oracleAddress as Address) || zeroAddress,
		strategyManager: address || zeroAddress,

		owner: address || zeroAddress,

		protocolFeeReceiver: zeroAddress,
		lpFee: 0,
		_lpFeeReceiver: zeroAddress,
	};

	// const { data: createMultipoolGasEstimate } = useEstimateGas({
	// 	to: chain?.routerAddress as Address,
	// 	value: BigInt(1e6),
	// 	query: { enabled: !isDisabled && !!address },
	// 	data: encodeFunctionData({
	// 		abi: MultipoolFactory.abi,
	// 		functionName: "createMultipool",
	// 		args: [{ ...mpCreationArgs, priceData: [] }],
	// 	}),
	// 	account: address || zeroAddress,
	// });

	// const { data: updateAssetsGasEstimate } = useEstimateGas({
	// 	to: multipoolAddress as Address,
	// 	account: address,
	// 	query: {
	// 		enabled: !!multipoolAddress,
	// 	},
	// 	data: encodeFunctionData({
	// 		abi: MultipoolFactory,
	// 		functionName: "createMultipool",
	// 		args: [mpCreationArgs],
	// 	}),
	// });

	// const createMultipoolGasEstimate = formatUnits(
	// 	updateAssetsGasEstimate || 0n,
	// 	chain?.nativeCurrency?.decimals || 18,
	// );

	const handleError = ({
		title,
		description,
		errorStep,
	}: { title: string; description: string; errorStep: number }) => {
		toast({
			title,
			description,
			variant: "error",
			withTimeline: true,
		});
		setErrorStepInCreation(errorStep);
	};

	const createPortfolio = async () => {
		try {
			const priceData = await Promise.all(
				tokens?.map(async (token) => {
					if (!client) {
						throw new Error("Client is not defined");
					}
					if (
						!token?.poolAddress ||
						token.poolAddress === zeroAddress ||
						!token?.priceFeedType
					) {
						return encodePriceData(zeroAddress, false, BigInt(0));
					}

					const [token0] = await client.multicall({
						contracts: [
							{
								address: token.poolAddress as Address,
								abi: IUniswapV3PoolABI.abi,
								functionName: "token0",
							},
						],
					});

					const isToken0Native = Same(
						token0.result?.toString() || "",
						chain?.nativeTokenAddress || "",
					);

					const priceFeedType = PRICE_FEEDS?.indexOf(token?.priceFeedType);

					return encodePriceData(
						token.poolAddress as Address,
						isToken0Native,
						BigInt(0),
						priceFeedType,
					);
				}) || [],
			);

			const nonce = generateNonce();

			const { mpAddress } = getMultipoolContractAddress({
				chainId,
				factoryAddress: chain.factoryAddress,
				sender: address as Address,
				nonce,
				implAddress: "0x06a34AE8174349606D22a00d6eE6aCea448772e4",
			});

			const txHash = await writeContractAsync({
				abi: MultipoolFactory,
				address: chain?.factoryAddress as Address,
				functionName: "createMultipool",
				value: BigInt(1e16),
				args: [{ ...mpCreationArgs, priceData: priceData, nonce: nonce }],
				account: address,
			});

			const receipt = await client?.waitForTransactionReceipt({
				hash: txHash,
			});

			setFutureMpAddress(mpAddress);

			if (logo && receipt?.status === "success") {
				const base64Logo = await toBase64(logo);

				await CreateMultipool({
					d: description || "",
					n: name || "",
					s: symbol || "",
					l: base64Logo || "",
					m: mpAddress,
				});
			}

			if (!isError) {
				toast({
					title: t("createPortfolio"),
					description: t("successfullySigned"),
					variant: "success",
					withTimeline: true,
				});
				if (
					allowance &&
					allowance <
						parseUnits(
							initialLiquidityAmount?.toString() || "0",
							initialLiquidityToken?.decimals ?? 18,
						)
				) {
					setCurrentCreateModalState("approve");
				} else {
					setCurrentCreateModalState("mint");
				}
				setCreateTxHash(txHash);
			} else {
				handleError({
					title: t("createPortfolio"),
					description: t("errorSigning"),
					errorStep: 1,
				});
			}
		} catch (e) {
			handleError({
				title: t("createPortfolio"),
				description: t("errorSigning"),
				errorStep: 1,
			});
			console.error("e: ", e);
		}
	};

	const approveMint = async () => {
		await writeContractAsync({
			abi: ERC20,
			address: initialLiquidityToken?.address as Address,
			functionName: "approve",
			args: [chain?.routerAddress as Address, BigInt(maxUint256)],
		});

		if (!isError) {
			toast({
				title: t("approveSpending"),
				description: t("successfullySigned"),
				variant: "success",
				withTimeline: true,
			});

			setCurrentCreateModalState("mint");
		} else {
			handleError({
				title: t("approveSpending"),
				description: t("errorSigning"),
				errorStep: 2,
			});
		}
	};
	const mint = async () => {
		try {
			const swapArgs = {
				poolAddress: (futureMultipoolAddress as Address) || zeroAddress,

				swapArgs: {
					oraclePrice: {
						contractAddress: zeroAddress as Address,
						timestamp: BigInt(Math.floor(Date.now() / 1000)),
						sharePrice: BigInt(1e2),
						signature: zeroAddress as Address,
					},
					assetIn: initialLiquidityToken?.address as Address,
					assetOut: (futureMultipoolAddress as Address) || zeroAddress,
					swapAmount: parseUnits(
						initialLiquidityAmount?.toString() || "0",
						initialLiquidityToken?.decimals ?? 18,
					),
					isExactInput: true,

					receiverAddress: address || zeroAddress,
					refundAddress: address || zeroAddress,
					refundEthToReceiver: true,

					ethValue: BigInt(1e16),
					minimumReceive: BigInt(0),
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
								initialLiquidityToken?.address as Address,
								(futureMultipoolAddress as Address) || zeroAddress,
								parseUnits(
									initialLiquidityAmount || "0",
									initialLiquidityToken?.decimals ?? 18,
								),
							],
						),
					},
				],
				callsAfter: [],
			};

			const txHash = await writeContractAsync({
				value: BigInt(1e16),
				address: chain?.routerAddress as Address,
				abi: MultipoolRouter,
				functionName: "swap",
				args: [
					swapArgs.poolAddress as Address,
					swapArgs.swapArgs,
					swapArgs.callsBefore,
					swapArgs.callsAfter,
				],
				chainId: chainId as ChainId,
				account: address,
			});

			if (!isError) {
				toast({
					title: t("depositInitialLiquidity"),
					description: t("successfullySigned"),
					variant: "success",
					withTimeline: true,
				});

				setMintTxHash(txHash);

				setCurrentCreateModalState("final");
			} else {
				handleError({
					title: t("depositInitialLiquidity"),
					description: t("errorSigning"),
					errorStep: 3,
				});
			}
		} catch (e) {
			console.log(e);
		}
	};

	return {
		createPortfolio,
		approveMint,
		isPending,
		mint,
		createMultipoolGasEstimate: 0,
	};
};
