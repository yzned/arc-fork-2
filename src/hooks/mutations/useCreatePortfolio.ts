import { useAccountStore } from "@/contexts/AccountContext";
import { useCreatePortfolio as useCreatePortfolioContext } from "@/contexts/CreatePortfolioContext";
import ERC20 from "@/lib/abi/ERC20";
import MultipoolRouter from "@/lib/abi/MultipoolRouter";

import { CreateMultipool } from "@/api/create";
import MultipoolFactory from "@/lib/abi/MultipoolFactory";
import type { ChainId } from "@/lib/types";
import {
	encodeUniV3PriceData,
	getMultipoolContractAddress,
	getValidAddress,
	toBase64,
} from "@/lib/utils";
import { useWallets } from "@privy-io/react-auth";
import { useTranslation } from "react-i18next";
import {
	type Address,
	encodeAbiParameters,
	encodeFunctionData,
	maxUint256,
	parseUnits,
	zeroAddress,
} from "viem";
import {
	useChainId,
	useEstimateGas,
	useReadContract,
	useWriteContract,
} from "wagmi";
import { useToast } from "../use-toast";

export const useCreatePortfolio = () => {
	const {
		name,
		symbol,
		initialSharePrice,
		deviationFee,
		deviationLimit,
		cashbackFeeShare,
		baseFee,
		logo,
		description,
		isDisabled,
		managementFeeRecepient,
		managementFee,
		tokens,
		initialLiquidityToken,
		initialLiquidityAmount,
		setCurrentCreateModalState,
		setCreateTxHash,
		setMintTxHash,
		setErrorStepInCreation,
		setFutureMpAddress,
		futureMultipoolAddress,
	} = useCreatePortfolioContext();

	const { wallets } = useWallets();
	const { writeContractAsync, isPending, isError } = useWriteContract();
	const { t } = useTranslation(["main"]);
	const { toast } = useToast();
	const { currentChain } = useAccountStore();
	const chainId = useChainId();

	const { data: allowance } = useReadContract({
		abi: ERC20,
		address: tokens[0]?.address || zeroAddress,
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

	const priceData = tokens?.map((token) =>
		encodeUniV3PriceData(
			(token?.poolAddress as Address) || zeroAddress,
			true,
			BigInt(0),
		),
	);

	const {
		nonce,
		contractAddress: multipoolAddress,
		initCodeHash,
		salt,
	} = getMultipoolContractAddress({
		chainId: chainId || 42161,
		factoryAddress: currentChain?.factoryAddress as Address,
	});

	const assetAddresses = tokens?.map(
		(token) => (token.address as Address) || zeroAddress,
	);

	const targetShares = tokens?.map((token) => Number(token.share || 0) * 100);

	const mpCreationArgs = {
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
		managementFeeRecepient: getValidAddress(
			managementFeeRecepient || "",
			(wallets[0]?.address as Address) || zeroAddress,
		),
		oracleAddress: (currentChain?.oracleAddress as Address) || zeroAddress,
		strategyManager: (wallets[0]?.address as Address) || zeroAddress,
		priceData,
		nonce: BigInt(nonce),
		owner: (wallets[0]?.address as Address) || zeroAddress,
		protocolFeeReceiver: zeroAddress,
	};

	const { data: createMultipoolGasEstimate } = useEstimateGas({
		to: currentChain?.routerAddress as Address,
		value: BigInt(1e6),
		query: { enabled: !isDisabled && !!wallets[0]?.address },
		data: encodeFunctionData({
			abi: MultipoolFactory.abi,
			functionName: "createMultipool",
			args: [mpCreationArgs],
		}),
		account: (wallets[0]?.address as Address) || zeroAddress,
	});

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
			setFutureMpAddress(multipoolAddress);

			const txHash = await writeContractAsync({
				abi: MultipoolFactory.abi,
				address: currentChain?.factoryAddress as Address,
				functionName: "createMultipool",
				value: BigInt(1e6),
				args: [mpCreationArgs],
				account: wallets[0].address as Address,
			});

			if (logo) {
				const base64Logo = await toBase64(logo);

				await CreateMultipool({
					d: description || "",
					ih: initCodeHash,
					st: salt,
					n: name || "",
					s: symbol || "",
					l: base64Logo || "",
				});
			}

			if (!isError) {
				toast({
					title: t("createPortfolio"),
					description: t("successfullySigned"),
					variant: "success",
					withTimeline: true,
				});
				if (allowance && allowance < Number(initialLiquidityAmount)) {
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

			// const txHash = await writeContractAsync({
			// 	abi: MultipoolFactory.abi,
			// 	address: currentChain?.factoryAddress as Address,
			// 	functionName: "createMultipool",
			// 	value: BigInt(1e6),
			// 	args: [
			// {
			// 	name: "MONAD ETF",
			// 	symbol: "mETF",
			// 	initialSharePrice: BigInt(1),
			// 	deviationIncreaseFee: Number(1), //Deviation fee,
			// 	deviationLimit: Number(1),
			// 	feeToCashbackRatio: Number(1), ///Cashback fee share
			// 	baseFee: Number(1),
			// 	managementFee: Number(1),
			// 	assetAddresses: [
			// 		"0xb2f82D0f38dc453D596Ad40A37799446Cc89274A",
			// 		"0x00F26C926345D6F8e1BfCa684873C35070DC49Fd",
			// 	],
			// 	targetShares: [5000, 5000],
			// 	initialLiquidityAsset: zeroAddress,
			// 	managementFeeRecepient: wallets[0].address as Address,
			// 	oracleAddress: currentChain?.oracleAddress as Address,
			// 	strategyManager: wallets[0].address as Address,
			// 	priceData: [priceDataAprioriMonad, priceDataMolandak],
			// 	nonce: BigInt(nonce),
			// 	owner: wallets[0].address as Address,
			// 	protocolFeeReceiver: zeroAddress,
			// },
			// 	],
			// 	account: wallets[0].address as Address,
			// });
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
			args: [currentChain?.routerAddress as Address, BigInt(maxUint256)],
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
				swapAmount: parseUnits(initialLiquidityAmount?.toString() || "0", 18),
				isExactInput: true,
				receiverData: {
					receiverAddress: (wallets[0]?.address as Address) || zeroAddress,
					refundAddress: (wallets[0]?.address as Address) || zeroAddress,
					refundEthToReceiver: true,
				},
				ethValue: BigInt(1e15),
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
							parseUnits(initialLiquidityAmount || "0", 18),
						],
					),
				},
			],
			callsAfter: [],
		};

		// const swapArgs = {
		// 	poolAddress: "0xB25D309C4f1522F2322045bb482a2eaA6057545d",
		// 	swapArgs: {
		// 		oraclePrice: {
		// 			contractAddress: zeroAddress as Address, /// random address
		// 			timestamp: BigInt(Math.floor(Date.now() / 1000)),
		// 			sharePrice: BigInt(1e2),
		// 			signature: zeroAddress as Address, /// random address
		// 		},
		// 		assetIn: "0xb2f82D0f38dc453D596Ad40A37799446Cc89274A" as Address,
		// 		assetOut: "0xB25D309C4f1522F2322045bb482a2eaA6057545d" as Address,
		// 		swapAmount: parseUnits((0.1)?.toString() || "0", 18),
		// 		isExactInput: true,
		// 		receiverData: {
		// 			receiverAddress: (wallets[0]?.address as Address) || zeroAddress,
		// 			refundAddress: (wallets[0]?.address as Address) || zeroAddress,
		// 			refundEthToReceiver: true,
		// 		},
		// 		ethValue: BigInt(1e15),
		// 	},
		// 	callsBefore: [
		// 		{
		// 			callType: 0,
		// 			data: encodeAbiParameters(
		// 				[
		// 					{ name: "token", type: "address" },
		// 					{ name: "targetOrOrigin", type: "address" },
		// 					{ name: "amount", type: "uint256" },
		// 				],
		// 				[
		// 					"0xb2f82D0f38dc453D596Ad40A37799446Cc89274A",
		// 					"0xB25D309C4f1522F2322045bb482a2eaA6057545d",
		// 					parseUnits((0.1)?.toString() || "0", 18),
		// 				],
		// 			),
		// 		},
		// 	],
		// 	callsAfter: [],
		// };

		const txHash = await writeContractAsync({
			value: BigInt(1e15),
			address: currentChain?.routerAddress as Address,
			abi: MultipoolRouter,
			functionName: "swap",
			args: [
				swapArgs.poolAddress as Address,
				swapArgs.swapArgs,
				swapArgs.callsBefore,
				swapArgs.callsAfter,
			],
			chainId: chainId as ChainId,
			account: wallets[0]?.address as Address,
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
	};

	return {
		createPortfolio,
		approveMint,
		isPending,
		mint,
		createMultipoolGasEstimate,
	};
};

