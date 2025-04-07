import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xs px-4 font-droid text-[14px] leading-[130%] tracking-[0.01em] transition-colors hover:cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:*:fill-text-secondary [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				primary:
					"bg-fill-brand-primary-700 text-text-primary hover:bg-fill-brand-secondary-500 disabled:bg-fill-brand-tertiary-900 disabled:text-text-secondary",
				secondary:
					"bg-fill-accent text-text-accent hover:bg-fill-quaternary hover:text-text-primary disabled:border-[#323138] disabled:border-[2px] disabled:bg-transparent disabled:text-text-tertiary",
				tertiary:
					"bg-fill-tertiary text-text-primary hover:bg-fill-secondary disabled:border-[#323138] disabled:border-[2px] disabled:bg-transparent disabled:text-text-tertiary",
				selector:
					"bg-fill-primary-900 px-2 text-text-primary hover:bg-fill-primary-700 disabled:bg-fill-primary-900 disabled:text-text-secondary data-[active=true]:bg-fill-accent data-[active=true]:text-text-accent",
				tab: "border border-fill-secondary bg-transparent text-text-primary hover:bg-fill-tertiary data-[active=true]:bg-fill-secondary",
				ghost: "bg-transparent hover:bg-fill-tertiary",
			},
			size: {
				L: "h-[40px]",
				M: "h-[32px]",
				S: "h-[24px]",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "M",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
