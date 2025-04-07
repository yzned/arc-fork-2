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
	decimals,
	value,
	className,
}) => {
	return (
		<div
			className={cn(
				"flex items-center gap-1 text-[14px] ",
				growing && "text-positive-primary",
				!growing && "text-negative-primary",
				className,
			)}
		>
			<span>
				{unit === "dollars" && "$"}
				{value}
				{unit === "percents" && "%"}
			</span>
			<ArrowIcon className={cn("mb-[2px]", !growing && "rotate-180")} />
		</div>
	);
};
