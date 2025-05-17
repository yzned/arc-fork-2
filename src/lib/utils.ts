import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
	type Address,
	concat,
	encodeDeployData,
	encodePacked,
	isAddress,
	keccak256,
	pad,
	toBytes,
	toHex,
} from "viem";
import ERC1967 from "./abi/ERC1967";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatAddress = (address?: string) => {
	if (!address) return "-";

	if (address.length > 10) {
		const start = address.slice(0, 6);
		const end = address.slice(-4);

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

const IMPL_ADDRESS = "0x14090b42338e02C786cDd6F29Bb83553FDe8f084";

export const getMultipoolContractAddress = ({
	chainId,
	factoryAddress,
}: { chainId: number; factoryAddress: Address }) => {
	const nonce = generateNonce();

	const initCode = encodeDeployData({
		abi: ERC1967.abi,
		bytecode: ERC1967.bytecode.object as Address,
		args: [IMPL_ADDRESS as Address, "0x" as Address],
	});

	const initCodeHash = keccak256(toBytes(initCode));

	const salt = keccak256(
		encodePacked(["uint256", "uint256"], [BigInt(chainId), BigInt(nonce)]),
	);

	const create2Address = computeCreate2Address(
		factoryAddress,
		salt,
		initCodeHash,
	);

	return { contractAddress: create2Address, nonce, initCodeHash, salt };
};

function computeCreate2Address(
	factoryAddress: Address,
	salt: `0x${string}`,
	initCodeHash: `0x${string}`,
): Address {
	const packed = encodePacked(
		["bytes1", "address", "bytes32", "bytes32"],
		["0xff", factoryAddress, salt, initCodeHash],
	);

	const hash = keccak256(toBytes(packed));

	return `0x${hash.slice(-40)}` as Address;
}

export const encodeUniV3PriceData = (
	oracleAddress: Address,
	reversed: boolean,
	twapInterval: bigint,
): `0x${string}` => {
	return concat([
		pad(toHex(0), { size: 1 }),

		oracleAddress,

		pad(toHex(reversed ? 1 : 0), { size: 1 }),

		pad(toHex(twapInterval), { size: 8 }),

		pad("0x00", { size: 2 }),
	]);
};

export const toBase64 = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			if (typeof reader.result === "string") {
				resolve(reader.result);
			} else {
				reject(new Error("Failed to convert file to base64 string"));
			}
		};
		reader.onerror = () => reject(reader.error);
	});

export const getValidAddress = (
	address: string,
	fallback: Address,
): Address => {
	if (!address) return fallback;
	try {
		return isAddress(address) ? address : fallback;
	} catch {
		return fallback;
	}
};

function numberToSubscript(num: number) {
	const subscriptDigits = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
	return num
		.toString()
		.split("")
		.map((c) => {
			const digit = Number.parseInt(c, 10);
			return Number.isNaN(digit) ? c : subscriptDigits[digit];
		})
		.join("");
}

export function shrinkNumber(n: number, decimals?: number) {
	if (n === 0) return "0";

	const absN = Math.abs(n);
	const sign = n < 0 ? "-" : "";

	// Handle small numbers (absN < 0.01)
	if (absN < 0.01) {
		const s = absN.toExponential(50);
		const [mantissa, expPart] = s.split("e");
		const exponent = Number.parseInt(expPart, 10);

		let subscriptNum = Math.abs(exponent) - 2;
		if (subscriptNum < 0) subscriptNum = 0;

		const subscriptStr = numberToSubscript(subscriptNum);
		const mainDigits = mantissa
			.replace(".", "")
			.substring(0, decimals ? decimals + 1 : 4);

		return `${sign}0.0${subscriptStr}${mainDigits}`;
	}

	// Handle medium numbers (0.01 <= absN < 1000)
	if (absN < 1000) {
		const formatted = absN
			.toFixed(decimals)
			.replace(/(\.\d*?[1-9])0+$/, "$1") // Remove trailing zeros
			.replace(/\.$/, ""); // Remove trailing dot
		return sign + formatted;
	}

	// Handle large numbers (absN >= 1000)
	const suffixes = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
	let steps = 0;
	let current = absN;

	while (current >= 1000 && steps < suffixes.length - 1) {
		current /= 1000;
		steps++;
	}

	if (current >= 1000) {
		// Beyond suffixes, use scientific notation
		const exponent = (steps + 1) * 3;
		current /= 1000;
		const sciStr = current.toFixed(decimals).replace(/\.?0+$/, "");
		return `${sign}${sciStr}e${exponent}`;
	}

	// Format with specified decimals
	const formatted = current
		.toFixed(decimals)
		.replace(/(\.\d*?[1-9])0+$/, "$1") // Remove trailing zeros
		.replace(/\.$/, ""); // Remove trailing dot

	return `${sign}${formatted}${suffixes[steps]}`;
}
