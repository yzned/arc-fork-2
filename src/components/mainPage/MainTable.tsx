import { observer } from "mobx-react-lite";

import LinkToPageIcon from "@/icons/linkToPage.svg?react";
import SortAsc from "../../icons/sortAsc.svg?react";

import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PriceChange } from "../ui/priceChange";
import { InfoTooltip } from "../ui/tooltips/InformationTooltip";
import { ShortMultipoolData } from "@/api/types";
import BigNumber from "bignumber.js";

export const MainTable = observer(() => {
	const { allPortfolios } = useExplorePortfolio();

	const { t } = useTranslation(["main"]);

	return (
		<div className="mt-6 max-h-[590px] w-full overflow-auto">
			<table className="w-full border-collapse ">
				<thead
					className="sticky top-0 z-10 grid w-full bg-fill-primary-800"
					style={{
						gridTemplateColumns: "103px 1fr 1fr 1fr 1fr 257px 52px",
					}}
				>
					<tr className="contents text-[14px] text-text-secondary">
						<th className="px-4 py-3 text-left">{t("asset")}</th>
						<th className="px-4 py-3 text-left">{t("name")}</th>
						<th className="py-3 pl-3 text-left ">{t("price")}, $</th>
						<th className="flex items-center gap-4 py-3 pl-4 text-left">
							{t("tvl")}, $ <SortAsc width={13} />
						</th>
						<th className="flex items-center gap-4 py-3 pl-4 text-left">
							{t("price24Hchange")}, $ <SortAsc width={13} /> <InfoTooltip />
						</th>

						<th className="py-3 pl-5 text-left ">{t("address")}</th>
						<th />
					</tr>
				</thead>

				<tbody className="w-full text-white ">
					{allPortfolios.map((row) => (
						<MainTableRow row={row} key={row.multipool} />
					))}
				</tbody>
			</table>
		</div>
	);
});

const MainTableRow = observer(({ row }: { row: ShortMultipoolData }) => {
	return (
		<Link to="/explore/$id" params={{ id: row.multipool }}>
			<tr
				className="group grid border-b border-b-fill-primary-700 transition-colors duration-400 ease-out hover:bg-fill-primary-700"
				style={{
					gridTemplateColumns: "103px 1fr 1fr 1fr 1fr 257px 52px",
				}}
			>
				<td className="flex items-center gap-2 px-3 py-4 text-left">
					<img
						src={row.logo || "/icons/empty-token.svg"}
						alt="icon1"
						className="h-4 w-4 overflow-hidden"
					/>
					<span>{row.symbol}</span>
				</td>

				<td className="px-3 py-4">{row.name}</td>

				<td className="px-3 py-4 text-left">{row.current_price}</td>
				<td className="py-4 pl-4 ">
					{" "}
					{new BigNumber(Number(row?.total_supply) * Number(row?.current_price))
						.multipliedBy(10 ** -8)
						.toString()}
				</td>

				<td className="flex gap-2 py-4 pl-4">
					{row.current_price} <PriceChange growing value="12" />
				</td>
				<a
					onClick={(e) => {
						e.stopPropagation();
					}}
					href={`https://arbiscan.io/address/${row.multipool}`}
					className="flex items-center gap-2 py-4 pl-5 text-[14px] text-fill-brand-secondary-500 transition-colors hover:text-text-brand-primary"
				>
					{`${row.multipool.slice(0, 5)}...${row.multipool.slice(-4)}`}
				</a>

				<td className="flex cursor-pointer items-center justify-center">
					<LinkToPageIcon className="text-text-secondary group-hover:text-text-brand-secondary" />
				</td>
			</tr>
		</Link>
	);
});
