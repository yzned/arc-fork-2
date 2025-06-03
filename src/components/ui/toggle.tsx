import { cn } from "@/lib/utils";
import { useState } from "react";

interface ToggleProps {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	label?: string;
	size?: "default" | "small";
}

export const Toggle = ({
	checked = false,
	onChange,
	disabled = false,
	className = "",
	label = "",
	size = "default",
}: ToggleProps) => {
	const [isChecked, setIsChecked] = useState(checked);

	const handleToggle = () => {
		if (!disabled) {
			const newChecked = !isChecked;
			setIsChecked(newChecked);
			if (onChange) {
				onChange(newChecked);
			}
		}
	};

	const sizeClasses = size === "small" ? "w-7 h-4" : "w-11 h-6";
	const circleSize =
		size === "small" ? "w-3 h-3 translate-x-[2px]" : "w-4 h-4 translate-x-1";
	const circleCheckedTranslate =
		size === "small" ? "translate-x-[14px]" : "translate-x-6";

	return (
		<button
			type="button"
			onClick={handleToggle}
			className={cn(
				"flex items-center text-text-tertiary transition-colors",
				isChecked && "text-text-brand-primary",
				!isChecked && "hover:text-text-primary",
				!disabled && "cursor-pointer",
				className,
			)}
		>
			<span
				aria-checked={isChecked}
				aria-disabled={disabled}
				className={cn(
					"relative inline-flex items-center rounded-full transition-colors focus:outline-none",
					sizeClasses,
					disabled
						? "cursor-not-allowed bg-fill-quaternary"
						: isChecked
							? "cursor-pointer bg-fill-brand-primary-700"
							: "cursor-pointer bg-fill-quinary transition-colors duration-200 hover:bg-fill-brand-400",
				)}
			>
				<span
					className={cn(
						"inline-block transform rounded-full bg-white transition-transform",
						circleSize,
						isChecked ? circleCheckedTranslate : "",
						disabled && "bg-fill-quinary",
					)}
				/>
			</span>
			{label && <span className="ml-2 font-droid text-[16px]">{label}</span>}
		</button>
	);
};
