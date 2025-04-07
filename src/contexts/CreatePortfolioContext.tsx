import { CreatePortfolioStore } from "@/store/create-portfolio";
import { createContext, useContext, useState } from "react";

interface StoreProviderState {
	store?: CreatePortfolioStore;
	setStore: (store: CreatePortfolioStore) => void;
}

interface StoreProviderProps {
	children: React.ReactNode;
}

const initialState: StoreProviderState = {
	store: undefined,
	setStore: () => null,
};

const CreatePortfolioProviderContext = createContext(initialState);
const _CreatePortfolio = new CreatePortfolioStore();

export function CreatePortfolioProvider({
	children,
	...props
}: StoreProviderProps) {
	const [_store, _setStore] = useState(_CreatePortfolio);

	return (
		<CreatePortfolioProviderContext.Provider
			{...props}
			value={{
				store: _store,
				setStore: _setStore,
			}}
		>
			{children}
		</CreatePortfolioProviderContext.Provider>
	);
}

export function useCreatePortfolio() {
	const context = useContext(CreatePortfolioProviderContext);
	if (context === undefined) {
		throw new Error("useStoreProvider must be used within a StoreProvider");
	}

	return _CreatePortfolio;
}
