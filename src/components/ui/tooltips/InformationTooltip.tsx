import QuestionIcon from "@/icons/question.svg?react";
import { cn } from "@/lib/utils";
import type { TooltipContentProps } from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

export const InfoTooltip = ({
	children,
	className,
	contentProps,
}: {
	children?: ReactNode;
	className?: string;
	contentProps?: TooltipContentProps;
}) => {
	return (
		<>
			<Tooltip>
				<TooltipTrigger className={cn("cursor-pointer", className)}>
					<QuestionIcon width={13} className="text-text-tertiary" />
				</TooltipTrigger>
				<TooltipContent
					{...contentProps}
					className="px-4 py-3 font-droid text-[14px]"
				>
					<div className="w-fit ">{children ?? <p>no content provided</p>}</div>
				</TooltipContent>
			</Tooltip>
		</>
	);
};
