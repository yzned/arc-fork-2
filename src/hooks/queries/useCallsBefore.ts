import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { encodeAbiParameters } from "viem";
import { useCurrentPortfolio } from "../use-current-portfolio";
import { useSwapToCalldata } from "./useSwapToCalldata";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";

export function useCallsBefore() {
    const { portfolioAssets } = useExplorePortfolio();
    const { selectedAsset, mintBurnAmount } = useExplorePortfolio();
    const { address } = useCurrentPortfolio();

    const { mutateAsync } = useSwapToCalldata();

    return useQuery({
        queryKey: ["callsBefore", portfolioAssets, selectedAsset, mintBurnAmount],
        queryFn: async () => {
            if (!portfolioAssets) {
                throw new Error("Portfolio assets are not available");
            }

            if (!mintBurnAmount) {
                throw new Error("Mint/Burn amount is not specified");
            }

            if (!selectedAsset) {
                throw new Error("Selected asset is not available");
            }

            const multipliedBy = new BigNumber(10).pow(selectedAsset.decimals);
            const mintBurnAmountChain = new BigNumber(mintBurnAmount).multipliedBy(multipliedBy);

            // easy case: minting from token which is in ETF
            if (portfolioAssets.map((asset) => asset.address).findIndex((address) => address === selectedAsset.address) !== -1) {
                return {
                    callsBefore: [{
                        callType: 0 as const,
                        data: encodeAbiParameters(
                            [
                                { name: "token", type: "address" },
                                { name: "targetOrOrigin", type: "address" },
                                { name: "amount", type: "uint256" },
                            ],
                            [
                                selectedAsset.address,
                                address,
                                BigInt(mintBurnAmountChain.toString()),
                            ],
                        ),
                    }] as const,
                };
            }

            const calls = await mutateAsync({
                from: selectedAsset.address,
                to: portfolioAssets[0].address,
                amount: BigInt(mintBurnAmount),
            })

            return {
                callsBefore: [{
                    callType: 2 as const,
                    data: calls.data
                }] as const,
                optional: calls
            };
        },
    })





}
