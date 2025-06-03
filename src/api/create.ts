import { api } from "./api";

export async function CreateMultipool({
	l, // logo_bytes (base64 строка или data-URI)
	n, // name
	s, // symbol
	d, // description
	m, //multipool
}: {
	l: string;
	n: string;
	s: string;
	d: string;
	m: string;
}) {
	const logoBytes = prepareLogoBase64(l);

	const normalizedRequest = {
		l: logoBytes,
		n,
		s,
		d,
		m,
	};

	console.log("m: ", m);

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

export function cleanHex(hexString: string): string {
	return hexString.startsWith("0x") ? hexString.slice(2) : hexString;
}
