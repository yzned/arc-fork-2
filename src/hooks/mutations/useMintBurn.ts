import { useAccountStore } from "@/contexts/AccountContext";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import Multipool from "@/lib/abi/Multipool";
import { useWallets } from "@privy-io/react-auth";
import { useParams } from "@tanstack/react-router";
import { parseUnits, type Address } from "viem";
import { arbitrumSepolia } from "viem/chains";

export const useMintBurn = () => {
	const { wallets } = useWallets();
	const { selectedAsset, rightSectionState, mintBurnAmount } =
		useExplorePortfolio();
	const { currentClient } = useAccountStore();
	const { id: mpAddress } = useParams({ from: "/explore/$id" });

	// минтить  = класть
	// берн = забирать

	// при минте assetInAddress - тот что кладу в етф , a assetOutAddress - etf address
	// при берне наоборот
	const isMint = rightSectionState === "mint";

	const swapArgs = {
		oraclePrice: {
			//адрес мп
			contractAddress: "0x0000000000000000000000000000000000000000" as Address,
			timestamp: BigInt(Math.floor(Date.now() / 1000)), //
			sharePrice: BigInt(0.000001 * 1e18),
			signature: "0x0000000000000000000000000000000000000000" as Address,
		},
		assetInAddress: isMint
			? (selectedAsset.address as Address)
			: (mpAddress as Address),

		assetOutAddress: isMint
			? (mpAddress as Address)
			: (selectedAsset.address as Address),
		// если тру - асети ин адрес , если фалсе - асет оут адрес
		// если тру - то свап амонут - сколько я закидываю , если фалсе - сколько я забирю
		swapAmount: parseUnits(mintBurnAmount?.toString() || "0", 18),
		isExactInput: isMint,

		data: {
			receiverAddress: wallets[0]?.address as Address, // кому я свапаю
			refundAddress: wallets[0]?.address as Address,
			refundEthToReceiver: true, // если тру то refundAddress не нужен , если фалсе тогда нужен
		},
	};

	const handleSimulate = async () => {
		const { result } = await currentClient.simulateContract({
			value: BigInt(1e18),
			address: mpAddress as Address,
			abi: Multipool,
			functionName: "swap",
			args: [
				swapArgs.oraclePrice,
				swapArgs.assetInAddress,
				swapArgs.assetOutAddress,
				swapArgs.swapAmount,
				swapArgs.isExactInput,
				swapArgs.data,
			],
			// chainId: currentChain.id,
			chain: arbitrumSepolia,
			account: wallets[0]?.address as Address,
		});

		console.log("result: ", result);

		// console.log("result: ", result);
	};

	return { handleSimulate };
};
