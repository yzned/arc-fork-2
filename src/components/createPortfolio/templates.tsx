import type { AvailableChainTokensDataFormated } from "@/api/types";
import { useCreatePortfolio } from "@/contexts/CreatePortfolioContext";
import { useTokensList } from "@/hooks/queries/useTokensList";
import { useMetadataChain } from "@/hooks/use-metadata-chain";
import CheckIcon from "@/icons/checkMark.svg?react";
import Chevron from "@/icons/chevron.svg?react";
import ResetIcon from "@/icons/refresh.svg?react";
import type { Category, SetupToken } from "@/lib/types";
import { observer } from "mobx-react-lite";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { zeroAddress } from "viem";
import { Button } from "../ui/button";
import { FindAsset } from "../ui/findAsset";
import { ModalBase } from "../ui/modalBase";

interface TemplateItemType {
	category?: Category;
	onSelect?: () => void;
	isFocused?: boolean;
	addedToken?: AvailableChainTokensDataFormated | null;
	onDeleteItem?: () => void;
}

interface SetupTokenExtended extends SetupToken {
	categoryName?: string;
}

export const TemplatesModal = observer(() => {
	const { setIsOpenTemplateModal, isOpenTemplateModal } = useCreatePortfolio();

	return (
		<div>
			<ModalBase
				isOpen={isOpenTemplateModal.isOpen}
				onClose={() => setIsOpenTemplateModal(false, 100)}
				className="h-[600px] w-[924px] overflow-hidden rounded-[8px]"
			>
				<TemplateModalContent />
			</ModalBase>
		</div>
	);
});

