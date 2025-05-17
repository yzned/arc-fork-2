import type {
	CandleDataFormated,
	LinearDataFormated,
	ShortMultipoolDataFormated,
} from "@/api/types";
import type {
	MultipoolSuplyChangelyPriceData,
	PorfolioAsset,
	SetupToken,
} from "@/lib/types";
import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from "uuid";

// export interface MultipoolAssetFormated extends Omit<MultipoolAsset, "price"> {
// 	price?: {
// 		price?: string;
// 		timestamp?: number;
// 	};
// 	walletBalance?: bigint;
// }

export class ExplorePortfolioStore {
	///for manage
	manageState: "main-info" | "asset-setup" | "fees";
	managingAsssets?: SetupToken[];

	isOpenAssetModal: boolean;
	isOpenTransferModal: boolean;
	isOpenPnlSettingsModal: boolean;

	allPortfolios: ShortMultipoolDataFormated[];

	portfolioCandlesData: CandleDataFormated[];
	portfolioLinearData: LinearDataFormated[];
	chartResolution: "60" | "900" | "3600" | "86400";
	portfolioAssets?: PorfolioAsset[];

	multipoolSupplyPriceData?: MultipoolSuplyChangelyPriceData;
	// shortPortfolioData?: MultipoolInfo;

	rightSectionState: "mint" | "burn" | "settings";

	// selectedAsset: Token = {};

	slippage: string;
	mintBurnAmount?: string;

	swapNetworkFee?: string;

	constructor(portfolios: ShortMultipoolDataFormated[]) {
		makeAutoObservable(this, {}, { autoBind: true });

		this.rightSectionState = "mint";
		this.isOpenAssetModal = false;
		this.isOpenTransferModal = false;
		this.slippage = "";
		this.isOpenPnlSettingsModal = false;
		this.allPortfolios = [];
		this.portfolioCandlesData = [];
		this.portfolioLinearData = [];
		this.chartResolution = "60";
		// this.portfolioAssets = [];
		this.manageState = "main-info";

		this.allPortfolios = portfolios;
	}

	// updateManagingAssets() {
	// 	this.managingAsssets = this.portfolioAssets?.map((asset) => ({
	// 		id: asset.address,
	// 		name: asset.symbol || "Unknown",
	// 		symbol: asset.symbol || "",
	// 		address: asset.address as Address,
	// 		priceFeedType: "UniswapV3",
	// 		creationState: "readed",
	// 		share: asset.share?.toString() || "0",
	// 	}));
	// }

	setPortfolioAssets(assets: PorfolioAsset[]) {
		this.portfolioAssets = assets;
	}

	setMultipoolSupplyPriceData(value: MultipoolSuplyChangelyPriceData) {
		this.multipoolSupplyPriceData = value;
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

	setChartResolution = (resolution: "60" | "900" | "3600" | "86400") => {
		this.chartResolution = resolution;
	};

	// setShortPortfolioData = (shortData: MultipoolInfo) => {
	// 	this.shortPortfolioData = shortData;
	// };

	setPorfolioCandles = (portfolioChartData: CandleDataFormated[]) => {
		this.portfolioCandlesData = portfolioChartData;
	};

	setPorfolioLinear = (linearChartData: LinearDataFormated[]) => {
		this.portfolioLinearData = linearChartData;
	};

	setIsOpenAssetModal = (value: boolean) => {
		this.isOpenAssetModal = value;
	};

	// setSelectedAsset = (asset: Token) => {
	// 	this.selectedAsset = asset;
	// };

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
