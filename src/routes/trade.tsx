import { ExplorePortfolioStore } from "@/store/explore-portfolio";
import { StoreProvider } from "@/store/store-context";
import { createFileRoute } from "@tanstack/react-router";
import { MainSection, RightSection } from "./explore/$id";

export const Route = createFileRoute("/trade")({
	component: RouteComponent,
});

function RouteComponent() {
	const store = new ExplorePortfolioStore();

	return (
		<StoreProvider store={store}>
			<div className="flex h-[1450px] w-full">
				<MainSection />
				<RightSection />
			</div>
		</StoreProvider>
	);
}
