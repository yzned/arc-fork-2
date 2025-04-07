import type { Token } from "@/lib/types";
import { observer } from "mobx-react-lite";

import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import LinkToPageIcon from "@/icons/linkToPage.svg?react";
import SortAsc from "@/icons/sortAsc.svg?react";
import { useTranslation } from "react-i18next";

export const PositionsTable = observer(() => {
	const { portfolioTokens } = useExplorePortfolio();

	const { t } = useTranslation(["main"]);

	return (
		<div className="max-h-[590px] w-full overflow-auto">
			<table className="w-full border-collapse ">
				<thead
					className="sticky top-0 z-10 grid w-full bg-fill-primary-800"
					style={{
						gridTemplateColumns: "103px 187px 101px 188px 1fr 52px",
					}}
				>
					<tr className="contents text-[14px] text-text-secondary">
						<th className="px-4 py-3 text-left">{t("asset")}</th>
						<th className="px-4 py-3 text-left">{t("quantity")}</th>
						<th className="py-3 pl-3 text-left ">{t("price")}, $</th>
						<th className="flex items-center gap-4 py-3 pl-4 text-left">
							{t("tvl")}, $ <SortAsc width={13} />
						</th>
						<th className="py-3 pl-5 text-left ">{t("address")}</th>
						<th />
					</tr>
				</thead>

				<tbody className="w-full text-white ">
					{portfolioTokens.map((row, index) => (
						<PositionsTableTableRow row={row} key={`${index}-${row.address}`} />
					))}
				</tbody>
			</table>
		</div>
	);
});

const PositionsTableTableRow = observer(({ row }: { row: Token }) => {
	return (
		<tr
			className="group grid border-b border-b-fill-primary-700 transition-colors duration-400 ease-out hover:bg-fill-primary-700"
			style={{
				gridTemplateColumns: "103px 187px 101px 188px 1fr 52px",
			}}
		>
			<td className="flex items-center gap-2 px-3 py-4 text-left">
				<img src={row.logo} alt="icon1" className="h-4 w-4 overflow-hidden" />
				<span>{row.symbol}</span>
			</td>

			<td className="px-4 py-4">{row.quantity}</td>

			<td className="px-3 py-4 text-left">{row.price}</td>
			<td className="py-4 pl-4 ">{row.price}</td>

			<a
				onClick={(e) => {
					e.stopPropagation();
				}}
				href="https://arbiscan.io/"
				className="flex items-center gap-2 py-4 pl-5 text-[14px] text-fill-brand-secondary-500 transition-colors hover:text-text-brand-primary"
			>
				{`${row.address.slice(0, 5)}...${row.address.slice(-4)}`}
			</a>

			<td className="flex cursor-pointer items-center justify-center">
				<LinkToPageIcon className="text-text-secondary group-hover:text-text-brand-secondary" />
			</td>
		</tr>
	);
});
