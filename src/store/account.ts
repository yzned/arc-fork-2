import type { BalancesToken } from "@/lib/types";
import { makeAutoObservable } from "mobx";

export class AccountStore {
	name: string | undefined;
	tokensInformation?: BalancesToken[];
	isOpenAssetSelector: boolean;

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });

		this.isOpenAssetSelector = false;
	}

	setIsOpenAssetSelector(value: boolean) {
		this.isOpenAssetSelector = value;
	}
}
