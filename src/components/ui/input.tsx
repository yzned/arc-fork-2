import * as React from "react";

import { cn } from "@/lib/utils";
import type { HTMLInputTypeAttribute } from "react";

// allow providing label span component as children of input
type InputProps = Omit<React.ComponentProps<"input">, "type"> & {
	type?: HTMLInputTypeAttribute | "token";
	children?: React.ReactNode;
	className?: string;
	label?: string;
	leftDescription?: string;
	rightDescription?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	validationMessage?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ children, className, type, label, required, ...props }, ref) => {
		return (
			<div className="group flex w-full flex-col gap-3">
				{label && (
					<span
						data-required={required}
						className="font-droid text-text-primary text-xs after:ml-0.5 after:text-negative-primary data-[required=true]:after:content-['*']"
					>
						{label}
					</span>
				)}
				<input
					type={type}
					data-disabled={props.disabled}
					className={cn(
						"flex h-[29px] w-full border-0 border-fill-secondary border-b bg-transparent pb-2 pl-2 font-droid text-base text-text-primary transition-colors placeholder:text-text-secondary hover:border-b-fill-quaternary focus:border-b-fill-brand-primary-700 focus:placeholder:opacity-0 disabled:cursor-not-allowed disabled:border-b-fill-secondary disabled:text-text-quartinary data-[invalid=true]:border-b-negative-primary data-[disabled=true]:placeholder:text-text-quinary",
						className,
					)}
					ref={ref}
					{...props}
				/>

				{children}
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input };
