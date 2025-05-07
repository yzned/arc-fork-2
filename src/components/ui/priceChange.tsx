import ArrowIcon from "@/icons/arrow.svg?react";
import { cn } from "@/lib/utils";
import type { FC } from "react";

interface PriceChangeProps {
	growing: boolean;
	unit?: "percents" | "dollars";
	decimals?: number;
	value: string;
	className?: string;
}

export const PriceChange: FC<PriceChangeProps> = ({
	growing,
	unit = "percents",
	decimals = 2,
	value,
	className,
}) => {
	return (
		<div
			className={cn(
				"flex items-center gap-1 text-[14px]",
				value === "0" && "text-text-secondary",
				value !== "0" && growing && "text-positive-primary",
				value !== "0" && !growing && "text-negative-primary",
				className,
			)}
		>
			<span>
				{unit === "dollars" && "$"}
				{Number(value).toFixed(decimals)}
				{unit === "percents" && "%"}
			</span>
			{value !== "0" && (
				<ArrowIcon className={cn("mb-[2px]", !growing && "rotate-180")} />
			)}
		</div>
	);
};
