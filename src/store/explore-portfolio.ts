import type {
	AvailableChainTokensDataFormated,
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
import type { Address } from "viem";

export class ExplorePortfolioStore {
	// "main-info" |
	manageState: "asset-setup" | "fees";
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

	rightSectionState: "mint" | "burn" | "settings";

	selectedAsset: AvailableChainTokensDataFormated | undefined;

	slippage: string;
	mintBurnAmount?: string;
	rawMintBurnAmount?: string;

	swapNetworkFee?: string;

	selectedFeeTemplate?: number;

	baseFee?: string;
	deviationLimit?: string;
	deviationFee?: string;
	cashbackFeeShare?: string;
	initialSharePrice?: string;
	managementFee?: string;
	managementFeeRecepient?: string;

	constructor(portfolios: ShortMultipoolDataFormated[]) {
		makeAutoObservable(this, {}, { autoBind: true });

		this.rightSectionState = "mint";
		this.isOpenAssetModal = false;
		this.isOpenTransferModal = false;
		this.slippage = "0.5";
		this.isOpenPnlSettingsModal = false;
		this.portfolioCandlesData = [];
		this.portfolioLinearData = [];
		this.chartResolution = "60";
		this.manageState = "asset-setup";
		this.allPortfolios = portfolios;
		this.selectedAsset = undefined;
	}

	updateManagingAssets() {
		if (!this.portfolioAssets) {
			this.managingAsssets = [];
			return;
		}
		this.managingAsssets = this.portfolioAssets.map((asset) => ({
			id: uuidv4(),
			name: asset.symbol || "Unknown",
			symbol: asset.symbol || "",
			address: asset.address as Address,
			priceFeedType: "UniswapV3",
			creationState: "readed",
			share: asset.targetShare.toString() || "0",
			targetShare: asset.targetShare.toString() || "0",
			logo: asset.image,
		}));
	}

	setSelectedFeeTemplate(id: number) {
		this.selectedFeeTemplate = id;
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

	setPortfolioAssets(assets: PorfolioAsset[]) {
		this.portfolioAssets = assets;
	}

	setMultipoolSupplyPriceData(value: MultipoolSuplyChangelyPriceData) {
		this.multipoolSupplyPriceData = value;
	}

	setManagingAssets(newAssets: SetupToken[]) {
		this.managingAsssets = newAssets;
	}

	changeTokenState(
		id: string,
		state?: "readed" | "new" | "edited" | "deleted",
	) {
		this.managingAsssets = this.managingAsssets?.map((token) => {
			if (token.id === id) {
				if (state === "deleted") {
					return { ...token, creationState: state, share: "0" };
				}

				return { ...token, creationState: state };
			}
			return token;
		});
	}

	deleteToken(id: string) {
		this.managingAsssets = this.managingAsssets?.filter(
			(token) => token.id !== id,
		);
	}

	editToken({
		id,
		address,
		name,
		symbol,
		logo,
		creationState,
		priceFeedType,
		shareGrowing,
		poolAddress,
		share,
		targetShare,
	}: SetupToken) {
		this.managingAsssets = this.managingAsssets?.map((token) =>
			token.id === id
				? {
						...token,
						creationState,
						address,
						share,
						logo,
						name,
						symbol,
						priceFeedType,
						poolAddress,
						shareGrowing,
						targetShare,
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
			shareGrowing: 0,
		});
	}

	setSwapNetworkFee(fee: string) {
		this.swapNetworkFee = fee;
	}

	setManageState = (state: "asset-setup" | "fees") => {
		this.manageState = state;
	};

	setChartResolution = (resolution: "60" | "900" | "3600" | "86400") => {
		this.chartResolution = resolution;
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

	setSelectedAsset = (asset: AvailableChainTokensDataFormated | undefined) => {
		this.selectedAsset = asset;
	};

	setRightPanelState = (value: "mint" | "burn" | "settings") => {
		this.rightSectionState = value;
	};

	setSlippage = (value: string) => {
		this.slippage = value;
	};

	setMintBurnAmount = (value: string) => {
		this.mintBurnAmount = value;
	};

	setRawMintBurnAmount = (value: string) => {
		this.rawMintBurnAmount = value;
	};

	setIsOpenTransferModal = (value: boolean) => {
		this.isOpenTransferModal = value;
	};

	setIsOpenPnlSettingsModal = (value: boolean) => {
		this.isOpenPnlSettingsModal = value;
	};
}
