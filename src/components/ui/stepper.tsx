import { Check } from "lucide-react";
import type { Hash } from "viem";

export interface Step {
	id: string;
	title: string;
	description?: string;
	txnHash?: Hash;
}

export const Stepper = ({
	steps,
	currentStep,
}: {
	steps: Step[];
	currentStep: number;
}) => {
	const isStepCompleted = (stepIndex: number) => stepIndex < currentStep;
	const isStepActive = (stepIndex: number) => stepIndex === currentStep;

	return (
		<div className="w-full">
			<nav aria-label="Progress">
				<ol className="flex flex-col space-y-10">
					{steps.map((step, index) => (
						<li key={step.id || index} className="flex h-[49px] w-full">
							{/* Step Circle */}
							<div className="relative flex items-center">
								<button
									type="button"
									className={`flex h-10 w-10 flex-shrink-0 cursor-pointer items-start justify-center rounded-full pt-1 font-namu text-2xl uppercase transition-all duration-200 ${
										isStepCompleted(index)
											? "bg-[#333340] text-[#EAEAEA] hover:bg-[#0148FE]/90"
											: isStepActive(index)
												? "bg-[#0148FE] text-[#EAEAEA]"
												: "bg-[#333340] text-[#EAEAEA]"
									}`}
									aria-current={isStepActive(index) ? "step" : undefined}
								>
									{isStepCompleted(index) ? (
										<Check className="mt-auto mb-auto h-5 w-5" />
									) : (
										<span
											data-active={isStepActive(index)}
											className="font-[600] text-[#8A8B8C] leading-[115%] data-[active=true]:text-[#EAEAEA]"
										>
											{index + 1}
										</span>
									)}
								</button>

								{/* Vertical Connector Line */}
								{index < steps.length - 1 && (
									<div className="-translate-x-1/2 absolute top-[53px] left-1/2 h-[33px] w-px transform bg-[#434355]" />
								)}
							</div>

							{/* Step Content */}
							<div className="ml-4 flex min-w-0 flex-1 flex-col items-start justify-between">
								<div
									className={`font-droid text-[16px] ${
										isStepActive(index)
											? "text-[#EAEAEA]"
											: isStepCompleted(index)
												? "text-[#646466]"
												: "text-[#646466]"
									}`}
								>
									{step.title}
								</div>
								{step.description && (
									<div className="mt-1 text-muted-foreground text-sm">
										{step.description}
									</div>
								)}
								<div className="h-[22px] rounded-xs bg-[#333340] px-2 pt-0.5">
									<span
										data-active={isStepActive(index)}
										className="font-droid text-[#646466] text-sm leading-[0px] data-[active=true]:text-[#EAEAEA]"
									>
										{isStepCompleted(index) ? "Done" : "To sign"}
									</span>
								</div>
							</div>
						</li>
					))}
				</ol>
			</nav>
		</div>
	);
};
