const apiRoot = "https://api.arcanum.to";

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
	//
	const address =
		apiRoot + (entrypoint[0] === "/" ? entrypoint : `/${entrypoint}`);
	// const token = localStorage.getItem(LS_TOKEN) || null;

	const res = await fetch(address, {
		method,
		body: JSON.stringify(body),
		headers: {
			...(body && { "Content-Type": "application/json" }),
			// ...(token && { Authorization: `Bearer ${token}` }),
		},
	});

	if (!res.ok) {
		const error = await res.json();
		throw new ApiError(error.description, error.error, error.trace_id);
	}

	return await res.json();
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
};

export { api };
