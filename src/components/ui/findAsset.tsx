import { Input } from "@/components/ui/input";
import { useAccountStore } from "@/contexts/AccountContext";
import CheckIcon from "@/icons/checkMark.svg?react";
import ChevronIcon from "@/icons/chevron.svg?react";
import RoundedCheck from "@/icons/roundedCheck.svg?react";

import type { AvailableChainTokensDataFormated } from "@/api/types";
import { getDecimals, getPoolsData } from "@/api/uniswap";
import { UNI_FEES } from "@/lib/constants";
import { shorten } from "@/lib/formatNumber";
import type { ShortPoolData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Token } from "@uniswap/sdk-core";
import { Pool, computePoolAddress } from "@uniswap/v3-sdk";
import BigNumber from "bignumber.js";
import { Loader2 } from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { type Address, zeroAddress } from "viem";
import { usePublicClient } from "wagmi";
import FilterIcon from "/src/icons/filter.svg?react";
import SearchIcon from "/src/icons/search.svg?react";
import SmallXIcon from "/src/icons/smallX.svg?react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { InfoTooltip } from "./tooltips/InformationTooltip";
import { useOnClickOutside } from "usehooks-ts";

interface FindAssetProps<T, S> {
	data: T[];
	filters?: string[];
	onSelectAsset?: (asset: T | null) => void;
	className?: string;
	defaultActiveItem?: T | null;
	listClassName?: string;
	additionalActiveItemInfo?: S[];
	variant?: "default" | "with-oracles";
	withSearch?: boolean;
}

interface FindAssetItemProps<
	T extends AvailableChainTokensDataFormated,
	S extends ShortPoolData,
> {
	item: T;
	selectAsset?: T | null;
	setSelectAsset: Dispatch<SetStateAction<T | null>>;
	onSelectAsset?: (asset: T | null) => void;
	variant?: "default" | "with-oracles";
	additionalActiveItemInfo?: S[];
}

export function FindAsset<
	T extends AvailableChainTokensDataFormated,
	S extends ShortPoolData,
>({
	data,
	filters,
	onSelectAsset,
	className,
	additionalActiveItemInfo,
	listClassName,
	defaultActiveItem,
	variant = "default",
	withSearch = true,
}: FindAssetProps<T, S>) {
	const [selectAsset, setSelectAsset] = useState<T | null>(
		defaultActiveItem || null,
	);

	const [isOpen, setIsOpen] = useState(false);
	const [activeFilters, setActiveFilters] = useState<string[]>([]);

	const filtersRef = useRef<HTMLDivElement>(null);
	const [hasScrollShadow, setHasScrollShadow] = useState(true);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Escape" || event.key === "Enter") {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const handleScroll = () => {
			setHasScrollShadow(container.scrollTop === 0);
		};

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const handleClickOutside = () => {
		setIsOpen(false);
	};

	useOnClickOutside(
		filtersRef as React.RefObject<HTMLElement>,
		handleClickOutside,
	);

	return (
		<div className={cn(className)}>
			{withSearch && (
				<div
					data-shadow={hasScrollShadow}
					className="flex h-[80px] flex-col justify-center px-4 transition-all data-[shadow=false]:shadow-[0_8px_16px_-8px_rgba(0,0,0,0.25)]"
				>
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
													!activeFilters.includes(item) &&
														"hover:bg-bg-floor-5",
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
			)}

			<div
				className={cn(
					" flex h-full flex-col gap-1 overflow-scroll",
					listClassName,
				)}
				ref={scrollContainerRef}
			>
				{data?.map((item) => (
					<FindAssetItem
						item={item}
						variant={variant}
						selectAsset={selectAsset}
						setSelectAsset={setSelectAsset}
						onSelectAsset={onSelectAsset}
						key={item.address}
						additionalActiveItemInfo={additionalActiveItemInfo}
					/>
				))}
			</div>
		</div>
	);
}

export function FindAssetItem<
	T extends AvailableChainTokensDataFormated,
	S extends ShortPoolData,
