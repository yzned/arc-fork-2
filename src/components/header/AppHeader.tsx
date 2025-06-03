import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import ChevronIcon from "@/icons/chevron.svg?react";
import GlobeIcon from "@/icons/globe.svg?react";
import MenuIcon from "@/icons/menu.svg?react";
import SettingsIcon from "@/icons/settingsGear.svg?react";
import { APP_LANGUAGES, changeLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { zeroAddress } from "viem";

import ShortLogo from "@/icons/short.svg?react";
import DiscordIcon from "@/icons/socials/discord.svg?react";
import GitIcon from "@/icons/socials/github.svg?react";
import TelegramIcon from "@/icons/socials/telegram.svg?react";
import TwitterIcon from "@/icons/socials/twitter.svg?react";

import { useMetadataChain } from "@/hooks/use-metadata-chain";
import { useOnClickOutside } from "usehooks-ts";
import { ChainSelector, ChainsColors } from "../ui/chain-select";
import { ConnectivityIndicator } from "../ui/connectivityIndicator";
import { RadioButton } from "../ui/radiobutton";
import { ConnectWallet } from "./ConnectWallet";

const MOCK_RPC_DATA = [
	{ rpcName: "RPC_1", connectValue: 50 },
	{ rpcName: "RPC_2", connectValue: 150 },
	{ rpcName: "RPC_3", connectValue: 300 },
];

export const AppHeader = () => {
	const [isOpenSettingsSelector, setIsOpenSettingsSelector] = useState(false);
	const location = useLocation();

	const settingsRef = useRef<HTMLDivElement | null>(null);

	const { i18n, t } = useTranslation(["main"]);

	const currentPath = location.pathname;

	const handleClickOutside = () => {
		setIsOpenSettingsSelector(false);
	};

	useOnClickOutside(
		settingsRef as React.RefObject<HTMLElement>,
		handleClickOutside,
	);

	return (
		<div className="sticky top-0 z-40 flex h-[72px] justify-between border-fill-secondary border-t border-b bg-bg-floor-0">
			<div className="flex flex-row">
				<Link
					to="/"
					className="h-full w-[104px] border-fill-secondary border-r bg-[url(/icons/logos/full.svg)] bg-center bg-no-repeat"
				/>
				<div className="flex flex-row gap-12 px-12 py-[27px]">
					<Link
						to="/"
						className={cn(
							"font-droid font-normal text-text-tertiary leading-[18.2px] tracking-[0.01em] transition-colors hover:text-text-primary",
							currentPath === "/" && "text-text-primary",
						)}
					>
						{t("explore")}
					</Link>
					<Link
						to="/explore/$id"
						params={{ id: "0x8a3BDf2870CF7931d2d8AC712367d5437D473148" }}
						className={cn(
							"font-droid font-normal text-text-tertiary leading-[18.2px] tracking-[0.01em] transition-colors hover:text-text-primary",
							currentPath.includes("/explore/") && "text-text-primary",
						)}
					>
						{t("trade")}
					</Link>
					<Link
						to="/docs"
						className={cn(
							"font-droid font-normal text-text-tertiary leading-[18.2px] tracking-[0.01em] transition-colors hover:text-text-primary",
							currentPath.includes("/docs") && "text-text-primary",
						)}
					>
						{t("docs")}
					</Link>
				</div>
			</div>
			<div className="flex flex-row border-fill-secondary border-l">
				<div className="grid h-full w-[72px] grid-cols-2 grid-rows-2">
					<a
						className="flex items-center justify-center border-fill-secondary border-r border-b transition-colors hover:bg-fill-secondary"
						href="https://t.me/+jBzcrYBvgDY3ZTI6"
						target="_blank"
						rel="noreferrer"
						aria-label="Arcanum Protocol Telegram"
					>
						<TelegramIcon className="text-text-primary" />
					</a>
					<a
						className="flex items-center justify-center border-fill-secondary border-b transition-colors hover:bg-fill-secondary"
						href="https://x.com/0xArcanum"
						target="_blank"
						rel="noreferrer"
						aria-label="Arcanum Protocol Twitter"
					>
						<TwitterIcon className="text-text-primary" />
					</a>
					<a
						className="flex items-center justify-center border-fill-secondary border-r transition-colors hover:bg-fill-secondary"
						href="https://discord.com/invite/Fdeg93TFcs"
						target="_blank"
						rel="noreferrer"
						aria-label="Arcanum Protocol Discord"
					>
						<DiscordIcon className="text-text-primary" />
					</a>
					<a
						className="flex items-center justify-center transition-colors hover:bg-fill-secondary"
						href="https://github.com/arcanum-protocol"
						target="_blank"
						rel="noreferrer"
						aria-label="Arcanum Protocol GitHub"
					>
						<GitIcon className="text-text-primary " />
					</a>
				</div>

				<div ref={settingsRef} className="relative ">
					<button
						type="button"
						onClick={() => {
							setIsOpenSettingsSelector(!isOpenSettingsSelector);
						}}
						className="flex h-full w-[169px] cursor-pointer items-center justify-center gap-2 border-fill-secondary border-l text-text-primary transition-colors hover:bg-fill-secondary"
					>
						<SettingsIcon className="text-text-primary" />
						<span> {t("settings")}</span>
						<ChevronIcon
							className={cn(
								"rotate-180 transition-all",
								isOpenSettingsSelector && "rotate-0",
							)}
						/>
					</button>

					<div
						data-opened={isOpenSettingsSelector}
						className="absolute top-full right-0 left-0 z-40 w-[329px] overflow-hidden border-fill-secondary bg-bg-floor-0 transition-all duration-200 data-[opened=true]:border"
					>
						<div
							className={cn(
								"overflow-scroll transition-all duration-300 ",
								isOpenSettingsSelector ? "max-h-[330px] " : "max-h-0 ",
							)}
						>
							<div className="flex flex-col gap-8 p-4">
								<div className="flex flex-col gap-4">
									<span className="text-[12px] text-text-secondary">
										RPC endpoint
									</span>
									<div className="flex flex-col gap-1">
										{MOCK_RPC_DATA.map((rpc) => (
											<div key={rpc.rpcName} className="flex justify-between">
												<RadioButton
													label={rpc.rpcName}
													value={rpc.rpcName}
													name={rpc.rpcName}
												/>

												<ConnectivityIndicator value={rpc.connectValue} />
											</div>
										))}
									</div>
									<Input className="text-text-primary" />
								</div>

								<div className="flex flex-col gap-4">
									<span className="text-[12px] text-text-secondary">
										{t("language")}
									</span>
									<div className="flex gap-1">
										{Object.values(APP_LANGUAGES).map((lang) => (
											<Button
												data-active={i18n.language === lang}
												variant={"selector"}
												onClick={() => changeLanguage(lang)}
												key={lang}
												className="flex grow uppercase"
											>
												{lang}
											</Button>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<ChainSelector />
				<ConnectWallet />
			</div>
		</div>
	);
};

export const AppHeaderMobile = () => {
	const [isOpenMenu, setIsOpenMenu] = useState(false);

	const { allPortfolios } = useExplorePortfolio();

	const location = useLocation();
	const currentPath = location.pathname;

	const { t } = useTranslation(["main"]);

	const [isOpenLangSheet, setIsOpenLangSheet] = useState(false);
	const [isOpenSettingsSheet, setIsOpenSettingsSheet] = useState(false);

	useEffect(() => {
		if (isOpenMenu) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpenMenu]);

	return (
		<div className="sticky top-0 z-40 flex h-[56px] bg-bg-floor-0">
			<div className=" relative z-50 flex w-full justify-between border-fill-secondary border-t border-b pl-[14px]">
				<div className=" flex items-center gap-4 ">
					<ShortLogo />
					<div className="flex items-center gap-2">
						<span className="font-[600] font-namu text-[14px] text-text-primary uppercase">
							arcanum
						</span>
						<span className="text-[10px] text-text-secondary">protocol</span>
					</div>
				</div>

				<button
					onClick={() => {
						setIsOpenMenu(!isOpenMenu);
					}}
					className="relative z-50 flex w-[72px] items-center justify-center border-fill-secondary border-l"
					type="button"
				>
					<MenuIcon
						data-open={isOpenMenu}
						className="transition-all data-[open=true]:rotate-90"
					/>
				</button>
			</div>

			<div
				data-open={isOpenMenu}
				className="fixed z-30 h-svh w-full bg-bg-floor-0 pt-[56px] data-[open=false]:hidden"
			>
				<div className="flex h-full w-full flex-col justify-between px-[14px] pt-4">
					<div className="flex w-full items-center gap-1">
						<button
							type="button"
							onClick={() => setIsOpenLangSheet(true)}
							className="flex h-[60px] w-[68px] items-center justify-center rounded-[4px] bg-bg-floor-1"
						>
							<GlobeIcon
								data-active={isOpenLangSheet}
								className="text-text-primary transition-all duration-300 data-[active=true]:rotate-360 data-[active=true]:text-fill-brand-secondary-500"
							/>
						</button>
						<button
							type="button"
							onClick={() => setIsOpenSettingsSheet(true)}
							className="flex h-[60px] w-[68px] items-center justify-center rounded-[4px] bg-bg-floor-1"
						>
							<SettingsIcon
								data-active={isOpenSettingsSheet}
								className="text-text-primary transition-all duration-300 data-[active=true]:rotate-360 data-[active=true]:text-fill-brand-secondary-500"
							/>
						</button>
						<SelectChain />
					</div>

					<div className="flex flex-col items-center justify-center gap-[48px] text-[18px] text-text-tertiary ">
						<Link
							to="/"
							onClick={() => setIsOpenMenu(false)}
							className={cn(
								" text-text-tertiary transition-colors hover:text-text-primary",
								currentPath === "/" && "text-text-primary",
							)}
						>
							{t("explore")}
						</Link>
						<Link
							to="/explore/$id"
							onClick={() => setIsOpenMenu(false)}
							params={{ id: allPortfolios?.[0]?.address || zeroAddress }}
							className={cn(
								" text-text-tertiary transition-colors hover:text-text-primary",
								currentPath.includes("/explore/") && "text-text-primary",
							)}
						>
							{t("trade")}
						</Link>
						<Link
							to="/docs"
							onClick={() => setIsOpenMenu(false)}
							className={cn(
								" text-text-tertiary transition-colors hover:text-text-primary",
								currentPath.includes("/docs") && "text-text-primary",
							)}
						>
							{t("docs")}
						</Link>
					</div>
					<footer className="flex flex-col gap-6">
						{/* <Button className="h-[48px]">
							Connect wallet <WalletIcon className="text-text-primary" />
						</Button> */}
						<ConnectWallet />
						<div className="flex w-full justify-between p-6 pt-0">
							<a
								href="https://t.me/+jBzcrYBvgDY3ZTI6"
								target="_blank"
								rel="noreferrer"
								aria-label="Arcanum Protocol Telegram"
							>
								<TelegramIcon className="scale-120 text-text-primary" />
							</a>
							<a
								className=""
								href="https://x.com/0xArcanum"
								target="_blank"
								rel="noreferrer"
								aria-label="Arcanum Protocol Twitter"
							>
								<TwitterIcon className="scale-120 text-text-primary" />
							</a>
							<a
								className=" "
								href="https://discord.com/invite/Fdeg93TFcs"
								target="_blank"
								rel="noreferrer"
								aria-label="Arcanum Protocol Discord"
							>
								<DiscordIcon className="scale-120 text-text-primary" />
							</a>
							<a
								className=""
								href="https://github.com/arcanum-protocol"
								target="_blank"
								rel="noreferrer"
								aria-label="Arcanum Protocol GitHub"
							>
								<GitIcon className="scale-120 text-text-primary" />
							</a>
						</div>
					</footer>
				</div>
			</div>
			{/* <BottomSheet
				open={isOpenLangSheet}
				onDismiss={() => setIsOpenLangSheet(false)}
			>
				<div className="flex flex-col gap-6 px-4 pb-6">
					<span className="text-[14px] text-text-secondary ">Language</span>
					<div className="flex flex-col gap-2 ">
						{Object.values(APP_LANGUAGES).map((lang) => (
							<button
								type="button"
								data-active={currentLanguage}
								key={lang}
								className={cn(
									"flex h-[56px] w-full cursor-pointer items-center rounded-[4px] bg-bg-floor-2 pl-4 text-text-primary uppercase",
									lang === currentLanguage && "bg-text-brand-primary",
								)}
								onClick={() => changeLanguage(lang)}
							>
								{lang}
							</button>
						))}
					</div>
				</div>
			</BottomSheet> */}

			{/* <BottomSheet
				open={isOpenSettingsSheet}
				onDismiss={() => setIsOpenSettingsSheet(false)}
			>
				<div className="flex flex-col gap-6 px-4 pb-[56px]">
					<span className="text-[14px] text-text-secondary ">Settings</span>
					<div className="flex flex-col gap-4">
						<span className="text-[12px] text-text-secondary">
							RPC endpoint
						</span>
						<div className="flex flex-col gap-1">
							{MOCK_RPC_DATA.map((rpc) => (
								<div key={rpc.rpcName} className="flex justify-between">
									<RadioButton
										label={rpc.rpcName}
										value={rpc.rpcName}
										name={rpc.rpcName}
									/>

									<ConnectivityIndicator value={rpc.connectValue} />
								</div>
							))}
						</div>
						<Input className="text-text-primary" />
					</div>
				</div>
			</BottomSheet> */}
		</div>
	);
};

const SelectChain = observer(() => {
	const [_, setIsOpenChainSelect] = useState(false);
	const { chain } = useMetadataChain();

	return (
		<div className="flex grow">
			<button
				type="button"
				data-chain={chain}
				onClick={() => setIsOpenChainSelect(true)}
				className={cn(
					"group flex h-[60px] w-full items-center justify-between gap-2 whitespace-nowrap rounded-[4px] bg-transparent pr-6 pl-8 text-text-primary outline-none transition-colors ",
					//arb
					"data-[chain=42161]:bg-[color-mix(in_srgb,var(--bg-42161),black_20%)] data-[chain=42161]:hover:bg-[var(--bg-42161)]",
					//arb sep
					"data-[chain=421614]:bg-[color-mix(in_srgb,var(--bg-421614),black_20%)] data-[chain=421614]:hover:bg-[var(--bg-42161)]",
					//monad
					"data-[chain=10143]:bg-[color-mix(in_srgb,var(--bg-10143),black_20%)] data-[chain=10143]:hover:bg-[var(--bg-10143)]",
					// "data-[chain=arbitrum]:bg-[color-mix(in_srgb,var(--bg-arbitrum),black_20%)]",
					// "data-[chain=aurora]:bg-[color-mix(in_srgb,var(--bg-aurora),black_20%)]",
					// "data-[chain=avalanche]:bg-[color-mix(in_srgb,var(--bg-avalanche),black_20%)]",
					// "data-[chain=base]:bg-[color-mix(in_srgb,var(--bg-base),black_20%)] ",
					// "data-[chain=bsc]:bg-[color-mix(in_srgb,var(--bg-bsc),black_20%)] ",
					// "data-[chain=ethereum]:bg-[color-mix(in_srgb,var(--bg-ethereum),black_20%)] ",
					// "data-[chain=gnosis]:bg-[color-mix(in_srgb,var(--bg-gnosis),black_20%)] ",
					// "data-[chain=kaia]:bg-[color-mix(in_srgb,var(--bg-kaia),black_20%)] ",
					// "data-[chain=optimism]:bg-[color-mix(in_srgb,var(--bg-optimism),black_20%)] ",
					// "data-[chain=polygon]:bg-[color-mix(in_srgb,var(--bg-polygon),black_20%)] ",
					// "data-[chain=fantom]:bg-[color-mix(in_srgb,var(--bg-fantom),black_20%)] ",
					// "data-[chain=zksync]:bg-[color-mix(in_srgb,var(--bg-zksync),black_20%)] ",
				)}
				style={ChainsColors}
			>
				<div className="flex flex-row items-center gap-2">
					<img src={chain?.logo} alt={`${chain?.name} logo`} />
					<span className="font-droid font-normal text-sm tracking-[0.01em]">
						{chain?.name}
					</span>
				</div>
				<ChevronIcon className="rotate-90" />
			</button>
			{/* <BottomSheet
				open={isOpenChainSelect}
				onDismiss={() => setIsOpenChainSelect(false)}
			>
				<div className="flex flex-col gap-6 px-4 pb-6">
					<span className="text-[14px] text-text-secondary">Network</span>
					<div className="grid grid-cols-2 gap-2">
						{arcanumChains.map((chain) => (
							<button
								type="button"
								onClick={() => {
									const newChain =
										chains.find((_chain) => _chain.id === chain.id) ||
										chains[0];
									if (currentWagmiChain?.id !== chain.id) {
										switchChain({ chainId: newChain.id });
										setCurrentChain(newChain);
									}
								}}
								key={chain.id}
								className="flex flex-row items-center gap-2 bg-bg-floor-2 px-3 py-2 text-text-primary"
							>
								<img src={chain.logo} alt="logo" />
								<span className="font-droid font-normal text-sm tracking-[0.01em]">
									{chain.name}
								</span>
							</button>
						))}
					</div>
				</div>
			</BottomSheet> */}
		</div>
	);
});
