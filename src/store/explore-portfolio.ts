import type {
	CandleDataFormated,
	LinearDataFormated,
	MultipoolAsset,
	MultipoolInfo,
	ShortMultipoolData,
} from "@/api/types";
import type { SetupToken, Token } from "@/lib/types";
import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from "uuid";
import type { Address } from "viem";

export interface MultipoolAssetFormated extends Omit<MultipoolAsset, "price"> {
	price?: {
		price?: string;
		timestamp?: number;
	};
	walletBalance?: bigint;
}

export class ExplorePortfolioStore {
	///for manage
	manageState: "main-info" | "asset-setup" | "fees";
	managingAsssets?: SetupToken[];

	isOpenAssetModal: boolean;
	isOpenTransferModal: boolean;
	isOpenPnlSettingsModal: boolean;

	allPortfolios: ShortMultipoolData[];

	portfolioCandlesData: CandleDataFormated[];
	portfolioLinearData: LinearDataFormated[];
	chartResolution: "1" | "15" | "30" | "60" | "720" | "1D";
	portfolioAssets?: MultipoolAssetFormated[];
	shortPortfolioData?: MultipoolInfo;

	rightSectionState: "mint" | "burn" | "settings";

	selectedAsset: Token = {
		...this?.portfolioAssets?.[0],
		address: this?.portfolioAssets?.[0].address as Address,
		share: this?.portfolioAssets?.[0].share.toString(),
		price: this?.portfolioAssets?.[0]?.price?.price,
	};

	slippage: string;
	mintBurnAmount?: string;

	swapNetworkFee?: string;

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
		this.manageState = "main-info";
	}

	updateManagingAssets() {
		this.managingAsssets = this.portfolioAssets?.map((asset) => ({
			id: asset.address,
			name: asset.symbol || "Unknown",
			symbol: asset.symbol || "",
			address: asset.address as Address,
			priceFeedType: "UniswapV3",
			creationState: "readed",
			share: asset.share?.toString() || "0",
		}));
	}

	changeTokenState(
		id: string,
		state?: "readed" | "new" | "edited" | "deleted",
	) {
		this.managingAsssets = this.managingAsssets?.map((token) =>
			token.id === id ? { ...token, creationState: state } : token,
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
		shareGrowing,
	}: SetupToken) {
		this.managingAsssets = this.managingAsssets?.map((token) =>
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
						shareGrowing,
					}
				: token,
		);
	}

	cancelEditToken(id: string) {
		const token = this.managingAsssets?.find((t) => t.id === id);
		if (token?.creationState === "new") {
			this.changeTokenState(id, "deleted");
		} else {
			this.managingAsssets = this.managingAsssets?.map((token) =>
				token.id === id ? { ...token, creationState: "readed" } : token,
			);
		}
	}

	addNewToken() {
		this.managingAsssets?.push({
			id: uuidv4(),
			name: "",
			creationState: "new",
			symbol: "",
		});
	}

	setSwapNetworkFee(fee: string) {
		this.swapNetworkFee = fee;
	}

	setManageState = (state: "main-info" | "asset-setup" | "fees") => {
		this.manageState = state;
	};

	setPortfolioAssets = (assets: MultipoolAssetFormated[]) => {
		this.portfolioAssets = assets.map((item) => {
			return {
				...item,
				price: item.price,
			};
		});
	};

	setChartResolution = (
		resolution: "1" | "15" | "30" | "60" | "720" | "1D",
	) => {
		this.chartResolution = resolution;
	};

	setShortPortfolioData = (shortData: MultipoolInfo) => {
		this.shortPortfolioData = shortData;
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

	setSelectedAsset = (asset: Token) => {
		this.selectedAsset = asset;
	};

	changeRightPanelState = (value: "mint" | "burn" | "settings") => {
		this.rightSectionState = value;
	};

	setSlippage = (value: string) => {
		this.slippage = value;
	};

	setMintBurnAmount = (value: string) => {
		this.mintBurnAmount = value;
	};

	setIsOpenTransferModal = (value: boolean) => {
		this.isOpenTransferModal = value;
	};

	setIsOpenPnlSettingsModal = (value: boolean) => {
		this.isOpenPnlSettingsModal = value;
	};
}
