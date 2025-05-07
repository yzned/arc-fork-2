import { observer } from "mobx-react-lite";

import { useTranslation } from "react-i18next";
import { InfoTooltip } from "../../ui/tooltips/InformationTooltip";

export const PortfolioTable = observer(() => {
	const { t } = useTranslation(["main"]);

	return (
		<div className="max-h-[590px] w-full overflow-auto">
			<table className="w-full border-collapse ">
				<thead
					className="sticky top-0 z-10 grid w-full bg-fill-primary-800"
					style={{
						gridTemplateColumns:
							"103px 187px 101px minmax(194px, 1fr) minmax(194px, 1fr) minmax(194px, 1fr) 143px",
					}}
				>
					<tr className="contents text-[14px] text-text-secondary">
						<th className="px-4 py-3 text-left">{t("token")}</th>
						<th className="px-4 py-3 text-left">{t("quantity")}</th>
						<th className="py-3 pr-2 text-right">{t("price")}, $</th>
						<th className="py-3 pr-2 text-right ">
							<div className="flex items-center justify-end gap-3">
								{t("targetShare")}, % <InfoTooltip />
							</div>
						</th>
						<th className="py-3 pr-2 pl-5 ">
							<div className="flex items-center justify-end gap-3">
								{t("currentShare")}, % <InfoTooltip />
							</div>
						</th>
						<th className="py-3 pr-4 text-right ">
							<div className="flex items-center justify-end gap-3">
								{t("priceFeedType")} <InfoTooltip />
							</div>
						</th>
						<th className="py-3 pr-6 text-left">{t("address")}</th>
					</tr>
				</thead>

				<tbody
					className="w-full text-white "
					style={{
						gridTemplateColumns: "103px 187px 101px 1fr 1fr 1fr 143px",
					}}
				>
					{/* {portfolioAssets?.map((row, index) => (
						<PortfolioTableRow row={row} key={`${index}-${row.address}`} />
					))} */}
				</tbody>
			</table>
		</div>
	);
});

// const PortfolioTableRow = observer(
// 	({
// 		row,
// 	}: {
// 		row: //@ts-ignore
// 		MultipoolAssetFormated;
// 	}) => {
// 		return (
// 			<tr
// 				className="grid border-b border-b-fill-primary-700 transition-colors duration-400 ease-out hover:bg-fill-primary-700"
// 				style={{
// 					gridTemplateColumns:
// 						"103px 187px 101px minmax(194px, 1fr) minmax(194px, 1fr) minmax(194px, 1fr) 143px",
// 				}}
// 			>
// 				<td className="flex items-center gap-2 px-4 py-3 text-left">
// 					{/* <img src={row.logo} alt="icon1" className="h-4 w-4 overflow-hidden" /> */}
// 					<img
// 						src={"/icons/empty-token.svg"}
// 						alt="icon1"
// 						className="h-4 w-4 overflow-hidden"
// 					/>

// 					<span>{row?.symbol || "-"} </span>
// 				</td>

// 				<td className="px-4 py-3">
// 					{shorten(new BigNumber(row.quantity).multipliedBy(10 ** -6))}
// 				</td>

// 				<td className="py-4 pr-2 text-right">
// 					{shorten(new BigNumber(row?.price?.price || 0))}
// 				</td>

// 				<td className="px-3 py-4 text-right">{row.share}</td>

// 				<td className="px-3 py-4 text-right">{row.share}</td>

// 				<td className="px-4 py-4 text-right text-fill-brand-secondary-500">
// 					{/* {row.priceFeedType} */}
// 				</td>

// 				<a
// 					onClick={(e) => {
// 						e.stopPropagation();
// 					}}
// 					href="https://arbiscan.io/"
// 					className="flex items-center gap-2 py-4 text-[14px] text-fill-brand-secondary-500 transition-colors hover:text-text-brand-primary"
// 				>
// 					{`${row.address.slice(0, 5)}...${row.address.slice(-4)}`}
// 				</a>
// 			</tr>
// 		);
// 	},
// );
