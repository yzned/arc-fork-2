import RoundedCheckIcon from "@/icons/roundedCheck.svg?react";
import SettingsIcon from "@/icons/settings.svg?react";
import TemplatesIcon from "@/icons/templates.svg?react";

import { Input } from "@/components/ui/input";

import { observer } from "mobx-react-lite";

import Chevron from "@/icons/chevron.svg?react";

import { useCreatePortfolio } from "@/contexts/CreatePortfolioContext";

import { FEES_TEMPLATES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAccount } from "wagmi";

export const Fees = observer(({ className }: { className?: string }) => {
	const [opened, setOpened] = useState(true);

	const { t } = useTranslation(["main"]);
	const { address } = useAccount();

	const {
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
		selectedFeeTemplate,
		setSelectedFeeTemplate,
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
		let value = e.target.value.replace(",", ".");

		value = value.replace(/[^\d.]/g, "");

		if (value.includes(".")) {
			const [integerPart, decimalPart] = value.split(".");

			const trimmedDecimal = decimalPart.slice(0, 6);
			value = `${integerPart}.${trimmedDecimal}`;

			if (decimalPart === "") {
				value = `${integerPart}.`;
			}
		}

		const numericValue = Number.parseFloat(value);
		if (
			!Number.isNaN(numericValue) &&
			numericValue >= 1 &&
			numericValue <= 100
		) {
			setter(value);
		} else if (value === "" || value === ".") {
			setter(value);
		}
	};

	return (
		<div className={cn(className, "flex flex-col gap-10 px-6")}>
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
					{FEES_TEMPLATES.map((item, index) => {
						return (
							<button
								type="button"
								key={item.name}
								data-selected={selectedFeeTemplate === index}
								onClick={() => {
									setSelectedFeeTemplate(index);
									setBaseFee(item.baseFee);
									setManagementFee(item.managementFee);
									setDeviationLimit(item.deviationFee);
									setCashbackFeeShare(item.cashbackFeeShare);
									setDeviationFee(item.deviationFee);
								}}
								className="flex h-full w-full max-w-[260px] cursor-pointer flex-col gap-3 rounded-[8px] border-[1px] border-fill-primary-800 bg-[position:right_20.4px_top_16px] bg-no-repeat p-4 transition-all hover:bg-fill-secondary data-[selected=true]:border-fill-brand-secondary-500 data-[selected=true]:border-fill-secondary data-[selected=true]:bg-fill-secondary"
							>
								<div
									data-selected={selectedFeeTemplate === index}
									className="flex items-center gap-2 font-droid font-normal text-sm text-text-primary data-[selected=true]:text-fill-brand-secondary-500"
								>
									<RoundedCheckIcon
										data-selected={selectedFeeTemplate === index}
										className="text-fill-brand-secondary-500 data-[selected=false]:hidden"
									/>

									<span>{item.name}</span>
								</div>
								<div className="font-droid font-normal text-text-secondary text-xs">
									{item.description}
								</div>
							</button>
						);
					})}
				</div>
			</div>

			<div className="flex flex-col gap-6">
				<div className="flex flex-row gap-6">
					{/* <Input
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
					/> */}
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
					defaultValue={address}
				/>
				<div className="group flex h-[210px] h-[56px] w-[793px] flex-col gap-4 overflow-clip rounded-xs bg-fill-primary-800 p-4 transition-all">
					<div className="flex cursor-pointer flex-row gap-2">
						<SettingsIcon className="size-6 text-text-primary" />
						<span className="font-droid font-normal text-base text-text-primary">
							{t("advancedSettings")}
						</span>
					</div>
					<div className="grid grid-cols-2 grid-rows-2 gap-6">
						<Input
							type="number"
							label={t("baseFee")}
							required={true}
							placeholder={t("10 %")}
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
