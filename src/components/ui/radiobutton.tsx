import { cn } from "@/lib/utils";
import { useState } from "react";

interface RadioButtonProps {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	label?: string;
	value: string;
	name: string;
}

export const RadioButton = ({
	checked = false,
	onChange,
	disabled = false,
	className = "",
	label = "",
	value,
	name,
}: RadioButtonProps) => {
	const [isChecked, setIsChecked] = useState(checked);

	const handleRadioChange = () => {
		if (!disabled) {
			const newChecked = !isChecked;
			setIsChecked(newChecked);
			if (onChange) {
				onChange(newChecked);
			}
		}
	};

	return (
		<label
			className={cn(
				"flex w-fit items-center",
				!disabled && "cursor-pointer",
				className,
			)}
		>
			<input
				type="radio"
				checked={isChecked}
				onChange={handleRadioChange}
				disabled={disabled}
				value={value}
				name={name}
				className="sr-only"
			/>
			<div
				className={cn(
					"group relative flex h-4 w-4 items-center justify-center rounded-full transition-colors",
					disabled
						? "cursor-not-allowed bg-fill-quaternary"
						: isChecked
							? " bg-fill-brand-primary-700 "
							: " bg-white hover:bg-fill-brand-400",
				)}
			>
				{isChecked && <div className="h-2 w-2 rounded-full bg-white" />}
				{!isChecked && !disabled && (
					<div className="h-2 w-2 rounded-full bg-white opacity-0 transition-opacity duration-100 group-hover:opacity-100" />
				)}
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
