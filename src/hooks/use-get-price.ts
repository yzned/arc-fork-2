// import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
// import { useQuery } from "@tanstack/react-query";

export const useGetPrice = () => {
	// const priceIds = [
	// 	"0xe786153cc54abd4b0e53b4c246d54d9f8eb3f3b5a34d4fc5a2e9a423b0ba5d6b",
	// ];

	// const price = useQuery({
	// 	queryKey: ["price"],
	// 	queryFn: async () => {
	// 		try {
	// 			const connection = new EvmPriceServiceConnection(
	// 				"https://hermes-beta.pyth.network",
	// 			);

	// 			const priceFeeds = await connection.getLatestPriceFeeds(priceIds);
	// 			console.log("priceFeeds: ", priceFeeds);
	// 		} catch (e) {
	// 			console.log("ОШИБКА", e);
	// 		}
	// 	},
	// });

	return { price: 2 };
};
