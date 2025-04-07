import type * as React from "react";

import { cn } from "@/lib/utils";

type TextArea = React.ComponentProps<"textarea"> & {
	label?: string;
	description?: string;
	required?: boolean;
};

function Textarea({
	className,
	description,
	required,
	label,
	...props
}: TextArea) {
	return (
		<div className="flex flex-col gap-2">
			{label && (
				<span
					data-required={required}
					className="mb-1 font-droid text-text-primary text-xs after:ml-0.5 after:text-negative-primary data-[required=true]:after:content-['*']"
				>
					{label}
				</span>
			)}
			<textarea
				data-slot="textarea"
				className={cn(
					"text-text-primary field-sizing-content flex min-h-16 w-full resize-none rounded-xs border border-fill-secondary bg-[position:right_8.25px_bottom_12.5px] bg-[url(/icons/markdown.svg)] bg-transparent bg-no-repeat px-4 py-4 text-sm  outline-none transition-[color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
					className,
				)}
				{...props}
			/>
			{description && (
				<span className="font-droid text-text-secondary text-xs after:text-negative-primary">
					{description}
				</span>
			)}
		</div>
	);
}

export { Textarea };
