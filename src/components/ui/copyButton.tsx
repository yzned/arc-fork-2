import { type ReactNode, useState } from "react";
import CheckIcon from "../../icons/checkMark.svg?react";
import CopyIcon from "../../icons/copy.svg?react";

export const CopyButton = ({
	copyValue,
	children,
}: { copyValue: string; children: ReactNode; isHidenRightIcon?: boolean }) => {
	const [isCopiedData, setIsCopiedData] = useState<{
		value: string;
		isCopied: boolean;
	}>({
		value: "",
		isCopied: false,
	});

	const handleCopy = (value: string) => {
		navigator.clipboard
			.writeText(value)
			.then(() => {
				setIsCopiedData({ value, isCopied: true });
				setTimeout(
					() =>
						setIsCopiedData({
							value: "",
							isCopied: false,
						}),
					2000,
				);
			})
			.catch((err) => console.error("Failed to copy : ", err));
	};

	return (
		<button
			data-copied={isCopiedData.isCopied}
			type="button"
			onClick={() => handleCopy(copyValue)}
			className="group relative flex cursor-pointer items-center gap-2 text-fill-brand-secondary-500 transition-colors *:transition-all hover:text-fill-brand-primary-700"
		>
			<span>{children}</span>
			<CopyIcon className="-right-4 absolute mb-1 h-[16px] w-[14px] opacity-0 group-hover:opacity-100 group-data-[copied=true]:opacity-0" />
			<CheckIcon className="-right-4 absolute h-[10px] w-[14px] text-fill-brand-secondary-500 opacity-0 group-hover:text-fill-brand-primary-700 group-data-[copied=true]:opacity-100" />
		</button>
	);
};