export const TemplateModalContent = observer(() => {
	const { setIsOpenTemplateModal, isOpenTemplateModal } = useCreatePortfolio();
	const { t } = useTranslation(["main"]);
	const { addNewToken, editToken, deleteAllTokens } = useCreatePortfolio();
	const { chain } = useMetadataChain();
	const { data: chainsTokens } = useTokensList();

	const openedTemplate = chain?.creationTemplates?.find(
		(_, index) => index === isOpenTemplateModal.id,
	);

	const firstActiveItem = (item: Category) => {
		const lsData = localStorage.getItem(
			`${chain?.id}-${isOpenTemplateModal.id}-${item?.name}`,
		);
		return !lsData;
	};

	const [templateTokens, setTemplateTokens] = useState<string[]>(() => {
		if (!openedTemplate?.categories) return [];

		return openedTemplate.categories.reduce<string[]>((acc, category) => {
			const lsData = localStorage.getItem(
				`${chain?.id}-${isOpenTemplateModal.id}-${category.name}`,
			);

			if (lsData) {
				const token = JSON.parse(lsData) as AvailableChainTokensDataFormated;
				if (token.address) {
					acc.push(token.address);
				}
			}

			return acc;
		}, []);
	});

	const [addedToken, setAddedToken] =
		useState<AvailableChainTokensDataFormated | null>(null);

	const handleReset = useCallback(
		(category: Category) => {
			localStorage.removeItem(
				`${chain?.id}-${isOpenTemplateModal.id}-${category.name}`,
			);
			setAddedToken(null);
			setTemplateTokens((prev) =>
				prev.filter((addr) => addr !== category.selectToken?.address),
			);
		},
		[chain?.id, isOpenTemplateModal.id],
	);

	const handleSaveCategory = (
		item: AvailableChainTokensDataFormated | null,
	) => {
		localStorage.setItem(
			`${chain?.id}-${isOpenTemplateModal.id}-${focusedCategory?.name}`,
			JSON.stringify({ ...item, categoryName: focusedCategory?.name }),
		);

		if (focusedCategory && openedTemplate?.categories) {
			setAddedToken(item);
		}
	};

	const handleUseCurrentTemplate = () => {
		const ls_tokens = openedTemplate?.categories
			?.map((item) => {
				const lsData = localStorage.getItem(
					`${chain?.id}-${isOpenTemplateModal.id}-${item?.name}`,
				);
				return lsData ? (JSON.parse(lsData) as SetupTokenExtended) : null;
			})
			.filter(Boolean);

		deleteAllTokens();

		ls_tokens?.map((item) => {
			const id = uuidv4();

			addNewToken(id);

			const share = openedTemplate?.categories?.find(
				(category) => category.name === item?.categoryName,
			)?.share;

			editToken({
				id,
				name: item?.name || "",
				symbol: item?.symbol || "",
				address: item?.address,
				decimals: item?.decimals,
				logo: item?.logo,
				poolAddress: item?.poolAddress,
				priceFeedType: "UniswapV3",
				creationState: "readed",
				share: share?.toString() || "0",
			});
		});
		setIsOpenTemplateModal(false, 100);
	};

	const [focusedCategory, setFocusedCategory] = useState<Category | undefined>(
		openedTemplate?.categories?.find(firstActiveItem) || undefined,
	);

	useEffect(() => {
		if (addedToken && focusedCategory && openedTemplate?.categories) {
			setFocusedCategory(undefined);
		}
	}, [addedToken]);

	const assetList = useMemo(() => {
		const selectedTokens = (openedTemplate?.categories || []).reduce<string[]>(
			(acc, category) => {
				const lsData = localStorage.getItem(
					`${chain?.id}-${isOpenTemplateModal.id}-${category.name}`,
				);
				if (lsData) {
					const token = JSON.parse(lsData) as AvailableChainTokensDataFormated;
					if (token.address) {
						acc.push(token.address);
					}
				}
				return acc;
			},
			[],
		);
		return (
			chainsTokens?.filter((token) => {
				const isInCategory = focusedCategory?.tokens?.includes(
					token.address || zeroAddress,
				);
				const isNotSelected = !selectedTokens.includes(token?.address || "");
				return isInCategory && isNotSelected;
			}) || []
		);
	}, [
		chain,
		focusedCategory,
		isOpenTemplateModal.id,
		openedTemplate?.categories,
	]);

	useEffect(() => {
		if (!openedTemplate?.categories) return;

		const tokens = openedTemplate.categories.reduce<string[]>(
			(acc, category) => {
				const lsData = localStorage.getItem(
					`${chain?.id}-${isOpenTemplateModal.id}-${category.name}`,
				);

				if (lsData) {
					const token = JSON.parse(lsData) as AvailableChainTokensDataFormated;
					if (token.address) {
						acc.push(token.address);
					}
				}

				return acc;
			},
			[],
		);

		setTemplateTokens(tokens);
	}, [
		openedTemplate?.categories,
		chain?.id,
		isOpenTemplateModal.id,
		addedToken,
		handleReset,
	]);

	return (
		<div className="flex h-full ">
			<div className="flex h-full w-[50%] flex-col gap-10 bg-fill-primary-800 p-4">
				<div className="flex items-center justify-between">
					<Button
						variant={"tertiary"}
						className="h-[32px] w-[91px]"
						onClick={() => {
							setIsOpenTemplateModal(false, 100);
						}}
					>
						<Chevron className="-rotate-90 scale-80" />
						{t("back")}
					</Button>
					<div className="text-text-secondary">
						{templateTokens.length}/{openedTemplate?.categories?.length}{" "}
						{t("selected")}
					</div>
				</div>

				<div className="flex h-full flex-col">
					<div className="flex flex-col gap-4">
						<p className="font-namu text-[24px] text-text-primary leading-[100%]">
							{openedTemplate?.name}
						</p>
						<p className="text-text-secondary">{t("selectAssetFor")}</p>
					</div>
					<div className="mt-4 flex h-[374px] flex-col gap-2 overflow-scroll ">
						{openedTemplate?.categories?.map((item) => {
							return (
								<TemplateItem
									category={item}
									key={item.name}
									isFocused={item.name === focusedCategory?.name}
									addedToken={addedToken}
									onDeleteItem={() => {
										handleReset(item);
									}}
									onSelect={() => {
										setFocusedCategory(item);
									}}
								/>
							);
						})}
					</div>
					<Button
						className="mt-1 h-[42px] w-full"
						onClick={handleUseCurrentTemplate}
						disabled={
							!(templateTokens.length === openedTemplate?.categories?.length)
						}
					>
						{t("useThisTemplate")}
					</Button>
				</div>
			</div>
			<FindAsset
				data={assetList}
				className="h-[600px] w-[50%] p-4"
				variant="with-oracles"
				onSelectAsset={(item) => {
					handleSaveCategory(item);
				}}
				withSearch={false}
			/>
		</div>
	);
});

