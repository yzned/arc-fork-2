// import { GetMultipoolInfo } from "@/api/explore";
import { GetMultipoolChartStats } from "@/api/explore";
import { queryKeys } from "@/api/types";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import ERC20 from "@/lib/abi/ERC20";
import Multipool from "@/lib/abi/Multipool";
import { feesCoefficients, PRICE_FEEDS, twoPow96 } from "@/lib/constants";
import type { AssetData, ChainId, PorfolioAsset } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { type Address, maxUint256, zeroAddress } from "viem";
import { useChainId, usePublicClient, useReadContract } from "wagmi";
import { useCurrentPortfolio } from "../use-current-portfolio";
import { useMetadataChain } from "../use-metadata-chain";
import { decodePriceData } from "@/lib/utils";

import { v4 as uuidv4 } from "uuid";

function bytesToBits(bytes: Uint8Array): boolean[] {
	const bits: boolean[] = [];

	for (const byte of bytes) {
		for (let i = 0; i < 8; i++) {
			bits.push((byte & (1 << (7 - i))) !== 0);
		}
	}

	return bits;
}

function unpackMpFees1(b: string) {
	const hex = b.startsWith("0x") ? b.slice(2) : b;
	const bytes = new Uint8Array(hex.length / 2);

	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
	}

	const allBits = bytesToBits(bytes);

	const readBits = (startBit: number, bitLength: number): number => {
		let value = 0;
		for (let i = 0; i < bitLength; i++) {
			if (allBits[startBit + i]) {
				value |= 1 << (bitLength - 1 - i);
			}
		}
		return value;
	};

	return {
		oracleAddress: `0x${Array.from(bytes.slice(0, 20))
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("")}`,

		deviationIncreaseFee: readBits(160, 19),
		feeToCashbackRatio: readBits(179, 19),
		baseFee: readBits(198, 20),
		lpFee: readBits(218, 19),
		managerFee: readBits(237, 19),
	};
}

