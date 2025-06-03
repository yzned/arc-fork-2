import { useMutation } from "@tanstack/react-query";
import { decodeAbiParameters, type Hex, type Address } from "viem";
import { useMetadataChain } from "../use-metadata-chain";
import { getPoolsData } from "@/api/uniswap";
import { usePublicClient } from "wagmi";
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import ERC20 from "@/lib/abi/ERC20";
import { Route, type SwapOptions, SwapQuoter, SwapRouter, Trade } from "@uniswap/v3-sdk";
import { useCurrentPortfolio } from "../use-current-portfolio";

export function useSwapToCalldata() {
    const { chain } = useMetadataChain();
    const client = usePublicClient();
    const { address: multipoolAddress } = useCurrentPortfolio();

    return useMutation({
        mutationKey: ["swapToCalldata"],
        mutationFn: async (args: {
            from: Address;
            to: Address;
            amount: bigint;
        }) => {
            const { from, to, amount } = args;
            const pools = await getPoolsData(from, to, chain.factoryAddress);

            if (!pools || pools.length === 0) {
                throw new Error("No pools found for the given assets");
            }
            if (!client) {
                throw new Error("Client is not available");
            }

            const fromDecimals = await client.readContract({
                address: from,
                abi: ERC20,
                functionName: "decimals",
            })

            const toDecimals = await client.readContract({
                address: to,
                abi: ERC20,
                functionName: "decimals",
            })

            const fromToken = new Token(chain.id, from, fromDecimals);
            const toToken = new Token(chain.id, to, toDecimals);

            const route = new Route([pools[0]], fromToken, toToken);
            const { value: quoteValue, calldata: quoteCalldata } = SwapQuoter.quoteCallParameters(
                route,
                CurrencyAmount.fromRawAmount(fromToken, amount.toString()),
                TradeType.EXACT_INPUT,
                {
                    useQuoterV2: true,
                }
            );

            const { data: quoterResult } = await client.call({
                to: chain.uniswapQuoterAddress,
                data: quoteCalldata as Hex,
            });

            if (!quoterResult) {
                throw new Error("Quoter call failed");
            }

            const [amountOut, , gasEstimate] = decodeAbiParameters(
                [{ name: 'amountOut', type: 'uint256' }, { name: 'sqrtPriceX96AfterList', type: 'uint160' }, { name: 'initializedTicksCrossedList', type: 'uint32' }, { name: 'gasEstimate', type: 'uint256' }],
                quoterResult
            )

            const uncheckedTrade = Trade.createUncheckedTrade({
                route,
                inputAmount: CurrencyAmount.fromRawAmount(fromToken, amount.toString()),
                outputAmount: CurrencyAmount.fromRawAmount(toToken, amountOut.toString()),
                tradeType: TradeType.EXACT_INPUT,
            });

            const options: SwapOptions = {
                slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
                deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
                recipient: multipoolAddress as string,
            };

            const { value, calldata } = SwapRouter.swapCallParameters([uncheckedTrade], options);

            return {
                callType: 2 as const,
                data: calldata as Hex,
                value: BigInt(value),
                gasEstimate: gasEstimate,
                returnEstimate: {
                    token: to,
                    amount: BigInt(quoteValue)
                }
            };
        },
    })
} 