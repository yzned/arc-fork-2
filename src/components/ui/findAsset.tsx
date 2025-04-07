import { Input } from "@/components/ui/input";
import type { Token } from "@/lib/types";
import { cn } from "@/lib/utils";
import { type FC, useEffect, useRef, useState } from "react";
import FilterIcon from "/src/icons/filter.svg?react";
import SearchIcon from "/src/icons/search.svg?react";
import SmallXIcon from "/src/icons/smallX.svg?react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";

interface FindAssetProps {
	assets: Token[];
	filters?: string[];
	onSelectAsset?: (asset: Token) => void;
	className?: string;
	defaultAsset: Token;
	listClassName?: string;
}

export const FindAsset: FC<FindAssetProps> = ({
	assets,
	filters,
	onSelectAsset,
	className,
	listClassName,
	defaultAsset,
}) => {
	const [asset, setAsset] = useState<Token>(defaultAsset);
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
				{assets.map((item) => (
					<button
						type="button"
						onClick={() => {
							setAsset(item);
							if (onSelectAsset) onSelectAsset(item);
						}}
						key={item.address}
						className={cn(
							"flex h-[56px] w-full cursor-pointer justify-between rounded-[8px] p-2 transition-colors duration-200 ease-out",
							item?.address === asset?.address
								? "bg-text-brand-primary"
								: "hover:bg-bg-floor-2 ",
						)}
					>
						<div className="flex gap-4">
							<img
								src={item.logo || "/icons/empty-token.svg"}
								className="h-10 w-10 "
								alt="no-item"
							/>
							<div className="flex flex-col items-start justify-center">
								<span className="font-[600] font-namu text-[14px] text-text-primary uppercase">
									{item.symbol}
								</span>
								<span className="font-[600] font-namu text-[14px] text-text-tertiary">
									{item.name}
								</span>
							</div>
						</div>
						<div className="flex flex-col justify-center text-[14px]">
							<span className=" text-text-primary">
								{item.price ? item.price : item.current_price} $
							</span>
							{/* <PriceChange growing value="23.23" /> */}
						</div>
					</button>
				))}
			</div>
		</div>
	);
};
