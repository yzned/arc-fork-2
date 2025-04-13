import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import MultipoolFactory from "@/lib/abi/MultipoolFactory";
import {
	ARBITRUM_SEPOLIA_CHAIN_ID,
	ARCANUM_POOL_FACTORY_ADDRESS,
} from "@/lib/constants";
import { encodePacked, getContractAddress, keccak256, toBytes } from "viem";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatNumber(num: number, significantDigits = 2): string {
	if (num === 0) return "0";

	if (Math.abs(num) < 1e-10) {
		return num.toExponential(significantDigits);
	}

	if (num < 1 && num > 0) {
		const decimalStr =
			num.toLocaleString("fullwide", { useGrouping: false }).split(".")[1] ||
			"";
		let leadingZeros = 0;

		for (const char of decimalStr) {
			if (char === "0") {
				leadingZeros++;
			} else {
				break;
			}
		}

		return num.toFixed(leadingZeros + significantDigits);
	}

	// Для обычных чисел
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

const generateNonce = () => {
	const array = new Uint32Array(2);
	crypto.getRandomValues(array);
	return (BigInt(array[0]) << 32n) | BigInt(array[1]);
};

export const getMultipoolContractAddress = () => {
	const nonce = generateNonce();

	const bytecodeHash = keccak256(toBytes(MultipoolFactory.bytecode.object));

	const contractAddress = getContractAddress({
		from: ARCANUM_POOL_FACTORY_ADDRESS,
		opcode: "CREATE2",
		salt: keccak256(
			encodePacked(
				["uint256", "uint256"],
				[BigInt(ARBITRUM_SEPOLIA_CHAIN_ID), BigInt(nonce)],
			),
		),
		bytecode: MultipoolFactory.bytecode.object,
		bytecodeHash,
	});

	return contractAddress;
};
