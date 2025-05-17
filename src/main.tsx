import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { scan } from "react-scan";
import "./lib/i18n";
import "@rainbow-me/rainbowkit/styles.css";
import { TooltipProvider } from "./components/ui/tooltips/Tooltip";
import { routeTree } from "./routeTree.gen";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum } from "wagmi/chains";
import type { Config } from "wagmi";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toast";
import { AccountStoreProvider } from "./contexts/AccountContext";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chains } from "./lib/constants";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			experimental_prefetchInRender: true,
		},
	},
});

const rootElement = document.getElementById("root");

// check if its dev build
if (import.meta.env.MODE === "development") {
	scan({
		enabled: true,
	});
}

export const config = getDefaultConfig({
	appName: "ARCANUM",
	projectId: "1d63d7e43fd1d5ea177bdb4a8939ade4",
	chains: chains,
}) as Config;

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);

	root.render(
		<AccountStoreProvider>
			<TooltipProvider delayDuration={50}>
				<QueryClientProvider client={queryClient}>
					<WagmiProvider config={config}>
						<RainbowKitProvider initialChain={arbitrum}>
							<RouterProvider router={router} />
							<Toaster />
						</RainbowKitProvider>
					</WagmiProvider>
				</QueryClientProvider>
			</TooltipProvider>
		</AccountStoreProvider>,
	);
}
