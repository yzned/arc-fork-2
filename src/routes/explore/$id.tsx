import { Button } from "@/components/ui/button";
import { createFileRoute, useParams } from "@tanstack/react-router";

import { Input } from "@/components/ui/input";
import { ModalBase } from "@/components/ui/modalBase";
import { cn } from "@/lib/utils";
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
import { FindAsset } from "@/components/ui/findAsset";
import { PriceChange } from "@/components/ui/priceChange";
import { Toggle } from "@/components/ui/toggle";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useTranslation } from "react-i18next";
import { useChart } from "@/hooks/queries/useChart";
import BigNumber from "bignumber.js";
import { ARBITRUM_CHAIN_ID, PORTFOLIO_ASSETS } from "@/lib/constants";
import { CandleChart } from "@/components/ui/Charts/CandleChart";
import { LinearChart } from "@/components/ui/Charts/LinearChart";

export const Route = createFileRoute("/explore/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<div className=" grid-cols-[1fr_329px] grid-rows-1 gap-0  hidden md:grid">
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

	const { t } = useTranslation(["main"]);

	const {
		isOpenAssetModal,
		setIsOpenAssetModal,
		isOpenPnlSettingsModal,
		setIsOpenPnlSettingsModal,
		chartResolution,
		setChartResolution,
	} = useExplorePortfolio();

	const [isOpenAssetSelector, setIsOpenAssetSelector] = useState(false);

	const assetSelectorRef = useRef<HTMLDivElement>(null);

	const { allPortfolios } = useExplorePortfolio();
	const { id } = useParams({ from: "/explore/$id" });

	const currentPortfolio = allPortfolios.find((item) => item.multipool === id);

	useChart();

	const { portfolioCandlesData, portfolioLinearData } = useExplorePortfolio();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				assetSelectorRef.current &&
				!assetSelectorRef.current.contains(event.target as Node)
			) {
				setIsOpenAssetSelector(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

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
								// src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"
								src={currentPortfolio?.logo || "/icons/empty-token.svg"}
								className="h-8 w-8"
								alt="no-logo"
							/>
							<div className="flex max-w-[150px] flex-col gap-2">
								<span className="font-namu text-[24px] text-text-primary leading-[24px]">
									{currentPortfolio?.symbol}
								</span>
								<span className="truncate font-droid text-[12px] text-text-secondary leading-[12px]">
									{currentPortfolio?.name}
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
					<div className="absolute top-full right-0 left-0 z-40 w-[516px] overflow-hidden border-fill-secondary border-r-[1px] border-b-[1px] bg-fill-primary-900">
						<div
							className={cn(
								"transition-all duration-300 ",
								isOpenAssetSelector ? "h-[600px]" : "h-0",
							)}
						>
							<FindAsset
								//@ts-ignore

								defaultAsset={currentPortfolio || allPortfolios[0]}
								//@ts-ignore

								assets={allPortfolios}
								className="h-[540px] w-full border-fill-secondary border-t px-4 pt-6"
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
									$ {Number(currentPortfolio?.current_price).toFixed(2)}
								</span>
							</div>
						</div>
						<div className="flex gap-10 font-droid">
							<div className="flex flex-col">
								<span className="text-[12px] text-text-primary">
									{t("tvl")}
								</span>
								<span className="text-[14px] text-text-secondary">
									${" "}
									{new BigNumber(
										Number(currentPortfolio?.total_supply) *
											Number(currentPortfolio?.current_price),
									)
										.multipliedBy(10 ** -8)
										.toFixed(2)
										.toString()}
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
										value={
											Number(currentPortfolio?.change_24h).toFixed(2) || "0"
										}
										growing={Number(currentPortfolio?.change_24h) > 0}
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
									$ {Number(currentPortfolio?.high_24h).toFixed(2)}
								</span>
							</div>
						</div>
						<div className="flex gap-10 font-droid">
							<div className="flex flex-col">
								<span className="text-[12px] text-text-primary">
									{t("24hLow")}
								</span>
								<span className="text-[14px] text-text-secondary">
									$ {Number(currentPortfolio?.low_24h).toFixed(2)}
								</span>
							</div>
						</div>
					</div>
					<Button
						variant={"tertiary"}
						className="h-[40px] w-[193px] text-[14px]"
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
								data-active={chartResolution === "1"}
								onClick={() => {
									setChartResolution("1");
								}}
								variant="selector"
							>
								{t("1m")}
							</Button>
							<Button
								data-active={chartResolution === "15"}
								className="w-fit bg-transparent"
								size="M"
								onClick={() => {
									setChartResolution("15");
								}}
								variant="selector"
							>
								{t("15m")}
							</Button>
							<Button
								className="w-fit bg-transparent"
								data-active={chartResolution === "30"}
								size="M"
								onClick={() => {
									setChartResolution("30");
								}}
								variant="selector"
							>
								{t("30m")}
							</Button>
							<Button
								className="w-fit bg-transparent"
								data-active={chartResolution === "60"}
								size="M"
								onClick={() => {
									setChartResolution("60");
								}}
								variant="selector"
							>
								{t("1h")}
							</Button>
							<Button
								className="w-fit bg-transparent"
								data-active={chartResolution === "720"}
								size="M"
								onClick={() => {
									setChartResolution("720");
								}}
								variant="selector"
							>
								{t("12h")}
							</Button>
							<Button
								data-active={chartResolution === "1D"}
								className="w-fit bg-transparent"
								size="M"
								onClick={() => {
									setChartResolution("1D");
								}}
								variant="selector"
							>
								{t("1d")}
							</Button>
							{/* <Button
								className="w-fit bg-transparent"
								size="M"
								variant="selector"
							>
								{t("1w")}
							</Button> */}
						</div>
					)}
				</div>

				<div className={cn(currentGraph !== "portfolio" && "pr-[55px] pl-6")}>
					{currentGraph === "candles" && (
						<CandleChart height={443} data={portfolioCandlesData} />
					)}
					{currentGraph === "linear" && (
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
				<div className=" flex items-center gap-8 p-6">
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

						<Button
							variant={"tab"}
							data-active={currentBottomTable === "history"}
							className="h-10 w-[128px]"
							onClick={() => setCurrentBottomTable("history")}
						>
							<span>{t("history")}</span>
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
								<PriceChange growing value="23.23" />
								<div className="flex items-center gap-1 text-[14px]">
									<span className="text-text-primary">0.54 ETH</span>
									<span className="text-text-secondary">($37,623)</span>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="flex gap-1">
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
							</div>

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
	const [amount, setCurrentAmout] = useState("");

	const { t } = useTranslation(["main"]);

	const {
		setIsOpenAssetModal,
		selectedAsset,
		rightSectionState,
		changeRightPanelState,
		setSlippage,
		slippage,
	} = useExplorePortfolio();

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(",", ".");

		if (value.startsWith("0") && value.length > 1 && !value.startsWith("0.")) {
			value = value.replace(/^0+/, "");
		}

		if (/^\d*\.?\d*$/.test(value)) {
			const numericValue = value === "" ? "" : value;

			setCurrentAmout(numericValue);
		}
	};

	const inputRef = useRef<HTMLInputElement>(null);

	const [percentOffset, setPercentOffset] = useState(0);

	const handleSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(",", ".");

		if (value.startsWith("0") && value.length > 1 && !value.startsWith("0.")) {
			value = value.replace(/^0+/, "");
		}

		if (/^\d*\.?\d*$/.test(value)) {
			const numericValue = value === "" ? "" : value;

			if (Number(numericValue) >= 0 && Number(numericValue) <= 100) {
				setSlippage(numericValue);
			}
		}
	};

	const { allPortfolios } = useExplorePortfolio();
	const { id } = useParams({ from: "/explore/$id" });
	const currentPortfolio = allPortfolios.find((item) => item.multipool === id);

	useEffect(() => {
		if (inputRef.current) {
			const tempSpan = document.createElement("span");
			tempSpan.style.visibility = "hidden";
			tempSpan.style.whiteSpace = "pre";
			tempSpan.style.fontFamily = "namu";
			tempSpan.style.fontSize = "24px";
			tempSpan.textContent = slippage || "";

			document.body.appendChild(tempSpan);
			const textWidth = tempSpan.getBoundingClientRect().width;
			document.body.removeChild(tempSpan);

			setPercentOffset(textWidth + 16);
		}
	}, [slippage]);

	const fetchBalances = () => {};

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
									changeRightPanelState("mint");
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
											data-active={slippage === "0.1"}
											onClick={() => {
												setSlippage("0.1");
											}}
										>
											0.1%
										</Button>
										<Button
											variant={"selector"}
											className="h-8 w-[68px] text-[14px] text-text-primary"
											data-active={slippage === "0.5"}
											onClick={() => {
												setSlippage("0.5");
											}}
										>
											0.5%
										</Button>
										<Button
											variant={"selector"}
											className="h-8 w-[68px] text-[14px] text-text-primary"
											data-active={slippage === "1"}
											onClick={() => {
												setSlippage("1");
											}}
										>
											1%
										</Button>
										<Button
											variant={"selector"}
											className="h-8 w-[68px] text-[14px] text-text-primary"
											data-active={
												slippage !== "0.1" &&
												slippage !== "0.5" &&
												slippage !== "1"
											}
											onClick={() => {
												setSlippage("0");
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
										value={slippage}
										className=" h-[50px] font-namu text-[24px] text-white placeholder:font-droid placeholder:text-[14px]"
										placeholder={t("enterSlippage")}
										type=""
									/>
									{slippage && (
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
							<Button className="mt-4 h-10 w-full">
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
										changeRightPanelState("mint");
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
										changeRightPanelState("burn");
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
										changeRightPanelState("settings");
									}}
								>
									<SettingsIcon className="scale-120 text-text-primary" />
								</Button>
							</div>
						</div>
						<div className=" flex flex-col gap-4 px-2">
							<div className="flex w-full items-center justify-between">
								<span className="font-droid text-[12px] text-text-secondary leading-[12px]">
									{rightSectionState === "mint" ? t("mint") : t("burn")} from
								</span>

								<Button
									variant={"tertiary"}
									className="w-[103px] p-0 font-droid"
									onClick={() => setIsOpenAssetModal(true)}
								>
									<div className="flex items-center gap-2 ">
										<img
											src={selectedAsset.logo || "/icons/empty-token.svg"}
											alt="no icon"
											className="h-6 w-6"
										/>
										<span>{selectedAsset.symbol}</span>
										<ChevronIcon className="h-4 w-4 rotate-90 scale-90" />
									</div>
								</Button>
							</div>

							<div className="flex flex-col gap-2">
								<Input
									onChange={(e) => handleAmountChange(e)}
									type="token"
									value={amount}
									placeholder={t("enterAmount")}
									className="h-[40px] font-[600] font-namu text-[24px] text-white placeholder:font-droid placeholder:text-[14px]"
								/>
								<div className="flex w-full justify-between text-text-secondary">
									<span className="font-droid text-[12px]">~$ 0</span>
									<span className="font-droid text-[12px]">
										{t("balance")} 0
									</span>
								</div>
							</div>
						</div>
						<div>
							<div className="flex flex-col gap-2 text-[12px]">
								<div className="flex w-full items-center justify-between">
									<span className="font-droid text-text-secondary">
										{t("tokensReceive")}
									</span>
									<span className="">0 ETH (0$)</span>
								</div>
								<div className="flex w-full items-center justify-between">
									<span className="font-droid text-text-secondary">
										{t("transactionFee")}
									</span>
									<span className="">0 ETH (0$)</span>
								</div>
								<div className="flex w-full items-center justify-between">
									<span className="font-droid text-text-secondary">
										{t("minimumReceive")}
									</span>
									<span className="">0 ETH (0$)</span>
								</div>
							</div>
							<Button
								className="mt-4 h-10 w-full"
								onClick={() => fetchBalances()}
							>
								<span> {rightSectionState === "mint" ? "Mint" : "Burn"}</span>
							</Button>
						</div>
					</div>
				)}

				<div className="flex flex-col gap-6 overflow-y-auto border-fill-secondary border-t-[1px] p-4 pt-[6] ">
					<span className="font-droid text-[12px] text-text-secondary">
						{t("description")}
					</span>

					<div className="flex flex-col gap-4 px-2">
						<span className="leading-[18px] tracking-[1.05px]">
							{currentPortfolio?.description}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
});

export const AssetsModalContent = observer(() => {
	const { setIsOpenAssetModal, changeSelectedAsset } = useExplorePortfolio();
	const { t } = useTranslation(["main"]);

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
				//@ts-ignore
				assets={PORTFOLIO_ASSETS.map((item) => {
					return {
						address: item.address,
						chainId: ARBITRUM_CHAIN_ID,
						logo: "/icons/empty-token.svg",
						name: item.symbol,
						symbol: item.symbol,
						price: new BigNumber(item.price.value)
							.multipliedBy(10 ** -25)
							.toString(),
					};
				})}
				onSelectAsset={changeSelectedAsset}
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
