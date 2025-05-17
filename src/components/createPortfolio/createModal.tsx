import { useAccountStore } from "@/contexts/AccountContext";
import { useCreatePortfolio as useCreatePortfolioContext } from "@/contexts/CreatePortfolioContext";
import { useCreatePortfolio } from "@/hooks/mutations/useCreatePortfolio";
import CheckIcon from "@/icons/checkMark.svg?react";
import LinkIcon from "@/icons/link.svg?react";
import SmallXIcon from "@/icons/smallX.svg?react";
import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { ModalBase } from "../ui/modalBase";

export const CreateModal = observer(() => {
	const { isOpenCreateModal, setIsOpenCreateModal } =
		useCreatePortfolioContext();

	return (
		<div>
			<ModalBase
				isOpen={isOpenCreateModal}
				onClose={() => setIsOpenCreateModal(false)}
				className="h-[454px] w-[444px] rounded-[8px] p-4"
			>
				<CreateModalContent />
			</ModalBase>
		</div>
	);
});
export const CreateModalContent = observer(() => {
	const {
		setIsOpenCreateModal,
		currentCreateModalState,
		initialLiquidityToken,
		createTxHash,
		mintTxHash,
		errorStepInCreation,
		futureMultipoolAddress,
	} = useCreatePortfolioContext();

	const navigate = useNavigate();
	const { t } = useTranslation(["main"]);

	const { approveMint, isPending, createPortfolio, mint } =
		useCreatePortfolio();

	const handleSign = () => {
		if (currentCreateModalState === "create") {
			createPortfolio();
		}
		if (currentCreateModalState === "approve") {
			approveMint();
		}
		if (currentCreateModalState === "mint") {
			mint();
		}
		if (currentCreateModalState === "final") {
			navigate({
				to: "/explore/$id",
				params: { id: futureMultipoolAddress || "" },
			});
		}
	};

	return (
		<div className="flex h-full flex-col justify-between">
			<header className="flex w-full justify-between">
				<span className="font-[600] font-namu text-[24px] text-white uppercase ">
					{t("signTransactions")}
				</span>
				<Button
					variant={"tertiary"}
					className=" h-[32px] w-[66px]"
					onClick={() => {
						setIsOpenCreateModal(false);
					}}
				>
					<SmallXIcon
						className="h-[10px] w-[10px] scale-75 cursor-pointer transition-transform duration-300"
						width={10}
						height={10}
					/>
					<span>ESC</span>
				</Button>
			</header>

			<div className="flex flex-col gap-1">
				<SignStepItem
					active={currentCreateModalState === "create"}
					number={1}
					inProcess={currentCreateModalState === "create" && isPending}
					isDone={currentCreateModalState !== "create"}
					name={t("createPortfolio")}
					txHash={createTxHash}
					isError={errorStepInCreation === 1}
				/>
				<div className="ml-5 h-[33px] w-[1px] bg-fill-tertiary" />
				<SignStepItem
					active={currentCreateModalState === "approve"}
					number={2}
					name={`${t("approveSpending")}: ${initialLiquidityToken?.symbol || ""}`}
					inProcess={currentCreateModalState === "approve" && isPending}
					isDone={
						currentCreateModalState !== "create" &&
						currentCreateModalState !== "approve"
					}
					isError={errorStepInCreation === 2}
				/>

				<div className="ml-5 h-[33px] w-[1px] bg-fill-tertiary" />

				<SignStepItem
					active={currentCreateModalState === "mint"}
					number={3}
					name={t("depositInitialLiquidity")}
					inProcess={currentCreateModalState === "mint" && isPending}
					isDone={currentCreateModalState === "final"}
					txHash={mintTxHash}
					isError={errorStepInCreation === 3}
				/>
			</div>
			<Button
				className="h-10"
				onClick={handleSign}
				disabled={isPending || errorStepInCreation !== 0}
				variant={currentCreateModalState === "final" ? "secondary" : "primary"}
			>
				{isPending && t("signingInWallet")}
				{currentCreateModalState === "final" && t("goToPortfolio")}
				{errorStepInCreation !== 0 && t("retrySigning")}
				{!isPending &&
					currentCreateModalState !== "final" &&
					errorStepInCreation === 0 &&
					t("sign")}
			</Button>
		</div>
	);
});

const SignStepItem = observer(
	({
		active,
		number,
		name,
		inProcess,
		isDone,
		isError,
		txHash,
	}: {
		active: boolean;
		number: number;
		name: string;
		inProcess: boolean;
		isDone: boolean;
		txHash?: string;
		isError: boolean;
	}) => {
		const { t } = useTranslation(["main"]);
		const { currentChain } = useAccountStore();
		const { setErrorStepInCreation } = useCreatePortfolioContext();
		const [countdown, setCountdown] = useState<number | null>(null);

		useEffect(() => {
			let timer: NodeJS.Timeout;

			if (isError) {
				setCountdown(10);

				timer = setInterval(() => {
					setCountdown((prev) => {
						if (prev === null) return null;
						if (prev <= 1) {
							clearInterval(timer);
							setErrorStepInCreation(0);
							return null;
						}
						return prev - 1;
					});
				}, 1000);
			} else {
				setCountdown(null);
			}

			return () => {
				if (timer) clearInterval(timer);
			};
		}, [isError, setErrorStepInCreation]);

		return (
			<div className="flex justify-between">
				<div className="flex items-center gap-3">
					<div
						data-active={active}
						className="flex h-10 w-10 items-center justify-center rounded-full bg-fill-secondary pb-1 font-namu text-[24px] text-text-secondary data-[active=true]:bg-fill-brand-primary-700 data-[active=true]:text-text-primary"
					>
						{!isDone && number}
						{isDone && (
							<CheckIcon
								className="mt-1 text-text-primary"
								width={16}
								height={12}
							/>
						)}
					</div>
					<div
						data-active={active}
						className="flex flex-col gap-[6px] text-text-tertiary data-[active=true]:text-text-primary"
					>
						<span className="text-[16px]">{name}</span>
						<div className="flex gap-3">
							<div className="w-fit rounded-[2px] bg-fill-secondary px-[6px]">
								{inProcess && t("inProcess")}
								{isDone && t("done")}
								{isError && t("error")}
								{!inProcess && !isDone && !isError && t("toSign")}
							</div>
							<span className="text-text-secondary">
								{countdown !== null && `${t("retry")} ${countdown}s`}
							</span>
						</div>
					</div>
				</div>
				{txHash && (
					<a
						className="flex h-10 w-[74px] items-center justify-center gap-2 rounded-[4px] bg-bg-floor-0 text-text-secondary transition-colors hover:text-fill-brand-secondary-500 "
						href={`${currentChain?.blockExplorers?.default.url}/tx/${txHash}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<span>TXN</span> <LinkIcon className="mb-[2px]" />{" "}
					</a>
				)}
			</div>
		);
	},
);
