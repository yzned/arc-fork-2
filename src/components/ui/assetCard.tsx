import type { ShortMultipoolData } from "@/api/types";
import LinkIcon from "@/icons/link.svg?react";
import LinkToPageIcon from "@/icons/linkToPage.svg?react";
import { shorten } from "@/lib/formatNumber";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useMediaQuery } from "@uidotdev/usehooks";
import BigNumber from "bignumber.js";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { PriceChange } from "./priceChange";

interface AssetCardProps {
	className?: string;
	asset: ShortMultipoolData;
	variant?: "default" | "special";
}

export const AssetCard: FC<AssetCardProps> = ({
	className,
	asset,
	variant = "default",
}) => {
	const { t } = useTranslation(["main"]);
	const isMobile = useMediaQuery("(max-width: 768px)");

	return (
		<div
			className={cn(
				"group h-[163px] w-full cursor-pointer rounded-[8px] border border-fill-secondary transition-colors hover:bg-fill-primary-800",
				variant === "special" && "bg-bg-floor-1",
				className,
			)}
		>
			<Link
				to="/explore/$id"
				disabled={isMobile}
				params={{ id: asset.multipool }}
				className="flex flex-col gap-4 p-2"
			>
				<div className="flex justify-between">
					<div className="flex gap-2">
						<img
							className="h-8 w-8 overflow-hidden rounded-[2px] md:h-9 md:w-9"
							src={asset.logo || "/icons/empty-token.svg"}
							alt="no-logo"
						/>
						<div className="flex flex-col ">
							<span className="-mt-1 mb-1 font-[600] font-namu text-[18px] text-text-primary leading-[100%] md:text-[24px]">
								{asset.symbol}
							</span>
							<span className="text-[12px] text-text-secondary leading-[100%]">
								{asset.name}
							</span>
						</div>
					</div>

					<Link
						to="/explore/$id"
						params={{ id: asset.multipool }}
						className="flex items-center gap-2 text-[12px] text-fill-brand-secondary-500 transition-colors hover:text-text-brand-primary"
					>
						{t("address")}
						<LinkIcon />
					</Link>
				</div>
				<div className="flex flex-col gap-1">
					<div className="flex h-[59px] gap-1">
						<div
							data-variant={variant}
							className="flex w-full flex-col justify-center rounded-[4px] bg-bg-floor-1 py-3 pl-2 transition-colors group-hover:bg-bg-floor-3 data-[variant=special]:bg-bg-floor-2"
						>
							<span className="text-[12px] text-text-secondary">
								{t("price")}
							</span>
							<span className="text-[14px] text-text-primary">
								${shorten(new BigNumber(asset.current_price))}
							</span>
						</div>
						<div
							data-variant={variant}
							className="flex w-full flex-col justify-center rounded-[4px] bg-bg-floor-1 py-3 pl-2 transition-colors group-hover:bg-bg-floor-3 data-[variant=special]:bg-bg-floor-2"
						>
							<span className="text-[12px] text-text-secondary">
								{t("tvl")}{" "}
							</span>
							<span className="text-[14px] text-text-primary">
								$
								{shorten(
									new BigNumber(
										Number(asset.total_supply) * Number(asset.current_price),
									).multipliedBy(10 ** -8),
								)}
							</span>
						</div>

						<Link
							to="/explore/$id"
							params={{ id: asset.multipool }}
							className="flex w-full items-center justify-center rounded-[4px] bg-fill-brand-primary-700 md:hidden"
						>
							<LinkToPageIcon className="text-text-primary" />
						</Link>
					</div>
					<div
						data-variant={variant}
						className="flex h-[32px] w-full items-center justify-between rounded-[4px] bg-bg-floor-1 px-2 py-2 text-[12px] transition-colors group-hover:bg-bg-floor-3 data-[variant=special]:bg-bg-floor-2"
					>
						<span className="text-text-secondary ">{t("24HChange")}</span>
						<div className="flex items-center gap-2">
							<span className="text-text-primary ">
								{shorten(new BigNumber(asset.current_price))}
							</span>
							<PriceChange
								value={asset?.change_24h || "0"}
								growing={Number(asset?.change_24h) > 0}
								className="text-[12px]"
							/>
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};
