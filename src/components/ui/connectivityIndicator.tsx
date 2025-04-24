import { cn } from "@/lib/utils";
import type { FC } from "react";

export type ConnectivityIndicatorProps = {
	value: number;
	thresholds?: number[];
	unit?: string;
	className?: string;
};

export const ConnectivityIndicator: FC<ConnectivityIndicatorProps> = ({
	value,
	thresholds = [100, 200],
	unit = "ms",
	className,
}) => {
	const status =
		value <= thresholds[0] ? "good" : value <= thresholds[1] ? "medium" : "bad";
	return (
		<div
			data-connection={status}
			className={cn(
				"w-fit rounded-[8px] border-[2px] px-2 py-[7px] leading-[14px] data-[connection=bad]:border-[#ED648633] data-[connection=good]:border-[#86CE8333] data-[connection=medium]:border-[#ECCD7333] data-[connection=bad]:text-accent-red data-[connection=good]:text-accent-green data-[connection=medium]:text-accent-yellow",
				className,
			)}
		>
			{value}
			{unit}
		</div>
	);
};
