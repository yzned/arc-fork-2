import type { TokenPriceData } from "@/lib/types";
import BigNumber from "bignumber.js";
import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from "uuid";
import type { Address } from "viem";

export interface SetupToken {
	id: string;
	name: string;
	symbol: string;
	address: Address;
	logo: string;
	priceFeedType?:
		| "UniswapV3"
		| "UniswapV2"
		| "Chainlink"
		| "FixedPrice"
		| "RedStone";

	creationState?: "new" | "edited" | "readed";
	share?: string;
}
export class CreatePortfolioStore {
	///main info
	name?: string;
	symbol?: string;
	description?: string;
	logo?: File;

	///tokensSetup
	prices: TokenPriceData[];
	initialLiquidityToken?: Address;
	initialLiquidityAmount?: string;
	tokens: SetupToken[] = [];

	///fees
	initialSharePrice?: string;
	managementFee?: string;
	managementFeeRecepient?: string;

	baseFee?: string;
	deviationLimit?: string;
	deviationFee?: string;
	cashbackFeeShare?: string;

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });
		this.prices = [];
	}

	get sharePercentsSum() {
		const totalShare = this.tokens.reduce(
			(acc, token) => acc.plus(token?.share || 0),
			new BigNumber(0),
		);

		return totalShare;
	}

	get dollarPrice() {
		if (this.initialLiquidityToken && this.initialLiquidityAmount) {
			const cleanAmount = this.initialLiquidityAmount.replace(/[,.]$/, "");

			if (!cleanAmount) return 0;

			const tokenPriceRaw = this.getTokenPrice(this.initialLiquidityToken);
			const tokenPrice = new BigNumber(
				tokenPriceRaw?.toString() || "0",
			).multipliedBy(10 ** -8);

			const calculatedAmount =
				new BigNumber(cleanAmount).toNumber() * tokenPrice.toNumber();

			return Number.isNaN(calculatedAmount)
				? 0
				: Number(calculatedAmount.toFixed(2));
		}

		return 0;
	}

	setInitialPrice(value: string) {
		this.initialSharePrice = value;
	}

	setManagementFee(value: string) {
		this.managementFee = value;
	}

	setManagementFeeRecipient(value: string) {
		this.managementFeeRecepient = value;
	}

	setBaseFee(value: string) {
		this.baseFee = value;
	}

	setDeviationLimit(value: string) {
		this.deviationLimit = value;
	}

	setDeviationFee(value: string) {
		this.deviationFee = value;
	}

	setCashbackFeeShare(value: string) {
		this.cashbackFeeShare = value;
	}

	setPrices(prices: TokenPriceData[]) {
		this.prices = prices;
	}

	setInitialLiqudityAmount(value: string) {
		this.initialLiquidityAmount = value;
	}

	setName(name: string) {
		this.name = name;
	}

	setSymbol(symbol: string) {
		this.symbol = symbol;
	}

	setDescription(description: string) {
		this.description = description;
	}
	setLogo(logo: File) {
		this.logo = logo;
	}

	setInitialLiquidityToken(address: Address) {
		this.initialLiquidityToken = address;
	}

	getTokenPrice(address: Address) {
		const currentPrice = this.prices.find(
			(price) => price.address.toLowerCase() === address.toLowerCase(),
		)?.price;

		return currentPrice;
	}

	deleteToken(id: string) {
		this.tokens = this.tokens.filter((token) => token.id !== id);
	}

	startEditToken(id: string) {
		this.tokens = this.tokens.map((token) =>
			token.id === id ? { ...token, creationState: "edited" } : token,
		);
	}

	editToken({
		id,
		share,
		address,
		name,
		symbol,
		logo,
		creationState,
		priceFeedType,
	}: SetupToken) {
		this.tokens = this.tokens.map((token) =>
			token.id === id
				? {
						...token,
						creationState,
						share,
						address,
						logo,
						name,
						symbol,
						priceFeedType,
					}
				: token,
		);
	}

	cancelEditToken(id: string) {
		const token = this.tokens.find((t) => t.id === id);
		if (token?.creationState === "new") {
			this.deleteToken(id);
		} else {
			this.tokens = this.tokens.map((token) =>
				token.id === id ? { ...token, creationState: "readed" } : token,
			);
		}
	}

	addNewToken() {
		this.tokens.push({
			id: uuidv4(),
			address: "",
			name: "",
			creationState: "new",
			symbol: "",
		});
	}
}
