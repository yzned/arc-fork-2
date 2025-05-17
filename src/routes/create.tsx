import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textArea";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import clsx from "clsx";
import { observer } from "mobx-react-lite";

import Chevron from "@/icons/chevron.svg?react";

import {
	CreatePortfolioProvider,
	useCreatePortfolio,
} from "@/contexts/CreatePortfolioContext";

import { Fees } from "@/components/createPortfolio/fees";
import { Overview } from "@/components/createPortfolio/overview";
import { TokenSetup } from "@/components/createPortfolio/tokenSetup";
import ChainLinkPriceFeed from "@/lib/abi/ChainLinkPriceFeed";
import { ARBITRUM_SEPOLIA_CHAIN_ID, ARBITRUM_TOKENS } from "@/lib/constants";
import type { TokenPriceData, UniswapPriceData } from "@/lib/types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useReadContracts } from "wagmi";

export const Route = createFileRoute("/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: prices } = useReadContracts({
		contracts: ARBITRUM_TOKENS.map((item) => ({
			abi: ChainLinkPriceFeed,
			address: item.priceFeedAddress,
			functionName: "latestRoundData",
			chainId: ARBITRUM_SEPOLIA_CHAIN_ID,
		})),
	});

	const { setPrices } = useCreatePortfolio();

	useEffect(() => {
		if (!prices) return;
		const formattedPrices: TokenPriceData[] = prices
			.filter(
				(item): item is { result: UniswapPriceData; status: "success" } =>
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
			<Fees />
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
		logo,
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
					maxLength={25}
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
					maxLength={10}
				/>
				<FileInput
					required={true}
					label="Logo"
					onSelect={async (item) => {
						if (item) {
							setLogo(item);
						}
					}}
					defaultItem={logo}
					onDelete={() => {
						setLogo();
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
