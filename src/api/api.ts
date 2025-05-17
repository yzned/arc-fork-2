const apiRoot = "https://api.arcanum.to";
import { pack, unpack } from "msgpackr";

export class ApiError extends Error {
	constructor(description: string, error: string, trace_id: string) {
		super(error);
		this.name = "ApiError";
		this.message = description;
		this.stack = trace_id;
	}
}

async function request(
	entrypoint: string,
	method: "POST" | "GET" = "GET",
	body?: object,
) {
	const address =
		apiRoot + (entrypoint[0] === "/" ? entrypoint : `/${entrypoint}`);

	const res = await fetch(address, {
		method,
		body: JSON.stringify(body),
		headers: {
			...(body && { "Content-Type": "application/json" }),
		},
	});

	if (!res.ok) {
		const error = await res.json();
		throw new ApiError(error.description, error.error, error.trace_id);
	}

	return await res.json();
}

async function requestWithMsgpack(
	entrypoint: string,
	method: "POST" | "GET" = "GET",
	body?: object,
) {
	const address =
		apiRoot + (entrypoint[0] === "/" ? entrypoint : `/${entrypoint}`);

	const res = await fetch(address, {
		method,
		body: method === "POST" ? pack(body) : JSON.stringify(body),
		headers: {
			...(body && { "Content-Type": "application/msgpack" }),
			Accept: "application/x-msgpack",
		},
	});

	if (!res.ok) {
		try {
			const errorBuffer = await res.arrayBuffer();
			const errorData = unpack(new Uint8Array(errorBuffer));
			throw new ApiError(
				errorData.description || "Unknown error",
				errorData.error || "server_error",
				errorData.trace_id || "",
			);
		} catch {
			const error = await res.json().catch(() => ({
				description: "Failed to parse error response",
				error: "parse_error",
				trace_id: "",
			}));
			throw new ApiError(error.description, error.error, error.trace_id);
		}
	}

	const buffer = await res.arrayBuffer();
	return unpack(new Uint8Array(buffer));
}

const api = {
	get(
		entrypoint: string,
		queryObj?:
			| string
			| URLSearchParams
			| Record<string, string | number>
			| [string, string | number][],
	) {
		let queryStr = "";
		if (queryObj) {
			const normalized = new URLSearchParams(
				Object.entries(queryObj).map(([key, value]) => [key, value.toString()]),
			);
			queryStr = `?${normalized.toString()}`;
		}
		return request(entrypoint + queryStr);
	},

	post(entrypoint: string, body?: object) {
		return request(entrypoint, "POST", body);
	},

	getMsgpack(
		entrypoint: string,
		queryObj?:
			| string
			| URLSearchParams
			| Record<string, string | number | (string | number)[]>
			| [string, string | number][],
	) {
		let queryStr = "";

		if (queryObj) {
			if (typeof queryObj === "string" || queryObj instanceof URLSearchParams) {
				queryStr = `?${queryObj.toString()}`;
			} else if (Array.isArray(queryObj)) {
				const sp = new URLSearchParams();
				for (const [key, value] of queryObj) {
					if (Array.isArray(value)) {
						sp.append(key, JSON.stringify(value));
					} else {
						sp.append(key, value.toString());
					}
				}
				queryStr = `?${sp.toString()}`;
			} else {
				const sp = new URLSearchParams();
				for (const [key, val] of Object.entries(queryObj)) {
					if (Array.isArray(val)) {
						sp.append(key, JSON.stringify(val));
					} else {
						sp.append(key, val.toString());
					}
				}
				queryStr = `?${sp.toString()}`;
			}
		}

		return requestWithMsgpack(entrypoint + queryStr);
	},

	postMsgpack(entrypoint: string, body?: object) {
		return requestWithMsgpack(entrypoint, "POST", body);
	},
};

export { api };
