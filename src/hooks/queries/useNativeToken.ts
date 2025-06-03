import type { AvailableChainTokensDataFormated } from "@/api/types";
import { useChainId } from "wagmi";

export function useNativeToken(): AvailableChainTokensDataFormated {
    const chainId = useChainId();

    if (chainId === 421614) {
        return {
            name: "Ethereum",
            symbol: "ETH",
            address: "0x0000000000000000000000000000000000000000",
            logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
            cmc: "https://coinmarketcap.com/currencies/ethereum",
            coingecko: "https://www.coingecko.com/en/coins/ethereum",
            decimals: 18,
            tags: ["native", "ethereum"],
        };
    }

    if (chainId === 10143) {
        return {
            name: "Monad",
            symbol: "MOD",
            address: "0x0000000000000000000000000000000000000000",
            logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/30495.png",
            cmc: "https://coinmarketcap.com/currencies/monad/",
            coingecko: undefined,
            decimals: 18,
            tags: ["native", "monad"],
        };
    }

    if (chainId === 42161) {
        return {
            name: "Ethereum",
            symbol: "ETH",
            address: "0x0000000000000000000000000000000000000000",
            logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
            cmc: "https://coinmarketcap.com/currencies/ethereum",
            coingecko: "https://www.coingecko.com/en/coins/ethereum",
            decimals: 18,
            tags: ["native", "arbitrum"],
        };
    }

    return {
        name: "Ethereum",
        symbol: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
        cmc: "https://coinmarketcap.com/currencies/ethereum",
        coingecko: "https://www.coingecko.com/en/coins/ethereum",
        decimals: 18,
        tags: ["native", "ethereum"],
    };
}