// const priceDataAprioriMonad = encodeUniV3PriceData(
// 	"0x0E5b205A058101584d0b94736212A517730F5FC0" as Address,
// 	true,
// 	BigInt(0),
// );
// const priceDataMolandak = encodeUniV3PriceData(
// 	"0x00F26C926345D6F8e1BfCa684873C35070DC49Fd" as Address,
// 	true,
// 	BigInt(0),
// );

// const mpCreationArgs = {
// 	name: "MONAD ETF",
// 	symbol: "mETF",
// 	initialSharePrice: BigInt(1),
// 	deviationIncreaseFee: Number(1), //Deviation fee,
// 	deviationLimit: Number(1),
// 	feeToCashbackRatio: Number(1), ///Cashback fee share
// 	baseFee: Number(1),
// 	managementFee: Number(1),
// 	assetAddresses: [
// 		"0xb2f82D0f38dc453D596Ad40A37799446Cc89274A",
// 		"0x00F26C926345D6F8e1BfCa684873C35070DC49Fd",
// 	],
// 	targetShares: [5000, 5000],
// 	initialLiquidityAsset: zeroAddress,
// 	managementFeeRecepient: wallets[0]?.address as Address,
// 	oracleAddress: currentChain?.oracleAddress as Address,
// 	strategyManager: wallets[0]?.address as Address,
// 	priceData: [priceDataAprioriMonad, priceDataMolandak],
// 	nonce: BigInt(nonce),
// 	owner: wallets[0]?.address as Address,
// 	protocolFeeReceiver: zeroAddress,
// };
