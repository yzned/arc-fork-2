import { Button } from "@/components/ui/button";
import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";

import { LinearChart } from "@/components/ui/Charts/LinearChart";
import { Input } from "@/components/ui/input";
import { ModalBase } from "@/components/ui/modalBase";
import { cn, shrinkNumber } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

import CandlesIcon from "@/icons/candles.svg?react";
import ChevronIcon from "@/icons/chevron.svg?react";
import CoinsIcon from "@/icons/coins.svg?react";
import EditIcon from "@/icons/edit.svg?react";
import FireIcon from "@/icons/fire.svg?react";
import LinearIcon from "@/icons/linear.svg?react";
import PortfolioIcon from "@/icons/portfolio.svg?react";
import RefreshIcon from "@/icons/refresh.svg?react";
import SettingsIcon from "@/icons/settings.svg?react";

import RoundedCheckIcon from "@/icons/roundedCheck.svg?react";
import SmallXIcon from "@/icons/smallX.svg?react";

import { ExploreMobile } from "@/components/explorePortfolio/ExploreMobile";
import { BalancesTable } from "@/components/explorePortfolio/tables/BalanceTable";
import { HistoryTable } from "@/components/explorePortfolio/tables/HistoryTable";
import { PortfolioTable } from "@/components/explorePortfolio/tables/PortfolioTable";
import { PositionsTable } from "@/components/explorePortfolio/tables/PositionsTable";
import { CandleChart } from "@/components/ui/Charts/CandleChart";
import { FindAsset } from "@/components/ui/findAsset";
import { PriceChange } from "@/components/ui/priceChange";
import { Toggle } from "@/components/ui/toggle";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";

import { BalanceSpan } from "@/components/explorePortfolio/balance";
import { MinimalReceive } from "@/components/explorePortfolio/minimal-receive";
import { MintButton } from "@/components/explorePortfolio/mint-button";
import { useMultipoolInfo } from "@/hooks/queries/useMultipoolInfo";
import { useTokensList } from "@/hooks/queries/useTokensList";
import { useGetPrice } from "@/hooks/use-get-price";
import { useOnClickOutside } from "usehooks-ts";
import type { Address } from "viem";
import { useAccount } from "wagmi";
import { usePnlPositions } from "@/hooks/queries/usePnlPositions";

export const Route = createFileRoute("/explore/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	useMultipoolInfo();
	useTokensList();

	return (
		<>
			<div className="hidden grid-cols-[1fr_329px] grid-rows-1 gap-0 md:grid">
				<MainSection />
				<RightSection />
			</div>

			<div className="block md:hidden">
				<ExploreMobile />
			</div>
		</>
	);
}

