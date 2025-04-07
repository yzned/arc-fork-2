import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textArea";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import clsx from "clsx";
import { observer } from "mobx-react-lite";

import Chevron from "@/icons/chevron.svg?react";
import RoundedCheckIcon from "@/icons/roundedCheck.svg?react";

import SettingsIcon from "@/icons/settings.svg?react";
import TemplatesIcon from "@/icons/templates.svg?react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	CreatePortfolioProvider,
	useCreatePortfolio,
} from "@/contexts/CreatePortfolioContext";
import { useDeployPortfolio } from "@/hooks/useDeployPortfolio";
import { useReadContracts } from "wagmi";
import { ARBITRUM_CHAIN_ID, ARBITRUM_TOKENS } from "@/lib/constants";
import ChainLinkPriceFeed from "@/lib/abi/ChainLinkPriceFeed";
import type { PriceData, TokenPriceData } from "@/lib/types";
import { formatAddress } from "@/lib/utils";
import { TokenSetup } from "@/components/createPortfolio/tokenSetup";

export const Route = createFileRoute("/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: prices } = useReadContracts({
		//@ts-ignore
		contracts: ARBITRUM_TOKENS.map((item) => ({
			abi: ChainLinkPriceFeed,
			address: item.priceFeedAddress,
			functionName: "latestRoundData",
			chainId: ARBITRUM_CHAIN_ID,
		})),
	});

	const { setPrices } = useCreatePortfolio();

	useEffect(() => {
		if (!prices) return;
		const formattedPrices: TokenPriceData[] = prices
			.filter(
				(item): item is { result: PriceData; status: "success" } =>
					item.status === "success" && item.result !== undefined,
			)
			.map(({ result }, index) => ({
				address: ARBITRUM_TOKENS[index].address,
				price: result[1],
			}));

		setPrices(formattedPrices);
	}, [prices, setPrices]);

	return (
		<CreatePortfolioProvider>
			<div className="grid grid-cols-[1fr_329px] grid-rows-1 gap-0">
				<Settings className="overflow-hidden" />
				<Overview className="w-full" />
			</div>
		</CreatePortfolioProvider>
	);
}

const Settings = observer(({ className }: { className?: string }) => {
	return (
		<div
			className={clsx(className, "flex flex-col gap-[80px] bg-bg-floor-1 pt-8")}
		>
			<Header />
			<div className="w-full px-6">
				<Separator
					orientation="horizontal"
					className="bg-fill-primary-700 px-6"
				/>
			</div>
			<MainInfo />
			<div className="w-full px-6">
				<Separator
					orientation="horizontal"
					className="w-1/2 bg-fill-primary-700"
				/>
			</div>
			<TokenSetup />
			<div className="w-full px-6">
				<Separator
					orientation="horizontal"
					className="w-1/2 bg-fill-primary-700"
				/>
			</div>
			<Fees className="" />
			<div className="w-full px-6">
				<Separator
					orientation="horizontal"
					className="w-1/2 bg-fill-primary-700"
				/>
			</div>
		</div>
	);
});

const Header = observer(() => {
	const { t } = useTranslation(["main"]);
	const router = useRouter();

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-row gap-4">
				<Button
					className="h-[72px] w-[104px] bg-bg-floor-1 text-base text-fill-brand-secondary-500 [&_svg]:h-[16.81px] [&_svg]:w-[9.6px]"
					variant="selector"
					size="L"
					onClick={() => router.history.back()}
				>
					<Chevron className="-rotate-90" fill="#3d73ff" />
					{t("back")}
				</Button>
				<span className="font-namu font-semibold text-7xl text-text-primary uppercase">
					{t("createPortfolio")}
				</span>
			</div>
			<span className="overflow-clip text-nowrap border-[#252627] border-t border-b py-px font-droid text-[10px] text-text-tertiary leading-[120%]">
				{`//////////////////////////////////////////////////////////////////////
					///////// .- .-. -.-. .- -. ..- --`.repeat(9)}
			</span>
		</div>
	);
});

