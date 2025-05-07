import { useToast } from "@/hooks/use-toast";
import CopyIcon from "@/icons/copy.svg?react";
import ErrorIcon from "@/icons/error.svg?react";
import InfoIcon from "@/icons/info.svg?react";
import XmarkIcon from "@/icons/smallX.svg?react";
import SuccessIcon from "@/icons/success.svg?react";
import { cn } from "@/lib/utils";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { type VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Viewport>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={cn(
			"fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]",
			className,
		)}
		{...props}
	/>
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
	"group data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full pointer-events-auto relative flex min-h-[88px] w-full min-w-[300px] items-center justify-between overflow-hidden rounded-[4px] p-4 pr-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-out data-[state=open]:animate-in data-[swipe=end]:animate-out data-[swipe=move]:transition-none dark:border-neutral-800",
	{
		variants: {
			variant: {
				default:
					"border bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50",
				success:
					"bg-[linear-gradient(90deg,rgba(18,166,16,0.3)_0%,rgba(39,39,39,0)_100%)] bg-bg-floor-1",
				error:
					"bg-[linear-gradient(90deg,rgba(209,15,15,0.3)_0%,rgba(39,39,39,0)_100%)] bg-bg-floor-1",

				errorWithCopy:
					"bg-[linear-gradient(90deg,rgba(209,15,15,0.3)_0%,rgba(39,39,39,0)_100%)] bg-bg-floor-1",
				info: "bg-[linear-gradient(90deg,rgba(1,72,254,0.3)_0%,rgba(39,39,39,0)_100%)] bg-bg-floor-1",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const ToastIcon = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
		VariantProps<typeof toastVariants>
>(({ className, variant }) => {
	if (variant === "default") {
		return <></>;
	}
	if (variant === "success") {
		return <SuccessIcon className={clsx(className, "")} />;
	}

	if (variant === "error") {
		return <ErrorIcon className={clsx(className, "")} />;
	}

	if (variant === "errorWithCopy") {
		return <ErrorIcon className={clsx(className, "")} />;
	}

	if (variant === "info") {
		return <InfoIcon className={clsx(className, "")} />;
	}
});

const Toast = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
		VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
	return (
		<ToastPrimitives.Root
			ref={ref}
			className={cn(toastVariants({ variant }), className)}
			{...props}
		/>
	);
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastCopy = ({
	text,
	href,
	toastAction = () => {
		if (href) {
			navigator.clipboard.writeText(href);
		}
	},
}: { text: string; href?: string; toastAction?: () => void }) => (
	<button
		onClick={toastAction}
		type="button"
		className="group mb-2 flex flex-row gap-2"
	>
		<div className="flex size-6 flex-col items-center justify-center rounded-full bg-[#888787]">
			<CopyIcon className="size-[10px]" />
		</div>
		<span className="font-droid font-medium text-[#888787] text-base leading-normal duration-100 ease-in-out hover:text-white">
			{text}
		</span>
	</button>
);

const ToastAction = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Action>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Action
		ref={ref}
		className={cn(
			"inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-transparent px-3 font-medium text-sm transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-neutral-100/40 group-[.destructive]:focus:ring-red-500 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-neutral-50 dark:border-neutral-800 dark:group-[.destructive]:border-neutral-800/40 dark:focus:ring-neutral-300 dark:group-[.destructive]:focus:ring-red-900 dark:hover:bg-neutral-800 dark:group-[.destructive]:hover:border-red-900/30 dark:group-[.destructive]:hover:bg-red-900 dark:group-[.destructive]:hover:text-neutral-50",
			className,
		)}
		{...props}
	/>
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Close>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Close
		ref={ref}
		className={cn(
			"mx-0 my-auto cursor-pointer rounded-md focus:outline-none focus:ring-1",
			className,
		)}
		toast-close=""
		{...props}
	>
		<XmarkIcon className="size-[21px] text-fill-tertiary" />
	</ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Title>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Title
		ref={ref}
		className={cn(
			"font-droid font-medium text-[14px] text-white leading-normal sm:text-[16px] [&+div]:text-xs ",
			className,
		)}
		{...props}
	/>
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
	React.ElementRef<typeof ToastPrimitives.Description>,
	React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
	<ToastPrimitives.Description
		ref={ref}
		className={cn(
			"mb-2 font-droid font-medium text-[14px] text-text-secondary",
			className,
		)}
		{...props}
	/>
));

const ToastTimeline = ({
	duration,
	isPaused,
	variant,
}: {
	duration: number;
	isPaused: boolean;
	variant?: "default" | "error" | "success" | "errorWithCopy" | "info" | null;
}) => {
	return (
		<div>
			<div
				data-variant={variant}
				className={cn(
					"absolute bottom-2 left-4 h-[3px] w-[90%] rounded data-[variant=info]:bg-fill-brand-tertiary-900 data-[variant=success]:bg-positive-tertiary",
				)}
			/>

			<div
				data-variant={variant}
				className={cn(
					"toast-progress-animation absolute bottom-2 left-4 h-[3px] rounded data-[variant=info]:bg-text-brand-primary data-[variant=success]:bg-positive-primary ",
				)}
				style={{
					animationDuration: `${duration}ms`,
					animationPlayState: isPaused ? "paused" : "running",
				}}
			/>
		</div>
	);
};

ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
	type ToastProps,
	type ToastActionElement,
	ToastProvider,
	ToastViewport,
	Toast,
	ToastTitle,
	ToastDescription,
	ToastClose,
	ToastAction,
	ToastIcon,
	ToastCopy,
	ToastTimeline,
};

export function Toaster() {
	const { toasts, isPaused, setIsPaused } = useToast();

	React.useEffect(() => {
		const handleFocus = () => {
			setIsPaused(false);
		};

		const handleBlur = () => {
			setIsPaused(true);
		};

		window.addEventListener("focus", handleFocus);
		window.addEventListener("blur", handleBlur);

		return () => {
			window.removeEventListener("focus", handleFocus);
			window.removeEventListener("blur", handleBlur);
		};
	}, [setIsPaused]);

	return (
		<ToastProvider>
			{toasts.map(
				({
					id,
					title,
					description,
					action,
					copy,
					href,
					toastAction,
					duration = 5000,
					withTimeline,
					...props
				}) => (
					<Toast
						key={id}
						duration={duration}
						{...props}
						onMouseEnter={() => setIsPaused(true)}
						onMouseLeave={() => setIsPaused(false)}
					>
						<ToastIcon className="mr-4 size-12" variant={props.variant} />
						<div className="grid w-full gap-2">
							{title && <ToastTitle>{title}</ToastTitle>}

							{description && (
								<ToastDescription>
									{props.variant === "errorWithCopy" && (
										<p className="mb-2 text-[14px]">
											To solve problems, contact us <br />
											via{" "}
											<a
												href={"/#"}
												target="_blank"
												rel="noreferrer"
												className="relative text-brand"
											>
												Discord
												<div className="absolute left-0 h-[1px] w-[56px] bg-brand" />
											</a>{" "}
											and send the error text
										</p>
									)}
									{props.variant !== "errorWithCopy" &&
										description &&
										description}
								</ToastDescription>
							)}

							{copy && (
								<ToastCopy text={copy} href={href} toastAction={toastAction} />
							)}
						</div>
						{action}
						<ToastClose />

						{withTimeline && (
							<ToastTimeline
								duration={duration}
								isPaused={isPaused}
								variant={props.variant}
							/>
						)}
					</Toast>
				),
			)}
			<ToastViewport />
		</ToastProvider>
	);
}
