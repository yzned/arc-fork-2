import { useAccountStore } from "@/contexts/AccountContext";
import ChainLinkPriceFeed from "@/lib/abi/ChainLinkPriceFeed";
import ERC20 from "@/lib/abi/ERC20";
import { ARBITRUM_TOKENS } from "@/lib/constants";
import type { ChainId, UniswapPriceData } from "@/lib/types";
import BigNumber from "bignumber.js";
import { runInAction } from "mobx";
import { useEffect } from "react";
import type { Address } from "viem";
import { useAccount, useChainId, useReadContracts } from "wagmi";

export const useTokensInformation = () => {
	const { currentChain } = useAccountStore();
	const { address } = useAccount();
	const chainId = useChainId();

	const { data: quantities } = useReadContracts({
		contracts: currentChain?.availableTokens?.map((token) => ({
			abi: ERC20,
			address: token.address as Address,
			functionName: "balanceOf",
			args: [address],
		})),
		query: {
			enabled: !!currentChain?.availableTokens,
		},
	});

	const priceFeeds = [...ARBITRUM_TOKENS];

	const { data: prices } = useReadContracts({
		contracts: priceFeeds.map((item) => ({
			abi: ChainLinkPriceFeed,
			address: item.priceFeedAddress,
			functionName: "latestRoundData",
			chainId: chainId as ChainId,
		})),
	});

	useEffect(() => {
		if (!quantities || !prices) return;

		runInAction(() => {
			currentChain?.availableTokens?.forEach((token, index) => {
				const resultQuantities = quantities[index]?.result;

				token.quantityOnWallet = resultQuantities
					? new BigNumber(resultQuantities.toString()).multipliedBy(
							new BigNumber(10).pow(-(token?.decimals ?? 0)),
						)
					: new BigNumber(0);
			});

			// const nativePrice = prices[0]?.result as UniswapPriceData;

			// nativeToken.price = nativePrice?.[1]
			// 	? new BigNumber(nativePrice[1].toString())
			// 			.multipliedBy(10 ** -6)
			// 			.toString()
			// 	: new BigNumber(0).toString();

			currentChain?.availableTokens?.forEach((arbToken, index) => {
				const tokenInfo = currentChain?.availableTokens?.find(
					(t) => t.address === arbToken.address,
				);
				const priceData = prices[index + 1]?.result as UniswapPriceData;

				if (tokenInfo) {
					tokenInfo.price = priceData?.[1]
						? new BigNumber(priceData[1].toString()).multipliedBy(10 ** -6)
						: new BigNumber(0);
				}
			});
		});
	}, [quantities, prices, currentChain?.availableTokens]);

	return {};
};
