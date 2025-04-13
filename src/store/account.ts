import {
	ARBITRUM_SEPOLIA_CHAIN_ID,
	ARBITRUM_TOKENS,
	wETH_ADDRESS,
} from "@/lib/constants";
import type { BalancesToken, Token } from "@/lib/types";
import { makeAutoObservable } from "mobx";
import { type Chain, createPublicClient, http, type PublicClient } from "viem";
import { arbitrumSepolia } from "viem/chains";

export class AccountStore {
	name: string | undefined;
	tokensInformation: BalancesToken[];
	//for assetSelector page
	nativeToken: Token;

	currentClient: PublicClient;
	currentChain: { name: string; id: number };

	isOpenAssetSelector: boolean;

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });

		this.tokensInformation = ARBITRUM_TOKENS.map(
			({ logo, symbol, address, priceFeedAddress }) => ({
				logo,
				symbol,
				address,
				priceFeedAddress,
				quantityOnWallet: undefined,
				price: undefined,
			}),
		);

		this.nativeToken = {
			address: wETH_ADDRESS,
			decimals: 18,
			price: "0",
			chainId: ARBITRUM_SEPOLIA_CHAIN_ID,
			priceFeedAddress: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",
		};
		this.currentChain = { id: ARBITRUM_SEPOLIA_CHAIN_ID, name: "Arbitrum" };

		this.currentClient = createPublicClient({
			chain: arbitrumSepolia,
			transport: http(),
		});
		this.isOpenAssetSelector = false;
	}

	setIsOpenAssetSelector(value: boolean) {
		this.isOpenAssetSelector = value;
	}

	setNewClient(chain?: Chain) {
		this.currentClient = createPublicClient({
			chain,
			transport: http(),
		});
	}

	setCurrentChain({ id, name }: { id: number; name: string }) {
		this.currentChain = { id, name };
	}
}