export const MainSection = observer(() => {
	const [currentGraph, setCurrentGraph] = useState<
		"candles" | "linear" | "portfolio"
	>("candles");

	const [currentBottomTable, setCurrentBottomTable] = useState<
		"balances" | "positions" | "history"
	>("balances");

	const [isOpenAssetSelector, setIsOpenAssetSelector] = useState(false);

	const { t } = useTranslation(["main"]);

	const assetSelectorRef = useRef<HTMLDivElement>(null);

	const {
		isOpenAssetModal,
		setIsOpenAssetModal,
		isOpenPnlSettingsModal,
		setIsOpenPnlSettingsModal,
		chartResolution,
		setChartResolution,
		portfolioLinearData,
		allPortfolios,
		multipoolSupplyPriceData,
		managementFeeRecepient,
	} = useExplorePortfolio();

	const { address } = useAccount();

	const { id } = useParams({ from: "/explore/$id" });

	const currentPortfolio =
		allPortfolios?.find(
			(item) => item.address?.toLowerCase() === id?.toLowerCase(),
		) ?? allPortfolios?.[0];

	const handleClickOutside = () => {
		setIsOpenAssetSelector(false);
	};

	useOnClickOutside(
		assetSelectorRef as React.RefObject<HTMLElement>,
		handleClickOutside,
	);

	const navigate = useNavigate();

	const { price } = useGetPrice();
	const { data: pnlData } = usePnlPositions();

	return (
		<div className="overflow-hidden bg-bg-floor-1">
			<ModalBase
				isOpen={isOpenAssetModal}
				onClose={() => setIsOpenAssetModal(false)}
				className="h-[650px] w-[516px] rounded-[8px]"
			>
				<AssetsModalContent />
			</ModalBase>

			<ModalBase
				isOpen={isOpenPnlSettingsModal}
				onClose={() => setIsOpenPnlSettingsModal(false)}
				className="h-[400px] w-[516px] rounded-[8px]"
			>
				<PnlSettingsModal />
			</ModalBase>

			<header className="relative flex h-[72px] w-full border-b-[1px] border-b-fill-secondary">
				<div ref={assetSelectorRef}>
					<button
						onClick={() => {
							setIsOpenAssetSelector(!isOpenAssetSelector);
						}}
						type="button"
						className="flex h-full w-[260px] cursor-pointer items-center justify-between border-r-[1px] border-r-fill-secondary p-5"
					>
						<div className="flex items-center gap-4">
							<img
								src={currentPortfolio?.logo || "/icons/empty-token.svg"}
								className="h-8 w-8 rounded-full overflow-hidden"
								alt="no-logo"
							/>
							<div className="flex max-w-[150px] flex-col gap-2">
								<span className="font-namu text-[24px] text-text-primary leading-[24px]">
									{currentPortfolio?.stats?.symbol}
								</span>
								<span className="truncate font-droid text-[12px] text-text-secondary leading-[12px]">
									{currentPortfolio?.stats?.name}
								</span>
							</div>
						</div>
						<ChevronIcon
							className={cn(
								"h-4 w-4 transition-all duration-300",
								isOpenAssetSelector && "rotate-0 text-fill-brand-secondary-500",
								!isOpenAssetSelector && " rotate-180 text-text-primary",
							)}
						/>
					</button>
					<div className="absolute top-full right-0 left-0 z-30 w-[516px] overflow-hidden border-fill-secondary border-r-[1px] border-b-[1px] bg-fill-primary-900">
						<div
							className={cn(
								"transition-all duration-300 ",
								isOpenAssetSelector ? "h-[600px]" : "h-0",
							)}
						>
							<FindAsset
								//@ts-ignore
								defaultActiveItem={currentPortfolio}
								data={allPortfolios.map((item) => {
									return {
										address: item.address as Address,
										price: new BigNumber(item.stats.currentPrice || 0),
										symbol: item.stats.symbol,
										name: item.stats.name,
										logo: item.logo,
										decimals: item.decimals,
									};
								})}
								onSelectAsset={(asset) => {
									navigate({
										to: "/explore/$id",
										params: { id: asset?.address || "" },
									});
								}}
								className="h-[510px] w-full border-fill-secondary border-t px-4 pt-6"
							/>
						</div>
					</div>
				</div>
				<div className="flex grow items-center justify-between pr-4">
					<div className="flex h-full items-center gap-10 pl-10">
						<div className="flex gap-10 font-droid">
							<div className="flex flex-col">
								<span className="text-[12px] text-text-primary">
									{t("price")}
								</span>
								<span className="text-[14px] text-text-secondary">
									{shrinkNumber(
										(multipoolSupplyPriceData?.price?.toNumber() || 0) * price,
									)}
								</span>
							</div>
						</div>
						<div className="flex gap-10 font-droid">
							<div className="flex flex-col">
								<span className="text-[12px] text-text-primary">
									{t("tvl")}
								</span>
								<span className="text-[14px] text-text-secondary">
									{shrinkNumber(
										(multipoolSupplyPriceData?.tvl?.toNumber() || 0) * price,
									)}
								</span>
							</div>
						</div>
						<div className="flex gap-10 font-droid">
							<div className="flex flex-col">
								<span className="text-[12px] text-text-primary">
									{t("24HChange")}
								</span>
								<span className="text-[14px] text-text-secondary">
									<PriceChange
										value={shrinkNumber(
											multipoolSupplyPriceData?.absolute24hPriceChange?.toNumber() ||
												0,
										)}
										growing={
											multipoolSupplyPriceData?.absolute24hPriceChange.isPositive() ||
											false
										}
										unit="dollars"
									/>
								</span>
							</div>
						</div>
						<div className="flex gap-10 font-droid">
							<div className="flex flex-col">
								<span className="text-[12px] text-text-primary">
									{t("24hHigh")}
								</span>
								<span className="text-[14px] text-text-secondary">
									${" "}
									{multipoolSupplyPriceData?.close?.isLessThan(
										multipoolSupplyPriceData?.open || 0,
									)
										? shrinkNumber(
												multipoolSupplyPriceData?.open?.toNumber() || 0,
											)
										: shrinkNumber(
												multipoolSupplyPriceData?.close?.toNumber() || 0,
											)}
								</span>
							</div>
						</div>
						<div className="flex gap-10 font-droid">
							<div className="flex flex-col">
								<span className="text-[12px] text-text-primary">
									{t("24hLow")}
								</span>
								<span className="text-[14px] text-text-secondary">
									${" "}
									{multipoolSupplyPriceData?.close?.isLessThan(
										multipoolSupplyPriceData?.open || 0,
									)
										? shrinkNumber(
												multipoolSupplyPriceData?.close?.toNumber() || 0,
											)
										: shrinkNumber(
												multipoolSupplyPriceData?.open?.toNumber() || 0,
											)}
								</span>
							</div>
						</div>
					</div>
					<Button
						variant={"tertiary"}
						data-visible={address === managementFeeRecepient}
						onClick={() => {
							navigate({ to: "/manage/$id", params: { id: id } });
						}}
						className="h-[40px] w-[193px] text-[14px] data-[visible=false]:hidden"
					>
						<span> {t("managePortfolio")}</span>
						<EditIcon className="scale-90" />
					</Button>
				</div>
			</header>

			<div>
				<div className="mb-4 flex items-center gap-8 p-6 ">
					<div className="flex gap-1 text-[14px]">
						<Button
							variant={"tab"}
							data-active={currentGraph === "candles"}
							className="h-10 w-[128px]"
							onClick={() => setCurrentGraph("candles")}
						>
							<CandlesIcon className="mb-[2px] scale-85" />
							<span>{t("candles")}</span>
						</Button>

						<Button
							variant={"tab"}
							className="h-10 w-[128px]"
							data-active={currentGraph === "linear"}
							onClick={() => setCurrentGraph("linear")}
						>
							<LinearIcon className="mb-[2px] scale-85" />
							<span>{t("line")}</span>
						</Button>

						<Button
							variant={"tab"}
							className="h-10 w-[128px]"
							data-active={currentGraph === "portfolio"}
							onClick={() => {
								setCurrentGraph("portfolio");
							}}
						>
							<PortfolioIcon className="mb-[2px] scale-85" />
							<span>{t("portfolio")}</span>
						</Button>
					</div>
					{currentGraph !== "portfolio" && (
						<div className="flex gap-1">
							<Button
								className="w-fit bg-transparent"
								size="M"
								data-active={chartResolution === "60"}
								onClick={() => {
									setChartResolution("60");
								}}
								variant="selector"
							>
								{t("1m")}
							</Button>
							<Button
								data-active={chartResolution === "900"}
								className="w-fit bg-transparent"
								size="M"
								onClick={() => {
									setChartResolution("900");
								}}
								variant="selector"
							>
								{t("15m")}
							</Button>

							<Button
								className="w-fit bg-transparent"
								data-active={chartResolution === "3600"}
								size="M"
								onClick={() => {
									setChartResolution("3600");
								}}
								variant="selector"
							>
								{t("1h")}
							</Button>

							<Button
								data-active={chartResolution === "86400"}
								className="w-fit bg-transparent"
								size="M"
								onClick={() => {
									setChartResolution("86400");
								}}
								variant="selector"
							>
								{t("1d")}
							</Button>
						</div>
					)}
				</div>

				<div className={cn(currentGraph !== "portfolio" && "pr-[55px] pl-6")}>
					{currentGraph === "candles" && <CandleChart />}
					{currentGraph === "linear" && (
						//@ts-ignore
						<LinearChart height={443} data={portfolioLinearData} />
					)}
					{currentGraph === "portfolio" && <PortfolioTable />}
				</div>
			</div>

			<div className="mt-[56px] overflow-clip text-nowrap border-[#252627] border-t border-b py-px font-droid text-[10px] text-text-tertiary leading-[120%]">
				{`//////////////////////////////////////////////////////////////////////
					///////// .- .-. -.-. .- -. ..- --`.repeat(9)}
			</div>

			<div>
				<div className="flex items-center gap-8 p-6">
					<div className="flex gap-1">
						<Button
							variant={"tab"}
							data-active={currentBottomTable === "balances"}
							className="h-10 w-[128px]"
							onClick={() => setCurrentBottomTable("balances")}
						>
							<span>{t("balances")}</span>
						</Button>

						<Button
							variant={"tab"}
							data-active={currentBottomTable === "positions"}
							className="h-10 w-[128px]"
							onClick={() => setCurrentBottomTable("positions")}
						>
							<span>{t("positions")}</span>
						</Button>
					</div>
				</div>

				<div className="mb-6 px-6">
					<div className="flex h-[64px] w-full justify-between bg-fill-primary-800 px-4 py-3">
						<div className="flex items-center gap-8">
							<span className="mb-1 font-[600] font-namu text-[40px] text-text-primary uppercase">
								{t("pnl")}
							</span>

							<div className="flex items-center gap-4">
								<PriceChange
									growing={
										pnlData?.relativeCommonPnl?.isGreaterThan(0) || false
									}
									value={shrinkNumber(pnlData?.relativeCommonPnl?.toString())}
								/>
								<div className="flex items-center gap-1 text-[14px]">
									<span className="text-text-primary">
										{shrinkNumber(pnlData?.absoluteCommonPnl?.toString())}
									</span>
									<span className="text-text-secondary">
										{shrinkNumber(
											pnlData?.absoluteCommonPnl
												?.multipliedBy(price)
												.toString(),
										)}{" "}
										$
									</span>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-4">
							{/* <div className="flex gap-1">
								<Button className="w-fit" size="M" variant="selector">
									{t("day")}
								</Button>
								<Button className="w-fit" size="M" variant="selector">
									{t("week")}
								</Button>
								<Button className="w-fit" size="M" variant="selector">
									{t("month")}
								</Button>
								<Button className="w-fit" size="M" variant="selector">
									{t("year")}
								</Button>
								<Button className="w-fit" size="M" variant="selector">
									{t("allTime")}
								</Button>
							</div> */}

							<Button
								variant={"ghost"}
								className="h-10 w-10"
								onClick={() => {
									setIsOpenPnlSettingsModal(true);
								}}
							>
								<SettingsIcon className="scale-120 text-text-primary" />
							</Button>
						</div>
					</div>
				</div>
				<div>
					{currentBottomTable === "balances" && <BalancesTable />}
					{currentBottomTable === "positions" && <PositionsTable />}
					{currentBottomTable === "history" && <HistoryTable />}
				</div>
			</div>
		</div>
	);
});

