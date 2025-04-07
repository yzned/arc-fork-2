import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
	type PlaywrightTestConfig,
	defineConfig,
	devices,
} from "@playwright/experimental-ct-react";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const __filename = fileURLToPath(import.meta.url);
const esdirname = dirname(__filename);

const config: PlaywrightTestConfig = {
	testDir: "./tests",
	snapshotDir: "./snapshots",
	snapshotPathTemplate: "./snapshots/{testFilePath}/{arg}{ext}",
	timeout: 10 * 1000,
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	expect: {
		timeout: 10000,
		toMatchSnapshot: {
			threshold: process.env.CI ? 0.2 : 0,
		},
	},
	use: {
		trace: "on-first-retry",
		ctPort: 3100,
		screenshot: {
			mode: "on",
			omitBackground: true,
		},
		ctViteConfig: {
			plugins: [react(), tailwindcss(), svgr()],
			resolve: {
				alias: {
					"@": path.resolve(esdirname, "./src"),
				},
			},
		},
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
};

export default defineConfig(config);
