import { api } from "./api";

export async function CreateMultipool({
	l, // logo_bytes (base64 строка или data-URI)
	ih, // init_code_hash (B256)
	n, // name
	s, // symbol
	st, // salt (B256)
	d, // description
}: {
	l: string;
	ih: string;
	n: string;
	s: string;
	st: string;
	d: string;
}) {
	const logoBytes = prepareLogoBase64(l);

	const normalizedRequest = {
		l: logoBytes,
		ih: cleanHex(ih),
		st: cleanHex(st),
		n,
		s,
		d,
	};

	return await api.postMsgpack("portfolio/create", normalizedRequest);
}
function prepareLogoBase64(logoInput: string): string {
	if (!logoInput) return "";

	// Удаляем data-URI префикс если есть
	const pureBase64 = logoInput.startsWith("data:")
		? logoInput.slice(logoInput.indexOf(",") + 1)
		: logoInput;

	// Проверяем валидность base64
	if (!/^[A-Za-z0-9+/=]*$/.test(pureBase64)) {
		console.error("Invalid base64 string");
		return "";
	}

	return pureBase64;
}

function cleanHex(hexString: string): string {
	return hexString.startsWith("0x") ? hexString.slice(2) : hexString;
}
