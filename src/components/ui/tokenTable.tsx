import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import EditIcon from "../../icons/edit.svg?react";
import RoundedCheckIcon from "../../icons/roundedCheck.svg?react";
import TrashIcon from "../../icons/trash.svg?react";

import { useTranslation } from "react-i18next";
import { CopyButton } from "../ui/copyButton";

import type { SetupToken } from "@/lib/types";
import type BigNumber from "bignumber.js";
import { AssetSelector } from "../ui/assetSelector";
import { PriceChange } from "../ui/priceChange";

export const TokenTable = observer(
	({
		tokens,
		sharePercentsSum,
		onRestoreItem,
		onStartEdit,
		onCancelEditToken,
		onDeleteToken,
		onEditToken,
	}: {
		tokens: SetupToken[];
		sharePercentsSum: BigNumber;
		onStartEdit: (id: string) => void;
		onDeleteToken: (item: string) => void;
		onCancelEditToken: (item: string) => void;
		onEditToken: (item: SetupToken) => void;
		onRestoreItem?: (id: string) => void;
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
							<th className=" px-4 py-3 text-left">{t("token")}</th>
							<th className="px-4 py-3 text-left ">{t("address")}</th>
							<th className=" px-4 py-3 text-left">{t("priceFeedType")}</th>
							<th
								className={cn(
									" px-4 py-3 text-left",
									sharePercentsSum.toNumber() > 100 && "text-negative-primary",
								)}
							>
								{t("share")} ({sharePercentsSum.toString()}%)
							</th>
						</tr>
					</thead>

					<tbody className="text-white">
						{tokens.map((row, index) =>
							row.creationState === "readed" ||
							row.creationState === "deleted" ? (
								<ReadOnlyTableRow
									row={row}
									key={`${index}-${row.address}`}
									onStartEdit={onStartEdit}
									onRestoreItem={onRestoreItem}
								/>
							) : (
								<EditTableRow
									row={row}
									key={`${index}-${row.address}`}
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

const ReadOnlyTableRow = observer(
	({
		row,
		onStartEdit,
		onRestoreItem,
	}: {
		row: SetupToken;
		onStartEdit: (id: string) => void;
		onRestoreItem?: (id: string) => void;
	}) => {
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
							className="h-4 w-4 overflow-hidden"
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
				<td className="flex items-center justify-between border-b border-b-fill-primary-700 py-4 pr-4 pl-4 text-left">
					<span
						data-state={row.creationState}
						className="flex gap-2 data-[state=deleted]:opacity-30"
					>
						{row?.share?.toString()} %
						{row.shareGrowing && (
							<PriceChange
								growing={row.shareGrowing > 0}
								value={row.shareGrowing.toString()}
								decimals={0}
							/>
						)}
					</span>
					{row.creationState === "deleted" && (
						<Button
							variant={"tertiary"}
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
	},
);

const EditTableRow = observer(
	({
		row,
		onCancelEditToken,
		onDeleteToken,
		onEditToken,
	}: {
		row: SetupToken;
		onDeleteToken: (item: string) => void;
		onCancelEditToken: (item: string) => void;
		onEditToken: (item: SetupToken) => void;
	}) => {
		const { t } = useTranslation(["main"]);

		const inputRef = useRef<HTMLInputElement>(null);
		const [percentOffset, setPercentOffset] = useState(0);

		const handleShareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value.replace(",", ".");
			console.log("row: ", row);

			if (Number(value) >= 0 && Number(value) <= 100) {
				onEditToken({ ...row, share: value.toString() });
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
				<td>
					<div className="mt-4 flex h-[106px] bg-fill-primary-800 p-4">
						<div className="flex w-[80%] gap-6">
							<div className="w-[50%]">
								<Label text="Select token" isRequired />

								<AssetSelector
									logo={row.logo}
									symbol={row.symbol}
									className="w-full"
									onSelectAsset={(item) =>
										onEditToken({
											...row,
											address: item.address,
											id: row.id,
											logo: item.logo,
											name: item.name || "",
											symbol: item.symbol || "",
											priceFeedType: item.priceFeedType,
											poolAddress: item.poolAddress,
										})
									}
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
									onDeleteToken(row.id || "");
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
										onEditToken({ ...row, creationState: "readed" });
									}}
								>
									<span>{t("confirm")}</span>

									<RoundedCheckIcon className="h-2 w-2 scale-90" />
								</Button>
								<Button
									variant={"tertiary"}
									className="w-[84px]"
									onClick={() => {
										onCancelEditToken(row.id);
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
