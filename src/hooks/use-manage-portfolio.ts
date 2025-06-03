import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import Multipool from "@/lib/abi/Multipool";
import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
	type Address,
	encodeFunctionData,
	formatUnits,
	zeroAddress,
} from "viem";
import {
	useAccount,
	useEstimateGas,
	useGasPrice,
	usePublicClient,
	useWriteContract,
} from "wagmi";
import { useToast } from "./use-toast";

import { Same } from "@/api/uniswap";
import { PRICE_FEEDS, feesCoefficients } from "@/lib/constants";
import { encodePriceData } from "@/lib/utils";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { useMetadataChain } from "./use-metadata-chain";

export const useManagePortfolio = () => {
	const { manageState } = useExplorePortfolio();
	const { writeContractAsync, isError } = useWriteContract();
	const { id } = useParams({ from: "/manage/$id" });
	const { address } = useAccount();
	const { toast } = useToast();

	const { t } = useTranslation(["main"]);

	const client = usePublicClient();

	const { chain } = useMetadataChain();

	const {
		managingAsssets,
		baseFee,
		deviationFee,
		deviationLimit,
		cashbackFeeShare,
		managementFee,
		managementFeeRecepient,
	} = useExplorePortfolio();

	const assetAddresses = managingAsssets
		?.filter((item) => item.address !== undefined)
		?.map((item) => item.address as Address);

	const shares = managingAsssets
		?.filter((item) => item.share)
		?.map((item) => {
			if (item.creationState === "deleted") {
				return 0;
			}
			return Number(item.share) * 100;
		});

	const { data: updateAssetsGasEstimate } = useEstimateGas({
		to: id as Address,
		account: address,
		query: {
			enabled: !!id,
		},
		data: encodeFunctionData({
			abi: Multipool,
			functionName: "updateAssets",
			args: [[], [], assetAddresses || [], shares || []],
		}),
	});

	const { data: gasPrice } = useGasPrice();

	const calculateFee = () => {
		if (!updateAssetsGasEstimate || !gasPrice) return BigInt(0);
		return updateAssetsGasEstimate * gasPrice;
	};

	const currentNetworkFee = formatUnits(
		calculateFee() || 0n,
		chain?.nativeCurrency?.decimals || 18,
	);

	const changeFees = async () => {
		if (manageState === "fees") {
			try {
				await writeContractAsync({
					abi: Multipool,
					address: id as Address,
					functionName: "setFeeParams",
					account: address,
					args: [
						Math.round(Number(deviationFee || 0) / 100 / feesCoefficients[1]),
						Math.round(Number(deviationLimit || 0) / 100 / feesCoefficients[2]),
						Math.round(
							Number(cashbackFeeShare || 0) / 100 / feesCoefficients[1],
						),
						Math.round(Number(baseFee || 0) / 100 / feesCoefficients[0]),
						Math.round(Number(managementFee || 0) / 100 / feesCoefficients[1]),
						0,
						(managementFeeRecepient as Address) || zeroAddress,
						zeroAddress,
						(chain?.oracleAddress as Address) || zeroAddress,
					],
				});

				if (!isError) {
					toast({
						title: t("manageFees"),
						description: t("successfullySigned"),
						variant: "success",
						withTimeline: true,
					});
				} else {
					toast({
						title: t("manageFees"),
						description: t("errorSigning"),
						variant: "error",
						withTimeline: true,
					});
				}
			} catch (e) {
				console.log("e: ", e);
				toast({
					title: t("manageFees"),
					description: t("errorSigning"),
					variant: "error",
					withTimeline: true,
				});
			}
		}
	};

	const changeShares = async () => {
		if (manageState === "asset-setup") {
			try {
				const priceData = await Promise.all(
					managingAsssets?.map(async (token) => {
						if (!client) {
							throw new Error("Client is not defined");
						}

						const [token0] = await client.multicall({
							contracts: [
								{
									address: token.poolAddress as Address,
									abi: IUniswapV3PoolABI.abi,
									functionName: "token0",
								},
							],
						});

						const isToken0Native = Same(
							token0.result?.toString() || "",
							chain?.nativeTokenAddress || "",
						);

						if (token.priceFeedType) {
							const priceFeedTypeIndex = PRICE_FEEDS?.indexOf(
								token?.priceFeedType,
							);

							return encodePriceData(
								token.poolAddress as Address,
								isToken0Native,
								BigInt(0),
								priceFeedTypeIndex,
							);
						}

						return encodePriceData(zeroAddress, false, BigInt(0));
					}) || [],
				);

				/// добавление токена (к существующиму списку)
				// 	assetAddresses - адрес нового токена
				// 	priceData - его прайс дата (если есть)
				// 	его шейр

				/// удаление токена
				// assetAddresses - токен который я хочу удалить
				// priceData - его прайс дата
				// шейр - нулевый шейр

				/// изменение таргет шейр
				// assetAddresses - токен который я хочу обновить
				// priceData - его прайс дата
				// шейр - новый шейр

				await writeContractAsync({
					abi: Multipool,
					address: id as Address,
					functionName: "updateAssets",
					account: address,
					args: [
						assetAddresses || [],
						priceData || [],
						assetAddresses || [],
						shares || [],
					],
				});

				if (!isError) {
					toast({
						title: t("manageAssets"),
						description: t("successfullySigned"),
						variant: "success",
						withTimeline: true,
					});
				} else {
					toast({
						title: t("manageAssets"),
						description: t("errorSigning"),
						variant: "error",
						withTimeline: true,
					});
				}
			} catch (e) {
				console.log("e: ", e);
				toast({
					title: t("manageAssets"),
					description: t("errorSigning"),
					variant: "error",
					withTimeline: true,
				});
			}
		}
	};

	return { changeShares, changeFees, currentNetworkFee };
};
