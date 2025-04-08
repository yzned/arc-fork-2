import type { Token } from "@/lib/types";
import { observer } from "mobx-react-lite";

import LinkIcon from "@/icons/link.svg?react";
import { useTranslation } from "react-i18next";
import { Toggle } from "../../ui/toggle";
import { InfoTooltip } from "../../ui/tooltips/InformationTooltip";

const MOCK_TOKENS: Token[] = [
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

export const HistoryTable = observer(() => {
	const { t } = useTranslation(["main"]);

	return (
		<div className="max-h-[590px] w-full overflow-auto">
			<table className="w-full border-collapse ">
				<thead
					className="sticky top-0 z-10 grid w-full bg-fill-primary-800"
					style={{
						gridTemplateColumns: "103px 187px 116px 167px 1fr 193px",
					}}
				>
					<tr className="contents text-[14px] text-text-secondary">
						<th className="px-4 py-3 text-left">{t("asset")}</th>
						<th className="px-4 py-3 text-left">{t("quantity")}</th>
						<th className="py-3 pl-4 text-left">{t("action")}</th>
						<th className="py-3 pl-5 text-left ">{t("TXNLink")}</th>
						<th className="py-3 pl-5 text-left ">{t("address")}</th>
						<th className="px-4 py-3 text-left ">
							<div className="flex items-center justify-end gap-3 whitespace-nowrap">
								{t("removeFromPNL")}
								<InfoTooltip>
									<span>
										When enabled, transaction will <br />
										be excluded from PNL calculations
									</span>
								</InfoTooltip>
							</div>
						</th>
					</tr>
				</thead>

				<tbody className="w-full text-white ">
					{MOCK_TOKENS.map((row, index) => (
						<HistoryTableRow row={row} key={`${index}-${row.address}`} />
					))}
				</tbody>
			</table>
		</div>
	);
});

const HistoryTableRow = observer(({ row }: { row: Token }) => {
	const { t } = useTranslation(["main"]);

	return (
		<tr
			className="grid border-b border-b-fill-primary-700 transition-colors duration-400 ease-out hover:bg-fill-primary-700"
			style={{
				gridTemplateColumns: "103px 187px 116px 167px 1fr 133px",
			}}
		>
			<td className="flex items-center gap-2 px-3 py-4 text-left">
				<img src={row.logo} alt="icon1" className="h-4 w-4 overflow-hidden" />
				<span>{row.symbol}</span>
			</td>

			<td className="px-4 py-4">{row.quantity}</td>

			<td className="py-4 pl-4 text-left">{t("mint")}</td>

			<td className="group py-4 pl-5 text-fill-brand-secondary-500 transition-colors hover:text-text-brand-primary ">
				<button
					type="button"
					className="flex cursor-pointer items-center gap-2"
				>
					<span>{`${row.address.slice(0, 5)}...${row.address.slice(-4)}`}</span>
					<LinkIcon className="mb-[2px] group:text-fill-brand-secondary-500" />
				</button>
			</td>

			<a
				onClick={(e) => {
					e.stopPropagation();
				}}
				href="https://arbiscan.io/"
				className="flex items-center gap-2 py-4 pl-5 text-[14px] text-fill-brand-secondary-500 transition-colors hover:text-text-brand-primary"
			>
				{`${row.address.slice(0, 5)}...${row.address.slice(-4)}`}
			</a>

			<td className=" flex justify-end pr-4">
				<Toggle />
			</td>
		</tr>
	);
});
