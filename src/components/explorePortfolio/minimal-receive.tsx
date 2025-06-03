import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useMinimumReceive } from "@/hooks/queries/useMinimumReceive";
import { useNetworkFee } from "@/hooks/queries/useNetworkFee";
import { useCurrentPortfolio } from "@/hooks/use-current-portfolio";
import { shrinkNumber } from "@/lib/utils";
import { t } from "i18next";
import { observer } from "mobx-react-lite";
import { useBalance } from "wagmi";

export const MinimalReceive = observer(() => {
	const { data } = useMinimumReceive();
	const { data: balance } = useBalance();
	const { rightSectionState, selectedAsset } = useExplorePortfolio();
	const networkFee = useNetworkFee();
	const currentPortfolio = useCurrentPortfolio();

	if (!data) {
		return (
			<div className="flex flex-col gap-2 text-[12px]">
				<div className="flex w-full items-center justify-between leading-[14px]">
					<span className="font-droid text-text-secondary">
						{t("tokensReceive")}
					</span>
					<span className="">
						{0}{" "}
						{rightSectionState === "mint"
							? currentPortfolio.stats.symbol
							: selectedAsset?.symbol}
					</span>
				</div>
				<div className="flex w-full items-center justify-between leading-[14px]">
					<span className="font-droid text-text-secondary">
						{t("transactionFee")}
					</span>
					<span className="">0 - </span>
				</div>
				<div className="flex w-full items-center justify-between leading-[14px]">
					<span className="font-droid text-text-secondary">
						{t("minimumReceive")}
					</span>
					<span className="">
						0{" "}
						{rightSectionState === "mint"
							? currentPortfolio.stats.symbol
							: selectedAsset?.symbol}
					</span>
				</div>
			</div>
		);
	}

	const { tokensReceive, minimumReceive } = data;

	return (
		<div className="flex flex-col gap-2 text-[12px]">
			<div className="flex w-full items-center justify-between leading-[14px]">
				<span className="font-droid text-text-secondary">
					{t("tokensReceive")}
				</span>
				<span className="">
					{shrinkNumber(Number(tokensReceive || 0), 4)}{" "}
					{rightSectionState === "mint"
						? currentPortfolio.stats.symbol
						: selectedAsset?.symbol}
				</span>
			</div>
			<div className="flex w-full items-center justify-between leading-[14px]">
				<span className="font-droid text-text-secondary">
					{t("transactionFee")}
				</span>
				<span className="">
					{shrinkNumber(Number(networkFee) || 0, 4)} {balance?.symbol || "ETH"}
				</span>
			</div>
			<div className="flex w-full items-center justify-between leading-[14px]">
				<span className="font-droid text-text-secondary">
					{t("minimumReceive")}
				</span>
				<span className="">
					{shrinkNumber(Number(minimumReceive || 0), 4)}{" "}
					{rightSectionState === "mint"
						? currentPortfolio.stats.symbol
						: selectedAsset?.symbol}
				</span>
			</div>
		</div>
	);
});
