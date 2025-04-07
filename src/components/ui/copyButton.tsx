import { cn } from "@/lib/utils";
import { type ReactNode, useState } from "react";
import CheckIcon from "../../icons/checkMark.svg?react";
import CopyIcon from "../../icons/copy.svg?react";

export const CopyButton = ({
	copyValue,
	children,
	isHidenRightIcon = true,
}: { copyValue: string; children: ReactNode; isHidenRightIcon?: boolean }) => {
	const [isHovered, setHovered] = useState<string | null>(null);

	const [isCopiedData, setIsCopiedData] = useState<{
		value: string;
		isCopied: boolean;
	} | null>(null);

	const handleCopy = (value: string) => {
		navigator.clipboard
			.writeText(value)
			.then(() => {
				setIsCopiedData({ value, isCopied: true });
				setTimeout(() => setIsCopiedData(null), 2000);
			})
			.catch((err) => console.error("Failed to copy : ", err));
	};

	if (isHidenRightIcon) {
		return (
			<button
				type="button"
				onClick={() => handleCopy(copyValue)}
				onMouseEnter={() => setHovered(copyValue)}
				onMouseLeave={() => setHovered(null)}
				className="group flex cursor-pointer items-center gap-2 text-fill-brand-secondary-500 transition-colors hover:text-fill-brand-primary-700"
			>
				<span>{children}</span>
				<CopyIcon
					className={cn(
						"mb-1 h-[16px] w-[14px]",

						!isCopiedData?.isCopied && isHovered === copyValue
							? "block"
							: "hidden",
					)}
				/>
				<CheckIcon
					className={cn(
						"h-[10px] w-[14px] text-fill-brand-secondary-500 group-hover:text-fill-brand-primary-700 ",

						isCopiedData?.isCopied && copyValue === isCopiedData.value
							? "block"
							: "hidden",
					)}
				/>
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={() => handleCopy(copyValue)}
			className="group flex cursor-pointer items-center gap-2 text-fill-brand-secondary-500 transition-colors hover:text-fill-brand-primary-700"
		>
			<span>{children}</span>
			<CopyIcon
				className={cn(
					"mb-1 h-[16px] w-[14px]",
					!isCopiedData?.isCopied ? "block" : "hidden",
				)}
			/>
			<CheckIcon
				className={cn(
					"h-[10px] w-[14px] text-fill-brand-secondary-500 group-hover:text-fill-brand-primary-700 ",
					isCopiedData?.isCopied ? "block" : "hidden",
				)}
			/>
		</button>
	);
};
