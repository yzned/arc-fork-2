import { useAccountStore } from "@/contexts/AccountContext";
import ChainLinkPriceFeed from "@/lib/abi/ChainLinkPriceFeed";
import ERC20 from "@/lib/abi/ERC20";
import { ARBITRUM_TOKENS } from "@/lib/constants";
import type { ChainId, UniswapPriceData } from "@/lib/types";
import { useWallets } from "@privy-io/react-auth";
import BigNumber from "bignumber.js";
import { runInAction } from "mobx";
import { useEffect } from "react";
import { useChainId, useReadContracts } from "wagmi";

export const useTokensInformation = () => {
	const { tokensInformation } = useAccountStore();
	const { wallets } = useWallets();
	const chainId = useChainId();

	const { data: quantities } = useReadContracts({
		contracts: tokensInformation.map((token) => ({
			abi: ERC20,
			address: token.address,
			functionName: "balanceOf",
			args: [wallets[0]?.address],
		})),
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
			tokensInformation.forEach((token, index) => {
				const resultQuantities = quantities[index]?.result;

				token.quantityOnWallet = resultQuantities
					? new BigNumber(resultQuantities.toString())
					: new BigNumber(0);
			});

			// const nativePrice = prices[0]?.result as UniswapPriceData;

			// nativeToken.price = nativePrice?.[1]
			// 	? new BigNumber(nativePrice[1].toString())
			// 			.multipliedBy(10 ** -6)
			// 			.toString()
			// 	: new BigNumber(0).toString();

			ARBITRUM_TOKENS.forEach((arbToken, index) => {
				const tokenInfo = tokensInformation.find(
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
	}, [quantities, prices, tokensInformation]);

	return {};
};
