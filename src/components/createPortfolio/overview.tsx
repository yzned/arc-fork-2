import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import { observer } from "mobx-react-lite";

import { useAccountStore } from "@/contexts/AccountContext";
import { useCreatePortfolio as useCreatePortfolioContext } from "@/contexts/CreatePortfolioContext";
import { useCreatePortfolio } from "@/hooks/mutations/useCreatePortfolio";
import ERC20 from "@/lib/abi/ERC20";
import { shorten } from "@/lib/formatNumber";
import { formatAddress, toBase64 } from "@/lib/utils";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	type Address,
	encodeFunctionData,
	formatUnits,
	maxUint256,
	zeroAddress,
} from "viem";
import { useEstimateGas } from "wagmi";
import { CreateModal } from "./createModal";

export const Overview = observer(({ className }: { className?: string }) => {
	const { t } = useTranslation(["main"]);
	const { currentChain } = useAccountStore();

	const {
		tokens,
		name,
		initialLiquidityAmount,
		initialLiquidityToken,
		initialSharePrice,
		managementFee,
		managementFeeRecepient,
		dollarPrice,
		symbol,
		networkFee,
		setIsOpenCreateModal,
		logo,
		setNetworkFee,
	} = useCreatePortfolioContext();

	const { createMultipoolGasEstimate } = useCreatePortfolio();

	const { data: approveGasEstimate } = useEstimateGas({
		to: tokens[0]?.address || zeroAddress,

		query: {
			enabled: !!tokens[0]?.address,
		},

		data: encodeFunctionData({
			abi: ERC20,
			functionName: "approve",
			args: [
				(currentChain?.routerAddress as Address) || zeroAddress,
				BigInt(maxUint256),
			],
		}),
	});

	const totalGasWei =
		(approveGasEstimate || 0n) + (createMultipoolGasEstimate || 0n);

	const currentNetworkFee = formatUnits(
		totalGasWei,
		currentChain?.nativeCurrency?.decimals || 18,
	);

	const [logoBase64, setLogoBase64] = useState<string>();

	useEffect(() => {
		setNetworkFee(currentNetworkFee);
	}, [currentNetworkFee]);

	useEffect(() => {
		async function convertLogoToBase() {
			if (logo) {
				const base64Logo = await toBase64(logo);
				setLogoBase64(base64Logo);
			}
			if (!logo) {
				setLogoBase64("");
			}
		}
		convertLogoToBase();
	}, [logo]);

	return (
		<div className="h-full bg-bg-floor-2">
			<CreateModal />
			<div
				className={clsx(
					className,
					"sticky top-[73px] flex flex-col gap-[102px] bg-bg-floor-2 p-4",
				)}
			>
				<div className="flex w-full flex-col gap-8">
					<div className="flex flex-row items-center gap-4">
						<Avatar className="size-10">
							<AvatarImage src={logoBase64 || "/icons/empty-token.svg"} />
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
									{initialLiquidityAmount || "0"}{" "}
									{initialLiquidityToken?.symbol}
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
												src={item.logo || "/icons/empty-token.svg"}
												className="h-4 w-4 overflow-hidden rounded-full"
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
									{initialLiquidityAmount || "0"}{" "}
									{initialLiquidityToken?.symbol}
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
								<span className="whitespace-nowrap text-text-primary">
									{shorten(new BigNumber(networkFee || 0))}{" "}
									{currentChain?.nativeCurrency.symbol}
								</span>
							</span>
						</div>
					</div>
					<Button
						onClick={() => setIsOpenCreateModal(true)}
						size="L"
						// disabled={isDisabled}
					>
						{t("create")}
					</Button>
				</div>
			</div>
		</div>
	);
});
