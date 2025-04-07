import { AccountStore } from "@/store/account";
import { createContext, useContext, useState } from "react";

interface StoreProviderState {
	store?: AccountStore;
	setStore: (store: AccountStore) => void;
}

interface StoreProviderProps {
	children: React.ReactNode;
}

const initialState: StoreProviderState = {
	store: undefined,
	setStore: () => null,
};

const AccountStoreProviderContext = createContext(initialState);
const _AccountStore = new AccountStore();

export function AccountStoreProvider({
	children,
	...props
}: StoreProviderProps) {
	const [_store, _setStore] = useState(_AccountStore);

	return (
		<AccountStoreProviderContext.Provider
			{...props}
			value={{
				store: _store,
				setStore: _setStore,
			}}
		>
			{children}
		</AccountStoreProviderContext.Provider>
	);
}

export function useAccountStore() {
	const context = useContext(AccountStoreProviderContext);
	if (context === undefined) {
		throw new Error("useStoreProvider must be used within a StoreProvider");
	}

	return _AccountStore;
}
