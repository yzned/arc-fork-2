import { TokenSetup } from "@/components/createPortfolio/TokenSetup";
import { CreatePortfolioStore } from "@/store/create-portfolio";
import { StoreProvider } from "@/store/store-context";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stake")({
	component: RouteComponent,
});

function RouteComponent() {
	const store = new CreatePortfolioStore();

	return (
		<StoreProvider store={store}>
			<TokenSetup />
		</StoreProvider>
	);
}
