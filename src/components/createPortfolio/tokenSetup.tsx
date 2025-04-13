import { ARBITRUM_TOKENS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Dropdown } from "../ui/dropdown";
import { Input } from "../ui/Input";
import { Label } from "../ui/label";

import PlusRoundedIcon from "@/icons/plus-rounded.svg?react";
import TemplatesIcon from "@/icons/templates.svg?react";
import ChevronIcon from "../../icons/chevron.svg?react";
import EditIcon from "../../icons/edit.svg?react";
import RoundedCheckIcon from "../../icons/roundedCheck.svg?react";
import TrashIcon from "../../icons/trash.svg?react";

import { useCreatePortfolio } from "@/contexts/CreatePortfolioContext";
import { useTranslation } from "react-i18next";
import { CopyButton } from "../ui/copyButton";

import type { SetupToken } from "@/store/create-portfolio";
import { AssetSelector } from "../ui/assetSelector";

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
	} = useCreatePortfolio();

	const liquidityDropdownTokens = ARBITRUM_TOKENS.map(({ logo, ...rest }) => ({
		...rest,
		iconLeft: logo,
	}));

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInitialLiqudityAmount(e.target.value);
	};

	return (
		<div className="flex flex-col gap-10 p-4">
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

			<div className="flex flex-col ">
				<div className="mb-8 flex gap-4">
					<div>
						<Label className="" text="Initial liquidity token" isRequired />
						<Dropdown
							items={liquidityDropdownTokens}
							defaultItem={liquidityDropdownTokens.find(
								(item) => item.address === initialLiquidityToken,
							)}
							className="mt-[11px] w-[254px]"
							placeholder={t("selectToken")}
							onSelect={(item) => {
								setInitialLiquidityToken(item.address);
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

				<TokenTable />

				<div className="mt-4 flex items-center gap-4">
					<Button
						variant={"secondary"}
						onClick={() => {
							addNewToken();
						}}
						className="w-fit"
					>
						<span className="font-droid font-normal text-sm text-text-accent leading-[130%] tracking-[0.01em]">
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

const TokenTable = observer(() => {
	const { tokens, sharePercentsSum } = useCreatePortfolio();

	const { t } = useTranslation(["main"]);

	return (
		<div>
			<table>
				<thead>
					<tr className="bg-fill-primary-800 text-text-secondary">
						<th className="min-w-[131px] px-4 py-3 text-left">{t("asset")}</th>
						<th className="min-w-[227px] px-4 py-3 text-left">
							{t("address")}
						</th>
						<th className="min-w-[161px] px-4 py-3 text-left">
							{t("priceFeedType")}
						</th>
						<th
							className={cn(
								"min-w-[251px] px-4 py-3 text-left",
								sharePercentsSum.toNumber() > 100 && "text-negative-primary",
							)}
						>
							{t("share")} ({sharePercentsSum.toString()}%)
						</th>
						<th className="min-w-[24px] px-4 py-3 text-left" />
					</tr>
				</thead>

				<tbody className="text-white">
					{tokens.map((row, index) =>
						row.creationState === "readed" ? (
							<ReadOnlyTableRow row={row} key={`${index}-${row.address}`} />
						) : (
							<EditTableRow row={row} key={`${index}-${row.address}`} />
						),
					)}
				</tbody>
			</table>
		</div>
	);
});

const ReadOnlyTableRow = observer(({ row }: { row: SetupToken }) => {
	const { startEditToken } = useCreatePortfolio();

	return (
		<tr className="transition-colors duration-400 ease-out hover:bg-fill-primary-700">
			<td className="border-b border-b-fill-primary-700 px-4 py-4 text-left ">
				<div className="flex items-center gap-2">
					<img src={row.logo} alt="icon1" className="h-4 w-4 overflow-hidden" />
					<span>{row.symbol}</span>
				</div>
			</td>
			<td className="border-b border-b-fill-primary-700 px-4 py-4 text-left text-fill-brand-secondary-500">
				<CopyButton
					copyValue={row.address || ""}
				>{`${row?.address?.slice(0, 5)}...${row?.address?.slice(-4)}`}</CopyButton>
			</td>
			<td className="border-b border-b-fill-primary-700 px-4 py-4 text-left text-fill-brand-secondary-500">
				{row.priceFeedType}
			</td>
			<td className="border-b border-b-fill-primary-700 px-4 py-4 text-left">
				{row?.share?.toString()} %
			</td>
			<td className="border-b border-b-fill-primary-700 px-4 py-4 text-left">
				<button
					type="button"
					className="cursor-pointer pt-2"
					onClick={() => {
						startEditToken(row.id || "");
					}}
				>
					<EditIcon className="h-4 w-4 hover:text-fill-brand-secondary-500" />
				</button>
			</td>
		</tr>
	);
});

const EditTableRow = observer(({ row }: { row: SetupToken }) => {
	const { t } = useTranslation(["main"]);

	const { deleteToken, cancelEditToken, editToken } = useCreatePortfolio();

	const inputRef = useRef<HTMLInputElement>(null);
	const [percentOffset, setPercentOffset] = useState(0);

	const handleShareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(",", ".");

		if (Number(value) >= 0 && Number(value) <= 100) {
			editToken({ ...row, share: value.toString() });
		}
	};

	useEffect(() => {
		if (inputRef.current) {
			const tempSpan = document.createElement("span");
			tempSpan.style.visibility = "hidden";
			tempSpan.style.whiteSpace = "pre";
			tempSpan.style.fontFamily = "droid";
			tempSpan.style.fontSize = "16px";
			tempSpan.textContent = row.share?.toString() || "";

			document.body.appendChild(tempSpan);
			const textWidth = tempSpan.getBoundingClientRect().width;
			document.body.removeChild(tempSpan);

			setPercentOffset(textWidth + 16);
		}
	}, [row.share]);

	const disableConfirm =
		row.share === undefined ||
		row.share === "" ||
		row.share === "0" ||
		row.symbol === "";

	return (
		<tr className="w-full">
			<td colSpan={5}>
				<div className="mt-4 flex h-[106px] bg-fill-primary-800 p-4">
					<div className="flex gap-6">
						<div>
							<Label text="Select token" isRequired />

							<AssetSelector
								logo={row.logo}
								symbol={row.symbol}
								onSelectAsset={(item) =>
									editToken({
										...row,
										address: item.address,
										id: row.id,
										logo: item.logo,
										name: item.name || "",
										symbol: item.symbol || "",
										priceFeedType: item.priceFeedType,
									})
								}
							/>
						</div>
						<div>
							<Label text={t("enterShare")} isRequired />
							<div className="relative text-text-primary">
								<Input
									type="number"
									ref={inputRef}
									className="mt-[10px] w-[254px] overflow-hidden pr-8 text-text-primary"
									placeholder={t("enterShare")}
									value={row.share?.toString()}
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
									onChange={handleShareChange}
								/>
								{row.share && (
									<span
										style={{ left: `${percentOffset}px` }}
										className="pointer-events-none absolute top-[10px] transform"
									>
										%
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="ml-[48px] flex flex-col items-end gap-[18px]">
						<button
							onClick={() => {
								deleteToken(row.id || "");
							}}
							type="button"
							className="group flex h-[24px] w-[24px] cursor-pointer items-center justify-center rounded-[2px] border-[1px] border-fill-secondary transition-colors hover:border-fill-tertiary hover:bg-fill-tertiary"
						>
							<TrashIcon className="h-[16px] w-[14px] text-text-secondary transition-colors group-hover:text-text-primary" />
						</button>
						<div className="flex gap-2">
							<Button
								className="w-[116px]"
								disabled={disableConfirm}
								onClick={() => {
									editToken({ ...row, creationState: "readed" });
								}}
							>
								<span>{t("confirm")}</span>

								<RoundedCheckIcon className="h-2 w-2 scale-90" />
							</Button>
							<Button
								variant={"tertiary"}
								className="w-[84px]"
								onClick={() => {
									cancelEditToken(row.id || "");
								}}
							>
								<span>{t("cancel")}</span>
							</Button>
						</div>
					</div>
				</div>
			</td>
		</tr>
	);
});
