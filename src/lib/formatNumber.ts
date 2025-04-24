import BigNumber from "bignumber.js";

export function shorten(
	BNAmount: BigNumber,
	dollars = false,
	insertSpaces = true,
) {
	function getShortenMode(BNAmount: BigNumber) {
		if (BNAmount.isEqualTo(new BigNumber(0))) return "zero";
		if (BNAmount.isGreaterThanOrEqualTo(new BigNumber(1_000_000_000)))
			return "b";
		if (BNAmount.isGreaterThanOrEqualTo(new BigNumber(1_000_000))) return "m";
		if (BNAmount.isGreaterThanOrEqualTo(new BigNumber(1_000))) return "k";
		if (BNAmount.isLessThan(new BigNumber(0.000001))) return "d";
		return "cut";
	}

	const mode = getShortenMode(BNAmount);

	if (mode === "zero") return dollars ? "0.00" : "0";

	switch (mode) {
		case "b": {
			let res = BNAmount.dividedBy(new BigNumber(1_000_000_000)).toFixed(2, 1);
			if (!dollars) res = new BigNumber(res).toString();
			if (insertSpaces) res = formatNumberWithSpaces(res);
			return `${res}B`;
		}
		case "m": {
			let res = BNAmount.dividedBy(new BigNumber(1_000_000)).toFixed(2, 1);
			if (!dollars) res = new BigNumber(res).toString();
			if (insertSpaces) res = formatNumberWithSpaces(res);
			return `${res}M`;
		}
		case "k": {
			let res = BNAmount.dividedBy(new BigNumber(1_000)).toFixed(2, 1);
			if (!dollars) res = new BigNumber(res).toString();
			if (insertSpaces) res = formatNumberWithSpaces(res);
			return `${res}K`;
		}
		case "d": {
			return "< 0.000001";
		}
		default: {
			return new BigNumber(BNAmount.toFixed(dollars ? 2 : 4, 1)).toString();
		}
	}
}

export function cutDecimals(purifiedNumber: string, decimals = 3) {
	if (!decimals) return purifiedNumber.replace(/[^0-9]/gi, "");

	const hasDot = purifiedNumber.includes(".");

	if (!hasDot) return purifiedNumber;

	let [beforeDot, afterDot] = purifiedNumber.split(".");

	if (afterDot.length > decimals) afterDot = afterDot.slice(0, decimals);

	return `${beforeDot}.${afterDot}`;
}

export function formatNumberWithSpaces(purifiedNumberString: string) {
	const hasDot = purifiedNumberString.includes(".");

	const [beforeDot, afterDot] = purifiedNumberString.split(".");

	const { length } = beforeDot;

	if (length <= 3) return purifiedNumberString;

	let intWithSpaces = "";

	for (let i = length; i > 0; i -= 3) {
		const newDigits = beforeDot.slice(Math.max(i - 3, 0), i);

		if (i - 3 > 0) intWithSpaces = ` ${newDigits}${intWithSpaces}`;
		else intWithSpaces = newDigits + intWithSpaces;
	}
	if (hasDot) return `${intWithSpaces}.${afterDot}`;

	return intWithSpaces;
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
