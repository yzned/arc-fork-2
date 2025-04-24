import { Input } from "@/components/ui/Input";
import { useAccountStore } from "@/contexts/AccountContext";
import CheckIcon from "@/icons/checkMark.svg?react";
import { shorten } from "@/lib/formatNumber";
import type { ShortPoolData, Token } from "@/lib/types";
import { cn } from "@/lib/utils";
import BigNumber from "bignumber.js";
import { Loader2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import FilterIcon from "/src/icons/filter.svg?react";
import SearchIcon from "/src/icons/search.svg?react";
import SmallXIcon from "/src/icons/smallX.svg?react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";

interface FindAssetProps<T, S> {
	data: T[];
	filters?: string[];
	onSelectAsset?: (asset: T) => void;
	className?: string;
	defaultActiveItem: T;
	listClassName?: string;
	additionalActiveItemInfo?: S[];
	variant?: "basic" | "with-additional-data";
}

interface FindAssetItemProps<T extends Token, S extends ShortPoolData> {
	item: T;
	currentAsset: T;
	setCurrentAsset: Dispatch<SetStateAction<T>>;
	onSelectAsset?: (asset: T) => void;
	variant?: "basic" | "with-additional-data";
	additionalActiveItemInfo?: S[];
}

export function FindAsset<T extends Token, S extends ShortPoolData>({
	data,
	filters,
	onSelectAsset,
	className,
	additionalActiveItemInfo,
	listClassName,
	defaultActiveItem,
	variant = "basic",
}: FindAssetProps<T, S>) {
	const [asset, setAsset] = useState<T>(defaultActiveItem);

	const [isOpen, setIsOpen] = useState(false);
	const [activeFilters, setActiveFilters] = useState<string[]>([]);

	const filtersRef = useRef<HTMLDivElement>(null);

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Escape" || event.key === "Enter") {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				filtersRef.current &&
				!filtersRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className={cn(className)}>
			<div className="flex flex-col">
				<div className="relative flex items-center">
					<Input
						placeholder="Search asset..."
						type=""
						className="w-full pl-8 text-text-primary"
					/>

					<SearchIcon className="absolute top-[3px] left-2" />
					{filters?.length && (
						<div ref={filtersRef}>
							<button
								type="button"
								onClick={() => {
									setIsOpen(!isOpen);
								}}
								className={cn(
									"relative flex grow cursor-pointer items-center justify-center gap-2 pl-4 text-[14px] text-text-secondary transition-colors",
									(isOpen || activeFilters.length) && "text-text-primary ",
								)}
							>
								<FilterIcon />
								<span>Filter</span>
								{activeFilters.length > 0 && (
									<div className="absolute top-0 left-6 h-2 w-2 rounded-full bg-fill-brand-primary-700" />
								)}
							</button>
							<div
								className={`absolute top-9 right-[0px] z-50 w-[250px] overflow-y-scroll transition-all duration-300 ease-in-out ${isOpen ? "max-h-[200px]" : "max-h-0"}`}
							>
								<div
									className={cn(
										"z-10 flex flex-col rounded-[2px] bg-bg-floor-4 text-text-primary",
										filters.length !== 0 && "py-2",
									)}
								>
									{filters.map((item) => (
										<Checkbox
											checked={activeFilters.includes(item)}
											onChange={() => {
												if (activeFilters.includes(item)) {
													setActiveFilters(
														activeFilters.filter(
															(activeItem) => activeItem !== item,
														),
													);
												} else {
													setActiveFilters([...activeFilters, item]);
												}
											}}
											label={item}
											className={cn(
												"h-9 w-full rounded-[2px] pl-3 transition-colors ",
												activeFilters.includes(item) &&
													"bg-fill-brand-primary-700",
												!activeFilters.includes(item) && "hover:bg-bg-floor-5",
											)}
											key={`${item}`}
										/>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="mt-1 flex flex-wrap gap-1 ">
					{activeFilters.map((item) => (
						<Button
							variant={"tertiary"}
							className="h-[32px] w-[99px] "
							key={item}
							onClick={() => {
								setActiveFilters(
									activeFilters.filter((activeItem) => activeItem !== item),
								);
							}}
						>
							{item}
							<SmallXIcon className="scale-80 text-text-secondary" />
						</Button>
					))}
				</div>
			</div>

			<div
				className={cn(
					"mt-6 flex h-full flex-col gap-1 overflow-scroll",
					listClassName,
				)}
			>
				{data.map((item) => (
					<FindAssetItem
						item={item}
						variant={variant}
						currentAsset={asset}
						setCurrentAsset={setAsset}
						onSelectAsset={onSelectAsset}
						key={item.address}
						additionalActiveItemInfo={additionalActiveItemInfo}
					/>
				))}
			</div>
		</div>
	);
}

export function FindAssetItem<T extends Token, S extends ShortPoolData>({
	item,
	currentAsset,
	setCurrentAsset,
	onSelectAsset,
	variant = "basic",
	additionalActiveItemInfo,
}: FindAssetItemProps<T, S>) {
	const { t } = useTranslation(["main"]);

	const [selectedOracle, setSelectedOracle] = useState(
		additionalActiveItemInfo?.[0]?.poolAddress || "",
	);

	const isActive = item?.address === currentAsset?.address;

	const handleAssetSelect = () => {
		setCurrentAsset(item);
		if (!isActive) {
			onSelectAsset?.(item);
		}
	};

	const BasicContent = () => {
		return (
			<div className="flex w-full justify-between">
				<div className="flex gap-4">
					<img
						src={item.logo || "/icons/empty-token.svg"}
						className="h-10 w-10"
						alt={item.symbol || "token"}
					/>
					<div className="flex flex-col items-start justify-center">
						<span className="font-[600] font-namu text-[14px] text-text-primary uppercase">
							{item?.symbol || "-"}
						</span>
						<span className="font-[600] font-namu text-[14px] text-text-tertiary">
							{item.name}
						</span>
					</div>
				</div>
				<div className="flex flex-col justify-center text-[14px]">
					<span className="text-text-primary">
						{shorten(new BigNumber(item.price || 0))} $
					</span>
				</div>
			</div>
		);
	};

	const OracleInfo = observer(() => {
		if (!isActive || variant !== "with-additional-data") return null;

		const { currentChain } = useAccountStore();

		return (
			<div className="mt-6 flex flex-col gap-4">
				<span className="text-start">{t("selectOracle")}</span>
				<div className="flex flex-col gap-2">
					{additionalActiveItemInfo?.length === 0 && (
						<Loader2 className="scale-75 animate-spin" />
					)}
					{additionalActiveItemInfo?.map((oracle) => (
						<button
							type="button"
							className={cn(
								"flex w-full cursor-pointer flex-col gap-4 rounded-[8px] border-[1px] border-fill-secondary p-4",
								selectedOracle === oracle?.poolAddress &&
									"border-fill-secondary bg-fill-secondary",
							)}
							onClick={() => {
								setSelectedOracle(oracle?.poolAddress);
								onSelectAsset?.({
									...item,
									poolAddress: oracle.poolAddress,
								});
							}}
							key={oracle?.priceFeedType}
						>
							<div className="flex items-center justify-between text-text-primary">
								<div className="flex items-center gap-4">
									<span>{oracle?.priceFeedType}</span>
									<span className="flex h-[24px] items-center rounded-[4px] bg-fill-secondary p-2 text-[12px]">
										{oracle?.fee / 1000} %
									</span>
								</div>
								{selectedOracle === oracle?.poolAddress && (
									<CheckIcon className="scale-190 text-fill-brand-primary-700" />
								)}
							</div>
							<div className="flex flex-col gap-1">
								<div className="flex items-center justify-between text-[12px]">
									<span className="text-text-secondary">{t("liquidity")}</span>
									<span className="text-text-primary">
										{new BigNumber(oracle?.liquidity || 0)
											.toFixed(6)
											.toString()}{" "}
										{currentChain?.nativeCurrency.symbol}
									</span>
								</div>
							</div>
						</button>
					))}
				</div>
			</div>
		);
	});

	return variant === "basic" ? (
		<button
			type="button"
			onClick={handleAssetSelect}
			key={item.address}
			className={cn(
				"flex h-[56px] w-full cursor-pointer justify-between rounded-[8px] p-2 transition-colors duration-200 ease-out",
				isActive ? "bg-text-brand-primary" : "hover:bg-bg-floor-2",
			)}
		>
			<BasicContent />
		</button>
	) : (
		<div
			className={cn(
				"flex w-full flex-col justify-between rounded-[8px] p-2 transition-colors duration-200 ease-out",
				isActive ? "bg-fill-primary-800" : "hover:bg-fill-primary-800",
			)}
		>
			<button
				type="button"
				onClick={handleAssetSelect}
				key={item.address}
				className="flex w-full cursor-pointer justify-between"
			>
				<BasicContent />
			</button>
			<OracleInfo />
		</div>
	);
}
