import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useParams } from "@tanstack/react-router";

export function useCurrentPortfolio() {
	const { allPortfolios } = useExplorePortfolio();
	const exploreId = useParams({ shouldThrow: false, from: "/explore/$id" });
	const manageId = useParams({ shouldThrow: false, from: "/manage/$id" });

	const id = exploreId?.id || manageId?.id;

	const currentPortfolio =
		allPortfolios?.find(
			(item) => item.address?.toLowerCase() === id?.toLowerCase(),
		) ?? allPortfolios?.[0];

	return currentPortfolio;
}
