import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import { useBurn } from "@/hooks/queries/useBurn";
import { useBurnSteps } from "@/hooks/queries/useBurnSteps";
import { useMint } from "@/hooks/queries/useMint";
import { useMintSteps, useMintStepsNative } from "@/hooks/queries/useMintSteps";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import { Stepper } from "../ui/stepper";

export const MintButton = observer(() => {
	const [open, setOpen] = useState(false);
	const { address } = useAccount();
	const { selectedAsset, mintBurnAmount, rightSectionState } =
		useExplorePortfolio();

	if (rightSectionState === "mint") {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button
						className="mt-4 h-10 w-full"
						disabled={!address || !selectedAsset || !mintBurnAmount}
					>
						Mint
					</Button>
				</DialogTrigger>
				<DialogContent className="rounded-[8px] border-none bg-[#17161B] p-4 sm:max-w-[425px]">
					<StepperActionMint />
				</DialogContent>
			</Dialog>
		);
	}
	if (rightSectionState !== "burn" && rightSectionState !== "settings") {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button
						className="mt-4 h-10 w-full"
						disabled={!address || !selectedAsset || !mintBurnAmount}
					>
						Mint
					</Button>
				</DialogTrigger>
				<DialogContent className="rounded-[8px] border-none bg-[#17161B] p-4 sm:max-w-[425px]">
					{selectedAsset?.address ===
					"0x0000000000000000000000000000000000000000" ? (
						<StepperActionMintNative />
					) : (
						<StepperActionMint />
					)}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className="mt-4 h-10 w-full"
					disabled={!address || !selectedAsset || !mintBurnAmount}
				>
					Burn
				</Button>
			</DialogTrigger>
			<DialogContent className="rounded-[8px] border-none bg-[#17161B] p-4 sm:max-w-[425px]">
				<StepperActionBurn />
			</DialogContent>
		</Dialog>
	);
});

const StepperActionMintNative = observer(() => {
	const { steps, currentStep, setMintHash } = useMintStepsNative();
	const { callStep } = useMint({ step: 1, onSwap: setMintHash });

	return (
		<>
			<DialogHeader>
				<DialogTitle className="font-namu text-2xl text-[#EAEAEA] uppercase">
					sign transactions
				</DialogTitle>
			</DialogHeader>
			<Stepper steps={steps} currentStep={currentStep} />
			<ActionButtonMint callStep={callStep} />
		</>
	);
});

const StepperActionMint = observer(() => {
	const { steps, currentStep, setApproveHash, setMintHash } = useMintSteps();
	const { callStep } = useMint({
		step: currentStep,
		onApprove: setApproveHash,
		onSwap: setMintHash,
	});

	return (
		<>
			<DialogHeader>
				<DialogTitle className="font-namu text-2xl text-[#EAEAEA] uppercase">
					sign transactions
				</DialogTitle>
			</DialogHeader>
			<Stepper steps={steps} currentStep={currentStep} />
			<ActionButtonMint callStep={callStep} />
		</>
	);
});

const ActionButtonMint = observer(({ callStep }: { callStep: () => void }) => {
	const { address } = useAccount();

	if (!address) {
		return (
			<Button className="mt-4 h-10 w-full" disabled={true}>
				Mint
			</Button>
		);
	}

	return (
		<Button className="mt-4 h-10 w-full" onClick={() => callStep()}>
			Mint
		</Button>
	);
});

const StepperActionBurn = observer(() => {
	const { steps, currentStep, setApproveHash, setMintHash } = useBurnSteps();
	const { callStep } = useBurn({
		step: currentStep,
		onApprove: setApproveHash,
		onSwap: setMintHash,
	});

	return (
		<>
			<DialogHeader>
				<DialogTitle className="font-namu text-2xl text-[#EAEAEA] uppercase">
					sign transactions
				</DialogTitle>
			</DialogHeader>
			<Stepper steps={steps} currentStep={currentStep} />
			<ActionButtonBurn callStep={callStep} />
		</>
	);
});

const ActionButtonBurn = observer(({ callStep }: { callStep: () => void }) => {
	const { address } = useAccount();

	if (!address) {
		return (
			<Button className="mt-4 h-10 w-full" disabled={true}>
				Burn
			</Button>
		);
	}

	return (
		<Button className="mt-4 h-10 w-full" onClick={() => callStep()}>
			Burn
		</Button>
	);
});