>({
	item,
	selectAsset,
	setSelectAsset,
	onSelectAsset,
	variant = "default",
	additionalActiveItemInfo,
}: FindAssetItemProps<T, S>) {
	const { t } = useTranslation(["main"]);
	const { currentChain } = useAccountStore();

	const isActive = item?.address === selectAsset?.address;

	if (variant === "with-oracles") {
		const handleAssetSelect = async () => {
			if (isActive) {
				onSelectAsset?.({
					...item,
					poolAddress: selectedOracle,
				});
			} else {
				const decimals = await getDecimals({
					addresses: [
						item.address as Address,
						currentChain?.nativeTokenAddress as Address,
					],
				});

				const tokenA = new Token(
					currentChain?.id || 42161,
					item.address as Address,
					Number(decimals[0]),
				);

				const tokenB = new Token(
					currentChain?.id || 42161,
					currentChain?.nativeTokenAddress as Address,
					Number(decimals[1]),
				);

				for (const fee of UNI_FEES) {
					const poolAddress = computePoolAddress({
						factoryAddress: currentChain?.uniswapV3FactoryAddress as Address,
						tokenA,
						tokenB,
						fee,
					});

					const bytecode = await client?.getCode({
						address: poolAddress as Address,
					});

					if (bytecode && bytecode !== "0x") {
						onSelectAsset?.({
							...item,
							poolAddress,
						});
						break;
					}
				}
			}
		};

		const itemRef = useRef<HTMLDivElement>(null);
		const [pools, setPools] = useState<ShortPoolData[]>();

		const [selectedOracle, setSelectedOracle] = useState(
			additionalActiveItemInfo?.[0]?.poolAddress || "",
		);

		const client = usePublicClient();

		useEffect(() => {
			if (isActive && itemRef.current) {
				itemRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
					inline: "start",
				});
			}
		}, [isActive]);

		useEffect(() => {
			setSelectedOracle("");
		}, [selectAsset?.address]);

		useEffect(() => {
			async function fetchPools() {
				try {
					if (isActive) {
						setPools([]);

						const pools = await getPoolsData(
							(currentChain?.nativeTokenAddress || zeroAddress) as Address,
							(item?.address || zeroAddress) as Address,
							currentChain?.uniswapV3FactoryAddress as Address,
						);

						const poolsResult = await Promise.all(
							pools.map(async (pool, index) => {
								const rawLiquidity = new BigNumber(pool.liquidity.toString());

								const isToken0Native =
									pool.token0.address === currentChain?.nativeTokenAddress;
								const isToken1Native =
									pool.token1.address === currentChain?.nativeTokenAddress;

								let liquidityInNative: BigNumber;
								let price: BigNumber | undefined;

								if (isToken0Native) {
									price = new BigNumber(
										pool.priceOf(pool.token1).toSignificant(18),
									);
									liquidityInNative = rawLiquidity
										.multipliedBy(price)
										.div(new BigNumber(10).pow(pool.token1.decimals));
								} else if (isToken1Native) {
									price = new BigNumber(
										pool.priceOf(pool.token0).toSignificant(18),
									);
									liquidityInNative = rawLiquidity
										.multipliedBy(price)
										.div(new BigNumber(10).pow(pool.token0.decimals));
								} else {
									liquidityInNative = new BigNumber(0);
								}

								const poolAddress = Pool.getAddress(
									pool.token0,
									pool.token1,
									pool.fee,
								);

								return {
									priceFeedType: "UniswapV3",
									poolAddress: poolAddress,
									liquidity: liquidityInNative.toString(),
									fee: UNI_FEES[index],
									price: price?.toString(),
								};
							}),
						);

						const filteredPools = poolsResult?.filter(
							(pool) => pool?.liquidity !== undefined && pool.fee !== undefined,
						);

						setPools(filteredPools);
					}
				} catch (err) {
					console.error(err);
				}
			}

			fetchPools();
		}, [item.address, currentChain?.nativeTokenAddress, isActive]);

		return (
			<div
				ref={itemRef}
				className={cn(
					"flex w-full flex-col justify-between rounded-[8px] p-2 transition-colors duration-200 ease-out",
					isActive ? "bg-fill-primary-800" : "hover:bg-fill-primary-800",
				)}
			>
				<button
					type="button"
					onClick={() => {
						if (selectAsset?.address === item.address) {
							setSelectAsset(null);
						} else {
							setSelectAsset(item);
						}
					}}
					key={item.address}
					className="flex w-full cursor-pointer justify-between"
				>
					<div className="flex w-full items-center justify-between">
						<div className="flex gap-4">
							<img
								src={item.logo || "/icons/empty-token.svg"}
								className="h-10 w-10 rounded-full"
								alt={""}
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
						<div className="flex items-center gap-3">
							<Button
								className="h-10 transition-colors data-[active=false]:bg-fill-tertiary"
								data-active={isActive}
								disabled={isActive ? !selectedOracle : false}
								onClick={(e) => {
									e.stopPropagation();
									handleAssetSelect();
								}}
							>
								<RoundedCheck className="scale-100" />
								{isActive && t("useAsset")}
							</Button>

							<div>
								<ChevronIcon
									width={16}
									height={16}
									data-active={isActive}
									className="rotate-[180deg] text-text-tertiary transition-all duration-150 data-[active=true]:rotate-[0deg] data-[active=true]:text-text-primary"
								/>
							</div>
						</div>
					</div>
				</button>
				{isActive && (
					<div className="flex flex-col gap-6">
						<div className="mt-6 flex flex-col gap-4">
							<span className="flex gap-2 text-start text-text-tertiary">
								{t("selectOracle")}
								<InfoTooltip />
							</span>
							<div className="flex flex-col gap-2">
								{pools?.length === 0 && (
									<Loader2 className="scale-75 animate-spin text-text-primary" />
								)}
								{pools?.map((pool) => (
									<button
										type="button"
										className={cn(
											"flex w-full cursor-pointer flex-col gap-4 rounded-[8px] border-[1px] border-fill-secondary p-4",
											selectedOracle === pool?.poolAddress &&
												"border-fill-secondary bg-fill-secondary",
										)}
										onClick={() => {
											setSelectedOracle(pool?.poolAddress);
										}}
										key={pool?.priceFeedType}
									>
										<div className="flex items-center justify-between text-text-primary">
											<div className="flex items-center gap-4">
												<span>{pool?.priceFeedType}</span>
												<span
													data-active={selectedOracle === pool?.poolAddress}
													className="flex h-[24px] items-center rounded-[4px] bg-fill-secondary p-2 text-[12px] data-[active=true]:bg-fill-tertiary"
												>
													{pool?.fee / 1000} %
												</span>
											</div>
											{selectedOracle === pool?.poolAddress && (
												<div className="flex h-6 w-6 items-center justify-center rounded-full bg-fill-brand-primary-700">
													<CheckIcon className="h-[12px] w-[15px] text-text-primary" />
												</div>
											)}
										</div>
										<div className="flex flex-col gap-1">
											<div className="flex items-center justify-between text-[12px]">
												<span className="text-text-secondary">
													{t("liquidity")}
												</span>
												<span className="text-text-primary">
													{new BigNumber(pool?.liquidity || 0)
														.toFixed(6)
														.toString()}{" "}
													{currentChain?.nativeCurrency.symbol}
												</span>
											</div>
											<div className="flex items-center justify-between text-[12px]">
												<span className="text-text-secondary">
													{t("price")}
												</span>
												<span className="text-text-primary">
													{new BigNumber(pool?.price || 0)
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

						<div className="flex flex-wrap gap-2">
							{item.tags?.map((tag) => (
								<div
									key={tag}
									className="w-fit rounded-[4px] bg-fill-secondary px-2 py-[7px] text-text-primary"
								>
									{tag}
								</div>
							))}
							{/* <div className="bg-fill-secondary rounded-[4px] py-[7px] px-2 w-fit">
								{item.address}
							</div> */}
						</div>
					</div>
				)}
			</div>
		);
	}

	if (variant === "default") {
		const handleAssetSelect = () => {
			setSelectAsset(item);
			if (!isActive) {
				onSelectAsset?.(item);
			}
		};
		return (
			<button
				type="button"
				onClick={handleAssetSelect}
				key={item.address}
				className={cn(
					"flex h-[56px] w-full cursor-pointer justify-between rounded-[8px] p-2 transition-colors duration-200 ease-out",
					isActive ? "bg-text-brand-primary" : "hover:bg-bg-floor-2",
				)}
			>
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
			</button>
		);
	}
}
