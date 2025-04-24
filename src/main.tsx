import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./lib/i18n";
import { TooltipProvider } from "./components/ui/tooltips/Tooltip";
import { routeTree } from "./routeTree.gen";
import "react-spring-bottom-sheet/dist/style.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AccountStoreProvider } from "./contexts/AccountContext";
import { ExplorePortfolioProvider } from "./contexts/ExplorePortfolioContext";
import { config } from "./lib/config";
import { privyConfig } from "./lib/privyConfig";

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

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);

	root.render(
		<AccountStoreProvider>
			<ExplorePortfolioProvider>
				<PrivyProvider appId="cm8q7k9oy0013v3x1kqstk46c" config={privyConfig}>
					<TooltipProvider delayDuration={50}>
						<QueryClientProvider client={queryClient}>
							<WagmiProvider config={config}>
								<RouterProvider router={router} />
							</WagmiProvider>
						</QueryClientProvider>
					</TooltipProvider>
				</PrivyProvider>
			</ExplorePortfolioProvider>
		</AccountStoreProvider>,
	);
}
