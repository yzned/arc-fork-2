import type {
	CandleDataFormated,
	LinearDataFormated,
	ShortMultipoolData,
} from "@/api/types";
import { PORTFOLIO_ASSETS } from "@/lib/constants";
import type { Token } from "@/lib/types";
import { makeAutoObservable } from "mobx";

export class ExplorePortfolioStore {
	isOpenAssetModal: boolean;
	isOpenTransferModal: boolean;
	isOpenPnlSettingsModal: boolean;

	allPortfolios: ShortMultipoolData[];

	portfolioCandlesData: CandleDataFormated[];
	portfolioLinearData: LinearDataFormated[];
	chartResolution: "1" | "15" | "30" | "60" | "720" | "1D";

	rightSectionState: "mint" | "burn" | "settings";
	portfolioTokens: Token[] = [
		{
			name: "Bitcoin",
			symbol: "BTC",
			address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
			priceFeedType: "UniswapV3",
			share: "9.6189",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
			quantity: "178.94",
			targetShare: "4.9167",
			currentShare: "9.6189",
			price: "0.0723",
			tags: ["Tag1"],
		},
		{
			name: "Ethereum",
			symbol: "ETH",
			address: "0xbf88d065e77c8cC2239327C5EDb3A432268e5832",
			priceFeedType: "UniswapV3",
			share: "7.1234",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
			quantity: "120.45",
			targetShare: "5.0000",
			currentShare: "7.1234",
			price: "0.0456",
			tags: ["Tag2"],
		},
		{
			name: "Binance Coin",
			symbol: "BNB",
			address: "0xcf88d065e77c8cC2239327C5EDb3A432268e5833",
			priceFeedType: "Chainlink",
			share: "3.4567",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
			quantity: "89.12",
			targetShare: "2.5000",
			currentShare: "3.4567",
			price: "0.0234",
			tags: ["Tag3"],
		},
		{
			name: "Cardano",
			symbol: "ADA",
			address: "0xdf88d065e77c8cC2239327C5EDb3A432268e5834",
			priceFeedType: "RedStone",
			share: "2.3456",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
			quantity: "456.78",
			targetShare: "1.5000",
			currentShare: "2.3456",
			price: "0.0123",
			tags: ["Tag1", "Tag4"],
		},
		{
			name: "Solana",
			symbol: "SOL",
			address: "0xef88d065e77c8cC2239327C5EDb3A432268e5835",
			priceFeedType: "UniswapV2",
			share: "4.5678",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
			quantity: "234.56",
			targetShare: "3.0000",
			currentShare: "4.5678",
			price: "0.0345",
		},
		{
			name: "Ripple",
			symbol: "XRP",
			address: "0xff88d065e77c8cC2239327C5EDb3A432268e5836",
			priceFeedType: "FixedPrice",
			share: "1.2345",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
			quantity: "567.89",
			targetShare: "0.7500",
			currentShare: "1.2345",
			price: "0.0056",
		},
		{
			name: "Polkadot",
			symbol: "DOT",
			address: "0x1f88d065e77c8cC2239327C5EDb3A432268e5837",
			priceFeedType: "Chainlink",
			share: "2.6789",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
			quantity: "123.45",
			targetShare: "1.2500",
			currentShare: "2.6789",
			price: "0.0456",
		},
		{
			name: "Litecoin",
			symbol: "LTC",
			address: "0x2f88d065e77c8cC2239327C5EDb3A432268e5838",
			priceFeedType: "UniswapV3",
			share: "1.8901",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
			quantity: "78.90",
			targetShare: "1.0000",
			currentShare: "1.8901",
			price: "0.0678",
		},
		{
			name: "Chainlink",
			symbol: "LINK",
			address: "0x3f88d065e77c8cC2239327C5EDb3A432268e5839",
			priceFeedType: "RedStone",
			share: "3.2101",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
			quantity: "345.67",
			targetShare: "2.0000",
			currentShare: "3.2101",
			price: "0.0789",
		},
		{
			name: "Dogecoin",
			symbol: "DOGE",
			address: "0x4f88d065e77c8cC2239327C5EDb3A432268e5840",
			priceFeedType: "UniswapV2",
			share: "0.9876",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png",
			quantity: "678.90",
			targetShare: "0.5000",
			currentShare: "0.9876",
			price: "0.0012",
		},
	];

	selectedAsset: Token = PORTFOLIO_ASSETS[0];
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
	}

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
