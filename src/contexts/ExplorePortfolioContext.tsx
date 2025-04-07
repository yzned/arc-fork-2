import { ExplorePortfolioStore } from "@/store/explore-portfolio";
import { createContext, useContext, useState } from "react";

interface StoreProviderState {
	store?: ExplorePortfolioStore;
	setStore: (store: ExplorePortfolioStore) => void;
}

interface StoreProviderProps {
	children: React.ReactNode;
}

const initialState: StoreProviderState = {
	store: undefined,
	setStore: () => null,
};

const ExplorePortfolioProviderContext = createContext(initialState);
const _ExplorePortfolio = new ExplorePortfolioStore();

export function ExplorePortfolioProvider({
	children,
	...props
}: StoreProviderProps) {
	const [_store, _setStore] = useState(_ExplorePortfolio);

	return (
		<ExplorePortfolioProviderContext.Provider
			{...props}
			value={{
				store: _store,
				setStore: _setStore,
			}}
		>
			{children}
		</ExplorePortfolioProviderContext.Provider>
	);
}

export function useExplorePortfolio() {
	const context = useContext(ExplorePortfolioProviderContext);
	if (context === undefined) {
		throw new Error("useStoreProvider must be used within a StoreProvider");
	}

	return _ExplorePortfolio;
}
