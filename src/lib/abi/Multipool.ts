export default [
	{
		"type": "constructor",
		"inputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "allowance",
		"inputs": [
			{
				"name": "owner",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "spender",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "approve",
		"inputs": [
			{
				"name": "spender",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "amount",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "balanceOf",
		"inputs": [
			{
				"name": "account",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "checkSwap",
		"inputs": [
			{
				"name": "oraclePrice",
				"type": "tuple",
				"internalType": "struct OraclePrice",
				"components": [
					{
						"name": "contractAddress",
						"type": "address",
						"internalType": "address"
					},
					{
						"name": "timestamp",
						"type": "uint128",
						"internalType": "uint128"
					},
					{
						"name": "sharePrice",
						"type": "uint128",
						"internalType": "uint128"
					},
					{
						"name": "signature",
						"type": "bytes",
						"internalType": "bytes"
					}
				]
			},
			{
				"name": "assetInAddress",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "assetOutAddress",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "swapAmount",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "isExactInput",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"outputs": [
			{
				"name": "amountIn",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "amountOut",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "managerEarnedFee",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "oracleEarnedFee",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "lpEarnedFee",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "cashbacksRefund",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "claimLpFees",
		"inputs": [
			{
				"name": "to",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [
			{
				"name": "fee",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "claimManagerFees",
		"inputs": [
			{
				"name": "to",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [
			{
				"name": "fee",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "decimals",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint8",
				"internalType": "uint8"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "decreaseAllowance",
		"inputs": [
			{
				"name": "spender",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "subtractedValue",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "getAsset",
		"inputs": [
			{
				"name": "assetAddress",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [
			{
				"name": "isUsed",
				"type": "bool",
				"internalType": "bool"
			},
			{
				"name": "quantity",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "cashback",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "targetShare",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getConfig",
		"inputs": [],
		"outputs": [
			{
				"name": "_mpFees1",
				"type": "bytes32",
				"internalType": "bytes32"
			},
			{
				"name": "_mpFees2",
				"type": "bytes32",
				"internalType": "bytes32"
			},
			{
				"name": "_manageFeeReceiver",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "_lpFeeReceiver",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "_totalSupply",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getPrice",
		"inputs": [
			{
				"name": "asset",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [
			{
				"name": "price",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getPriceFeed",
		"inputs": [
			{
				"name": "asset",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [
			{
				"name": "priceFeed",
				"type": "bytes32",
				"internalType": "bytes32"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getSharePrice",
		"inputs": [
			{
				"name": "oraclePrice",
				"type": "tuple",
				"internalType": "struct OraclePrice",
				"components": [
					{
						"name": "contractAddress",
						"type": "address",
						"internalType": "address"
					},
					{
						"name": "timestamp",
						"type": "uint128",
						"internalType": "uint128"
					},
					{
						"name": "sharePrice",
						"type": "uint128",
						"internalType": "uint128"
					},
					{
						"name": "signature",
						"type": "bytes",
						"internalType": "bytes"
					}
				]
			},
			{
				"name": "_totalSupply",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "price",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getSharePricePart",
		"inputs": [
			{
				"name": "limit",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "offset",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "pricePart",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getUsedAssets",
		"inputs": [
			{
				"name": "limit",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "offset",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "address[]",
				"internalType": "address[]"
			},
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "increaseAllowance",
		"inputs": [
			{
				"name": "spender",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "addedValue",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "increaseCashback",
		"inputs": [
			{
				"name": "assetAddress",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
		"stateMutability": "payable"
	},
	{
		"type": "function",
		"name": "initialize",
		"inputs": [
			{
				"name": "name",
				"type": "string",
				"internalType": "string"
			},
			{
				"name": "symbol",
				"type": "string",
				"internalType": "string"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "name",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "string",
				"internalType": "string"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "owner",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "address"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "proxiableUUID",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "bytes32",
				"internalType": "bytes32"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "renounceOwnership",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "setFeeParams",
		"inputs": [
			{
				"name": "deviationIncreaseFee",
				"type": "uint24",
				"internalType": "uint24"
			},
			{
				"name": "deviationLimit",
				"type": "uint16",
				"internalType": "uint16"
			},
			{
				"name": "feeToCashbackRatio",
				"type": "uint24",
				"internalType": "uint24"
			},
			{
				"name": "baseFee",
				"type": "uint24",
				"internalType": "uint24"
			},
			{
				"name": "managerFee",
				"type": "uint24",
				"internalType": "uint24"
			},
			{
				"name": "lpFee",
				"type": "uint24",
				"internalType": "uint24"
			},
			{
				"name": "_managerFeeReceiver",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "_lpFeeReceiver",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "oracleAddress",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "swap",
		"inputs": [
			{
				"name": "oraclePrice",
				"type": "tuple",
				"internalType": "struct OraclePrice",
				"components": [
					{
						"name": "contractAddress",
						"type": "address",
						"internalType": "address"
					},
					{
						"name": "timestamp",
						"type": "uint128",
						"internalType": "uint128"
					},
					{
						"name": "sharePrice",
						"type": "uint128",
						"internalType": "uint128"
					},
					{
						"name": "signature",
						"type": "bytes",
						"internalType": "bytes"
					}
				]
			},
			{
				"name": "assetInAddress",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "assetOutAddress",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "swapAmount",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "isExactInput",
				"type": "bool",
				"internalType": "bool"
			},
			{
				"name": "receiverAddress",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "refundAddress",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "refundEthToReceiver",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"outputs": [
			{
				"name": "amountIn",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "amountOut",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "payable"
	},
	{
		"type": "function",
		"name": "symbol",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "string",
				"internalType": "string"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "totalSupply",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "transfer",
		"inputs": [
			{
				"name": "to",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "amount",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "transferFrom",
		"inputs": [
			{
				"name": "from",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "to",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "amount",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "bool",
				"internalType": "bool"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "transferOwnership",
		"inputs": [
			{
				"name": "newOwner",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "updateAssets",
		"inputs": [
			{
				"name": "priceAssetAddresses",
				"type": "address[]",
				"internalType": "address[]"
			},
			{
				"name": "priceData",
				"type": "bytes32[]",
				"internalType": "bytes32[]"
			},
			{
				"name": "targetShareAssetAddresses",
				"type": "address[]",
				"internalType": "address[]"
			},
			{
				"name": "targetShares",
				"type": "uint16[]",
				"internalType": "uint16[]"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "upgradeTo",
		"inputs": [
			{
				"name": "newImplementation",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "upgradeToAndCall",
		"inputs": [
			{
				"name": "newImplementation",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "data",
				"type": "bytes",
				"internalType": "bytes"
			}
		],
		"outputs": [],
		"stateMutability": "payable"
	},
	{
		"type": "event",
		"name": "AdminChanged",
		"inputs": [
			{
				"name": "previousAdmin",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			},
			{
				"name": "newAdmin",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Approval",
		"inputs": [
			{
				"name": "owner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "spender",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "value",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "AssetChange",
		"inputs": [
			{
				"name": "asset",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "quantity",
				"type": "uint128",
				"indexed": false,
				"internalType": "uint128"
			},
			{
				"name": "collectedCashbacks",
				"type": "uint112",
				"indexed": false,
				"internalType": "uint112"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "BeaconUpgraded",
		"inputs": [
			{
				"name": "beacon",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "FeesChange",
		"inputs": [
			{
				"name": "deviationIncreaseFee",
				"type": "uint24",
				"indexed": false,
				"internalType": "uint24"
			},
			{
				"name": "deviationLimit",
				"type": "uint16",
				"indexed": false,
				"internalType": "uint16"
			},
			{
				"name": "feeToCashbackRatio",
				"type": "uint24",
				"indexed": false,
				"internalType": "uint24"
			},
			{
				"name": "baseFee",
				"type": "uint24",
				"indexed": false,
				"internalType": "uint24"
			},
			{
				"name": "managerFee",
				"type": "uint24",
				"indexed": false,
				"internalType": "uint24"
			},
			{
				"name": "lpFee",
				"type": "uint24",
				"indexed": false,
				"internalType": "uint24"
			},
			{
				"name": "managerFeeReceiver",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			},
			{
				"name": "lpFeeReceiver",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			},
			{
				"name": "oracleAddress",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Initialized",
		"inputs": [
			{
				"name": "version",
				"type": "uint8",
				"indexed": false,
				"internalType": "uint8"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "MultipoolOwnerChange",
		"inputs": [
			{
				"name": "newOwner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "OwnershipTransferred",
		"inputs": [
			{
				"name": "previousOwner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "newOwner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "PriceFeedChange",
		"inputs": [
			{
				"name": "targetAsset",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "newFeed",
				"type": "bytes32",
				"indexed": false,
				"internalType": "bytes32"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "ShareTransfer",
		"inputs": [
			{
				"name": "from",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "to",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "amount",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Swap",
		"inputs": [
			{
				"name": "sender",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "assetIn",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "assetOut",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "amountIn",
				"type": "uint128",
				"indexed": false,
				"internalType": "uint128"
			},
			{
				"name": "amountOut",
				"type": "uint128",
				"indexed": false,
				"internalType": "uint128"
			},
			{
				"name": "priceIn",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			},
			{
				"name": "priceOut",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			},
			{
				"name": "collectedManagerFees",
				"type": "uint112",
				"indexed": false,
				"internalType": "uint112"
			},
			{
				"name": "collectedLpFees",
				"type": "uint112",
				"indexed": false,
				"internalType": "uint112"
			},
			{
				"name": "collectedOracleFees",
				"type": "uint112",
				"indexed": false,
				"internalType": "uint112"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "TargetShareChange",
		"inputs": [
			{
				"name": "asset",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "newTargetShare",
				"type": "uint16",
				"indexed": false,
				"internalType": "uint16"
			},
			{
				"name": "newTotalTargetShares",
				"type": "uint16",
				"indexed": false,
				"internalType": "uint16"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Transfer",
		"inputs": [
			{
				"name": "from",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "to",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "value",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Upgraded",
		"inputs": [
			{
				"name": "implementation",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "error",
		"name": "AssetsAreSame",
		"inputs": []
	},
	{
		"type": "error",
		"name": "DeviationExceedsLimit",
		"inputs": []
	},
	{
		"type": "error",
		"name": "FeeExceeded",
		"inputs": []
	},
	{
		"type": "error",
		"name": "InsufficientBalance",
		"inputs": [
			{
				"name": "asset",
				"type": "address",
				"internalType": "address"
			}
		]
	},
	{
		"type": "error",
		"name": "InvalidTargetShareAuthority",
		"inputs": []
	},
	{
		"type": "error",
		"name": "NoPriceOriginSet",
		"inputs": []
	},
	{
		"type": "error",
		"name": "NotEnoughQuantityToBurn",
		"inputs": []
	},
	{
		"type": "error",
		"name": "NotLpFeeReceiver",
		"inputs": []
	},
	{
		"type": "error",
		"name": "NotManagerFeeReceiver",
		"inputs": []
	},
	{
		"type": "error",
		"name": "SleepageExceeded",
		"inputs": []
	},
	{
		"type": "error",
		"name": "TargetShareIsZero",
		"inputs": []
	},
	{
		"type": "error",
		"name": "UniV3PriceFetchingReverted",
		"inputs": []
	},
	{
		"type": "error",
		"name": "ZeroAmountSupplied",
		"inputs": []
	}
] as const;