const MainInfo = observer(({ className }: { className?: string }) => {
	const { t } = useTranslation(["main"]);
	const {
		setName,
		name,
		setSymbol,
		symbol,
		description,
		setDescription,
		setLogo,
	} = useCreatePortfolio();

	return (
		<div className={clsx(className, "flex flex-col gap-8 px-6")}>
			<span className="mb-2 font-namu font-semibold text-2xl text-text-primary uppercase leading-[130%]">
				{t("mainInfo")}
			</span>
			<div className="flex flex-row gap-6 *:w-[248px]">
				<Input
					required={true}
					type="text"
					onChange={(e) => {
						setName(e.target.value);
					}}
					label={t("name")}
					placeholder="Arcoin"
					value={name}
				/>
				<Input
					required={true}
					type="text"
					onChange={(e) => {
						setSymbol(e.target.value);
					}}
					label={t("symbol")}
					placeholder="ARC"
					value={symbol}
				/>
				<FileInput
					required={true}
					label="Logo"
					onSelect={(item) => {
						setLogo(item);
					}}
				/>
			</div>

			<Textarea
				required={true}
				label={t("description")}
				description={t("upTo100Characters")}
				className="max-w-[793px]"
				onChange={(e) => {
					setDescription(e.target.value);
				}}
				value={description}
			/>

			<div />
		</div>
	);
});

const Overview = observer(({ className }: { className?: string }) => {
	const { t } = useTranslation(["main"]);
	const { createPortfolio } = useDeployPortfolio();
	const {
		tokens,
		name,
		initialSharePrice,
		managementFee,
		managementFeeRecepient,
		dollarPrice,
	} = useCreatePortfolio();

	const { symbol } = useCreatePortfolio();

	return (
		<div className="h-full bg-bg-floor-2">
			<div
				className={clsx(
					className,
					"sticky top-[73px] flex flex-col gap-[102px] bg-bg-floor-2 p-4",
				)}
			>
				<div className="flex w-full flex-col gap-8">
					<div className="flex flex-row items-center gap-4">
						<Avatar className="size-10">
							<AvatarImage src="https://avatars.githubusercontent.com/u/14010287?v=4" />
							<AvatarFallback>U</AvatarFallback>
						</Avatar>
						<div className="flex flex-col gap-2">
							<span className="font-namu font-semibold text-sm text-text-primary uppercase leading-[12px] tracking-[0.015em]">
								{name ? name : t("portfolioName")}
							</span>
							<span className="font-namu font-semibold text-sm text-text-tertiary uppercase leading-[12px] tracking-[0.015em]">
								{symbol ? symbol : t("symbol")}
							</span>
						</div>
					</div>

					<div className="flex w-full flex-col justify-start gap-6 font-droid">
						<span className="font-normal text-base text-text-primary tracking-[0.01em]">
							{t("tokenSetup")}
						</span>
						<div className="grid w-full grid-cols-2 grid-rows-2 gap-y-4 text-xs tracking-[0.01em]">
							<span className="text-text-secondary">
								{t("initialLiquidity")}
							</span>
							<span className="ml-auto text-text-secondary whitespace-nowrap">
								<span className="text-text-primary">0.54 ETH</span> (
								{dollarPrice.toFixed(2)} $)
							</span>
							<span className="text-text-secondary">{t("tokens")}</span>
							<div className="ml-auto flex items-center gap-2  text-text-secondary">
								<span>
									{
										tokens?.filter((item) => item.creationState === "readed")
											.length
									}
								</span>
								<div className="flex gap-0.5">
									{tokens
										?.filter((item) => item.creationState === "readed")
										.slice(0, 5)
										.map((item) => (
											<img
												alt="no-logo"
												src={item.logo}
												className="w-4 h-4"
												key={item.address}
											/>
										))}
								</div>
							</div>
						</div>
					</div>

					<div className="flex w-full flex-col justify-start gap-6 font-droid">
						<span className="font-normal text-base text-text-primary tracking-[0.01em]">
							{t("fees")}
						</span>
						<div className="grid w-full grid-cols-2 grid-rows-3 gap-y-4 text-nowrap text-xs tracking-[0.01em]">
							<span className="text-text-secondary"> {t("initialPrice")}</span>
							<span className="ml-auto text-text-secondary">
								{initialSharePrice ? initialSharePrice : "-"}
							</span>
							<span className="text-text-secondary">{t("managementFee")}</span>
							<span className="ml-auto text-text-secondary">
								{managementFee ? `${managementFee} %` : "-"}
							</span>
							<span className="text-text-secondary">
								{t("managementFeeReceiver")}
							</span>
							<span className="ml-auto text-text-secondary">
								{formatAddress(managementFeeRecepient)}
							</span>
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col gap-8">
					<div className="flex w-full flex-col justify-start gap-6 font-droid">
						<div className="flex flex-col gap-4">
							<Separator
								orientation="horizontal"
								className="w-full bg-fill-tertiary"
							/>
							<span className="font-droid text-base text-text-primary tracking-[0.01em]">
								{t("transactionDetails")}
							</span>
						</div>
						<div className="grid w-full grid-cols-2 grid-rows-3 gap-y-4 text-text-secondary text-xs tracking-[0.01em]">
							<span> {t("youPay")}</span>
							<span className="ml-auto">
								<span className="text-text-primary">0.54 ETH</span> ($27,82)
							</span>
							<span>{t("youReceive")}</span>
							<span className="ml-auto">
								<span className="text-text-primary">0.54 ETH</span> ($27,82)
							</span>
							<span>{t("networkFee")}</span>
							<span className="ml-auto">
								<span className="text-text-primary">0.54 ETH</span> ($27,82)
							</span>
						</div>
					</div>
					<Button onClick={createPortfolio} size="L">
						{t("deploy")}
					</Button>
				</div>
			</div>
		</div>
	);
});

