import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon } from "lucide-react";
import ChevronIcon from "../../icons/chevron.svg?react";

import { chainsMetadata } from "@/lib/constants";
import type { ChainId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import type * as React from "react";
import { useChainId, useSwitchChain } from "wagmi";

const Select = observer(
	({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) => {
		return <SelectPrimitive.Root data-slot="select" {...props} />;
	},
);

function SelectValue({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
	return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			className={cn(
				"group flex h-full w-full items-center justify-between gap-2 whitespace-nowrap bg-transparent px-6 py-2 text-sm text-text-primary outline-none transition-colors ",
				//arb
				"data-[chain=42161]:bg-[color-mix(in_srgb,var(--bg-42161),black_20%)] data-[chain=42161]:hover:bg-[var(--bg-42161)]",
				//arb sep
				"data-[chain=421614]:bg-[color-mix(in_srgb,var(--bg-421614),black_20%)] data-[chain=421614]:hover:bg-[var(--bg-42161)]",
				//monad
				"data-[chain=10143]:bg-[color-mix(in_srgb,var(--bg-10143),black_20%)] data-[chain=10143]:hover:bg-[var(--bg-10143)]",

				// "data-[chain=aurora]:bg-[color-mix(in_srgb,var(--bg-aurora),black_20%)] data-[chain=aurora]:hover:bg-[var(--bg-aurora)]",
				// "data-[chain=avalanche]:bg-[color-mix(in_srgb,var(--bg-avalanche),black_20%)] data-[chain=avalanche]:hover:bg-[var(--bg-avalanche)]",
				// "data-[chain=base]:bg-[color-mix(in_srgb,var(--bg-base),black_20%)] data-[chain=base]:hover:bg-[var(--bg-base)]",
				// "data-[chain=bsc]:bg-[color-mix(in_srgb,var(--bg-bsc),black_20%)] data-[chain=bsc]:hover:bg-[var(--bg-bsc)]",
				// "data-[chain=ethereum]:bg-[color-mix(in_srgb,var(--bg-ethereum),black_20%)] data-[chain=ethereum]:hover:bg-[var(--bg-ethereum)]",
				// "data-[chain=gnosis]:bg-[color-mix(in_srgb,var(--bg-gnosis),black_20%)] data-[chain=gnosis]:hover:bg-[var(--bg-gnosis)]",
				// "data-[chain=kaia]:bg-[color-mix(in_srgb,var(--bg-kaia),black_20%)] data-[chain=kaia]:text-text-accent data-[chain=kaia]:hover:bg-[var(--bg-kaia)]",
				// "data-[chain=optimism]:bg-[color-mix(in_srgb,var(--bg-optimism),black_20%)] data-[chain=optimism]:hover:bg-[var(--bg-optimism)]",
				// "data-[chain=polygon]:bg-[color-mix(in_srgb,var(--bg-polygon),black_20%)] data-[chain=polygon]:hover:bg-[var(--bg-polygon)]",
				// "data-[chain=fantom]:bg-[color-mix(in_srgb,var(--bg-fantom),black_20%)] data-[chain=fantom]:hover:bg-[var(--bg-fantom)]",
				// "data-[chain=zksync]:bg-[color-mix(in_srgb,var(--bg-zksync),black_20%)] data-[chain=zksync]:hover:bg-[var(--bg-zksync)]",
				className,
			)}
			{...props}
		>
			<div className="flex flex-row items-center gap-2">{children}</div>

			<SelectPrimitive.Icon asChild>
				<ChevronIcon className="size-3 transition-transform duration-200 group-data-[state=closed]:rotate-180" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}

function SelectContent({
	className,
	children,
	position = "popper",
	...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				data-slot="select-content"
				className={cn(
					" data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 overflow-hidden border border-fill-secondary bg-bg-floor-0 data-[state=closed]:animate-out data-[state=open]:animate-in",
					position === "popper" &&
						"data-[side=left]:-translate-x-1 data-[side=top]:-translate-y-1 data-[side=right]:translate-x-1",
					className,
				)}
				avoidCollisions={false}
				position={position}
				{...props}
			>
				<SelectPrimitive.Viewport
					className={cn(
						"p-2",
						position === "popper" &&
							"flex h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1 flex-col gap-1",
					)}
				>
					{children}
				</SelectPrimitive.Viewport>
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
}

function SelectItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			data-slot="select-item"
			className={cn(
				"cursor-pointer rounded-[4px] border-none bg-bg-floor-2 px-3 py-2 font-droid font-normal text-sm text-text-primary outline-none transition-colors hover:bg-bg-floor-3",
				className,
			)}
			{...props}
		>
			<span className="absolute right-4 mt-[6px] flex size-3.5 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<CheckIcon className="size-4" />
				</SelectPrimitive.ItemIndicator>
			</span>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}

export const ChainsColors = chainsMetadata.reduce(
	(acc: Record<string, string>, chain) => {
		if (chain.color) {
			acc[`--bg-${chain.id}`] = chain.color;
		}
		return acc;
	},
	{} as Record<string, string>,
);

export const ChainSelector = observer(() => {
	const navigate = useNavigate();

	const { chains, switchChain } = useSwitchChain();
	const chainId = useChainId();

	return (
		<Select
			value={chainId.toString()}
			onValueChange={(value) => {
				const newChain =
					chains.find((chain) => chain.id.toString() === value) || chains[0];

				switchChain({ chainId: newChain.id as ChainId });
				navigate({ to: "/" });
			}}
		>
			<SelectTrigger
				className="w-fit min-w-[220px] cursor-pointer border-fill-secondary border-l"
				data-chain={chainId}
				style={ChainsColors}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{chainsMetadata.map((chain) => {
					return (
						<SelectItem value={chain.id.toString()} key={chain.id}>
							<div className="flex flex-row items-center gap-2">
								<img src={chain.logo} alt={`${chain.name} logo`} />
								<span className="font-droid font-normal text-sm tracking-[0.01em]">
									{chain.name}
								</span>
							</div>
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
});
