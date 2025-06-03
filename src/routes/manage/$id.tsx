import { Fees } from "@/components/managePortfolio/fees";
import { RightSection } from "@/components/managePortfolio/rightSection";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file";
import { Textarea } from "@/components/ui/textArea";
import { TokenTable } from "@/components/ui/tokenTable";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useMultipoolInfo } from "@/hooks/queries/useMultipoolInfo";
import { useTokensList } from "@/hooks/queries/useTokensList";
import { useGetPrice } from "@/hooks/use-get-price";
import Chevron from "@/icons/chevron.svg?react";
import PlusRoundedIcon from "@/icons/plus-rounded.svg?react";
import { shrinkNumber } from "@/lib/utils";

import { createFileRoute, useRouter } from "@tanstack/react-router";
import BigNumber from "bignumber.js";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/manage/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="grid grid-cols-[1fr_329px] ">
			<MainSection />
			<RightSection />
		</div>
	);
}

export const MainSection = observer(() => {
	useMultipoolInfo();
	useTokensList();

	const { manageState, setManageState } = useExplorePortfolio();

	const router = useRouter();

	const { t } = useTranslation(["main"]);

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
					{/* <Button
						variant={"tab"}
						data-active={manageState === "main-info"}
						className="h-10 "
						onClick={() => setManageState("main-info")}
					>
						<span>{t("mainInfo")}</span>
					</Button> */}
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

			{/* {manageState === "main-info" && <MainInfo />} */}
			{manageState === "asset-setup" && <AssetSetup />}
			{manageState === "fees" && <Fees />}
		</div>
	);
});

export const MainInfo = observer(() => {
	const { t } = useTranslation(["main"]);

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
				disabled={true}
			/>

			<Textarea
				required={true}
				label={t("description")}
				description={t("upTo100Characters")}
				className="max-w-[793px]"
				disabled={true}
			/>
		</div>
	);
});

export const AssetSetup = observer(() => {
	const {
		managingAsssets,
		portfolioAssets,
		changeTokenState,
		editToken,
		addNewToken,
		deleteToken,
	} = useExplorePortfolio();

	const { t } = useTranslation(["main"]);
	const { price } = useGetPrice();

	return (
		<div className="mt-[56px] flex w-full gap-20 pl-6 font-droid">
			<div className="w-[600px]">
				<TokenTable
					tokens={managingAsssets || []}
					onStartEdit={(id) => changeTokenState(id || "", "edited")}
					onDeleteToken={(item) => changeTokenState(item.id, "deleted")}
					onCancelEditToken={(item) => {
						if (item.creationState === "new" || !item.share || !item.address) {
							deleteToken(item.id);
						} else {
							changeTokenState(item.id, "readed");
						}
					}}
					onEditToken={(item) => {
						const shareGrowing = Number(item.share) - Number(item.targetShare);

						editToken({
							...item,
							shareGrowing,
						});
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

				<Button
					variant={"secondary"}
					onClick={() => {
						addNewToken();
					}}
					className="group mt-4 w-fit"
				>
					<span className="font-normal text-sm text-text-accent leading-[130%] tracking-[0.01em] transition-colors group-hover:text-text-primary">
						{t("addToken")}
					</span>
					<PlusRoundedIcon className="h-4 w-4" fill="#18171C" />
				</Button>
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
						{portfolioAssets?.map((row) => {
							const dollarQuantity =
								row?.quantity &&
								row.price &&
								new BigNumber(row?.quantity)
									.multipliedBy(row.price)
									.multipliedBy(price);

							return (
								<tr
									key={row.address}
									className="border-b border-b-fill-primary-700 transition-colors duration-400 ease-out hover:bg-fill-primary-700"
								>
									<td className="py-4 pl-3 text-left">
										{shrinkNumber(row.currentShare, 3)} %
									</td>

									<td className="py-4 pl-3 text-left">
										{shrinkNumber(row.price, 4, false)}
									</td>
									<td className="py-3 pl-4 text-left">
										{shrinkNumber(row?.quantity, 3, true)}{" "}
										<span className="text-[#8A8B8C]">
											({shrinkNumber(dollarQuantity?.toString())}$)
										</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
});