const TemplateItem: FC<TemplateItemType> = ({
	category,
	onSelect,
	isFocused,
	addedToken,
	onDeleteItem,
}) => {
	const { t } = useTranslation(["main"]);

	const { chain } = useMetadataChain();
	const { isOpenTemplateModal } = useCreatePortfolio();

	const lsData = localStorage.getItem(
		`${chain?.id}-${isOpenTemplateModal.id}-${category?.name}`,
	);

	const lsItem = lsData
		? (JSON.parse(lsData) as AvailableChainTokensDataFormated)
		: null;

	const [selectedToken, setSelectedToken] = useState(lsItem);

	useEffect(() => {
		if (addedToken && isFocused) {
			setSelectedToken(addedToken);
		}
	}, [addedToken]);

	return (
		<div
			data-focused={isFocused}
			data-lsItem={!!lsItem}
			className="group flex h-[120px] w-full flex-col gap-6 rounded-[8px] border border-fill-secondary p-4 transition-all data-[lsItem=true]:border-fill-secondary data-[focused=true]:bg-fill-secondary data-[lsItem=false]:data-[focused=false]:hover:border-fill-tertiary"
		>
			<div
				data-focused={isFocused}
				data-lsItem={!!lsItem}
				className="flex h-6 items-center justify-between text-text-tertiary transition-colors data-[focused=true]:text-text-primary data-[lsItem=true]:text-text-primary data-[focused=false]:group-hover:text-text-primary"
			>
				<div className="flex items-center gap-2">
					<div
						data-lsItem={!!lsItem}
						data-focused={isFocused}
						className="flex h-4 w-4 items-center justify-center rounded-full border transition-colors data-[focused=false]:border-text-tertiary data-[focused=true]:border-text-primary data-[lsItem=true]:border-none data-[lsItem=true]:bg-fill-brand-primary-700 data-[focused=false]:group-hover:border-text-primary "
					>
						<CheckIcon
							data-lsItem={!!lsItem}
							className="h-[7px] w-[13px] text-text-primary data-[lsItem=false]:hidden "
						/>
					</div>
					<span data-focused={isFocused}>{category?.name}</span>
				</div>
				<div className="flex items-center gap-4">
					<span>{category?.share}%</span>

					<Button
						variant={"tertiary"}
						data-lsItem={!!lsItem}
						className="h-[32px] w-[99px] data-[lsItem=false]:hidden"
						onClick={() => {
							if (onDeleteItem) onDeleteItem();
							setSelectedToken(null);
						}}
					>
						{t("reset")}
						<ResetIcon className="scale-90" />
					</Button>
				</div>
			</div>

			{selectedToken ? (
				<div className="flex h-10 gap-4">
					<img
						src={selectedToken?.logo || "/icons/empty-token.svg"}
						className="h-10 w-10 rounded-full"
						alt={""}
					/>
					<div className="flex flex-col items-start justify-center">
						<span className="font-[600] font-namu text-[14px] text-text-primary uppercase">
							{selectedToken?.symbol || "-"}
						</span>
						<span className="font-[600] font-namu text-[14px] text-text-tertiary">
							{selectedToken?.name}
						</span>
					</div>
				</div>
			) : (
				<button
					type="button"
					disabled={!!selectedToken}
					data-lsItem={!!lsItem}
					onClick={onSelect}
					data-focused={isFocused}
					className=" relative flex h-10 w-full items-center justify-center rounded-[2px] border border-fill-secondary border-dashed text-text-tertiary transition-colors data-[lsItem=false]:data-[focused=false]:cursor-pointer data-[focused=true]:border-fill-brand-secondary-500 data-[focused=true]:text-fill-brand-secondary-500 data-[focused=false]:group-hover:bg-fill-secondary data-[focused=false]:group-hover:text-text-primary"
				>
					<span> {t("selectAsset")}</span>
					<div
						data-focused={isFocused}
						className="absolute right-[14px] flex gap-0 data-[focused=false]:hidden"
					>
						<Chevron className="rotate-90" />
						<Chevron className="-ml-[18px] rotate-90" />
					</div>
				</button>
			)}
		</div>
	);
};
