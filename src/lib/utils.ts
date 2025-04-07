import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatNumber(num: number, significantDigits = 2): string {
	// Handle zero case
	if (num === 0) return "0";

	// For small numbers (between 0 and 1)
	if (num < 1 && num > 0) {
		// Convert to string and extract decimal part
		const decimalStr = num.toString().split(".")[1];
		let leadingZeros = 0;

		// Count leading zeros
		for (const char of decimalStr) {
			if (char === "0") {
				leadingZeros++;
			} else {
				break;
			}
		}

		// Format with precision = leadingZeros + significantDigits
		return num.toFixed(leadingZeros + significantDigits);
	}
	return num.toFixed(significantDigits);
}

export const formatAddress = (address?: string) => {
	if (!address) return "-";

	// Сокращаем только если длина безопасна
	if (address.length > 10) {
		const start = address.slice(0, 6);
		const end = address.slice(-4);

		// Дополнительно убеждаемся, что эти части не пересекаются
		if (address.length > 10 && address.length > 6 + 4) {
			return `${start}...${end}`;
		}
	}

	return address;
};
