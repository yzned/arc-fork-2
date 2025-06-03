import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useCurrentPortfolio } from "@/hooks/use-current-portfolio";
import { useManagePortfolio } from "@/hooks/use-manage-portfolio";
import { formatAddress, shrinkNumber } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { PriceChange } from "../ui/priceChange";
import { useMetadataChain } from "@/hooks/use-metadata-chain";
import { useAccount } from "wagmi";

export const RightSection = observer(() => {
	const { t } = useTranslation(["main"]);

	const currentPortfolio = useCurrentPortfolio();

	if (!currentPortfolio.address) {
		throw new Error("Portfolio not found");
	}
	const { changeFees, changeShares, currentNetworkFee } = useManagePortfolio();
	// const { data: multipoolData, isLoading: isLoadingMultipoolData } = useReadContract({
	// 	address: currentPortfolio.address as Address,
	// 	abi: multipoolABI,
	// 	functionName: ""
	// })
	// })

	const {
		manageState,
		managementFee,
		managementFeeRecepient,
		multipoolSupplyPriceData,
	} = useExplorePortfolio();

	const { address } = useAccount();
	const { chain } = useMetadataChain();
	return (
		<div className="sticky top-[72px] flex h-[calc(100svh-72px)] flex-col justify-between bg-bg-floor-2">
			<div className="p-4">
				<div className="flex flex-row items-center gap-4">
					<Avatar className="size-10">
						<AvatarImage
							src={currentPortfolio.logo ?? "/icons/empty-token.svg"}
						/>
						<AvatarFallback>U</AvatarFallback>
					</Avatar>
					<div className="flex flex-col gap-2">
						<span className="font-namu font-semibold text-sm text-text-primary uppercase leading-[12px] tracking-[0.015em]">
							{currentPortfolio.stats.name
								? currentPortfolio.stats.name
								: t("portfolioName")}
						</span>
						<span className="font-namu font-semibold text-sm text-text-tertiary uppercase leading-[12px] tracking-[0.015em]">
							{currentPortfolio.stats.symbol
								? currentPortfolio.stats.symbol
								: t("symbol")}
						</span>
					</div>
				</div>

				<div className="mt-8 flex flex-col gap-4 border-fill-secondary border-b pb-4 text-[12px]">
					<div className="flex justify-between">
						<span className="text-text-secondary">{t("initialLiquidity")}</span>
						<span className="text-text-primary">
							{shrinkNumber(multipoolSupplyPriceData?.tvl.toNumber())}{" "}
							{chain.nativeCurrency.symbol}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-text-secondary">{t("managementFee")}</span>
						<span className="text-text-primary">
							{managementFee} {chain.nativeCurrency.symbol}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-text-secondary">
							{t("managementFeeReceiver")}
						</span>
						<span className="text-text-primary">
							{formatAddress(managementFeeRecepient)}
						</span>
					</div>
				</div>

				<div className="mt-4 flex flex-col text-[12px]">
					<div className="mb-4 flex justify-between">
						<span className="text-text-secondary">{t("price")}</span>
						<span className="text-text-primary">
							{/* {currentPortfolio.stats.currentPrice} ETH */}
						</span>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex justify-between">
							<span className="text-text-secondary">- {t("perDay")}</span>
							<span className="text-text-primary">
								<PriceChange
									value={
										currentPortfolio.relativePriceChange?.isEqualTo(0)
											? "0"
											: shrinkNumber(
													currentPortfolio.relativePriceChange?.toString() ||
														"0",
													4,
												)
									}
									growing={
										!currentPortfolio.relativePriceChange?.isLessThan(0) ||
										false
									}
								/>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-6 border-fill-secondary border-t p-4">
				<div className="flex flex-col gap-4">
					<p className="font-600 font-namu text-[24px] text-text-primary uppercase leading-[24px]">
						{/* {manageState === "main-info" && t("mainInfo")} */}
						{manageState === "asset-setup" && t("assetSetup")}
						{manageState === "fees" && t("fees")}
					</p>
					<div className="flex flex-col gap-4">
						<span className="font-droid text-base text-text-primary ">
							{t("transactionDetails")}
						</span>
					</div>
				</div>

				<div className="grid w-full grid-cols-2 grid-rows-1 gap-y-4 text-text-secondary text-xs tracking-[0.01em]">
					<span>{t("networkFee")}</span>
					<span className="ml-auto">
						<span className="text-text-primary">
							{shrinkNumber(currentNetworkFee)} {chain.nativeCurrency.symbol}
						</span>{" "}
					</span>
				</div>

				<Button
					disabled={managementFeeRecepient !== address}
					onClick={() => {
						if (manageState === "asset-setup") {
							changeShares();
						}
						if (manageState === "fees") {
							changeFees();
						}
					}}
					size="L"
				>
					{t("save")}
				</Button>
			</div>
		</div>
	);
});
