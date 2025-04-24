import { Fees } from "@/components/managePortfolio/fees";
import { RightSection } from "@/components/managePortfolio/rightSection";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file";
import { Textarea } from "@/components/ui/textArea";
import { TokenTable } from "@/components/ui/tokenTable";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useMultipoolInfo } from "@/hooks/queries/useMultipoolInfo";
import Chevron from "@/icons/chevron.svg?react";
import { shorten } from "@/lib/formatNumber";

import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import BigNumber from "bignumber.js";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Address } from "viem";

export const Route = createFileRoute("/manage/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id: mpAddress } = useParams({ from: "/manage/$id" });
	useMultipoolInfo(mpAddress as Address);

	const {
		portfolioAssets,

		updateManagingAssets,
	} = useExplorePortfolio();

	useEffect(() => {
		updateManagingAssets();
	}, [portfolioAssets]);

	return (
		<>
			<div className="grid grid-cols-[1fr_329px] ">
				<MainSection />
				<RightSection />
			</div>
		</>
	);
}

export const MainSection = observer(() => {
	const router = useRouter();

	const { t } = useTranslation(["main"]);

	const { manageState, setManageState } = useExplorePortfolio();

	return (
		<div className="h-full overflow-hidden bg-bg-floor-1 pb-4">
			<div className="flex items-center gap-8">
				<Button
					className="h-[72px] w-[104px] bg-bg-floor-1 text-base text-fill-brand-secondary-500 [&_svg]:h-[16.81px] [&_svg]:w-[9.6px]"
					variant="selector"
					size="L"
					onClick={() => router.history.back()}
				>
					<Chevron className="-rotate-90" fill="#3d73ff" />
					{t("back")}
				</Button>

				<div className="flex gap-1">
					<Button
						variant={"tab"}
						data-active={manageState === "main-info"}
						className="h-10 "
						onClick={() => setManageState("main-info")}
					>
						<span>{t("mainInfo")}</span>
					</Button>
					<Button
						variant={"tab"}
						data-active={manageState === "asset-setup"}
						className="h-10 "
						onClick={() => setManageState("asset-setup")}
					>
						<span>{t("assetSetup")}</span>
					</Button>
					<Button
						variant={"tab"}
						data-active={manageState === "fees"}
						onClick={() => setManageState("fees")}
						className="h-10 "
					>
						<span>{t("fees")}</span>
					</Button>
				</div>
			</div>

			<span className="pl-6 font-[600] font-namu text-[72px] text-text-primary uppercase leading-[72px]">
				{t("managePortfolio")}
			</span>

			<span className="mt-8 block overflow-clip text-nowrap border-[#252627] border-t border-b py-px font-droid text-[10px] text-text-tertiary leading-[120%] ">
				{`/////////////////////////////////////////////////////////////////////////////////
					///////// .- .-. -.-. .- -. ..- --`.repeat(9)}
			</span>

			{manageState === "main-info" && <MainInfo />}
			{manageState === "asset-setup" && <AssetSetup />}
			{manageState === "fees" && <Fees />}
		</div>
	);
});

export const MainInfo = observer(() => {
	const { t } = useTranslation(["main"]);

	const { shortPortfolioData } = useExplorePortfolio();

	return (
		<div className="mt-[56px] flex flex-col gap-8 pl-6">
			<FileInput
				required={true}
				label="Logo"
				className="w-[254px]"
				onSelect={(item) => {
					console.log("item: ", item);
					// setLogo(item);
				}}
			/>

			<Textarea
				required={true}
				label={t("description")}
				description={t("upTo100Characters")}
				className="max-w-[793px]"
				defaultValue={shortPortfolioData?.description}
				// onChange={(e) => {
				// 	setDescription(e.target.value);
				// }}
				// value={description}
			/>
		</div>
	);
});

export const AssetSetup = observer(() => {
	const {
		managingAsssets,
		changeTokenState,
		cancelEditToken,
		editToken,
		portfolioAssets,
	} = useExplorePortfolio();

	return (
		<div className="mt-[56px] flex w-full gap-20 pl-6">
			<div className="w-[600px]">
				<TokenTable
					tokens={managingAsssets || []}
					onStartEdit={(id) => changeTokenState(id || "", "edited")}
					onDeleteToken={(id) => changeTokenState(id, "deleted")}
					onCancelEditToken={cancelEditToken}
					onEditToken={(item) => {
						const shareGrowing =
							Number(item.share) -
							Number(
								managingAsssets?.find((asset) => item.address === asset.address)
									?.share,
							);
						editToken({ ...item, shareGrowing });
					}}
					onRestoreItem={(id) => changeTokenState(id, "readed")}
					sharePercentsSum={
						new BigNumber(
							managingAsssets?.reduce(
								(sum, asset) => sum + (Number(asset.share) || 0),
								0,
							) || 0,
						)
					}
				/>
			</div>

			<div className="max-w-[600px] flex-1 overflow-auto pr-6">
				<table className="w-full border-collapse">
					<thead className="sticky top-0 z-10 bg-fill-primary-800">
						<tr className="text-[14px] text-text-secondary">
							<th className="py-3 pl-3 text-left">Current share </th>
							<th className="py-3 pl-3 text-left">Price </th>
							<th className="py-3 pl-4 text-left">Quantity</th>
						</tr>
					</thead>
					<tbody className="text-white">
						{portfolioAssets?.map((row) => (
							<tr
								key={row.address}
								className="border-b border-b-fill-primary-700 transition-colors duration-400 ease-out hover:bg-fill-primary-700"
							>
								<td className="py-4 pl-3 text-left">{row?.share}</td>

								<td className="py-4 pl-3 text-left">
									{shorten(new BigNumber(row?.price?.price || 0))}
								</td>
								<td className="py-3 pl-4 text-left">
									{shorten(new BigNumber(row?.quantity).multipliedBy(10 ** -6))}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
});
