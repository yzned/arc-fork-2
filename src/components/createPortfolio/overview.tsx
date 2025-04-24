import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import { observer } from "mobx-react-lite";

import { useAccountStore } from "@/contexts/AccountContext";
import { useCreatePortfolio as useCreatePortfolioContext } from "@/contexts/CreatePortfolioContext";
import { useCreatePortfolio } from "@/hooks/mutations/useCreatePortfolio";
import { shorten } from "@/lib/formatNumber";
import { formatAddress } from "@/lib/utils";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";

export const Overview = observer(({ className }: { className?: string }) => {
	const { t } = useTranslation(["main"]);
	const { createPortfolio } = useCreatePortfolio();
	const { currentChain } = useAccountStore();
	const {
		tokens,
		name,
		initialSharePrice,
		managementFee,
		managementFeeRecepient,
		dollarPrice,
		symbol,
		isDisabled,
		networkFee,
	} = useCreatePortfolioContext();

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
							<span className="ml-auto whitespace-nowrap text-text-secondary">
								<span className="text-text-primary">
									0 {currentChain?.nativeCurrency.symbol}
								</span>{" "}
								({dollarPrice.toFixed(2)} $)
							</span>
							<span className="text-text-secondary">{t("tokens")}</span>
							<div className="ml-auto flex items-center gap-2 text-text-secondary">
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
												className="h-4 w-4"
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
								<span className="text-text-primary">
									0 {currentChain?.nativeCurrency.symbol}
								</span>{" "}
								($27,82)
							</span>
							<span>{t("youReceive")}</span>
							<span className="ml-auto">
								<span className="text-text-primary">
									0 {currentChain?.nativeCurrency.symbol}
								</span>{" "}
								($27,82)
							</span>
							<span>{t("networkFee")}</span>
							<span className="ml-auto">
								<span className="whitespace-nowrap text-text-primary">
									{shorten(new BigNumber(networkFee || 0))}{" "}
									{currentChain?.nativeCurrency.symbol}
								</span>
							</span>
						</div>
					</div>
					<Button onClick={createPortfolio} size="L" disabled={isDisabled}>
						{t("create")}
					</Button>
				</div>
			</div>
		</div>
	);
});