function unpackMpFees2(b: string) {
	const hex = b.startsWith("0x") ? b.slice(2) : b;
	const bytes = new Uint8Array(hex.length / 2);

	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
	}

	const allBits = bytesToBits(bytes);

	const readBits = (startBit: number, bitLength: number): bigint => {
		let value = 0n;
		for (let i = 0; i < bitLength; i++) {
			if (allBits[startBit + i]) {
				value |= 1n << BigInt(bitLength - 1 - i);
			}
		}
		return value;
	};

	return {
		collectedLpFee: readBits(0, 112),
		collectedManagementFee: readBits(112, 112),
		totalTargetShares: readBits(224, 16),
		deviationLimit: readBits(240, 16),
	};
}
export const useMultipoolInfo = () => {
	const client = usePublicClient();
	const chainId = useChainId();
	const currentMultipool = useCurrentPortfolio();
	const { chain } = useMetadataChain();

	const {
		setMultipoolSupplyPriceData,
		setPortfolioAssets,
		setBaseFee,
		setDeviationFee,
		setDeviationLimit,
		setManagementFee,
		setManagementFeeRecipient,
		setCashbackFeeShare,
		setManagingAssets,
	} = useExplorePortfolio();

	const { data: assetsAddresses } = useReadContract({
		abi: Multipool,
		functionName: "getUsedAssets",
		address: currentMultipool.address as Address,
		args: [BigInt(maxUint256), BigInt(0)],
		chainId: chainId as ChainId,
	});

	useQuery({
		queryKey: [queryKeys.portfolioFees],
		queryFn: async () => {
			const rowFees = await client?.readContract({
				abi: Multipool,
				address: currentMultipool.address as Address,
				functionName: "getConfig",
			});

			const fees1 = unpackMpFees1(rowFees?.[0] || zeroAddress);
			const fees2 = unpackMpFees2(rowFees?.[1] || zeroAddress);

			setBaseFee((fees1.baseFee * 100 * feesCoefficients[0]).toString());
			setDeviationFee(
				(fees1.deviationIncreaseFee * 100 * feesCoefficients[1]).toString(),
			);
			setDeviationLimit(
				(Number(fees2.deviationLimit) * 100 * feesCoefficients[2]).toString(),
			);
			setManagementFee(
				(fees1.managerFee * 100 * feesCoefficients[1]).toString(),
			);
			setCashbackFeeShare(
				(fees1.feeToCashbackRatio * 100 * feesCoefficients[1]).toString(),
			);
			setManagementFeeRecipient(
				rowFees?.[2] === zeroAddress ? "" : rowFees?.[2] || "",
			);
			return {};
		},
		enabled: !!currentMultipool.address && !!chainId,
		refetchIntervalInBackground: true,
		refetchOnWindowFocus: false,
	});

	useQuery({
		queryKey: [queryKeys.portfolioPriceData, currentMultipool.address, chainId],
		queryFn: async () => {
			const etfData = await GetMultipoolChartStats({
				m: currentMultipool.address as Address,
				r: 86400,
			});

			const totalSuply = new BigNumber(BigInt(etfData.t).toString()).div(
				twoPow96,
			);
			const price = new BigNumber(etfData.c.toString()).div(twoPow96);

			const tvl = totalSuply.multipliedBy(price);

			const open = new BigNumber(etfData.o || 0).div(twoPow96);
			const close = new BigNumber(etfData.c || 0).div(twoPow96);

			const absolute24hPriceChange = price.minus(open);

			const relative24hPriceChange = new BigNumber(
				open.isZero()
					? "0"
					: new BigNumber(absolute24hPriceChange)
							.multipliedBy(100)
							.dividedBy(close)
							.toString(),
			);

			setMultipoolSupplyPriceData({
				absolute24hPriceChange,
				relative24hPriceChange,
				tvl,
				close,
				open,
				price,
			});

			return {};
		},
		enabled: !!currentMultipool.address && !!chainId,
		refetchInterval: 1000,
		refetchIntervalInBackground: true,
		refetchOnWindowFocus: false,
	});

	useQuery({
		queryKey: [queryKeys.porfolioAssets],
		enabled:
			!!currentMultipool.address &&
			!!client &&
			!!assetsAddresses &&
			!!chain.availableTokens,
		queryFn: async () => {
			if (!assetsAddresses) {
				throw new Error("Assets addresses are not available");
			}

			if (!client) {
				throw new Error("Client is not available");
			}

			const results = await client.multicall({
				contracts: assetsAddresses[0].flatMap((address) => [
					{
						abi: Multipool,
						address: currentMultipool.address,
						functionName: "getAsset",
						args: [address],
						chainId,
					},
					{
						abi: Multipool,
						address: currentMultipool.address,
						functionName: "getPrice",
						args: [address],
						chainId,
					},
					{
						abi: ERC20,
						address,
						functionName: "decimals",
						chainId,
					},
					{
						abi: Multipool,
						address: currentMultipool.address,
						functionName: "getPriceFeed",
						args: [address],
						chainId,
					},
				]),
			});

			const rawAssets = assetsAddresses[0]
				.map((address, index) => {
					const baseIndex = index * 4;

					if (
						results?.[baseIndex].status !== "success" ||
						results?.[baseIndex + 1].status !== "success" ||
						results?.[baseIndex + 2].status !== "success" ||
						results?.[baseIndex + 3].status !== "success"
					) {
						console.warn(`Skipping asset ${address} due to failed calls`);
						return null;
					}

					const assetData = results[baseIndex].result as unknown as AssetData;

					const rawPrice = results[baseIndex + 1]?.result;

					const price = new BigNumber(
						typeof rawPrice === "bigint" ||
							typeof rawPrice === "number" ||
							typeof rawPrice === "string"
							? BigInt(rawPrice).toString()
							: "0",
					).div(twoPow96);

					const decimal = results[baseIndex + 2].result || 18;

					const priceData = decodePriceData(
						(results[baseIndex + 3]?.result as Address) || zeroAddress,
					);

					const priceFeedData = PRICE_FEEDS[Number(priceData.priceOracleIndex)];

					const quantity = new BigNumber(assetData?.[1].toString()).div(
						new BigNumber(10).pow(decimal.toString()),
					);

					const image = chain.availableTokens?.find(
						(t) => t.address === address,
					)?.logo;
					const symbol = chain.availableTokens?.find(
						(t) => t.address === address,
					)?.symbol;

					const value = quantity.multipliedBy(price);

					const targetShare = new BigNumber(assetData?.[3]?.toString())
						.div(100)
						.toNumber();

					return {
						image,
						symbol,
						address,
						targetShare,
						price,
						quantity,
						value,
						decimal: Number(decimal),
						priceFeedData,
						poolAddress: priceData.oracleAddress,
					};
				})
				.filter((a) => a !== null);

			const totalValue = rawAssets.reduce(
				(acc, a) => acc.plus(a?.value || 0),
				new BigNumber(0),
			);

			const combinedAssets = rawAssets.map((asset) => ({
				image: asset?.image,
				symbol: asset?.symbol,
				address: asset?.address as Address,
				price: asset?.price.toString(),
				decimal: asset?.decimal,
				targetShare: asset?.targetShare,
				priceFeedData: asset?.priceFeedData,
				quantity: asset?.quantity.toString(),
				poolAddress: asset.poolAddress,
				currentShare: totalValue.isZero()
					? "0"
					: asset?.value.dividedBy(totalValue).multipliedBy(100).toString(),
			})) as PorfolioAsset[];

			setPortfolioAssets(combinedAssets);

			setManagingAssets(
				combinedAssets.map((asset) => ({
					id: uuidv4(),
					name: asset.symbol || "Unknown",
					symbol: asset.symbol || "",
					address: asset.address as Address,
					creationState: "readed",
					share: asset.targetShare.toString() || "0",
					targetShare: asset.targetShare.toString() || "0",
					logo: asset.image,
					poolAddress: asset.poolAddress,
					priceFeedType: asset.priceFeedData,
					priceFeedData: asset.priceFeedData,
				})),
			);

			return combinedAssets;
		},
		refetchOnWindowFocus: false,
		refetchIntervalInBackground: true,
	});

	return {};
};
