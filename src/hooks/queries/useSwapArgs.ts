import { useAccount } from "wagmi";
import { useCurrentPortfolio } from "../use-current-portfolio";
import { type Address, parseUnits, zeroAddress } from "viem";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import BigNumber from "bignumber.js";

import { useMinimumReceive } from "./useMinimumReceive";
import { useCallsBefore } from "./useCallsBefore";

export function useSwapArgs() {
	const { address } = useAccount();
	const currentPortfolio = useCurrentPortfolio();
	const { selectedAsset, rightSectionState, mintBurnAmount } =
		useExplorePortfolio();
	const { data } = useMinimumReceive();
	const { data: callsBeforeResult } = useCallsBefore();

	if (!selectedAsset) {
		return undefined;
	}

	if (!data) {
		return undefined;
	}

	if (!callsBeforeResult) {
		return undefined;
	}

	const isMint = rightSectionState === "mint";
	const swapAmount = parseUnits(
		mintBurnAmount || "0",
		isMint ? selectedAsset.decimals : currentPortfolio.decimals,
	);

	const assetIn = isMint ? selectedAsset : currentPortfolio;
	const assetOut = isMint ? currentPortfolio : selectedAsset;

	if (callsBeforeResult.callsBefore[0].callType === 0) {
		return {
			poolAddress: currentPortfolio.address as Address,
			swapArgs: {
				oraclePrice: {
					contractAddress: zeroAddress as Address, // random address
					timestamp: BigInt(Math.floor(Date.now() / 1000)),
					sharePrice: BigInt(1e2),
					signature: zeroAddress as Address, // random address
				},
				assetIn: assetIn.address as Address,
				assetOut: assetOut.address as Address,
				swapAmount,
				isExactInput: isMint,
				receiverAddress: address || (zeroAddress as Address),
				refundAddress: address || (zeroAddress as Address),
				refundEthToReceiver: true,
				ethValue: BigInt(1e16),
				minimumReceive: BigInt(
					new BigNumber(data.minimumReceive)
						.multipliedBy(new BigNumber(10).pow(assetOut.decimals))
						.decimalPlaces(0)
						.toNumber(),
				),
			},
			callsBefore: callsBeforeResult.callsBefore,
			callsAfter: [],
		} as const;
	}

	return {
		poolAddress: currentPortfolio.address as Address,
		swapArgs: {
			oraclePrice: {
				contractAddress: zeroAddress as Address, // random address
				timestamp: BigInt(Math.floor(Date.now() / 1000)),
				sharePrice: BigInt(1e2),
				signature: zeroAddress as Address, // random address
			},
			assetIn: assetIn.address as Address,
			assetOut: assetOut.address as Address,
			swapAmount,
			isExactInput: isMint,
			receiverAddress: address || (zeroAddress as Address),
			refundAddress: address || (zeroAddress as Address),
			refundEthToReceiver: true,
			ethValue: BigInt(1e16),
			minimumReceive: BigInt(
				new BigNumber(data.minimumReceive)
					.multipliedBy(new BigNumber(10).pow(assetOut.decimals))
					.decimalPlaces(0)
					.toNumber(),
			),
		},
		callsBefore: callsBeforeResult.callsBefore,
		callsAfter: [],
	} as const;

	// return {
	//     poolAddress: currentPortfolio.address,
	//     swapArgs: {
	//         oraclePrice: {
	//             contractAddress: zeroAddress as Address, /// random address
	//             timestamp: BigInt(Math.floor(Date.now() / 1000)),
	//             sharePrice: BigInt(1e2),
	//             signature: zeroAddress as Address, /// random address
	//         },
	//         assetIn: assetIn.address,
	//         assetOut: assetOut.address,
	//         swapAmount,
	//         isExactInput: isMint,
	//         receiverData: {
	//             receiverAddress: address || zeroAddress,
	//             refundAddress: address || zeroAddress,
	//             refundEthToReceiver: true,
	//         },
	//         ethValue: BigInt(1e16),
	//         minimumReceive: BigInt(
	//             new BigNumber(data.minimumReceive)
	//                 .multipliedBy(new BigNumber(10).pow(assetOut.decimals))
	//                 .decimalPlaces(0)
	//                 .toNumber(),
	//         ),
	//     },
	//     callsBefore: [
	//         {
	//             callType: 0,
	//             data: encodeAbiParameters(
	//                 [
	//                     { name: "token", type: "address" },
	//                     { name: "targetOrOrigin", type: "address" },
	//                     { name: "amount", type: "uint256" },
	//                 ],
	//                 [
	//                     assetIn.address,
	//                     currentPortfolio.address,
	//                     swapAmount,
	//                 ],
	//             ),
	//         },
	//     ],
	//     callsAfter: [],
	// } as const;
}
