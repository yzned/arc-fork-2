import type { ExplorePortfolioStore } from "@/store/explore-portfolio";
import { createContext, useContext, useState } from "react";

interface StoreProviderState {
	store: ExplorePortfolioStore | undefined;
	setStore: (store: ExplorePortfolioStore) => void;
}

interface StoreProviderProps {
	store: ExplorePortfolioStore;
	children: React.ReactNode;
}

const initialState: StoreProviderState = {
	store: undefined,
	setStore: () => null,
};

const ExplorePortfolioProviderContext = createContext(initialState);

export function ExplorePortfolioProvider({
	children,
	store,
	...props
}: StoreProviderProps) {
	const [_store, _setStore] = useState(store);

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
	if (!context.store) {
		throw new Error("Store is not initialized");
	}

	return context.store;
}
