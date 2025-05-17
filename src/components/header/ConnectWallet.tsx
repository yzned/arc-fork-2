import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectWallet = () => {
	return (
		<ConnectButton.Custom>
			{({
				account,
				chain,
				openAccountModal,
				openChainModal,
				openConnectModal,
				mounted,
			}) => {
				// Note: If your app doesn't use authentication, you
				// can remove all 'authenticationStatus' checks
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
							if (!connected) {
								return (
									<button
										className="inline-flex size-full items-center gap-2 px-6 font-droid text-[#3D73FF]"
										onClick={openConnectModal}
										type="button"
									>
										Connect Wallet
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
								<button
									className="inline-flex size-full items-center gap-2 px-6 font-droid text-[#3D73FF]"
									onClick={openAccountModal}
									type="button"
								>
									{account.displayName}
									{account.displayBalance ? ` (${account.displayBalance})` : ""}
								</button>
							);
						})()}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
};
