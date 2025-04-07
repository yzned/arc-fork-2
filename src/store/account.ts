import {
	ARBITRUM_CHAIN_ID,
	ARBITRUM_TOKENS,
	wETH_ADDRESS,
} from "@/lib/constants";
import type { BalancesToken, Token } from "@/lib/types";
import { makeAutoObservable } from "mobx";

export class AccountStore {
	name: string | undefined;
	tokensInformation: BalancesToken[];
	//for assetSelector page
	onSelectAsset?: (item: Token) => void;
	nativeToken: Token;

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
		//@ts-ignore
		this.nativeToken = {
			address: wETH_ADDRESS,
			decimals: 18,
			price: "0",
			chainId: ARBITRUM_CHAIN_ID,
			priceFeedAddress: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",
		};
	}

	setOnSelectAsset(func: (item: Token) => void) {
		this.onSelectAsset = func;
	}
}