export const RightSection = observer(() => {
	const [percentOffset, setPercentOffset] = useState(50);

	const { t } = useTranslation(["main"]);

	const {
		setIsOpenAssetModal,
		selectedAsset,
		rightSectionState,
		setRightPanelState,
		setSlippage,

		rawMintBurnAmount,
		setRawMintBurnAmount,

		setMintBurnAmount,
	} = useExplorePortfolio();

	const [slippageValue, setSlippageValue] = useState("0.5");

	// const { data: balance } = useReadContract({
	// 	abi: ERC20,
	// 	address: id as Address,
	// 	functionName: "balanceOf",
	// 	args: [walletAddress || zeroAddress],
	// 	query: {
	// 		enabled: !!walletAddress,
	// 	},
	// });

	// const selectedAssetData = chainsTokens?.find(
	// 	(item) => item.address === selectedAsset?.address,
	// );

	const inputRef = useRef<HTMLInputElement>(null);

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setRawMintBurnAmount(value);
		setMintBurnAmount("0");

		// Regex for decimal numbers (up to 2 decimal places)
		const decimalRegex = /^\d*\.?\d{0,18}$/;

		if (value === "" || decimalRegex.test(value)) {
			setMintBurnAmount(value);
		}
	};

	const handleSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(",", ".");

		if (value.startsWith("0") && value.length > 1 && !value.startsWith("0.")) {
			value = value.replace(/^0+/, "");
		}

		if (/^\d*\.?\d*$/.test(value)) {
			const numericValue = value === "" ? "" : value;

			if (Number(numericValue) >= 0 && Number(numericValue) <= 100) {
				setSlippageValue(numericValue);
			}
		}
	};

	useEffect(() => {
		if (inputRef.current) {
			const tempSpan = document.createElement("span");
			tempSpan.style.visibility = "hidden";
			tempSpan.style.whiteSpace = "pre";
			tempSpan.style.fontFamily = "namu";
			tempSpan.style.fontSize = "24px";
			tempSpan.textContent = slippageValue || "";

			document.body.appendChild(tempSpan);
			const textWidth = tempSpan.getBoundingClientRect().width;
			document.body.removeChild(tempSpan);

			setPercentOffset(textWidth + 16);
		}
	}, [slippageValue]);

	return (
		<div className="h-full bg-black ">
			<div className="sticky top-[72px] h-[calc(100svh-72px)] w-[329px] overflow-scroll border-fill-secondary border-l-[1px] bg-bg-floor-2 text-text-primary">
				{rightSectionState === "settings" ? (
					<div className="flex h-[353px] flex-col justify-between py-4">
						<div className="flex flex-col">
							<Button
								className="ml-2 flex h-[32px] w-[91px] items-center gap-2 text-[14px] text-base text-fill-brand-secondary-500"
								type="button"
								onClick={() => {
									setRightPanelState("mint");
								}}
								variant={"ghost"}
							>
								<ChevronIcon
									className="-rotate-90 h-4 w-4 scale-90"
									fill="#3d73ff"
								/>
								{t("back")}
							</Button>

							<div className="mt-6 flex flex-col gap-4 px-6">
								<div className="flex flex-col gap-3">
									<span className="font-droid text-[12px] text-text-secondary">
										{t("slippage")}
									</span>

									<div className="flex gap-1">
										<Button
											variant={"selector"}
											className="h-8 w-[68px] text-[14px] text-text-primary"
											data-active={slippageValue === "0.1"}
											onClick={() => {
												setSlippage("0.1");
												setSlippageValue("0.1");
											}}
										>
											0.1%
										</Button>
										<Button
											variant={"selector"}
											className="h-8 w-[68px] text-[14px] text-text-primary"
											data-active={slippageValue === "0.5"}
											onClick={() => {
												setSlippage("0.5");
												setSlippageValue("0.5");
											}}
										>
											0.5%
										</Button>
										<Button
											variant={"selector"}
											className="h-8 w-[68px] text-[14px] text-text-primary"
											data-active={slippageValue === "1"}
											onClick={() => {
												setSlippage("1");
												setSlippageValue("1");
											}}
										>
											1%
										</Button>
										<Button
											variant={"selector"}
											className="h-8 w-[68px] text-[14px] text-text-primary"
											data-active={
												slippageValue !== "0.1" &&
												slippageValue !== "0.5" &&
												slippageValue !== "1"
											}
											onClick={() => {
												setSlippage("0");
												setSlippageValue("0");
											}}
										>
											{t("custom")}
										</Button>
									</div>
								</div>

								<div className="relative font-namu text-[24px]">
									<Input
										ref={inputRef}
										onChange={(e) => handleSlippageChange(e)}
										value={slippageValue}
										className=" h-[50px] font-namu text-[24px] text-white placeholder:font-droid placeholder:text-[14px]"
										placeholder={t("enterSlippage")}
										type=""
									/>
									{slippageValue && (
										<span
											style={{ left: `${percentOffset}px` }}
											className="pointer-events-none absolute top-[3px] transform"
										>
											%
										</span>
									)}
								</div>
							</div>
						</div>
						<div className="px-4">
							<Button
								className="mt-4 h-10 w-full"
								onClick={() => {
									setSlippage(slippageValue);
									setRightPanelState("mint");
								}}
							>
								<span> {t("apply")}</span>
							</Button>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-10 p-4">
						<div className="flex items-center gap-2">
							<div className="flex gap-1">
								<Button
									variant={"tab"}
									data-active={rightSectionState === "mint"}
									onClick={() => {
										setRightPanelState("mint");
									}}
									className="h-10 w-[102px]"
								>
									<CoinsIcon className="mb-[2px] scale-85" />
									<span> {t("mint")}</span>
								</Button>

								<Button
									variant={"tab"}
									className="h-10 w-[102px]"
									data-active={rightSectionState === "burn"}
									onClick={() => {
										setRightPanelState("burn");
									}}
								>
									<FireIcon className="mb-[2px] scale-85" />
									<span> {t("burn")}</span>
								</Button>
							</div>
							<div>
								<Button variant={"ghost"} className="h-10 w-10">
									<RefreshIcon />
								</Button>
								<Button
									variant={"ghost"}
									className="h-10 w-10"
									onClick={() => {
										setRightPanelState("settings");
									}}
								>
									<SettingsIcon className="scale-120 text-text-primary" />
								</Button>
							</div>
						</div>
						<div className=" flex flex-col gap-4 px-2">
							<div className="flex w-full items-center justify-between">
								<span className="font-droid text-[12px] text-text-secondary leading-[12px]">
									{rightSectionState === "mint" ? t("mint") : t("burn")}{" "}
									{rightSectionState === "mint" ? t("from") : t("to")}
								</span>

								<Button
									variant={"tertiary"}
									className="flex min-w-[90px] items-center justify-between p-0 px-1 font-droid "
									onClick={() => setIsOpenAssetModal(true)}
								>
									<div className="flex items-center gap-2">
										<img
											src={selectedAsset?.logo || "/icons/empty-token.svg"}
											alt="no icon"
											className="h-6 w-6 overflow-hidden rounded-full"
										/>
										<span>{selectedAsset?.symbol || "-"}</span>
									</div>
									<ChevronIcon className="h-4 w-4 rotate-90 scale-90" />
								</Button>
							</div>

							<div className="flex flex-col gap-2">
								<Input
									onChange={(e) => handleAmountChange(e)}
									type="token"
									value={rawMintBurnAmount}
									placeholder={t("enterAmount")}
									className="h-[40px] font-[600] font-namu text-[24px] text-white placeholder:font-droid placeholder:text-[14px]"
								/>
								<div className="flex w-full justify-between text-text-secondary">
									<BalanceSpan />
								</div>
							</div>
						</div>
						<div>
							<MinimalReceive />
							<MintButton />
						</div>
					</div>
				)}

				<div className="flex flex-col gap-6 overflow-y-auto border-fill-secondary border-t-[1px] p-4 pt-[6] ">
					<span className="font-droid text-[12px] text-text-secondary">
						{t("description")}
					</span>

					<div className="flex flex-col gap-4 px-2">
						<span className="leading-[18px] tracking-[1.05px]">
							{/* {currentPortfolio?.description} */}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
});