const Fees = observer(({ className }: { className?: string }) => {
	const [opened, setOpened] = useState(false);
	const [selectedId, setSelectedId] = useState(0);
	const [advOpen, setAdvOpen] = useState(false);

	const { t } = useTranslation(["main"]);

	const {
		initialSharePrice,
		setInitialPrice,
		managementFee,
		setManagementFee,
		managementFeeRecepient,
		setManagementFeeRecipient,
		baseFee,
		setBaseFee,
		deviationLimit,
		setDeviationLimit,
		deviationFee,
		setDeviationFee,
		cashbackFeeShare,
		setCashbackFeeShare,
	} = useCreatePortfolio();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setter: (value: string) => void,
	) => {
		setter(e.target.value);
	};

	const handleChangePercents = (
		e: React.ChangeEvent<HTMLInputElement>,
		setter: (value: string) => void,
	) => {
		const value = e.target.value.replace(",", ".");

		if (Number(value) >= 0 && Number(value) <= 100) {
			setter(e.target.value);
		}
	};

	return (
		<div className={clsx(className, "flex flex-col gap-10 px-6")}>
			<span className="font-namu font-semibold text-2xl text-[#EAEAEA] uppercase leading-[130%]">
				{t("fees")}
			</span>
			<div
				onClick={() => setOpened(!opened)}
				onKeyUp={(e) => e.key === "Enter" && setOpened(!opened)}
				className="flex w-fit cursor-pointer flex-row gap-2 rounded-md p-2 transition-all hover:bg-fill-secondary"
			>
				<TemplatesIcon className="h-6 w-6" fill="#0148fe" />
				<span className="font-droid text-base text-fill-brand-primary-700">
					{t("templates")}
				</span>
				<Chevron
					data-opened={opened}
					className="h-6 w-6 rotate-0 p-1.5 transition-all data-[opened=true]:rotate-180"
					fill="#0148FE"
				/>
			</div>

			<div
				data-opened={opened}
				className="h-0 w-full overflow-hidden opacity-0 transition-all data-[opened=true]:h-[160px] data-[opened=true]:opacity-100"
			>
				<div className="flex h-full flex-row gap-2">
					<div
						data-selected={selectedId}
						onClick={() => setSelectedId(0)}
						onKeyUp={(e) => e.key === "Enter" && setSelectedId(0)}
						className="flex h-full w-full cursor-pointer flex-col gap-3 rounded-[8px] border-[1px] border-fill-primary-800 bg-[position:right_20.4px_top_16px] bg-no-repeat p-4 transition-all hover:bg-fill-secondary data-[selected=0]:border-fill-brand-secondary-500 data-[selected=0]:border-fill-secondary data-[selected=0]:bg-fill-secondary"
					>
						<div
							data-selected={selectedId}
							className="flex items-center gap-2 font-droid font-normal text-sm text-text-primary data-[selected=0]:text-fill-brand-secondary-500"
						>
							{selectedId === 0 && (
								<RoundedCheckIcon className="text-fill-brand-secondary-500" />
							)}
							<span>No fees</span>
						</div>
						<div className="font-droid font-normal text-text-secondary text-xs">
							A balanced ETF blending growth and stability, tailored to reflect
							your financial goals
						</div>
					</div>
					<div
						data-selected={selectedId}
						onClick={() => setSelectedId(1)}
						onKeyUp={(e) => e.key === "Enter" && setSelectedId(1)}
						className="flex h-full w-full cursor-pointer flex-col gap-3 rounded-[8px] border-[1px] border-fill-primary-800 bg-[position:right_20.4px_top_16px] bg-no-repeat p-4 transition-all hover:bg-fill-secondary data-[selected=1]:border-fill-brand-secondary-500 data-[selected=1]:border-fill-secondary data-[selected=1]:bg-fill-secondary"
					>
						<div
							data-selected={selectedId}
							className="flex items-center gap-2 font-droid font-normal text-sm text-text-primary data-[selected=1]:text-fill-brand-secondary-500"
						>
							{selectedId === 1 && (
								<RoundedCheckIcon className="text-fill-brand-secondary-500" />
							)}
							<span>No fees</span>
						</div>
						<div className="font-droid font-normal text-text-secondary text-xs">
							A balanced ETF blending growth and stability, tailored to reflect
							your financial goals
						</div>
					</div>
					<div
						data-selected={selectedId}
						onClick={() => setSelectedId(3)}
						onKeyUp={(e) => e.key === "Enter" && setSelectedId(3)}
						className="flex h-full w-full cursor-pointer flex-col gap-3 rounded-[8px] border-[1px] border-fill-primary-800 bg-[position:right_20.4px_top_16px] bg-no-repeat p-4 transition-all hover:bg-fill-secondary data-[selected=3]:border-fill-brand-secondary-500 data-[selected=3]:border-fill-secondary data-[selected=3]:bg-fill-secondary"
					>
						<div
							data-selected={selectedId}
							className="flex items-center gap-2 font-droid font-normal text-sm text-text-primary data-[selected=3]:text-fill-brand-secondary-500"
						>
							{selectedId === 3 && (
								<RoundedCheckIcon className="text-fill-brand-secondary-500" />
							)}
							<span>No fees</span>
						</div>
						<div className="font-droid font-normal text-text-secondary text-xs">
							A balanced ETF blending growth and stability, tailored to reflect
							your financial goals
						</div>
					</div>
					<div
						data-selected={selectedId}
						onClick={() => setSelectedId(4)}
						onKeyUp={(e) => e.key === "Enter" && setSelectedId(4)}
						className="flex h-full w-full cursor-pointer flex-col gap-3 rounded-[8px] border-[1px] border-fill-primary-800 bg-[position:right_20.4px_top_16px] bg-no-repeat p-4 transition-all hover:bg-fill-secondary data-[selected=4]:border-fill-brand-secondary-500 data-[selected=4]:border-fill-secondary data-[selected=4]:bg-fill-secondary"
					>
						<div
							data-selected={selectedId}
							className="flex items-center gap-2 font-droid font-normal text-sm text-text-primary data-[selected=4]:text-fill-brand-secondary-500"
						>
							{selectedId === 4 && (
								<RoundedCheckIcon className="text-fill-brand-secondary-500" />
							)}
							<span>No fees</span>
						</div>
						<div className="font-droid font-normal text-text-secondary text-xs">
							A balanced ETF blending growth and stability, tailored to reflect
							your financial goals
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-6">
				<div className="flex flex-row gap-6">
					<Input
						type="number"
						label={t("initialPrice")}
						required={true}
						placeholder={t("enterPrice")}
						className="w-[384px]"
						min="0"
						onKeyDown={(e) => {
							if (
								e.key === "-" ||
								e.key === "+" ||
								e.key === "E" ||
								e.key === "e"
							) {
								e.preventDefault();
							}
						}}
						onChange={(e) => {
							handleChange(e, setInitialPrice);
						}}
						value={initialSharePrice?.toString()}
					/>
					<Input
						type="number"
						label={t("managementFee")}
						required={true}
						placeholder={`${t("enterFee")} %`}
						className="w-[384px]"
						onChange={(e) => {
							handleChangePercents(e, setManagementFee);
						}}
						onKeyDown={(e) => {
							if (
								e.key === "-" ||
								e.key === "+" ||
								e.key === "E" ||
								e.key === "e"
							) {
								e.preventDefault();
							}
						}}
						value={managementFee}
					/>
				</div>
				<Input
					type="text"
					label={t("managementFeeReceiver")}
					required={true}
					placeholder={`${t("enterFeeReceiver")}`}
					className="w-[793px]"
					onKeyDown={(e) => {
						if (
							e.key === "-" ||
							e.key === "+" ||
							e.key === "E" ||
							e.key === "e"
						) {
							e.preventDefault();
						}
					}}
					onChange={(e) => {
						handleChange(e, setManagementFeeRecipient);
					}}
					value={managementFeeRecepient}
				/>
				<div
					data-adv={advOpen}
					className="group flex h-[56px] w-[793px] flex-col gap-4 overflow-clip rounded-xs bg-fill-primary-800 p-4 transition-all data-[adv=true]:h-[210px]"
					onKeyUp={(e) => e.key === "Enter" && setAdvOpen(!advOpen)}
				>
					<button
						type="button"
						onClick={() => setAdvOpen(!advOpen)}
						className="flex flex-row gap-2 cursor-pointer"
					>
						<SettingsIcon className="size-6 text-text-primary" />
						<span className="font-droid font-normal text-base text-text-primary">
							{t("advancedSettings")}
						</span>
						<Chevron
							className="size-6 p-1 transition-all group-data-[adv=true]:rotate-180"
							fill="#EAEAEA"
						/>
					</button>
					<div className="grid grid-cols-2 grid-rows-2 gap-6">
						<Input
							type="number"
							label={t("baseFee")}
							required={true}
							placeholder={t("10%")}
							className="w-full"
							onKeyDown={(e) => {
								if (
									e.key === "-" ||
									e.key === "+" ||
									e.key === "E" ||
									e.key === "e"
								) {
									e.preventDefault();
								}
							}}
							value={baseFee}
							onChange={(e) => handleChangePercents(e, setBaseFee)}
						/>
						<Input
							type="number"
							label={t("deviationLimit")}
							required={true}
							placeholder="10 %"
							className="w-full"
							value={deviationLimit}
							onChange={(e) => handleChangePercents(e, setDeviationLimit)}
							onKeyDown={(e) => {
								if (
									e.key === "-" ||
									e.key === "+" ||
									e.key === "E" ||
									e.key === "e"
								) {
									e.preventDefault();
								}
							}}
						/>
						<Input
							type="number"
							label={t("deviationFee")}
							required={true}
							placeholder="10 %"
							className="w-full"
							value={deviationFee}
							onChange={(e) => handleChangePercents(e, setDeviationFee)}
							onKeyDown={(e) => {
								if (
									e.key === "-" ||
									e.key === "+" ||
									e.key === "E" ||
									e.key === "e"
								) {
									e.preventDefault();
								}
							}}
						/>
						<Input
							type="number"
							label={t("cashbackFeeShare")}
							required={true}
							placeholder="10 %"
							value={cashbackFeeShare}
							onChange={(e) => handleChangePercents(e, setCashbackFeeShare)}
							className="w-full"
							onKeyDown={(e) => {
								if (
									e.key === "-" ||
									e.key === "+" ||
									e.key === "E" ||
									e.key === "e"
								) {
									e.preventDefault();
								}
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
