export default [
	{
		type: "function",
		name: "getAsset",
		inputs: [
			{ name: "assetAddress", type: "address", internalType: "address" },
		],
		outputs: [
			{
				name: "asset",
				type: "tuple",
				internalType: "struct MpAsset",
				components: [
					{ name: "isUsed", type: "bool", internalType: "bool" },
					{
						name: "quantity",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "targetShare",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "collectedCashbacks",
						type: "uint256",
						internalType: "uint256",
					},
				],
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getPrice",
		inputs: [{ name: "asset", type: "address", internalType: "address" }],
		outputs: [{ name: "price", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getPriceFeed",
		inputs: [{ name: "asset", type: "address", internalType: "address" }],
		outputs: [{ name: "priceFeed", type: "bytes32", internalType: "bytes32" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getSharePricePart",
		inputs: [
			{ name: "limit", type: "uint256", internalType: "uint256" },
			{ name: "offset", type: "uint256", internalType: "uint256" },
		],
		outputs: [{ name: "pricePart", type: "uint256", internalType: "uint256" }],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "getUsedAssets",
		inputs: [
			{ name: "limit", type: "uint256", internalType: "uint256" },
			{ name: "offset", type: "uint256", internalType: "uint256" },
		],
		outputs: [
			{
				name: "assetsRes",
				type: "address[]",
				internalType: "address[]",
			},
			{ name: "length", type: "uint256", internalType: "uint256" },
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "increaseCashback",
		inputs: [
			{ name: "assetAddress", type: "address", internalType: "address" },
		],
		outputs: [],
		stateMutability: "payable",
	},
	{
		type: "function",
		name: "setFeeParams",
		inputs: [
			{
				name: "newDeviationIncreaseFee",
				type: "uint16",
				internalType: "uint16",
			},
			{
				name: "newDeviationLimit",
				type: "uint16",
				internalType: "uint16",
			},
			{
				name: "newFeeToCashbackRatio",
				type: "uint16",
				internalType: "uint16",
			},
			{ name: "newBaseFee", type: "uint16", internalType: "uint16" },
			{
				name: "newManagementFeeRecepient",
				type: "address",
				internalType: "address",
			},
			{
				name: "newManagementFee",
				type: "uint16",
				internalType: "uint16",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "swap",
		inputs: [
			{
				name: "oraclePrice",
				type: "tuple",
				internalType: "struct OraclePrice",
				components: [
					{
						name: "contractAddress",
						type: "address",
						internalType: "address",
					},
					{
						name: "timestamp",
						type: "uint128",
						internalType: "uint128",
					},
					{
						name: "sharePrice",
						type: "uint128",
						internalType: "uint128",
					},
					{ name: "signature", type: "bytes", internalType: "bytes" },
				],
			},
			{
				name: "assetInAddress",
				type: "address",
				internalType: "address",
			},
			{
				name: "assetOutAddress",
				type: "address",
				internalType: "address",
			},
			{ name: "swapAmount", type: "uint256", internalType: "uint256" },
			{ name: "isExactInput", type: "bool", internalType: "bool" },
			{
				name: "data",
				type: "tuple",
				internalType: "struct ReceiverData",
				components: [
					{
						name: "receiverAddress",
						type: "address",
						internalType: "address",
					},
					{
						name: "refundAddress",
						type: "address",
						internalType: "address",
					},
					{
						name: "refundEthToReceiver",
						type: "bool",
						internalType: "bool",
					},
				],
			},
		],
		outputs: [
			{ name: "amountIn", type: "uint256", internalType: "uint256" },
			{ name: "amountOut", type: "uint256", internalType: "uint256" },
		],
		stateMutability: "payable",
	},
	{
		type: "function",
		name: "updateOracleAddress",
		inputs: [
			{
				name: "_priceVerifierAddress",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "updatePrices",
		inputs: [
			{
				name: "assetAddresses",
				type: "address[]",
				internalType: "address[]",
			},
			{
				name: "priceData",
				type: "bytes32[]",
				internalType: "bytes32[]",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "updateStrategyManager",
		inputs: [{ name: "authority", type: "address", internalType: "address" }],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "updateTargetShares",
		inputs: [
			{
				name: "assetAddresses",
				type: "address[]",
				internalType: "address[]",
			},
			{
				name: "targetShares",
				type: "uint16[]",
				internalType: "uint16[]",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "event",
		name: "AssetChange",
		inputs: [
			{
				name: "asset",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "quantity",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "collectedCashbacks",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "FeesChange",
		inputs: [
			{
				name: "newDeviationIncreaseFee",
				type: "uint16",
				indexed: false,
				internalType: "uint16",
			},
			{
				name: "newDeviationLimit",
				type: "uint16",
				indexed: false,
				internalType: "uint16",
			},
			{
				name: "newFeeToCashbackRatio",
				type: "uint16",
				indexed: false,
				internalType: "uint16",
			},
			{
				name: "newBaseFee",
				type: "uint16",
				indexed: false,
				internalType: "uint16",
			},
			{
				name: "newManagementFee",
				type: "uint16",
				indexed: false,
				internalType: "uint16",
			},
			{
				name: "newManagementFeeRecepient",
				type: "address",
				indexed: false,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "PoolCreated",
		inputs: [
			{
				name: "initialSharePrice",
				type: "uint96",
				indexed: false,
				internalType: "uint96",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "PriceFeedChange",
		inputs: [
			{
				name: "targetAsset",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "newFeed",
				type: "bytes32",
				indexed: false,
				internalType: "bytes32",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "PriceOracleChange",
		inputs: [
			{
				name: "oldOracle",
				type: "address",
				indexed: false,
				internalType: "address",
			},
			{
				name: "newOracle",
				type: "address",
				indexed: false,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "ShareTransfer",
		inputs: [
			{
				name: "from",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "to",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "amount",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "StrategyManagerChange",
		inputs: [
			{
				name: "oldStrategyManager",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "newStrategyManager",
				type: "address",
				indexed: true,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "Swap",
		inputs: [
			{
				name: "sender",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "assetIn",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "assetOut",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "amountIn",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "amountOut",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "priceIn",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "priceOut",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "collectedManagementFees",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "collectedOracleFees",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "TargetShareChange",
		inputs: [
			{
				name: "asset",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "newTargetShare",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "newTotalTargetShares",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
		],
		anonymous: false,
	},
	{ type: "error", name: "AssetsAreSame", inputs: [] },
	{ type: "error", name: "DeviationExceedsLimit", inputs: [] },
	{ type: "error", name: "FeeExceeded", inputs: [] },
	{
		type: "error",
		name: "InsufficientBalance",
		inputs: [{ name: "asset", type: "address", internalType: "address" }],
	},
	{ type: "error", name: "InvalidTargetShareAuthority", inputs: [] },
	{ type: "error", name: "NoPriceOriginSet", inputs: [] },
	{ type: "error", name: "NotEnoughQuantityToBurn", inputs: [] },
	{ type: "error", name: "SleepageExceeded", inputs: [] },
	{ type: "error", name: "TargetShareIsZero", inputs: [] },
	{ type: "error", name: "UniV3PriceFetchingReverted", inputs: [] },
	{ type: "error", name: "ZeroAmountSupplied", inputs: [] },
] as const;