export const AssetsModalContent = observer(() => {
	const {
		setIsOpenAssetModal,
		setSelectedAsset,
		// portfolioAssets,
		selectedAsset,
	} = useExplorePortfolio();

	const { data: chainsTokens } = useTokensList();
	const { t } = useTranslation(["main"]);

	console.log("chainsTokens", chainsTokens);

	return (
		<div className="relative flex h-full flex-col overflow-y-scroll">
			<div className="pt-4 pl-6 ">
				<span className="font-[600] font-namu text-[72px] text-white uppercase leading-[93px] ">
					{t("assets")}
				</span>
				<Button
					variant={"tertiary"}
					className="absolute right-4 h-[32px] w-[66px]"
					onClick={() => {
						setIsOpenAssetModal(false);
					}}
				>
					<SmallXIcon
						className="h-[10px] w-[10px] scale-75 cursor-pointer transition-transform duration-300"
						width={10}
						height={10}
					/>
					<span>ESC</span>
				</Button>
			</div>
			<span className="mt-6 overflow-clip text-nowrap border-[#252627] border-t border-b py-px font-droid text-[10px] text-text-tertiary leading-[120%]">
				{`////////////////////////////////////////////////////////////
					///////// .- .-. -.-. .- -. ..- --`}
			</span>
			<FindAsset
				className="mt-6 h-[400px] px-4"
				data={chainsTokens || []}
				onSelectAsset={(asset) => setSelectedAsset(asset ?? undefined)}
				defaultActiveItem={selectedAsset}
				filters={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6", "Tag7"]}
			/>
		</div>
	);
});

const PnlSettingsModal = observer(() => {
	const { setIsOpenPnlSettingsModal } = useExplorePortfolio();

	const { t } = useTranslation(["main"]);

	return (
		<div className="flex h-full flex-col justify-between p-4">
			<div>
				<div className="flex items-center justify-between">
					<span className="font-[600] font-namu text-[24px] text-white uppercase ">
						{t("pnlSettings")}
					</span>
					<Button
						variant={"tertiary"}
						className="h-[32px] w-[66px]"
						onClick={() => {
							setIsOpenPnlSettingsModal(false);
						}}
					>
						<SmallXIcon
							className="h-[10px] w-[10px] scale-75 cursor-pointer transition-transform duration-300"
							width={10}
							height={10}
						/>
						<span>ESC</span>
					</Button>
				</div>

				<div className="mt-[48px] flex flex-col gap-4">
					<span className="text-[12px] text-text-secondary">
						{t("markSending")}
					</span>
					<div>
						<span className="text-[12px] text-text-primary">
							{t("includeNewTransfers")}
						</span>
						<Toggle label={t("include")} className="mt-2 flex items-center " />
					</div>
				</div>
			</div>
			<Button className="flex h-10 w-full items-center">
				<span>{t("confirm")}</span>
				<RoundedCheckIcon className="scale-75" />
			</Button>
		</div>
	);
});
