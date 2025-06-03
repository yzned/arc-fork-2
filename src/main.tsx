import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { scan } from "react-scan";
import "./lib/i18n";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Config } from "wagmi";
import { WagmiProvider, usePublicClient } from "wagmi";
import {
	type Chain,
	arbitrum,
	arbitrumSepolia,
	monadTestnet,
} from "wagmi/chains";
import { Toaster } from "./components/ui/toast";
import { TooltipProvider } from "./components/ui/tooltips/Tooltip";
import { AccountStoreProvider } from "./contexts/AccountContext";
import { routeTree } from "./routeTree.gen";

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
	chains: [arbitrum, arbitrumSepolia, monadTestnet] as [Chain, ...Chain[]],
}) as Config;

const router = createRouter({
	routeTree,
	context: {
		// biome-ignore lint/style/noNonNullAssertion: i dont care
		publicClient: undefined!,
	},
});

function Contexts({
	children,
}: { children: React.ReactNode | React.ReactNode[] }) {
	return (
		<AccountStoreProvider>
			<TooltipProvider delayDuration={50}>
				<QueryClientProvider client={queryClient}>
					<WagmiProvider config={config}>
						<RainbowKitProvider initialChain={monadTestnet}>
							{children}
						</RainbowKitProvider>
					</WagmiProvider>
				</QueryClientProvider>
			</TooltipProvider>
		</AccountStoreProvider>
	);
}

function Root() {
	const publicClient = usePublicClient();

	return (
		<>
			<RouterProvider
				router={router}
				context={{ publicClient: publicClient }}
			/>
			<ReactQueryDevtools initialIsOpen={true} />
			<Toaster />
		</>
	);
}

if (!rootElement) {
	throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
	<Contexts>
		<Root />
	</Contexts>,
);
