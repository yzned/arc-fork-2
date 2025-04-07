import type { BalancesToken } from "@/lib/types";
import { observer } from "mobx-react-lite";

import { useAccountStore } from "@/contexts/AccountContext";
import { useExplorePortfolio } from "@/contexts/ExplorePortfolioContext";
import RoundedCheckIcon from "@/icons/roundedCheck.svg?react";
import SmallXIcon from "@/icons/smallX.svg?react";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { ModalBase } from "../../ui/modalBase";

export const BalancesTable = observer(() => {
	const { isOpenTransferModal, setIsOpenTransferModal } = useExplorePortfolio();

	const { tokensInformation } = useAccountStore();
	const { t } = useTranslation(["main"]);

	return (
		<div className="max-h-[590px] w-full overflow-auto">
			<ModalBase
				isOpen={isOpenTransferModal}
				onClose={() => setIsOpenTransferModal(false)}
				className="h-[400px] w-[516px] rounded-[8px]"
			>
				<TransferModalContent />
			</ModalBase>

			<table className="w-full border-collapse ">
				<thead
					className="sticky top-0 z-10 grid w-full bg-fill-primary-800"
					style={{
						gridTemplateColumns: "103px 187px 101px  1fr 133px",
					}}
				>
					<tr className="contents text-[14px] text-text-secondary">
						<th className="px-4 py-3 text-left">{t("asset")}</th>
						<th className="px-4 py-3 text-left">{t("quantity")}</th>
						<th className="py-3 pr-2 text-right">{t("price")}, $</th>
						<th className="py-3 pl-5 text-left ">{t("address")}</th>
						<th />
					</tr>
				</thead>

				<tbody className="w-full text-white ">
					{tokensInformation?.map((row, index) => (
						<BalancesTableRow row={row} key={`${index}-${row.address}`} />
					))}
				</tbody>
			</table>
		</div>
	);
});

const BalancesTableRow = observer(({ row }: { row: BalancesToken }) => {
	const { setIsOpenTransferModal } = useExplorePortfolio();

	const { t } = useTranslation(["main"]);

	return (
		<tr
			className="grid border-b border-b-fill-primary-700 transition-colors duration-400 ease-out hover:bg-fill-primary-700"
			style={{
				gridTemplateColumns: "103px 187px 101px 1fr 133px",
			}}
		>
			<td className="flex items-center gap-2 px-3 py-4 text-left">
				<img src={row.logo} alt="icon1" className="h-4 w-4 overflow-hidden" />
				<span>{row.symbol}</span>
			</td>

			<td className="px-4 py-4">{row.quantityOnWallet?.toFixed(4)}</td>

			<td className="py-4 pr-2 text-right">{row.price?.toFixed(4)}</td>

			<a
				onClick={(e) => {
					e.stopPropagation();
				}}
				href={`https://arbiscan.io/token/${row.address}`}
				className="flex items-center gap-2 py-4 pl-5 text-[14px] text-fill-brand-secondary-500 transition-colors hover:text-text-brand-primary"
			>
				{`${row.address.slice(0, 5)}...${row.address.slice(-4)}`}
			</a>

			<td className=" flex items-center justify-center">
				<Button
					variant={"tertiary"}
					className="h-[32px]"
					onClick={() => setIsOpenTransferModal(true)}
				>
					{t("transfer")}
				</Button>
			</td>
		</tr>
	);
});

const TransferModalContent = observer(() => {
	const { setIsOpenTransferModal } = useExplorePortfolio();
	const { t } = useTranslation(["main"]);

	return (
		<div className="flex h-full flex-col justify-between p-4">
			<div>
				<div className="flex items-center justify-between">
					<span className="font-[600] font-namu text-[24px] text-white uppercase ">
						{t("transferAsset")}
					</span>
					<Button
						variant={"tertiary"}
						className="h-[32px] w-[66px]"
						onClick={() => {
							setIsOpenTransferModal(false);
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

				<div className="mt-6">
					<Input
						placeholder="0xAbCd...1234"
						type=""
						className=" text-text-primary"
						label={t("address")}
					/>
				</div>
			</div>
			<Button className="flex h-10 w-full items-center">
				<span> {t("send")}</span>
				<RoundedCheckIcon className="scale-75" />
			</Button>
		</div>
	);
});
