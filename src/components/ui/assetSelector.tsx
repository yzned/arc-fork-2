import { observer } from "mobx-react-lite";
import { ModalBase } from "./modalBase";
import { useAccountStore } from "@/contexts/AccountContext";
import SearchAssetIcon from "../../icons/searchAsset.svg?react";
import { useTranslation } from "react-i18next";
import type { ShortPoolData, Token } from "@/lib/types";
import { FindAsset } from "./findAsset";
import { ARBITRUM_TOKENS, wETH_ADDRESS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { usePools } from "@/hooks/queries/usePools";
import LinkIcon from "@/icons/link.svg?react";
import { Button } from "./button";
import SmallXIcon from "@/icons/smallX.svg?react";

export const AssetSelector = observer(
	({
		logo,
		symbol,
		onSelectAsset,
	}: {
		logo?: string;
		symbol?: string;
		onSelectAsset: (item: Token) => void;
	}) => {
		const { isOpenAssetSelector, setIsOpenAssetSelector } = useAccountStore();
		const { t } = useTranslation(["main"]);

		return (
			<div>
				<ModalBase
					isOpen={isOpenAssetSelector}
					onClose={() => setIsOpenAssetSelector(false)}
					className="h-[600px] w-[800px] rounded-[8px] "
				>
					<AssetSelectorModalContent onSelectAsset={onSelectAsset} />
				</ModalBase>

				<button
					type="button"
					onClick={() => {
						setIsOpenAssetSelector(true);
					}}
					className="mt-[1px] flex w-[248px] justify-between border-fill-secondary border-b py-2"
				>
					{logo && symbol ? (
						<div className="flex h-[21px] items-center gap-2">
							<img src={logo} className="h-4 w-4" alt="no-logo" />
							<span className="text-[16px]">{symbol}</span>
						</div>
					) : (
						<span className="text-text-secondary">{t("selectToken")}</span>
					)}
					<SearchAssetIcon className="mt-2" />
				</button>
			</div>
		);
	},
);

export const AssetSelectorModalContent = observer(
	({ onSelectAsset }: { onSelectAsset?: (item: Token) => void }) => {
		const { t } = useTranslation(["main"]);

		const { setIsOpenAssetSelector } = useAccountStore();

		const handleCopy = (value: string) => {
			navigator.clipboard
				.writeText(value)
				.catch((err) => console.error("Failed to copy : ", err));
		};

		const { tokensInformation } = useAccountStore();

		const [pools, setPools] = useState<ShortPoolData[]>();

		const tokens = ARBITRUM_TOKENS.map((item) => {
			const tokenInfo = tokensInformation.find(
				(info) => info.address === item.address,
			);

			return {
				...item,
				price: tokenInfo?.price?.toFixed(2)?.toString() || "",
			};
		});

		const [selectedAsset, setSelectedAsset] = useState<Token>(tokens[0]);

		useEffect(() => {
			async function fetchPools() {
				try {
					setPools([]);

					const poolsData = await usePools(wETH_ADDRESS, selectedAsset.address);

					const filteredPools = poolsData?.filter(
						(pool) => pool?.liquidity !== undefined && pool.fee !== undefined,
					);

					setPools(filteredPools);
				} catch (err) {
					console.error(err);
				}
			}

			fetchPools();
		}, [selectedAsset]);

		return (
			<div>
				<div className="flex h-[600px] overflow-hidden ">
					<FindAsset
						variant="with-additional-data"
						defaultActiveItem={tokens[0]}
						data={tokens}
						additionalActiveItemInfo={pools}
						className="px-4 py-6 w-[400px] h-[570px]"
						onSelectAsset={(item) => {
							setSelectedAsset(item);
						}}
						filters={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6", "Tag7"]}
					/>

					<div className="flex h-full w-[400px] flex-col justify-between border-r-[1px] border-r-fill-secondary bg-fill-primary-800">
						<div className="flex w-full flex-col gap-6 px-4 pt-6">
							<div className="flex items-center justify-between">
								<div className="flex gap-4 font-[600] font-namu uppercase">
									<span className="text-[24px] text-text-primary">
										{selectedAsset?.price} $
									</span>
								</div>
								<Button
									variant={"tertiary"}
									className="h-[32px] w-[66px]"
									onClick={() => {
										setIsOpenAssetSelector(false);
									}}
								>
									<SmallXIcon
										className="h-[10px] w-[10px] scale-75 cursor-pointer transition-transform duration-300"
										width={10}
										height={10}
									/>
									<span>ESC</span>
								</Button>
							</div>

							<div className="flex flex-col gap-8 ">
								<span className=" text-[14px] text-text-secondary ">
									{selectedAsset?.description}
								</span>
							</div>
						</div>
						<div className="flex flex-col gap-4 p-4">
							<div className="flex flex-wrap gap-2">
								{selectedAsset?.tags?.map((tag) => (
									<div
										key={tag}
										className="flex h-8 w-fit items-center justify-center rounded-[4px] bg-fill-secondary px-2 text-[14px] text-text-primary"
									>
										{tag}
									</div>
								))}
							</div>
							<div className="flex flex-wrap gap-2">
								<button
									type="button"
									onClick={() => {
										if (selectedAsset?.address)
											handleCopy(selectedAsset?.address.toString());
									}}
									className="flex h-8 cursor-pointer items-center gap-4 rounded-[4px] bg-fill-secondary px-3 text-[14px]"
								>
									<span className="text-text-primary ">
										{selectedAsset?.symbol}
									</span>
									<div className="flex items-center text-text-secondary gap-1">
										<span className="font-droid text-[12px]">{`${selectedAsset?.address.slice(0, 4)}...${selectedAsset?.address.slice(-4)}`}</span>
										<LinkIcon className="mb-[2px] scale-85" />
									</div>
								</button>
							</div>
							<Button
								onClick={() => {
									if (onSelectAsset) onSelectAsset(selectedAsset);
									setIsOpenAssetSelector(false);
								}}
								className="h-[42px]"
							>
								{t("useThisAsset")}
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	},
);
