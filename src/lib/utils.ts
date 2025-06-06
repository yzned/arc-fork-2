import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
	type Address,
	concat,
	encodeDeployData,
	encodePacked,
	getCreate2Address,
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

export const generateNonce = () => {
	const array = new Uint32Array(2);
	crypto.getRandomValues(array);
	return (BigInt(array[0]) << 32n) | BigInt(array[1]);
};

export const getMultipoolContractAddress = ({
	chainId,
	factoryAddress,
	implAddress,
	sender,
	nonce,
}: {
	chainId: number;
	factoryAddress: Address;
	implAddress: string;
	sender: Address;
	nonce: bigint;
}) => {
	const bytecode = encodeDeployData({
		abi: ERC1967.abi,
		bytecode: ERC1967.bytecode.object as Address,
		args: [implAddress as Address, "0x" as Address],
	});

	const bytecodeHash = keccak256(toBytes(bytecode));

	const salt = keccak256(
		encodePacked(
			["uint256", "uint256", "address"],
			[BigInt(chainId), BigInt(nonce), sender],
		),
	);

	const create2Address = getCreate2Address({
		from: factoryAddress,
		salt,
		bytecode,
		bytecodeHash,
	});

	return { mpAddress: create2Address, nonce, bytecodeHash, salt };
};

export const decodePriceData = (encodedData: `0x${string}`) => {
	if (encodedData.length < 66) {
		throw new Error("Invalid encoded data length");
	}

	let offset = 2;

	const priceOracleIndexHex = encodedData.slice(offset, offset + 2);
	const priceOracleIndex = Number.parseInt(priceOracleIndexHex, 16);
	offset += 2;

	const oracleAddress =
		`0x${encodedData.slice(offset, offset + 40)}` as Address;
	offset += 40;

	const reversedHex = encodedData.slice(offset, offset + 2);
	const reversed = Number.parseInt(reversedHex, 16) === 1;
	offset += 2;

	const twapIntervalHex = encodedData.slice(offset, offset + 16);
	const twapInterval = BigInt(`0x${twapIntervalHex}`);
	offset += 16;

	offset += 4;

	return {
		oracleAddress,
		reversed,
		twapInterval,
		priceOracleIndex,
	};
};

export const encodePriceData = (
	oracleAddress: Address,
	reversed: boolean,
	twapInterval: bigint,
	priceOracleIndex?: number,
): `0x${string}` => {
	return concat([
		pad(toHex(priceOracleIndex || 0), { size: 1 }),

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

export function shrinkNumber(
	n: number | string | undefined,
	decimals?: number,
	percent?: boolean,
) {
	if (n === undefined || n === null) return "-";
	if (n === 0 || n === "0") return "0";

	const x = typeof n === "string" ? (percent ? Number(n) * 100 : Number(n)) : n;

	const absN = Math.abs(x);
	const sign = x < 0 ? "-" : "";
	const isInteger = Number.isInteger(absN);

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

	if (absN < 1000) {
		if (isInteger) {
			return sign + absN.toString();
		}
		const formatted = absN
			.toFixed(decimals)
			.replace(/(\.\d*?[1-9])0+$/, "$1")
			.replace(/\.$/, "");
		return sign + formatted;
	}

	const suffixes = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
	let steps = 0;
	let current = absN;

	while (current >= 1000 && steps < suffixes.length - 1) {
		current /= 1000;
		steps++;
	}

	if (current >= 1000) {
		const exponent = (steps + 1) * 3;
		current /= 1000;
		const sciStr = current.toFixed(decimals).replace(/\.?0+$/, "");
		return `${sign}${sciStr}e${exponent}`;
	}

	let formatted: string;
	if (isInteger && steps > 0 && Number.isInteger(current)) {
		formatted = current.toString();
	} else {
		formatted = current
			.toFixed(decimals)
			.replace(/(\.\d*?[1-9])0+$/, "$1")
			.replace(/\.$/, "");
	}

	return `${sign}${formatted}${suffixes[steps]}`;
}
