import { createContext, useContext, useState } from "react";

interface StoreProviderState<T> {
	store?: T;
	setStore: React.SetStateAction<T>;
}

interface StoreProviderProps<T> {
	children: React.ReactNode;
	store: T;
}

const StoreProviderContext = createContext<StoreProviderState<unknown>>({
	store: undefined,
	setStore: () => {},
});

export function StoreProvider<T>({
	children,
	store,
	...props
}: StoreProviderProps<T>) {
	const [_store, _setStore] = useState(store);

	return (
		<StoreProviderContext.Provider
			{...props}
			value={{
				store: _store,
				setStore: _setStore,
			}}
		>
			{children}
		</StoreProviderContext.Provider>
	);
}

export function useStoreProvider<T>() {
	const context = useContext(StoreProviderContext);
	if (context === undefined) {
		throw new Error("useStoreProvider must be used within a StoreProvider");
	}

	return context.store as T;
}
