import { cn } from "@/lib/utils";
import CheckMark from "../../icons/checkMark.svg?react";

interface CheckboxProps {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	label?: string;
}

export const Checkbox = ({
	checked = false,
	onChange,
	disabled = false,
	className = "",
	label = "",
}: CheckboxProps) => {
	const handleCheckboxChange = () => {
		if (!disabled) {
			const newChecked = !checked;
			if (onChange) {
				onChange(newChecked);
			}
		}
	};

	return (
		<label
			className={cn(
				"flex w-fit items-center ",
				!disabled && "cursor-pointer",
				className,
			)}
		>
			<input
				type="checkbox"
				checked={checked}
				onChange={handleCheckboxChange}
				disabled={disabled}
				className="sr-only"
			/>
			<div
				className={cn(
					"relative flex h-4 w-4 items-center justify-center rounded-[4px] transition-colors",
					disabled
						? "cursor-not-allowed bg-fill-quaternary"
						: checked
							? "bg-fill-brand-primary-700 bg-fill-brand-primary-700 "
							: "bg-fill-quinary bg-white hover:bg-fill-brand-400 ",
				)}
			>
				{checked && <CheckMark />}
			</div>
			{label && (
				<span
					className={cn(
						"ml-2 font-droid text-[16px] text-text-primary",
						disabled && "text-text-quartinary",
					)}
				>
					{label}
				</span>
			)}
		</label>
	);
};
