import { getMultipoolContractAddress } from "@/api/arcanum";
import { CreateMultipool } from "@/api/create";
import {
	createPoolsRoute,
	createUnckeckedTrade,
	getOutputQuote,
} from "@/api/uniswap";
import { useCreatePortfolio } from "@/contexts/CreatePortfolioContext";
import ERC20 from "@/lib/abi/ERC20";
import {
	ARBITRUM_CHAIN_ID,
	ARCANUM_POOL_FACTORY_ADDRESS,
	MAX_FEE_PER_GAS,
	MAX_PRIORITY_FEE_PER_GAS,
	UNISWAP_SWAP_ROUTER_ADDRESS,
} from "@/lib/constants";
import type { SetupToken } from "@/store/create-portfolio";
import { useWallets } from "@privy-io/react-auth";
import { Percent } from "@uniswap/sdk-core";
import { type SwapOptions, SwapRouter } from "@uniswap/v3-sdk";
import type { Address } from "viem";
import { useSimulateContract, useWriteContract } from "wagmi";

export const useDeployPortfolio = () => {
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

		managementFeeRecepient,
		managementFee,
		tokens,
		initialLiquidityToken,
		initialLiquidityAmount,
	} = useCreatePortfolio();

	const { wallets } = useWallets();
	const { writeContract } = useWriteContract();

	const { data: simulateArcanumTransfer } = useSimulateContract({
		address: initialLiquidityToken || ("" as Address),
		abi: ERC20,
		functionName: "approve",
		args: [
			ARCANUM_POOL_FACTORY_ADDRESS as Address,
			BigInt(initialLiquidityAmount || 0),
		],
		chainId: ARBITRUM_CHAIN_ID,
		account: wallets[0]?.address as Address,
	});

	const { data: simulateUniswap } = useSimulateContract({
		address: tokens[0]?.address || ("" as Address),
		abi: ERC20,
		functionName: "approve",
		args: [UNISWAP_SWAP_ROUTER_ADDRESS as Address, BigInt(2000)], ///change to correct token amount
		chainId: ARBITRUM_CHAIN_ID,
		account: wallets[0]?.address as Address,
	});

	const approveUniswap = async () => {
		if (
			initialLiquidityToken &&
			initialLiquidityAmount &&
			simulateUniswap?.result
		) {
			const tx = await writeContract({
				abi: ERC20,
				address: initialLiquidityToken as Address,
				functionName: "approve",
				args: [
					UNISWAP_SWAP_ROUTER_ADDRESS,
					BigInt(initialLiquidityAmount || 0),
				],
				account: wallets[0].address as Address,
			});
		}
	};

	const approveArcanum = async () => {
		if (
			initialLiquidityToken &&
			initialLiquidityAmount &&
			simulateArcanumTransfer?.result
		) {
			const tx = await writeContract({
				abi: ERC20,
				address: initialLiquidityToken as Address,
				functionName: "approve",
				args: [
					ARCANUM_POOL_FACTORY_ADDRESS,
					BigInt(initialLiquidityAmount || 0),
				],
				account: wallets[0].address as Address,
			});
		}
	};

	const createPortfolio = async () => {
		// await approveArcanum();
		// await approveUniswap();

		// const tokenWithMaxShare = tokens.reduce<SetupToken | null>((max, token) => {
		// 	const share = token.share ? Number.parseFloat(token.share) : 0;
		// 	const maxShare = max?.share ? Number.parseFloat(max.share) : 0;

		// 	return share > maxShare ? token : max;
		// }, null);

		// if (
		// 	initialLiquidityToken &&
		// 	tokens[0].address &&
		// 	initialLiquidityAmount &&
		// 	tokenWithMaxShare
		// ) {
		// 	const routeTrade = await createPoolsRoute(
		// 		initialLiquidityToken,
		// 		tokenWithMaxShare?.address,
		// 	);

		// 	if (routeTrade) {
		// 		const amountOut = await getOutputQuote(
		// 			routeTrade,
		// 			new BigNumber(initialLiquidityAmount),
		// 		);

		// 		const uncheckedTrade = createUnckeckedTrade(
		// 			routeTrade,
		// 			new BigNumber(initialLiquidityAmount),
		// 			amountOut.amountOut,
		// 		);

		// 		const options: SwapOptions = {
		// 			slippageTolerance: new Percent(70, 10_000),
		// 			deadline: Math.floor(Date.now() / 1000) + 60 * 20,
		// 			recipient: wallets[0].address,
		// 		};

		// 		const methodParameters = SwapRouter.swapCallParameters(
		// 			[uncheckedTrade],
		// 			options,
		// 		);

		// 		const tradeTransaction = {
		// 			data: methodParameters.calldata,
		// 			to: UNISWAP_SWAP_ROUTER_ADDRESS,
		// 			value: methodParameters.value,
		// 			from: wallets[0].address,
		// 			maxFeePerGas: MAX_FEE_PER_GAS,
		// 			maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
		// 		};
		// 	}
		// }
		const multipoolAddress = getMultipoolContractAddress();

		if (description && logo && symbol && name) {
			await CreateMultipool({
				chaid_id: 421614,
				description,
				logo: logo.name,
				multipool_address: multipoolAddress,
				name,
				symbol,
			});
		}
		// if (
		// 	name &&
		// 	symbol &&
		// 	initialSharePrice &&
		// 	deviationLimit &&
		// 	deviationFee &&
		// 	managementFeeRecepient
		// ) {
		// 	writeContract({
		// 		abi: MultipoolFactory.abi,
		// 		address: "0xf4524F18c16df587fb4fBCaBF72aCB620D5f7DD1",
		// 		functionName: "createMultipool",
		// 		args: [
		// 			{
		// 				name,
		// 				symbol,
		// 				initialSharePrice: BigInt(initialSharePrice),
		// 				deviationIncreaseFee: Number(deviationFee),
		// 				deviationLimit: Number(deviationFee),
		// 				feeToCashbackRatio: Number(cashbackFeeShare),
		// 				baseFee: Number(baseFee),
		// 				managementFee: Number(managementFee),
		// 				assetAddresses: assetAddresses,
		// 				targetShares: targetShares,
		// 				initialLiquidityAsset: initialLiquidityToken,
		// 				managementFeeRecepient: managementFeeRecepient as `0x${string}`,
		// 				oracleAddress: "0x0EC0A1Fd56462Da00a240d56fd925b8095049fd2",
		// 				// strategyManager
		// 				// oracleAddress
		// 				// priceData
		// 			},
		// 		],
		// 	});
		// }
	};

	return { createPortfolio };
};
