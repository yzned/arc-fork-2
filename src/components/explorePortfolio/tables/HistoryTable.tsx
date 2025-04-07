import type { Token } from "@/lib/types";
import { observer } from "mobx-react-lite";

import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import LinkIcon from "@/icons/link.svg?react";
import { useTranslation } from "react-i18next";
import { Toggle } from "../../ui/toggle";
import { InfoTooltip } from "../../ui/tooltips/InformationTooltip";

export const HistoryTable = observer(() => {
	const { portfolioTokens } = useExplorePortfolio();
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
					{portfolioTokens.map((row, index) => (
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
