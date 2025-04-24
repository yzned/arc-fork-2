import { useAccountStore } from "@/contexts/AccountContext";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { formatAddress } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { PriceChange } from "../ui/priceChange";

export const RightSection = observer(() => {
	const { t } = useTranslation(["main"]);

	const { shortPortfolioData, managingAsssets, manageState } =
		useExplorePortfolio();

	const { currentChain } = useAccountStore();

	return (
		<div className="sticky top-[72px] flex h-[calc(100svh-72px)] flex-col justify-between bg-bg-floor-2">
			<div className="p-4">
				<div className="flex flex-row items-center gap-4">
					<Avatar className="size-10">
						<AvatarImage src="https://avatars.githubusercontent.com/u/14010287?v=4" />
						<AvatarFallback>U</AvatarFallback>
					</Avatar>
					<div className="flex flex-col gap-2">
						<span className="font-namu font-semibold text-sm text-text-primary uppercase leading-[12px] tracking-[0.015em]">
							{shortPortfolioData?.name
								? shortPortfolioData?.name
								: t("portfolioName")}
						</span>
						<span className="font-namu font-semibold text-sm text-text-tertiary uppercase leading-[12px] tracking-[0.015em]">
							{shortPortfolioData?.symbol
								? shortPortfolioData?.symbol
								: t("symbol")}
						</span>
					</div>
				</div>

				<div className="mt-8 flex flex-col gap-4 border-fill-secondary border-b pb-4 text-[12px]">
					<div className="flex justify-between">
						<span className="text-text-secondary">{t("initialLiquidity")}</span>
						<span className="text-text-primary">{1}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-text-secondary">{t("tokens")}</span>
						<div className="ml-auto flex items-center gap-2 text-text-secondary">
							<span className="text-text-primary">
								{
									managingAsssets?.filter(
										(item) => item.creationState === "readed",
									).length
								}
							</span>
							<div className="flex gap-0.5">
								{managingAsssets
									?.filter((item) => item.creationState === "readed")
									.slice(0, 5)
									.map((item) => (
										<img
											alt="no-logo"
											src={item.logo || "/icons/empty-token.svg"}
											className="h-4 w-4"
											key={item.address}
										/>
									))}
							</div>
						</div>
					</div>
					<div className="flex justify-between">
						<span className="text-text-secondary">{t("managementFee")}</span>
						<span className="text-text-primary">
							{shortPortfolioData?.cache.management_fee}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-text-secondary">
							{t("managementFeeReceiver")}
						</span>
						<span className="text-text-primary">
							{formatAddress(shortPortfolioData?.cache.management_fee_receiver)}
						</span>
					</div>
				</div>

				<div className="mt-4 flex flex-col text-[12px]">
					<div className="mb-4 flex justify-between">
						<span className="text-text-secondary">{t("price")}</span>
						<span className="text-text-primary">
							{shortPortfolioData?.current_price}
						</span>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex justify-between">
							<span className="text-text-secondary">- {t("perDay")}</span>
							<span className="text-text-primary">
								<PriceChange value="10" growing decimals={0} />
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-text-secondary">- {t("perDay")}</span>
							<span className="text-text-primary">
								<PriceChange value="10" growing decimals={0} />
							</span>
						</div>

						<div className="flex justify-between">
							<span className="text-text-secondary">- {t("perDay")}</span>
							<span className="text-text-primary">
								<PriceChange value="10" growing decimals={0} />
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-6 border-fill-secondary border-t p-4">
				<div className="flex flex-col gap-4">
					<p className="font-600 font-namu text-[24px] text-text-primary uppercase leading-[24px]">
						{manageState === "main-info" && t("mainInfo")}
						{manageState === "asset-setup" && t("assetSetup")}
						{manageState === "fees" && t("fees")}
					</p>
					<div className="flex flex-col gap-4">
						<span className="font-droid text-base text-text-primary ">
							{t("transactionDetails")}
						</span>
					</div>
				</div>

				<div className="grid w-full grid-cols-2 grid-rows-3 gap-y-4 text-text-secondary text-xs tracking-[0.01em]">
					<span> {t("youPay")}</span>
					<span className="ml-auto">
						<span className="text-text-primary">
							0 {currentChain?.nativeCurrency.symbol}
						</span>{" "}
					</span>
					<span>{t("youReceive")}</span>
					<span className="ml-auto">
						<span className="text-text-primary">
							0 {currentChain?.nativeCurrency.symbol}
						</span>{" "}
					</span>
					<span>{t("networkFee")}</span>
					<span className="ml-auto">
						<span className="text-text-primary">
							0 {currentChain?.nativeCurrency.symbol}
						</span>{" "}
					</span>
				</div>

				<Button
					onClick={() => {
						console.log("save");
					}}
					size="L"
				>
					{t("save")}
				</Button>
			</div>
		</div>
	);
});
