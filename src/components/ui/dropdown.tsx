import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import {
	type ChangeEvent,
	type Dispatch,
	type ForwardedRef,
	type JSX,
	forwardRef,
	useEffect,
	useRef,
	useState,
} from "react";
import { useOnClickOutside } from "usehooks-ts";
import ChevronIcon from "../../icons/chevron.svg?react";
import SmallXIcon from "../../icons/smallX.svg?react";

export interface DropdownItemType {
	name?: string;
	iconLeft?: string;
	iconRight?: string;
	rightText?: string;
	withCheckbox?: boolean;
}

export interface DropdownProps<T extends DropdownItemType> {
	items: Array<T>;
	isInput?: boolean;
	label?: string;
	placeholder?: string;
	onSelect?: (selectItem: T) => void;
	className?: string;
	defaultItem?: T;
	withXMark?: boolean;
	onDeleteItem?: () => void;
}

export interface DropdownItemProps<T extends DropdownItemType> {
	item?: T;
	currentValue?: T;
	setCurrentValue?: Dispatch<React.SetStateAction<T | undefined>>;
	onSelect?: (selectItem: T) => void;
	setIsOpen: Dispatch<React.SetStateAction<boolean>>;
}

export const DropdownItem = <T extends DropdownItemType>({
	item,
	currentValue,
	setCurrentValue,
	setIsOpen,
	onSelect,
}: DropdownItemProps<T>) => {
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
				<span className="font-semibold text-blue-500 ">{match}</span>
				{after}
			</>
		);
	};

	return (
		<button
			type="button"
			className={cn(
				"group flex h-9 w-full cursor-pointer items-center px-3",
				item?.name === currentValue?.name && "bg-fill-brand-primary-700",
				item?.name !== currentValue?.name && "hover:bg-bg-floor-5",
			)}
			onClick={() => {
				if (setCurrentValue && item) setCurrentValue({ ...item });
				setIsOpen(false);
				if (onSelect && item) onSelect(item);
			}}
		>
			<div className="flex w-full items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					{item?.withCheckbox && (
						<div className="h-4 w-4 rounded-[2px] bg-white opacity-0 transition-opacity duration-100 group-hover:opacity-100" />
					)}

					<img
						src={item?.iconLeft || "/icons/empty-token.svg"}
						alt="icon1"
						className="h-4 w-4 overflow-hidden rounded-full"
					/>

					<div className=" max-w-[200px] truncate whitespace-nowrap">
						{currentValue &&
							highlightText(item?.name || "", currentValue?.name || "")}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-[12px] text-text-secondary">
						{item?.rightText && item.rightText}
					</span>
					{item?.iconRight && (
						<img
							src={item.iconRight}
							alt="icon1"
							className="h-4 w-4 overflow-hidden rounded-full"
						/>
					)}
				</div>
			</div>
		</button>
	);
};

const DropdownRaw = <T extends DropdownItemType>(
	{
		items,
		isInput = true,
		label,
		placeholder,
		className,
		onSelect,
		defaultItem,
		withXMark = true,
	}: DropdownProps<T>,
	ref: ForwardedRef<HTMLDivElement>,
) => {
	const [isOpen, setIsOpen] = useState(false);

	const [currentValue, setCurrentValue] = useState<T | undefined>(
		defaultItem || ({ name: "" } as T),
	);

	const [filteredItems, setFilteredItems] = useState<T[]>(items);

	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Escape" || event.key === "Enter") {
			setIsOpen(false);
		}
	};

	const handleClickOutside = () => {
		setIsOpen(false);
	};

	useOnClickOutside(
		dropdownRef as React.RefObject<HTMLElement>,
		handleClickOutside,
	);

	useEffect(() => {
		setFilteredItems(items);

		if (
			currentValue?.name &&
			!items.some((item) => item.name === currentValue.name)
		) {
			setCurrentValue({ name: "" } as T);
		}
	}, [items]);

	useEffect(() => {
		if (items.some((item) => item.name === currentValue?.name)) {
			setFilteredItems(items);
		}
	}, [currentValue, items]);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (!isOpen) {
			setIsOpen(true);
		}
		const value = event.target.value;
		setCurrentValue({ name: value } as T);

		const filtered = items.filter((item) =>
			item?.name?.toLowerCase().startsWith(value.toLowerCase()),
		);
		setFilteredItems(filtered);
	};

	return (
		<div className={cn("max-h-[30px]", className)}>
			<div className="mb-2 text-[12px] text-text-primary">{label}</div>
			<div className="relative w-full font-droid" ref={ref ? ref : dropdownRef}>
				<button
					onClick={() => setIsOpen(!isOpen)}
					type="button"
					className={cn(
						"flex w-full cursor-pointer items-center justify-between border-[1px] border-transparent px-2 pb-2 text-text-primary transition-colors duration-200 ease-in-out focus:outline-none",
						isOpen
							? "border-b-fill-brand-primary-700"
							: "border-b-fill-secondary",
					)}
				>
					<img
						src={currentValue?.iconLeft || "/icons/empty-token.svg"}
						alt="icon1"
						className="h-4 w-[22px] overflow-hidden rounded-full"
					/>

					<input
						placeholder={placeholder}
						value={currentValue?.name}
						onChange={handleInputChange}
						readOnly={!isInput}
						className="ml-2 w-full cursor-pointer placeholder:text-text-secondary focus:outline-none"
					/>

					<div className="flex gap-2 ">
						{currentValue?.name && withXMark && (
							<button
								type="button"
								onClick={(event) => {
									event.stopPropagation();
									setCurrentValue({ name: "" } as T);
									setFilteredItems(items);
									if (onSelect) onSelect({ name: "" } as T);
								}}
							>
								<SmallXIcon className="h-[10px] w-[10px] cursor-pointer transition-transform duration-300" />
							</button>
						)}

						<button type="button">
							<ChevronIcon
								className={`h-3 w-3 cursor-pointer bg-center bg-no-repeat transition-transform duration-300 ${
									isOpen ? "rotate-0" : "rotate-180"
								}`}
							/>
						</button>
					</div>
				</button>

				<div
					className={`relative z-50 overflow-y-scroll transition-all duration-300 ease-in-out ${isOpen ? "max-h-[200px]" : "max-h-0"}`}
				>
					<div
						className={cn(
							"z-10 rounded-[2px] bg-bg-floor-4 text-text-primary",
							filteredItems.length !== 0 && "py-2",
						)}
					>
						{filteredItems.map((item, index) => (
							<DropdownItem
								currentValue={currentValue}
								item={item}
								key={`${item.name}${index}`}
								setCurrentValue={setCurrentValue}
								setIsOpen={setIsOpen}
								onSelect={onSelect}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

DropdownRaw.displayName = "Dropdown";

const Dropdown = observer(forwardRef(DropdownRaw)) as <
	T extends DropdownItemType,
>(
	props: DropdownProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element;

export { Dropdown };
