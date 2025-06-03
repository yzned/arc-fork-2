import { observer } from "mobx-react-lite";

import LinkToPageIcon from "@/icons/linkToPage.svg?react";
import SortAsc from "../../icons/sortAsc.svg?react";

import type { ShortMultipoolDataFormated } from "@/api/types";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useGetPrice } from "@/hooks/use-get-price";
import { useMetadataChain } from "@/hooks/use-metadata-chain";
import { shrinkNumber } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { zeroAddress } from "viem";
import { PriceChange } from "../ui/priceChange";
import { InfoTooltip } from "../ui/tooltips/InformationTooltip";

export const MainTable = observer(() => {
	const { allPortfolios } = useExplorePortfolio();

	const { t } = useTranslation(["main"]);
	const { chain } = useMetadataChain();
	useGetPrice();

	return (
		<div className="mt-6 h-[calc(100svh-72px)] w-full overflow-auto">
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
							{t("tvl")}, {chain.nativeCurrency.symbol} <SortAsc width={13} />
						</th>
						<th className="flex items-center gap-4 py-3 pl-4 text-left">
							{t("price24Hchange")}, $ <SortAsc width={13} /> <InfoTooltip />
						</th>

						<th className="py-3 pl-5 text-left ">{t("address")}</th>
						<th />
					</tr>
				</thead>

				<tbody className="w-full text-white ">
					{allPortfolios?.map((row) => (
						<MainTableRow row={row} key={row.address} />
					))}
				</tbody>
			</table>
		</div>
	);
});

const MainTableRow = observer(
	({ row }: { row: ShortMultipoolDataFormated }) => {
		const navigate = useNavigate();

		const { chain } = useMetadataChain();

		return (
			// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
			<tr
				onClick={() => {
					navigate({
						to: "/explore/$id",
						params: { id: row?.address || zeroAddress },
					});
				}}
				className="group grid cursor-pointer border-b border-b-fill-primary-700 transition-colors duration-400 ease-out hover:bg-fill-primary-700"
				style={{
					gridTemplateColumns: "103px 1fr 1fr 1fr 1fr 257px 52px",
				}}
			>
				<td className="flex items-center min-w-0 px-3 py-4 text-left">
					<div className="flex items-center gap-2 min-w-0">
						<img
							src={row.logo || "/icons/empty-token.svg"}
							alt="icon1"
							className="h-4 w-4 flex-shrink-0 rounded-full overflow-hidden"
						/>
						<span className="truncate">{row?.stats?.symbol}</span>
					</div>
				</td>
				<td className="py-4 pl-4">{row?.stats?.name}</td>

				<td className="px-3 py-4 text-left">
					{shrinkNumber(row?.stats?.currentPrice || 0)}{" "}
				</td>
				<td className="py-4 pl-4 ">
					{shrinkNumber(row?.tvl?.toNumber() || 0)}
				</td>

				<td className="flex gap-2 py-4 pl-4">
					{shrinkNumber(Number(row?.absolutePriceChange) || 0)}
					<PriceChange
						value={shrinkNumber(row?.relativePriceChange?.toNumber() || 0, 4)}
						growing={row?.relativePriceChange?.isPositive() || false}
						unit="percents"
					/>
				</td>

				<td>
					<div
						onClick={(e) => {
							e.stopPropagation();
							window.open(
								`${chain?.blockExplorers?.default.url}/token/${row.address}`,
								"_blank",
								"noopener,noreferrer",
							);
						}}
						className="flex cursor-pointer items-center gap-2 py-4 pl-5 text-[14px] text-fill-brand-secondary-500 transition-colors hover:text-text-brand-primary"
						onKeyPress={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.stopPropagation();
								window.open(
									`${chain?.blockExplorers?.default.url}/token/${row.address}`,
									"_blank",
									"noopener,noreferrer",
								);
							}
						}}
						aria-label={`Open ${row.address} on Arbiscan`}
					>
						{`${row.address?.slice(0, 5)}...${row.address?.slice(-4)}`}
					</div>
				</td>

				<td className="flex cursor-pointer items-center justify-center">
					<LinkToPageIcon className="text-text-secondary group-hover:text-text-brand-secondary" />
				</td>
			</tr>
		);
	},
);
