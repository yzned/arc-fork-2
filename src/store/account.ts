import { chains } from "@/lib/constants";
import type { BalancesToken, ExtendedChain } from "@/lib/types";
import { makeAutoObservable } from "mobx";

export class AccountStore {
	name: string | undefined;
	tokensInformation?: BalancesToken[];
	//for assetSelector page
	currentChain?: ExtendedChain;
	isOpenAssetSelector: boolean;

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });

		// this.tokensInformation = ARBITRUM_TOKENS.map(
		// 	({ logo, symbol, address, priceFeedAddress }) => ({
		// 		logo,
		// 		symbol,
		// 		address,
		// 		priceFeedAddress,
		// 		quantityOnWallet: undefined,
		// 		price: undefined,
		// 	}),
		// );

		this.isOpenAssetSelector = false;

		this.currentChain = chains[0];
	}

	setIsOpenAssetSelector(value: boolean) {
		this.isOpenAssetSelector = value;
	}

	setCurrentChain(chain: ExtendedChain) {
		this.currentChain = chain;
	}
}
