import { observer } from "mobx-react-lite";

import { useTranslation } from "react-i18next";
import { InfoTooltip } from "../../ui/tooltips/InformationTooltip";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import type { PorfolioAsset } from "@/lib/types";
import { shrinkNumber } from "@/lib/utils";
import { useAccountStore } from "@/contexts/AccountContext";

export const PortfolioTable = observer(() => {
	const { t } = useTranslation(["main"]);
	const { portfolioAssets } = useExplorePortfolio();
	console.log("portfolioAssets: ", portfolioAssets);
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
					{portfolioAssets?.map((row, index) => (
						<PortfolioTableRow row={row} key={`${index}-${row.address}`} />
					))}
				</tbody>
			</table>
		</div>
	);
});

const PortfolioTableRow = observer(
	({
		row,
	}: {
		row: PorfolioAsset;
	}) => {
		const { currentChain } = useAccountStore();

		return (
			<tr
				className="grid border-b border-b-fill-primary-700 transition-colors duration-400 ease-out hover:bg-fill-primary-700"
				style={{
					gridTemplateColumns:
						"103px 187px 101px minmax(194px, 1fr) minmax(194px, 1fr) minmax(194px, 1fr) 143px",
				}}
			>
				<td className="flex items-center gap-2 px-4 py-3 text-left">
					<img
						src={row.image ? row.image : "/icons/empty-token.svg"}
						alt="icon1"
						className="h-4 w-4 overflow-hidden rounded-full"
					/>

					<span className="w-[0px]">{row?.symbol || "-"} </span>
				</td>

				<td className="px-4 py-3 items-center flex">
					{shrinkNumber(Number(row.assetData?.quantity))}
				</td>

				<td className="py-4 pr-2 text-right">
					{shrinkNumber(Number(row.price), 4)}
				</td>

				<td className="px-3 py-4 text-right">
					{Number(row.assetData?.targetShare)}
				</td>

				<td className="px-3 py-4 text-right">
					{Number(row.currentShare).toFixed(4)}
				</td>

				<td className="px-4 py-4 text-right text-fill-brand-secondary-500">
					{/* {row.priceFeedType} */}
				</td>

				<a
					onClick={(e) => {
						e.stopPropagation();
					}}
					target="_blank"
					rel="noopener noreferrer"
					href={`${currentChain?.blockExplorers?.default.url}/token/${row.address}`}
					className="flex items-center gap-2 py-4 text-[14px] text-fill-brand-secondary-500 transition-colors hover:text-text-brand-primary"
				>
					{`${row.address?.slice(0, 5)}...${row.address?.slice(-4)}`}
				</a>
			</tr>
		);
	},
);
