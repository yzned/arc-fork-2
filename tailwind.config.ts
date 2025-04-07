import type { Config } from "tailwindcss";
export default {
	content: ["./src/*", "./playwright/*", "./tests/*"],
	theme: {
		extend: {},
	},
	plugins: [],
} satisfies Config;
