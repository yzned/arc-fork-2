export default [
	{
		"type": "constructor",
		"inputs": [
			{
				"name": "_factory",
				"type": "address",
				"internalType": "address"
			}
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "createMultipool",
		"inputs": [
			{
				"name": "creationParams",
				"type": "tuple",
				"internalType": "struct MultipoolCreationParams",
				"components": [
					{
						"name": "name",
						"type": "string",
						"internalType": "string"
					},
					{
						"name": "symbol",
						"type": "string",
						"internalType": "string"
					},
					{
						"name": "assetAddresses",
						"type": "address[]",
						"internalType": "address[]"
					},
					{
						"name": "priceData",
						"type": "bytes32[]",
						"internalType": "bytes32[]"
					},
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
					},
					{
						"name": "targetShares",
						"type": "uint16[]",
						"internalType": "uint16[]"
					},
					{
						"name": "initialLiquidityAsset",
						"type": "address",
						"internalType": "address"
					},
					{
						"name": "owner",
						"type": "address",
						"internalType": "address"
					},
					{
						"name": "nonce",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "protocolFeeReceiver",
						"type": "address",
						"internalType": "address"
					}
				]
			},
			{
				"name": "callsBefore",
				"type": "tuple[]",
				"internalType": "struct Call[]",
				"components": [
					{
						"name": "callType",
						"type": "uint8",
						"internalType": "enum CallType"
					},
					{
						"name": "data",
						"type": "bytes",
						"internalType": "bytes"
					}
				]
			},
			{
				"name": "callsAfter",
				"type": "tuple[]",
				"internalType": "struct Call[]",
				"components": [
					{
						"name": "callType",
						"type": "uint8",
						"internalType": "enum CallType"
					},
					{
						"name": "data",
						"type": "bytes",
						"internalType": "bytes"
					}
				]
			}
		],
		"outputs": [],
		"stateMutability": "payable"
	},
	{
		"type": "function",
		"name": "factory",
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
		"name": "renounceOwnership",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "swap",
		"inputs": [
			{
				"name": "poolAddress",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "swapArgs",
				"type": "tuple",
				"internalType": "struct SwapArgs",
				"components": [
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
						"name": "assetIn",
						"type": "address",
						"internalType": "address"
					},
					{
						"name": "assetOut",
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
					},
					{
						"name": "ethValue",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "minimumReceive",
						"type": "uint256",
						"internalType": "uint256"
					}
				]
			},
			{
				"name": "callsBefore",
				"type": "tuple[]",
				"internalType": "struct Call[]",
				"components": [
					{
						"name": "callType",
						"type": "uint8",
						"internalType": "enum CallType"
					},
					{
						"name": "data",
						"type": "bytes",
						"internalType": "bytes"
					}
				]
			},
			{
				"name": "callsAfter",
				"type": "tuple[]",
				"internalType": "struct Call[]",
				"components": [
					{
						"name": "callType",
						"type": "uint8",
						"internalType": "enum CallType"
					},
					{
						"name": "data",
						"type": "bytes",
						"internalType": "bytes"
					}
				]
			}
		],
		"outputs": [],
		"stateMutability": "payable"
	},
	{
		"type": "function",
		"name": "toggleContract",
		"inputs": [
			{
				"name": "contractAddress",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
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
		"type": "error",
		"name": "CallFailed",
		"inputs": [
			{
				"name": "callNumber",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "isPredecessing",
				"type": "bool",
				"internalType": "bool"
			}
		]
	},
	{
		"type": "error",
		"name": "ContractCallNotAllowed",
		"inputs": [
			{
				"name": "target",
				"type": "address",
				"internalType": "address"
			}
		]
	},
	{
		"type": "error",
		"name": "InsufficientEthBalance",
		"inputs": [
			{
				"name": "callNumber",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "isPredecessing",
				"type": "bool",
				"internalType": "bool"
			}
		]
	},
	{
		"type": "error",
		"name": "InsufficientEthBalanceCallingSwap",
		"inputs": []
	},
	{
		"type": "error",
		"name": "SleepageExceeded",
		"inputs": []
	}
] as const;
