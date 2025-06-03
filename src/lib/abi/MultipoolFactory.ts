export default [
	{
		"type": "constructor",
		"inputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "createMultipool",
		"inputs": [
			{
				"name": "params",
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
			}
		],
		"outputs": [
			{
				"name": "mp",
				"type": "address",
				"internalType": "contract Multipool"
			}
		],
		"stateMutability": "payable"
	},
	{
		"type": "function",
		"name": "implementationAddress",
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
		"name": "initialize",
		"inputs": [
			{
				"name": "owner",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "implementation",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
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
		"name": "updateImplementationAddress",
		"inputs": [
			{
				"name": "newImplementationAddress",
				"type": "address",
				"internalType": "address"
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
		"name": "MultipoolCreated",
		"inputs": [
			{
				"name": "multipoolAddress",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "feeReceiver",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "feeAmount",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			},
			{
				"name": "name",
				"type": "string",
				"indexed": false,
				"internalType": "string"
			},
			{
				"name": "symbol",
				"type": "string",
				"indexed": false,
				"internalType": "string"
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
	}
] as const;