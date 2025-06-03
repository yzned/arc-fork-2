import DisconnectIcon from "@/icons/disconnect.svg?react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTranslation } from "react-i18next";
import { useDisconnect } from "wagmi";
import CopyIcon from "../../icons/copy.svg?react";

export const ConnectWallet = () => {
	const handleCopy = (value: string) => {
		navigator.clipboard
			.writeText(value)

			.catch((err) => console.error("Failed to copy : ", err));
	};

	const { disconnect } = useDisconnect();

	return (
		<ConnectButton.Custom>
			{({
				account,
				chain,
				// openAccountModal,
				openChainModal,
				openConnectModal,
				mounted,
			}) => {
				const connected = account && chain;

				return (
					<div
						{...(!mounted && {
							"aria-hidden": true,
							style: {
								opacity: 0,
								pointerEvents: "none",
								userSelect: "none",
							},
						})}
					>
						{(() => {
							const { t } = useTranslation(["main"]);
							if (!connected) {
								return (
									<button
										className="inline-flex size-full cursor-pointer items-center gap-2 px-6 font-droid text-[#3D73FF]"
										onClick={openConnectModal}
										type="button"
									>
										{t("connectWallet")}
									</button>
								);
							}

							if (chain.unsupported) {
								return (
									<button
										className="inline-flex size-full items-center gap-2 px-6 font-droid text-[#3D73FF]"
										onClick={openChainModal}
										type="button"
									>
										Wrong network
									</button>
								);
							}

							return (
								<div className=" flex h-full w-[255px] items-center justify-center gap-4">
									<button
										type="button"
										onClick={() => handleCopy(account.address)}
										className="flex cursor-pointer items-center gap-2"
									>
										<div className="flex items-center gap-2 text-fill-brand-secondary-500">
											{/* <img
											src={wallets[0].meta.icon}
											alt={wallets[0].meta.name}
											className="h-6 w-6"
										/> */}
											<span>
												{`${account.address.slice(0, 5)}...${account.address.slice(-4)}`}
											</span>
										</div>
										<CopyIcon className="text-fill-brand-secondary-500" />
									</button>

									<button
										type="button"
										onClick={() => disconnect()}
										className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[2px] border border-fill-secondary transition-colors hover:border-fill-tertiary hover:bg-fill-tertiary"
									>
										<DisconnectIcon
											width={15}
											className="text-text-secondary"
										/>
									</button>
								</div>
							);
						})()}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
};
