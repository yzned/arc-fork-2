import type {
	CandleDataFormated,
	LinearDataFormated,
	MultipoolAsset,
	ShortMultipoolData,
} from "@/api/types";
import type { Token } from "@/lib/types";
import BigNumber from "bignumber.js";
import { makeAutoObservable } from "mobx";
import type { Address } from "viem";

export interface MultipoolAssetFormated extends Omit<MultipoolAsset, "price"> {
	price: {
		price: string;
		timestamp: number;
	};
}
export class ExplorePortfolioStore {
	isOpenAssetModal: boolean;
	isOpenTransferModal: boolean;
	isOpenPnlSettingsModal: boolean;

	allPortfolios: ShortMultipoolData[];

	portfolioCandlesData: CandleDataFormated[];
	portfolioLinearData: LinearDataFormated[];
	chartResolution: "1" | "15" | "30" | "60" | "720" | "1D";

	rightSectionState: "mint" | "burn" | "settings";
	portfolioAssets?: MultipoolAssetFormated[];

	selectedAsset: Token = {
		...this?.portfolioAssets?.[0],
		address: this?.portfolioAssets?.[0].address as Address,
		share: this?.portfolioAssets?.[0].share.toString(),
		price: this?.portfolioAssets?.[0].price.price,
	};

	slippage: string;

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });

		this.rightSectionState = "mint";
		this.isOpenAssetModal = false;
		this.isOpenTransferModal = false;
		this.slippage = "";
		this.isOpenPnlSettingsModal = false;
		this.allPortfolios = [];
		this.portfolioCandlesData = [];
		this.portfolioLinearData = [];
		this.chartResolution = "1";
		this.portfolioAssets = [];
	}

	setMultipoolAssets = (assets: MultipoolAssetFormated[]) => {
		this.portfolioAssets = assets.map((item) => {
			const value = new BigNumber(item.price.price, 16).dividedBy(
				new BigNumber(2).pow(96),
			);

			return {
				...item,
				price: {
					...item.price,
					price: value.toString(),
				},
			};
		});
	};

	setChartResolution = (
		resolution: "1" | "15" | "30" | "60" | "720" | "1D",
	) => {
		this.chartResolution = resolution;
	};

	setAllPortfolios = (portfolios: ShortMultipoolData[]) => {
		this.allPortfolios = portfolios;
	};

	setPorfolioCandles = (portfolioChartData: CandleDataFormated[]) => {
		this.portfolioCandlesData = portfolioChartData;
	};

	setPorfolioLinear = (linearChartData: LinearDataFormated[]) => {
		this.portfolioLinearData = linearChartData;
	};

	setIsOpenAssetModal = (value: boolean) => {
		this.isOpenAssetModal = value;
	};

	changeSelectedAsset = (asset: Token) => {
		this.selectedAsset = asset;
	};

	changeRightPanelState = (value: "mint" | "burn" | "settings") => {
		this.rightSectionState = value;
	};

	setSlippage = (value: string) => {
		this.slippage = value;
	};

	setIsOpenTransferModal = (value: boolean) => {
		this.isOpenTransferModal = value;
	};

	setIsOpenPnlSettingsModal = (value: boolean) => {
		this.isOpenPnlSettingsModal = value;
	};
}
