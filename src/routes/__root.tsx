import { useMediaQuery } from "@uidotdev/usehooks";

import { AppHeader, AppHeaderMobile } from "@/components/header/AppHeader";
import { ExplorePortfolioProvider } from "@/contexts/ExplorePortfolioContext";
import { getMultipoolsList } from "@/hooks/queries/useMultipoolsList";
import { useTokensInformation } from "@/hooks/queries/useTokensInformation";
import { ExplorePortfolioStore } from "@/store/explore-portfolio";
import { Outlet, createRootRoute, useRouter } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React, { Suspense, useEffect } from "react";

const TanStackRouterDevtools =
	process.env.NODE_ENV === "production"
		? () => null // Render nothing in production
		: React.lazy(() =>
				// Lazy load in development
				import("@tanstack/router-devtools").then((res) => ({
					default: res.TanStackRouterDevtools,
					// For Embedded Mode
					// default: res.TanStackRouterDevtoolsPanel
				})),
			);

const ScrollToTop = () => {
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = router.subscribe("onLoad", () => {
			window.scrollTo(0, 0);
		});

		return () => unsubscribe();
	}, [router]);

	return null;
};

export const Route = createRootRoute({
	loader: async () => {
		return await getMultipoolsList();
	},
	component: observer(() => {
		const portfolios = Route.useLoaderData();

		const isMobile = useMediaQuery("(max-width: 768px)");

		useTokensInformation();

		const store = new ExplorePortfolioStore(portfolios);

		return (
			<ExplorePortfolioProvider store={store}>
				<div className="relative max-w-full bg-bg-floor-0">
					{isMobile ? <AppHeaderMobile /> : <AppHeader />}
					<hr />
					<Outlet />
					<Suspense>
						<TanStackRouterDevtools />
					</Suspense>
					<ScrollToTop />
				</div>
			</ExplorePortfolioProvider>
		);
	}),
});

// import { computePoolAddress } from "@uniswap/v3-sdk";
// import { Token } from "@uniswap/sdk-core";
// import {
// 	ARBITRUM_CHAIN_ID,
// 	UNISWAP_POOL_FACTORY_CONTRACT_ADDRESS,
// } from "@/lib/constants";
// import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
// import { useReadContracts } from "wagmi";

// const UNI_FEES = [500, 1000, 3000];

// export const usePools = (addressA: string, addressB: string) => {
// 	let poolAddresses: string[] = [];

// 	const tokenA = new Token(ARBITRUM_CHAIN_ID, addressA, 18);

// 	const tokenB = new Token(ARBITRUM_CHAIN_ID, addressB, 6);

// 	UNI_FEES.map((fee) => {
// 		const currentPoolAddress = computePoolAddress({
// 			factoryAddress: UNISWAP_POOL_FACTORY_CONTRACT_ADDRESS,
// 			tokenA,
// 			tokenB,
// 			fee,
// 		});

// 		poolAddresses = [...poolAddresses, currentPoolAddress];
// 	});

// 	const { data: liquidities } = useReadContracts({
// 		contracts: poolAddresses.map((address) => ({
// 			abi: IUniswapV3PoolABI.abi,
// 			address,
// 			functionName: "liquidity",
// 		})),
// 	});

// 	const { data: prices } = useReadContracts({
// 		contracts: poolAddresses.map((address) => ({
// 			abi: IUniswapV3PoolABI.abi,
// 			address,
// 			functionName: "slot0",
// 		})),
// 	});

// 	const poolsData = poolAddresses.map((address, index) => {
// 		const price = prices && prices[index]?.result?.[0];

// 		return {
// 			poolAddress: address,
// 			liquidity: liquidities ? liquidities[index].result : null,
// 			price: price ? price.toString() : null,
// 			fee: UNI_FEES[index],
// 		};
// 	});

// 	return poolsData;
// };
