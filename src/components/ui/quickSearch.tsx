import { cn } from "@/lib/utils";
import {
	type ChangeEvent,
	type Dispatch,
	type FC,
	type ForwardedRef,
	forwardRef,
	useEffect,
	useRef,
	useState,
} from "react";
import { useOnClickOutside } from "usehooks-ts";

export interface QuickSearchProps {
	items: string[];
	placeholder?: string;
	className?: string;
}

export interface QuickSearchItemProps {
	item: string;
	currentValue: string;
	setCurrentValue: Dispatch<React.SetStateAction<string>>;
	setIsOpen: Dispatch<React.SetStateAction<boolean>>;
}

export const QuickSearchItem: FC<QuickSearchItemProps> = ({
	item,
	currentValue,
	setCurrentValue,
	setIsOpen,
}) => {
	const highlightText = (text: string, highlight: string) => {
		if (!highlight.trim()) {
			return text;
		}

		if (text.toLowerCase() === highlight.toLowerCase()) {
			return text;
		}

		const index = text.toLowerCase().indexOf(highlight.toLowerCase());

		if (index === -1) {
			return text;
		}

		const before = text.slice(0, index);
		const match = text.slice(index, index + highlight.length);
		const after = text.slice(index + highlight.length);

		return (
			<>
				{before}
				<span className="text-blue-500 ">{match}</span>
				{after}
			</>
		);
	};

	return (
		<button
			type="button"
			className={cn(
				"group flex h-9 w-full cursor-pointer items-center truncate px-9",
				item === currentValue && "bg-fill-brand-primary-700",
				item !== currentValue && "hover:bg-bg-floor-5",
			)}
			onClick={() => {
				setCurrentValue(item);
				setIsOpen(false);
			}}
		>
			<div className="flex w-full items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<div>{highlightText(item, currentValue)}</div>
				</div>
			</div>
		</button>
	);
};

export const QuickSearch = forwardRef(
	(
		{ items, placeholder, className }: QuickSearchProps,
		ref: ForwardedRef<HTMLInputElement>,
	) => {
		const [isInputFocused, setIsInputFocused] = useState(false);

		const [isOpen, setIsOpen] = useState(false);
		const [currentValue, setCurrentValue] = useState("");

		const [filteredItems, setFilteredItems] = useState<string[]>(items);

		const quickSearchRef = useRef<HTMLInputElement>(null);

		const handleClickOutside = () => {
			setIsOpen(false);
		};

		useOnClickOutside(
			quickSearchRef as React.RefObject<HTMLElement>,
			handleClickOutside,
		);

		useEffect(() => {
			if (items.some((item) => item === currentValue)) {
				setFilteredItems(items);
			}
		}, [currentValue]);

		useEffect(() => {
			document.addEventListener("keydown", handleKeyDown);
			return () => {
				document.removeEventListener("keydown", handleKeyDown);
			};
		}, []);

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" || event.key === "Enter") {
				setIsOpen(false);
			}
		};

		const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
			if (!isOpen) {
				setIsOpen(true);
			}
			const value = event.target.value;
			setCurrentValue(value);

			const filtered = items.filter((item) =>
				item.toLowerCase().startsWith(value.toLowerCase()),
			);
			setFilteredItems(filtered);
		};

		return (
			<div className={cn("max-h-[60px]", className)}>
				<div className="relative w-full font-droid">
					<button
						onClick={() => {
							setIsOpen(!isOpen);
							quickSearchRef.current?.focus();
						}}
						type="button"
						className={cn(
							"flex w-full cursor-pointer items-center justify-between gap-2 border-[1px] border-transparent pb-2 text-text-primary transition-colors duration-200 ease-in-out focus:outline-none",
							isOpen
								? "border-b-fill-brand-primary-700"
								: "border-b-fill-secondary",
						)}
					>
						<button
							type="button"
							onClick={(event) => {
								event.stopPropagation();
								setCurrentValue("");
								setFilteredItems(items);
							}}
							className={cn(
								"h-4 w-4 cursor-pointer bg-center bg-no-repeat transition-transform duration-300",
								isInputFocused || currentValue
									? "bg-[url('/icons/searchBlue.svg')]"
									: "bg-[url('/icons/search.svg')]",
							)}
						/>

						<input
							placeholder={placeholder}
							onFocus={() => setIsInputFocused(true)}
							onBlur={() => setIsInputFocused(false)}
							value={currentValue}
							ref={ref ? ref : quickSearchRef}
							onChange={handleInputChange}
							className="w-full cursor-pointer placeholder:text-text-secondary focus:outline-none "
						/>
						{currentValue && (
							<button
								type="button"
								onClick={(event) => {
									event.stopPropagation();
									setCurrentValue("");
									setFilteredItems(items);
								}}
								className="h-4 w-4 cursor-pointer bg-[url('/icons/smallX.svg')] bg-center bg-no-repeat transition-transform duration-300"
							/>
						)}
					</button>

					<div
						className={`relative z-50 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"}`}
					>
						<div
							className={cn(
								"z-10 rounded-[2px] bg-bg-floor-4 text-text-primary ",
								filteredItems.length !== 0 && "py-2",
							)}
						>
							{filteredItems.map((item) => (
								<QuickSearchItem
									currentValue={currentValue}
									item={item}
									key={`${item}`}
									setCurrentValue={setCurrentValue}
									setIsOpen={setIsOpen}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	},
);

QuickSearch.displayName = "QuickSearch";
