import { cn, shrinkNumber } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { type FC, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import EditIcon from "../../icons/edit.svg?react";
import RoundedCheckIcon from "../../icons/roundedCheck.svg?react";
import TrashIcon from "../../icons/trash.svg?react";

import { useTranslation } from "react-i18next";
import { CopyButton } from "../ui/copyButton";

import { useTokensList } from "@/hooks/queries/useTokensList";
import type { SetupToken } from "@/lib/types";
import type BigNumber from "bignumber.js";
import type { Address } from "viem";
import { AssetSelector } from "../ui/assetSelector";
import { PriceChange } from "../ui/priceChange";

export interface TokenTableProps {
	tokens: SetupToken[];
	sharePercentsSum: BigNumber;
	onStartEdit: (id: string) => void;
	onDeleteToken: (item: SetupToken) => void;
	onCancelEditToken: (item: SetupToken) => void;
	onEditToken: (item: SetupToken) => void;
	onRestoreItem?: (id: string) => void;
}

type RowType = { row: SetupToken };

export const TokenTable: FC<TokenTableProps> = observer(
	({
		tokens,
		sharePercentsSum,
		onRestoreItem,
		onStartEdit,
		onCancelEditToken,
		onDeleteToken,
		onEditToken,
	}) => {
		const { t } = useTranslation(["main"]);

		return (
			<div>
				<table className="w-full">
					<thead
						className="sticky top-0 z-10 grid w-full bg-fill-primary-800"
						style={{
							gridTemplateColumns: "131px 1fr 161px 251px",
						}}
					>
						<tr className="contents bg-fill-primary-800 text-text-secondary">
							<th className="px-4 py-3 text-left">{t("token")}</th>
							<th className="px-4 py-3 text-left ">{t("address")}</th>
							<th className="px-4 py-3 text-left">{t("priceFeedType")}</th>
							<th
								className={cn(
									"px-4 py-3 text-left",
									sharePercentsSum.toNumber() > 100 && "text-negative-primary",
								)}
							>
								{t("targetShare")} ({sharePercentsSum.toNumber()}%)
							</th>
						</tr>
					</thead>

					<tbody className="text-white">
						{tokens.map((row) =>
							row.creationState === "readed" ||
							row.creationState === "deleted" ? (
								<ReadOnlyTableRow
									row={row}
									key={row.id}
									onStartEdit={onStartEdit}
									onRestoreItem={onRestoreItem}
								/>
							) : (
								<EditTableRow
									tokens={tokens}
									row={row}
									key={row.id}
									onCancelEditToken={onCancelEditToken}
									onEditToken={onEditToken}
									onDeleteToken={onDeleteToken}
								/>
							),
						)}
					</tbody>
				</table>
			</div>
		);
	},
);

const ReadOnlyTableRow: FC<
	RowType & Pick<TokenTableProps, "onStartEdit" | "onRestoreItem">
> = observer(({ row, onStartEdit, onRestoreItem }) => {
	const { t } = useTranslation(["main"]);

	return (
		<tr
			className={cn(
				"grid transition-colors duration-400 ease-out hover:bg-fill-primary-700",
			)}
			style={{
				gridTemplateColumns: "131px 1fr 161px 251px",
			}}
		>
			<td
				data-state={row.creationState}
				className="border-b border-b-fill-primary-700 px-4 py-4 text-left data-[state=deleted]:opacity-30"
			>
				<div className="flex items-center gap-2">
					<img
						src={row.logo || "/icons/empty-token.svg"}
						alt="icon1"
						className="h-5 w-5 overflow-hidden rounded-xs"
					/>
					<span>{row.symbol}</span>
				</div>
			</td>
			<td
				data-state={row.creationState}
				className="border-b border-b-fill-primary-700 px-4 py-4 text-left text-fill-brand-secondary-500 data-[state=deleted]:opacity-30"
			>
				<CopyButton
					copyValue={row.address || ""}
				>{`${row?.address?.slice(0, 5)}...${row?.address?.slice(-4)}`}</CopyButton>
			</td>
			<td
				data-state={row.creationState}
				className="border-b border-b-fill-primary-700 px-4 py-4 text-left text-fill-brand-secondary-500 data-[state=deleted]:opacity-30"
			>
				{row.priceFeedType}
			</td>
			<td
				data-state={row.creationState}
				className="flex items-center justify-between border-b border-b-fill-primary-700 data-[state=deleted]:border-[#1D1B23] pr-4 pl-4 text-left"
			>
				<span
					data-state={row.creationState}
					className="flex gap-2 data-[state=deleted]:opacity-30"
				>
					{shrinkNumber(row.share, 4)} %
					{row.shareGrowing !== undefined &&
						Number(row.shareGrowing) !== 0 &&
						!Number.isNaN(Number(row.shareGrowing)) && (
							<PriceChange
								growing={row.shareGrowing > 0}
								value={row.shareGrowing.toString()}
							/>
						)}
				</span>
				{row.creationState === "deleted" && (
					<Button
						variant={"tertiary"}
						className="opacity-100"
						onClick={() => {
							if (onRestoreItem) onRestoreItem(row.id);
						}}
					>
						{t("restore")}
					</Button>
				)}
				{row.creationState === "readed" && (
					<button
						type="button"
						className="cursor-pointer "
						onClick={() => {
							onStartEdit(row.id);
						}}
					>
						<EditIcon className="h-4 w-4 hover:text-fill-brand-secondary-500" />
					</button>
				)}
			</td>
		</tr>
	);
});

const EditTableRow: FC<
	RowType &
		Pick<
			TokenTableProps,
			"onCancelEditToken" | "onDeleteToken" | "onEditToken" | "tokens"
		>
> = observer(
	({ row, onCancelEditToken, onDeleteToken, onEditToken, tokens }) => {
		const { t } = useTranslation(["main"]);
		const inputRef = useRef<HTMLInputElement>(null);
		const [percentOffset, setPercentOffset] = useState(0);

		const [currentShare, setCurrentShare] = useState(row.share);

		const handleShareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value.replace(",", ".");

			if (Number(value) >= 0 && Number(value) <= 100) {
				setCurrentShare(value.toString());
			}
		};

		useEffect(() => {
			if (inputRef.current) {
				const tempSpan = document.createElement("span");
				tempSpan.style.visibility = "hidden";
				tempSpan.style.whiteSpace = "pre";
				tempSpan.style.fontFamily = "droid";
				tempSpan.style.fontSize = "16px";
				tempSpan.textContent = currentShare?.toString() || "";

				document.body.appendChild(tempSpan);
				const textWidth = tempSpan.getBoundingClientRect().width;
				document.body.removeChild(tempSpan);

				setPercentOffset(textWidth + 16);
			}
		}, [currentShare]);

		const disableConfirm =
			currentShare === undefined ||
			currentShare === "" ||
			currentShare === "0" ||
			row.symbol === "";
		const { data: chainsTokens } = useTokensList();

		const availableTokens =
			chainsTokens?.filter(
				(availableToken) =>
					!tokens?.some((token) => token.symbol === availableToken.symbol),
			) || [];

		return (
			<tr className="w-full">
				<td>
					<div className="mt-4 flex h-[106px] bg-fill-primary-800 p-4">
						<div className="flex w-[80%] gap-6">
							<div className="w-[50%]">
								<Label text="Select token" isRequired />

								<AssetSelector
									logo={row.logo}
									symbol={row.symbol}
									assets={availableTokens}
									className="w-full"
									onSelectAsset={(item) => {
										onEditToken({
											address: item?.address as Address,
											id: row.id,
											logo: item?.logo,
											name: item?.name || "",
											symbol: item?.symbol || "",
											priceFeedType: item?.priceFeedType,
											poolAddress: item?.poolAddress,
											decimals: item?.decimals,
										});
									}}
								/>
							</div>
							<div className="w-[50%]">
								<Label text={t("enterShare")} isRequired />
								<div className="relative text-text-primary">
									<Input
										type="number"
										ref={inputRef}
										className="mt-[10px] w-full overflow-hidden pr-8 text-text-primary"
										placeholder={t("enterShare")}
										value={currentShare?.toString()}
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
									{currentShare && (
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
									onDeleteToken(row);
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
										onEditToken({
											...row,
											share: currentShare,
											creationState: "readed",
										});
									}}
								>
									<span>{t("confirm")}</span>

									<RoundedCheckIcon className="h-2 w-2 scale-90" />
								</Button>
								<Button
									variant={"tertiary"}
									className="w-[84px]"
									onClick={() => {
										onCancelEditToken(row);
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
	},
);
