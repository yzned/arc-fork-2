import type { AvailableChainTokensDataFormated } from "@/api/types";
import { useAccountStore } from "@/contexts/AccountContext";
import SmallXIcon from "@/icons/smallX.svg?react";
import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import SearchAssetIcon from "../../icons/searchAsset.svg?react";
import { Button } from "./button";
import { FindAsset } from "./findAsset";
import { ModalBase } from "./modalBase";

export const AssetSelector = observer(
	({
		logo,
		symbol,
		onSelectAsset,
		className,
	}: {
		logo?: string;
		symbol?: string;
		className?: string;
		onSelectAsset: (item: AvailableChainTokensDataFormated | null) => void;
	}) => {
		const { isOpenAssetSelector, setIsOpenAssetSelector } = useAccountStore();
		const { t } = useTranslation(["main"]);

		return (
			<div>
				<ModalBase
					isOpen={isOpenAssetSelector}
					onClose={() => setIsOpenAssetSelector(false)}
					className="h-[calc(100svh-40px)] w-[462px] rounded-[8px] "
				>
					<AssetSelectorModalContent onSelectAsset={onSelectAsset} />
				</ModalBase>

				<button
					type="button"
					onClick={() => {
						setIsOpenAssetSelector(true);
					}}
					className={cn(
						"mt-[1px] flex w-[248px] justify-between border-fill-secondary border-b py-2",
						className,
					)}
				>
					{symbol ? (
						<div className="flex h-[21px] items-center gap-2">
							<img
								src={logo || "/icons/empty-token.svg"}
								className="h-4 w-4"
								alt="no-logo"
							/>
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
	({
		onSelectAsset,
	}: {
		onSelectAsset?: (item: AvailableChainTokensDataFormated | null) => void;
	}) => {
		const { t } = useTranslation(["main"]);

		const { setIsOpenAssetSelector, currentChain } = useAccountStore();

		return (
			<div className="flex h-full flex-col overflow-hidden">
				<div className="pt-4 pl-6 ">
					<span className="font-[600] font-namu text-[72px] text-white uppercase leading-[93px] ">
						{t("assets")}
					</span>
					<Button
						variant={"tertiary"}
						className="absolute right-4 h-[32px] w-[66px]"
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

				<span className=" mt-5 overflow-clip text-nowrap border-[#252627] border-t border-b py-px font-droid text-[10px] text-text-tertiary leading-[120%]">
					{
						"/////////////////////////////////.- .-. -.-. .- -. ..- -- //////////////////////////////////////////"
					}
				</span>

				<FindAsset
					variant="with-oracles"
					// defaultActiveItem={currentChain?.availableTokens?.[0] || {}}
					data={currentChain?.availableTokens || []}
					className="h-[70%] w-full "
					onSelectAsset={(item) => {
						if (onSelectAsset) onSelectAsset(item);
						setIsOpenAssetSelector(false);
					}}
					listClassName="px-2"
					filters={["Tag1", "Tag2", "Tag3", "Tag4", "Tag5", "Tag6", "Tag7"]}
				/>
			</div>
		);
	},
);
