import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { Dropdown } from "../ui/dropdown";
import { Label } from "../ui/label";

import PlusRoundedIcon from "@/icons/plus-rounded.svg?react";
import TemplatesIcon from "@/icons/templates.svg?react";
import ChevronIcon from "../../icons/chevron.svg?react";
import RoundedCheckIcon from "../../icons/roundedCheck.svg?react";

import { useCreatePortfolio } from "@/contexts/CreatePortfolioContext";
import { useTranslation } from "react-i18next";

import { useAccountStore } from "@/contexts/AccountContext";
import { type Address, zeroAddress } from "viem";
import { TokenTable } from "../ui/tokenTable";

export const TokenSetup = observer(() => {
	const { t } = useTranslation(["main"]);

	const [isFocused, setIsFocused] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const [opened, setOpened] = useState(true);
	const [selectedId, setSelectedId] = useState(100);

	const {
		sharePercentsSum,
		addNewToken,
		setInitialLiquidityToken,
		initialLiquidityAmount,
		setInitialLiqudityAmount,
		dollarPrice,
		initialLiquidityToken,
		tokens,
		startEditToken,
		deleteToken,
		cancelEditToken,
		editToken,
	} = useCreatePortfolio();

	const { currentChain } = useAccountStore();

	const liquidityDropdownTokens = currentChain?.availableTokens?.map(
		({ logo, ...rest }) => ({
			...rest,
			iconLeft: logo,
		}),
	);

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInitialLiqudityAmount(e.target.value);
	};

	return (
		<div className="flex flex-col gap-10 p-4 ">
			<p className="font-[600] font-namu text-[24px] text-white uppercase ">
				{t("tokensSetup")}
			</p>

			<div className="flex flex-col gap-4">
				<div
					onClick={() => setOpened(!opened)}
					onKeyUp={(e) => e.key === "Enter" && setOpened(!opened)}
					className="flex w-fit cursor-pointer flex-row gap-2 rounded-md p-2 transition-all hover:bg-fill-secondary"
				>
					<TemplatesIcon className="h-6 w-6" fill="#0148fe" />
					<span className="font-droid text-base text-fill-brand-primary-700">
						{t("templates")}
					</span>

					<ChevronIcon
						data-opened={opened}
						className="h-6 w-6 rotate-0 p-1.5 transition-all data-[opened=true]:rotate-180"
						fill="#0148FE"
					/>
				</div>
				<span className="text-text-secondary ">{t("addTokensTemplate")}</span>

				<div
					data-opened={opened}
					className="h-0 w-full overflow-hidden opacity-0 transition-all data-[opened=true]:h-[160px] data-[opened=true]:opacity-100"
				>
					<div className="flex h-full flex-row gap-2">
						<div
							data-selected={selectedId}
							onClick={() => setSelectedId(0)}
							onKeyUp={(e) => e.key === "Enter" && setSelectedId(0)}
							className=" flex h-full w-full cursor-pointer flex-col gap-3 rounded-[8px] border-[1px] border-fill-primary-800 bg-[position:right_20.4px_top_16px] bg-no-repeat p-4 transition-all hover:bg-fill-secondary data-[selected=0]:border-fill-brand-secondary-500 data-[selected=0]:border-fill-secondary data-[selected=0]:bg-fill-secondary"
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
								A balanced ETF blending growth and stability, tailored to
								reflect your financial goals
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
								A balanced ETF blending growth and stability, tailored to
								reflect your financial goals
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
								A balanced ETF blending growth and stability, tailored to
								reflect your financial goals
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
								A balanced ETF blending growth and stability, tailored to
								reflect your financial goals
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex w-[793px] flex-col">
				<div className="mb-8 flex gap-4">
					<div>
						<Label className="" text="Initial liquidity token" isRequired />
						<Dropdown
							items={liquidityDropdownTokens || []}
							defaultItem={liquidityDropdownTokens?.find(
								(item) => item.address === initialLiquidityToken?.address,
							)}
							className="mt-[11px] w-[254px]"
							placeholder={t("selectToken")}
							onSelect={(item) => {
								setInitialLiquidityToken({
									address: (item.address || zeroAddress) as Address,
									symbol: item.symbol || "",
								});
							}}
						/>
					</div>
					<div>
						<Label className="" text={t("amount")} isRequired />
						<div className="mt-[13px] flex">
							<Input
								type="number"
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
								placeholder={t("enterAmount")}
								className="w-[234px] text-text-primary"
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								onMouseEnter={() => setIsHovered(true)}
								onMouseLeave={() => setIsHovered(false)}
								onChange={(e) => handleAmountChange(e)}
								value={initialLiquidityAmount}
								style={{
									MozAppearance: "textfield",
									appearance: "textfield",
								}}
							/>
							<span
								className={cn(
									"whitespace-nowrap border-b-[1px] pr-2 text-[12px] text-text-secondary transition-colors",
									isFocused
										? "border-b-fill-brand-primary-700"
										: isHovered
											? "border-b-fill-quaternary"
											: " border-fill-secondary",
								)}
								key="1"
							>
								{dollarPrice} $
							</span>
						</div>
					</div>
				</div>

				<TokenTable
					sharePercentsSum={sharePercentsSum}
					tokens={tokens}
					onStartEdit={(id) => {
						startEditToken(id || "");
					}}
					onDeleteToken={(id) => {
						deleteToken(id);
					}}
					onCancelEditToken={(id) => {
						cancelEditToken(id);
					}}
					onEditToken={(item) => {
						editToken(item);
					}}
				/>

				<div className="mt-4 flex items-center gap-4">
					<Button
						variant={"secondary"}
						onClick={() => {
							addNewToken();
						}}
						className="group w-fit"
					>
						<span className="font-droid font-normal text-sm text-text-accent leading-[130%] tracking-[0.01em] transition-colors group-hover:text-text-primary">
							{t("addToken")}
						</span>
						<PlusRoundedIcon className="h-4 w-4" fill="#18171C" />
					</Button>
					<span className="text-text-secondary">{t("addAtLeast")}</span>
				</div>
				<div className="mt-8">
					{sharePercentsSum.toNumber() > 100 && (
						<span className="text-negative-primary">{t("shareAttention")}</span>
					)}
				</div>
			</div>
		</div>
	);
});
