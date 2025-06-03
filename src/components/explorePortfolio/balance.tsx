import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useCurrentPortfolio } from "@/hooks/use-current-portfolio";
import ERC20 from "@/lib/abi/ERC20";
import { shrinkNumber } from "@/lib/utils";
import BigNumber from "bignumber.js";
import { t } from "i18next";
import { observer } from "mobx-react-lite";
import type { Address } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";

export const BalanceSpan = observer(() => {
	const { address: multipoolAddress, decimals: multipooldecimals } =
		useCurrentPortfolio();
	const { rightSectionState, selectedAsset } = useExplorePortfolio();
	const { address } = useAccount();

	if (!address) {
		return <span className="font-droid text-[12px]">{t("balance")} 0</span>;
	}

	const selectedAssetAddress =
		rightSectionState === "mint" ? selectedAsset?.address : multipoolAddress;
	const decimals =
		rightSectionState === "mint" ? selectedAsset?.decimals : multipooldecimals;

	if (!selectedAssetAddress || !decimals) {
		return <span className="font-droid text-[12px]">{t("balance")} 0</span>;
	}

	if (selectedAssetAddress === "0x0000000000000000000000000000000000000000") {
		return <BalanceSpanInnerNative />;
	}

	return (
		<BalanceSpanInner
			address={address}
			selectedAssetAddress={selectedAssetAddress}
			decimals={decimals}
		/>
	);
});

const BalanceSpanInner = observer(
	({
		address,
		selectedAssetAddress,
		decimals,
	}: { address: Address; selectedAssetAddress: Address; decimals: number }) => {
		const { data: balance } = useReadContract({
			abi: ERC20,
			functionName: "balanceOf",
			address: selectedAssetAddress,
			args: [address],
		});

		const powDecimals = new BigNumber(10).pow(decimals);
		const hrBalance = new BigNumber(balance?.toString() || 0)
			.dividedBy(powDecimals)
			.toString();

		return (
			<span className="font-droid text-[12px]">
				{t("balance")} {shrinkNumber(hrBalance)}
			</span>
		);
	},
);

const BalanceSpanInnerNative = observer(() => {
	const result = useBalance();
	console.log("BalanceSpanInnerNative", "data", result);

	if (!result.data) {
		return <span className="font-droid text-[12px]">{t("balance")} 0</span>;
	}

	const { value, decimals, symbol } = result.data;

	const hrBalance = new BigNumber(value.toString())
		.dividedBy(new BigNumber(10).pow(decimals))
		.toString();

	return (
		<span className="font-droid text-[12px]">
			{t("balance")} {shrinkNumber(hrBalance)} {symbol}
		</span>
	);
});
