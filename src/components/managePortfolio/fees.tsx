import { Input } from "@/components/ui/Input";

import Chevron from "@/icons/chevron.svg?react";
import RoundedCheckIcon from "@/icons/roundedCheck.svg?react";
import SettingsIcon from "@/icons/settings.svg?react";
import TemplatesIcon from "@/icons/templates.svg?react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Fees = observer(() => {
	const { t } = useTranslation(["main"]);

	const [opened, setOpened] = useState(true);
	const [selectedId, setSelectedId] = useState(100);
	const [advOpen, setAdvOpen] = useState(false);

	// const { portfolioAssets, updateManagingAssets, shortPortfolioData } =
	// 	useExplorePortfolio();

	// useEffect(() => {
	// 	updateManagingAssets();
	// }, [portfolioAssets]);

	// const handleChange = (
	// 	e: React.ChangeEvent<HTMLInputElement>,
	// 	setter: (value: string) => void,
	// ) => {
	// 	setter(e.target.value);
	// };

	// const handleChangePercents = (
	// 	e: React.ChangeEvent<HTMLInputElement>,
	// 	setter: (value: string) => void,
	// ) => {
	// 	const value = e.target.value.replace(",", ".");

	// 	if (Number(value) >= 0 && Number(value) <= 100) {
	// 		setter(e.target.value);
	// 	}
	// };

	return (
		<div className="mt-[56px] flex flex-col gap-8 pl-6">
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
						// defaultValue={shortPortfolioData?.cache.initial_share_price}
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
						// onChange={(e) => {
						// 	handleChange(e, setInitialPrice);
						// }}
						// value={initialSharePrice?.toString()}
					/>
					<Input
						type="number"
						label={t("managementFee")}
						required={true}
						placeholder={`${t("enterFee")} %`}
						className="w-[384px]"
						// defaultValue={shortPortfolioData?.cache.management_fee}
						// onChange={(e) => {
						// 	handleChangePercents(e, setManagementFee);
						// }}
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
						// value={managementFee}
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
					// defaultValue={shortPortfolioData?.cache.management_fee_receiver}
					// onChange={(e) => {
					// 	handleChange(e, setManagementFeeRecipient);
					// }}
					// value={managementFeeRecepient}
				/>
				<div
					data-adv={advOpen}
					className="group flex h-[56px] w-[793px] flex-col gap-4 overflow-clip rounded-xs bg-fill-primary-800 p-4 transition-all data-[adv=true]:h-[210px]"
					onKeyUp={(e) => e.key === "Enter" && setAdvOpen(!advOpen)}
				>
					<button
						type="button"
						onClick={() => setAdvOpen(!advOpen)}
						className="flex cursor-pointer flex-row gap-2"
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
							placeholder={t("10 %")}
							className="w-full"
							// defaultValue={shortPortfolioData?.cache.base_fee}
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
							// value={baseFee}
							// onChange={(e) => handleChangePercents(e, setBaseFee)}
						/>
						<Input
							type="number"
							label={t("deviationLimit")}
							required={true}
							placeholder="10 %"
							className="w-full"
							// defaultValue={shortPortfolioData?.cache.deviation_limit}
							// value={deviationLimit}
							// onChange={(e) => handleChangePercents(e, setDeviationLimit)}
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
							defaultValue={Number(
								// shortPortfolioData?.cache.deviation_increase_fee,
							)}
							className="w-full"
							// value={deviationFee}
							// onChange={(e) => handleChangePercents(e, setDeviationFee)}
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
							// defaultValue={shortPortfolioData?.cache.initial_share_price}
							// value={cashbackFeeShare}
							// onChange={(e) => handleChangePercents(e, setCashbackFeeShare)}
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
