import { cn } from "@/lib/utils";
import { type FC, type ReactNode, useEffect, useState } from "react";

interface ModalBaseProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	className?: string;
}

export const ModalBase: FC<ModalBaseProps> = ({
	isOpen,
	onClose,
	children,
	className,
}) => {
	const [visible, setVisible] = useState(isOpen);
	const [animating, setAnimating] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setVisible(true);
			setTimeout(() => setAnimating(true), 10);
			document.body.style.overflow = "hidden";
		} else {
			setAnimating(false);
			setTimeout(() => {
				setVisible(false);
			}, 200);
			document.body.style.overflow = "scroll";
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!visible) return null;

	return (
		<div
			className={cn(
				"fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200",
				animating ? "opacity-100" : "opacity-0",
			)}
		>
			<button
				type="button"
				className="fixed inset-0 bg-bg-overlay bg-opacity-50 transition-opacity duration-200"
				onClick={onClose}
			/>
			<div
				className={cn(
					"absolute transform bg-bg-floor-1 transition-all duration-200",
					animating ? "scale-100 opacity-100" : "scale-95 opacity-0",
					className,
				)}
			>
				{children}
			</div>
		</div>
	);
};
