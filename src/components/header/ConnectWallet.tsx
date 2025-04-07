import DisconnectIcon from "@/icons/disconnect.svg?react";
import WalletIcon from "@/icons/wallet.svg?react";
import { useLogout, usePrivy, useWallets } from "@privy-io/react-auth";
import { useTranslation } from "react-i18next";
import { CopyButton } from "../ui/copyButton";
import { Button } from "../ui/button";
import CopyIcon from "../../icons/copy.svg?react";

export const ConnectWallet = () => {
	const { t } = useTranslation(["main"]);

	const { user, login } = usePrivy();
	const { logout } = useLogout();
	const { ready, wallets } = useWallets();

	const handleCopy = (value: string) => {
		navigator.clipboard
			.writeText(value)

			.catch((err) => console.error("Failed to copy : ", err));
	};

	if (user && ready && wallets.length > 0) {
		return (
			<>
				<div className="hidden md:flex w-[256px] items-center justify-center gap-4 p-6 text-text-primary ">
					<div className="flex items-center gap-2">
						<img
							src={wallets[0].meta.icon}
							alt={wallets[0].meta.name}
							className="h-6 w-6"
						/>
						<CopyButton copyValue={wallets[0].address} isHidenRightIcon={false}>
							{`${wallets[0].address.slice(0, 5)}...${wallets[0].address.slice(-4)}`}
						</CopyButton>
					</div>

					<button
						type="button"
						onClick={() => logout()}
						className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[2px] border border-fill-secondary transition-colors hover:border-fill-tertiary hover:bg-fill-tertiary"
					>
						<DisconnectIcon width={15} className="text-text-secondary" />
					</button>
				</div>
				<div className="w-full flex flex-col md:hidden gap-2">
					<button
						type="button"
						onClick={() => handleCopy(wallets[0].address)}
						className="h-[60px] bg-fill-primary-900 items-center px-6 flex rounded-[4px] justify-between"
					>
						<div className="text-fill-brand-secondary-500 flex items-center gap-2">
							<img
								src={wallets[0].meta.icon}
								alt={wallets[0].meta.name}
								className="h-6 w-6"
							/>
							<span>
								{`${wallets[0].address.slice(0, 5)}...${wallets[0].address.slice(-4)}`}
							</span>
						</div>
						<CopyIcon className="text-text-secondary" />
					</button>

					<Button
						className="h-[48px] w-full flex md:hidden"
						onClick={() => logout()}
					>
						Disconnect wallet <DisconnectIcon className="text-text-primary" />
					</Button>
				</div>
			</>
		);
	}

	return (
		<>
			<button
				type="button"
				onClick={() => {
					login();
				}}
				className="hidden md:flex  cursor-pointer flex-row items-center border-fill-secondary border-r border-l px-6 font-droid text-fill-brand-secondary-500 text-sm tracking-[0.01em] transition-colors hover:bg-fill-secondary"
			>
				{t("connectWallet")}
				<WalletIcon className="ml-2" />
			</button>

			<Button
				className="h-[48px] flex md:hidden"
				onClick={() => {
					login();
				}}
			>
				Connect wallet <WalletIcon className="text-text-primary" />
			</Button>
		</>
	);
};
