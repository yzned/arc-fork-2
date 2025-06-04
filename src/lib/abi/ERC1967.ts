export default {
	abi: [
		{
			type: "constructor",
			inputs: [
				{ name: "_logic", type: "address", internalType: "address" },
				{ name: "_data", type: "bytes", internalType: "bytes" },
			],
			stateMutability: "payable",
		},
		{ type: "fallback", stateMutability: "payable" },
		{ type: "receive", stateMutability: "payable" },
		{
			type: "event",
			name: "AdminChanged",
			inputs: [
				{
					name: "previousAdmin",
					type: "address",
					indexed: false,
					internalType: "address",
				},
				{
					name: "newAdmin",
					type: "address",
					indexed: false,
					internalType: "address",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "BeaconUpgraded",
			inputs: [
				{
					name: "beacon",
					type: "address",
					indexed: true,
					internalType: "address",
				},
			],
			anonymous: false,
		},
		{
			type: "event",
			name: "Upgraded",
			inputs: [
				{
					name: "implementation",
					type: "address",
					indexed: true,
					internalType: "address",
				},
			],
			anonymous: false,
		},
	],
	bytecode: {
		object:
			"0x604060808152610403908138038061001681610218565b93843982019181818403126102135780516001600160a01b038116808203610213576020838101516001600160401b0394919391858211610213570186601f820112156102135780519061007161006c83610253565b610218565b918083528583019886828401011161021357888661008f930161026e565b813b156101b9577f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b031916841790556000927fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b8480a28051158015906101b2575b61010b575b855160be90816103458239f35b855194606086019081118682101761019e578697849283926101889952602788527f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c87890152660819985a5b195960ca1b8a8901525190845af4913d15610194573d9061017a61006c83610253565b91825281943d92013e610291565b508038808080806100fe565b5060609250610291565b634e487b7160e01b84526041600452602484fd5b50826100f9565b855162461bcd60e51b815260048101859052602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608490fd5b600080fd5b6040519190601f01601f191682016001600160401b0381118382101761023d57604052565b634e487b7160e01b600052604160045260246000fd5b6001600160401b03811161023d57601f01601f191660200190565b60005b8381106102815750506000910152565b8181015183820152602001610271565b919290156102f357508151156102a5575090565b3b156102ae5790565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b8251909150156103065750805190602001fd5b6044604051809262461bcd60e51b825260206004830152610336815180928160248601526020868601910161026e565b601f01601f19168101030190fdfe60806040523615605f5773ffffffffffffffffffffffffffffffffffffffff7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc54166000808092368280378136915af43d82803e15605b573d90f35b3d90fd5b73ffffffffffffffffffffffffffffffffffffffff7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc54166000808092368280378136915af43d82803e15605b573d90f3fea164736f6c6343000813000a",
		sourceMap:
			"567:723:51:-:0;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;-1:-1:-1;;;;;567:723:51;;;;;;;;;;;;-1:-1:-1;;;;;567:723:51;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;1702:19:60;;:23;567:723:51;;1030:66:52;;;-1:-1:-1;;;;;;1030:66:52;;;;;-1:-1:-1;;1889:27:52;-1:-1:-1;;1889:27:52;567:723:51;;2208:15:52;;;:28;;;-1:-1:-1;2204:112:52;;-1:-1:-1;567:723:51;;;;;;;;;2204:112:52;567:723:51;;;;;;;;;;;;;;;;;;;;;7307:69:60;567:723:51;;;;;;;;;;-1:-1:-1;;;567:723:51;;;;7265:25:60;;;;;;567:723:51;;;;;;;;;;:::i;:::-;;;;;;;;;;7307:69:60;:::i;:::-;;2204:112:52;;;;;;;;567:723:51;-1:-1:-1;567:723:51;;-1:-1:-1;7307:69:60;:::i;567:723:51:-;-1:-1:-1;;;567:723:51;;;;;;;;2208:28:52;;;;;567:723:51;;;-1:-1:-1;;;567:723:51;;;;;;;;;;;;;;;;;;-1:-1:-1;;;567:723:51;;;;;;;;-1:-1:-1;567:723:51;;;;;;;;;-1:-1:-1;;567:723:51;;;-1:-1:-1;;;;;567:723:51;;;;;;;;;;:::o;:::-;;;;;;;;;;;;;-1:-1:-1;;;;;567:723:51;;;;;;-1:-1:-1;;567:723:51;;;;:::o;:::-;;;;;;;;-1:-1:-1;;567:723:51;;;;:::o;:::-;;;;;;;;;;;;;7671:628:60;;;;7875:418;;;567:723:51;;;7906:22:60;7902:286;;8201:17;;:::o;7902:286::-;1702:19;:23;567:723:51;;8201:17:60;:::o;567:723:51:-;;;-1:-1:-1;;;567:723:51;;;;;;;;;;;;;;;;;;;;7875:418:60;567:723:51;;;;-1:-1:-1;8980:21:60;:17;;9152:142;;;;;;;8976:379;567:723:51;;;;;;;;9324:20:60;;567:723:51;9324:20:60;;;567:723:51;;;;;;;;;;;;;;;;;;:::i;:::-;;;-1:-1:-1;;567:723:51;;;9324:20:60;;;",
		linkReferences: {},
	},
	deployedBytecode: {
		object:
			"0x60806040523615605f5773ffffffffffffffffffffffffffffffffffffffff7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc54166000808092368280378136915af43d82803e15605b573d90f35b3d90fd5b73ffffffffffffffffffffffffffffffffffffffff7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc54166000808092368280378136915af43d82803e15605b573d90f3fea164736f6c6343000813000a",
		sourceMap:
			"567:723:51:-:0;;;;;;;1030:66:52;;;;-1:-1:-1;567:723:51;;;;1018:819:53;;;567:723:51;;1018:819:53;;;;;;;;;;;;;;;;;567:723:51;1030:66:52;;;;-1:-1:-1;567:723:51;;;;1018:819:53;;;567:723:51;;1018:819:53;;;;;;;;;;;;",
		linkReferences: {},
	},
	methodIdentifiers: {},
	rawMetadata:
		'{"compiler":{"version":"0.8.19+commit.7dd6d404"},"language":"Solidity","output":{"abi":[{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"stateMutability":"payable","type":"receive"}],"devdoc":{"details":"This contract implements an upgradeable proxy. It is upgradeable because calls are delegated to an implementation address that can be changed. This address is stored in storage in the location specified by https://eips.ethereum.org/EIPS/eip-1967[EIP1967], so that it doesn\'t conflict with the storage layout of the implementation behind the proxy.","events":{"AdminChanged(address,address)":{"details":"Emitted when the admin account has changed."},"BeaconUpgraded(address)":{"details":"Emitted when the beacon is changed."},"Upgraded(address)":{"details":"Emitted when the implementation is upgraded."}},"kind":"dev","methods":{"constructor":{"details":"Initializes the upgradeable proxy with an initial implementation specified by `_logic`. If `_data` is nonempty, it\'s used as data in a delegate call to `_logic`. This will typically be an encoded function call, and allows initializing the storage of the proxy like a Solidity constructor."}},"version":1},"userdoc":{"kind":"user","methods":{},"version":1}},"settings":{"compilationTarget":{"lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol":"ERC1967Proxy"},"evmVersion":"paris","libraries":{},"metadata":{"bytecodeHash":"none"},"optimizer":{"enabled":true,"runs":500},"remappings":[":@openzeppelin/contracts/=lib/openzeppelin-contracts-upgradeable/lib/openzeppelin-contracts/contracts/",":ds-test/=lib/forge-std/lib/ds-test/src/",":erc4626-tests/=lib/openzeppelin-contracts-upgradeable/lib/erc4626-tests/",":forge-std/=lib/forge-std/src/",":openzeppelin-contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/",":openzeppelin-contracts/=lib/openzeppelin-contracts/contracts/",":openzeppelin/=lib/openzeppelin-contracts/contracts/",":oz-proxy/=lib/openzeppelin-contracts-upgradeable/contracts/",":uniswapv3-router/=lib/v3-periphery/contracts/",":uniswapv3/=lib/v3-core/contracts/"],"viaIR":true},"sources":{"lib/openzeppelin-contracts/contracts/interfaces/IERC1967.sol":{"keccak256":"0x3cbef5ebc24b415252e2f8c0c9254555d30d9f085603b4b80d9b5ed20ab87e90","license":"MIT","urls":["bzz-raw://e8fa670c3bdce78e642cc6ae11c4cb38b133499cdce5e1990a9979d424703263","dweb:/ipfs/QmVxeCUk4jL2pXQyhsoNJwyU874wRufS2WvGe8TgPKPqhE"]},"lib/openzeppelin-contracts/contracts/interfaces/draft-IERC1822.sol":{"keccak256":"0x1d4afe6cb24200cc4545eed814ecf5847277dfe5d613a1707aad5fceecebcfff","license":"MIT","urls":["bzz-raw://383fb7b8181016ac5ccf07bc9cdb7c1b5045ea36e2cc4df52bcbf20396fc7688","dweb:/ipfs/QmYJ7Cg4WmE3rR8KGQxjUCXFfTH6TcwZ2Z1f6tPrq7jHFr"]},"lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol":{"keccak256":"0xa2b22da3032e50b55f95ec1d13336102d675f341167aa76db571ef7f8bb7975d","license":"MIT","urls":["bzz-raw://96b6d77a20bebd4eb06b801d3d020c7e82be13bd535cb0d0a6b7181c51dab5d5","dweb:/ipfs/QmPUR9Cv9jNFdQX6PtBfaBW1ZCnKwiu65R2VD5kbdanDyn"]},"lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Upgrade.sol":{"keccak256":"0x3b21ae06bf5957f73fa16754b0669c77b7abd8ba6c072d35c3281d446fdb86c2","license":"MIT","urls":["bzz-raw://2db8e18505e86e02526847005d7287a33e397ed7fb9eaba3fd4a4a197add16e2","dweb:/ipfs/QmW9BSuKTzHWHBNSHF4L8XfVuU1uJrP2vLg84YtBd8mL82"]},"lib/openzeppelin-contracts/contracts/proxy/Proxy.sol":{"keccak256":"0xc130fe33f1b2132158531a87734153293f6d07bc263ff4ac90e85da9c82c0e27","license":"MIT","urls":["bzz-raw://8831721b6f4cc26534d190f9f1631c3f59c9ff38efdd911f85e0882b8e360472","dweb:/ipfs/QmQZnLErZNStirSQ13ZNWQgvEYUtGE5tXYwn4QUPaVUfPN"]},"lib/openzeppelin-contracts/contracts/proxy/beacon/IBeacon.sol":{"keccak256":"0xd50a3421ac379ccb1be435fa646d66a65c986b4924f0849839f08692f39dde61","license":"MIT","urls":["bzz-raw://ada1e030c0231db8d143b44ce92b4d1158eedb087880cad6d8cc7bd7ebe7b354","dweb:/ipfs/QmWZ2NHZweRpz1U9GF6R1h65ri76dnX7fNxLBeM2t5N5Ce"]},"lib/openzeppelin-contracts/contracts/utils/Address.sol":{"keccak256":"0x006dd67219697fe68d7fbfdea512e7c4cb64a43565ed86171d67e844982da6fa","license":"MIT","urls":["bzz-raw://2455248c8ddd9cc6a7af76a13973cddf222072427e7b0e2a7d1aff345145e931","dweb:/ipfs/QmfYjnjRbWqYpuxurqveE6HtzsY1Xx323J428AKQgtBJZm"]},"lib/openzeppelin-contracts/contracts/utils/StorageSlot.sol":{"keccak256":"0xf09e68aa0dc6722a25bc46490e8d48ed864466d17313b8a0b254c36b54e49899","license":"MIT","urls":["bzz-raw://e26daf81e2252dc1fe1ce0e4b55c2eb7c6d1ee84ae6558d1a9554432ea1d32da","dweb:/ipfs/Qmb1UANWiWq5pCKbmHSu772hd4nt374dVaghGmwSVNuk8Q"]}},"version":1}',
	metadata: {
		compiler: { version: "0.8.19+commit.7dd6d404" },
		language: "Solidity",
		output: {
			abi: [
				{
					inputs: [
						{ internalType: "address", name: "_logic", type: "address" },
						{ internalType: "bytes", name: "_data", type: "bytes" },
					],
					stateMutability: "payable",
					type: "constructor",
				},
				{
					inputs: [
						{
							internalType: "address",
							name: "previousAdmin",
							type: "address",
							indexed: false,
						},
						{
							internalType: "address",
							name: "newAdmin",
							type: "address",
							indexed: false,
						},
					],
					type: "event",
					name: "AdminChanged",
					anonymous: false,
				},
				{
					inputs: [
						{
							internalType: "address",
							name: "beacon",
							type: "address",
							indexed: true,
						},
					],
					type: "event",
					name: "BeaconUpgraded",
					anonymous: false,
				},
				{
					inputs: [
						{
							internalType: "address",
							name: "implementation",
							type: "address",
							indexed: true,
						},
					],
					type: "event",
					name: "Upgraded",
					anonymous: false,
				},
				{ inputs: [], stateMutability: "payable", type: "fallback" },
				{ inputs: [], stateMutability: "payable", type: "receive" },
			],
			devdoc: {
				kind: "dev",
				methods: {
					constructor: {
						details:
							"Initializes the upgradeable proxy with an initial implementation specified by `_logic`. If `_data` is nonempty, it's used as data in a delegate call to `_logic`. This will typically be an encoded function call, and allows initializing the storage of the proxy like a Solidity constructor.",
					},
				},
				version: 1,
			},
			userdoc: { kind: "user", methods: {}, version: 1 },
		},
		settings: {
			remappings: [
				"@openzeppelin/contracts/=lib/openzeppelin-contracts-upgradeable/lib/openzeppelin-contracts/contracts/",
				"ds-test/=lib/forge-std/lib/ds-test/src/",
				"erc4626-tests/=lib/openzeppelin-contracts-upgradeable/lib/erc4626-tests/",
				"forge-std/=lib/forge-std/src/",
				"openzeppelin-contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/",
				"openzeppelin-contracts/=lib/openzeppelin-contracts/contracts/",
				"openzeppelin/=lib/openzeppelin-contracts/contracts/",
				"oz-proxy/=lib/openzeppelin-contracts-upgradeable/contracts/",
				"uniswapv3-router/=lib/v3-periphery/contracts/",
				"uniswapv3/=lib/v3-core/contracts/",
			],
			optimizer: { enabled: true, runs: 500 },
			metadata: { bytecodeHash: "none" },
			compilationTarget: {
				"lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol":
					"ERC1967Proxy",
			},
			evmVersion: "paris",
			libraries: {},
			viaIR: true,
		},
		sources: {
			"lib/openzeppelin-contracts/contracts/interfaces/IERC1967.sol": {
				keccak256:
					"0x3cbef5ebc24b415252e2f8c0c9254555d30d9f085603b4b80d9b5ed20ab87e90",
				urls: [
					"bzz-raw://e8fa670c3bdce78e642cc6ae11c4cb38b133499cdce5e1990a9979d424703263",
					"dweb:/ipfs/QmVxeCUk4jL2pXQyhsoNJwyU874wRufS2WvGe8TgPKPqhE",
				],
				license: "MIT",
			},
			"lib/openzeppelin-contracts/contracts/interfaces/draft-IERC1822.sol": {
				keccak256:
					"0x1d4afe6cb24200cc4545eed814ecf5847277dfe5d613a1707aad5fceecebcfff",
				urls: [
					"bzz-raw://383fb7b8181016ac5ccf07bc9cdb7c1b5045ea36e2cc4df52bcbf20396fc7688",
					"dweb:/ipfs/QmYJ7Cg4WmE3rR8KGQxjUCXFfTH6TcwZ2Z1f6tPrq7jHFr",
				],
				license: "MIT",
			},
			"lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol": {
				keccak256:
					"0xa2b22da3032e50b55f95ec1d13336102d675f341167aa76db571ef7f8bb7975d",
				urls: [
					"bzz-raw://96b6d77a20bebd4eb06b801d3d020c7e82be13bd535cb0d0a6b7181c51dab5d5",
					"dweb:/ipfs/QmPUR9Cv9jNFdQX6PtBfaBW1ZCnKwiu65R2VD5kbdanDyn",
				],
				license: "MIT",
			},
			"lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Upgrade.sol": {
				keccak256:
					"0x3b21ae06bf5957f73fa16754b0669c77b7abd8ba6c072d35c3281d446fdb86c2",
				urls: [
					"bzz-raw://2db8e18505e86e02526847005d7287a33e397ed7fb9eaba3fd4a4a197add16e2",
					"dweb:/ipfs/QmW9BSuKTzHWHBNSHF4L8XfVuU1uJrP2vLg84YtBd8mL82",
				],
				license: "MIT",
			},
			"lib/openzeppelin-contracts/contracts/proxy/Proxy.sol": {
				keccak256:
					"0xc130fe33f1b2132158531a87734153293f6d07bc263ff4ac90e85da9c82c0e27",
				urls: [
					"bzz-raw://8831721b6f4cc26534d190f9f1631c3f59c9ff38efdd911f85e0882b8e360472",
					"dweb:/ipfs/QmQZnLErZNStirSQ13ZNWQgvEYUtGE5tXYwn4QUPaVUfPN",
				],
				license: "MIT",
			},
			"lib/openzeppelin-contracts/contracts/proxy/beacon/IBeacon.sol": {
				keccak256:
					"0xd50a3421ac379ccb1be435fa646d66a65c986b4924f0849839f08692f39dde61",
				urls: [
					"bzz-raw://ada1e030c0231db8d143b44ce92b4d1158eedb087880cad6d8cc7bd7ebe7b354",
					"dweb:/ipfs/QmWZ2NHZweRpz1U9GF6R1h65ri76dnX7fNxLBeM2t5N5Ce",
				],
				license: "MIT",
			},
			"lib/openzeppelin-contracts/contracts/utils/Address.sol": {
				keccak256:
					"0x006dd67219697fe68d7fbfdea512e7c4cb64a43565ed86171d67e844982da6fa",
				urls: [
					"bzz-raw://2455248c8ddd9cc6a7af76a13973cddf222072427e7b0e2a7d1aff345145e931",
					"dweb:/ipfs/QmfYjnjRbWqYpuxurqveE6HtzsY1Xx323J428AKQgtBJZm",
				],
				license: "MIT",
			},
			"lib/openzeppelin-contracts/contracts/utils/StorageSlot.sol": {
				keccak256:
					"0xf09e68aa0dc6722a25bc46490e8d48ed864466d17313b8a0b254c36b54e49899",
				urls: [
					"bzz-raw://e26daf81e2252dc1fe1ce0e4b55c2eb7c6d1ee84ae6558d1a9554432ea1d32da",
					"dweb:/ipfs/Qmb1UANWiWq5pCKbmHSu772hd4nt374dVaghGmwSVNuk8Q",
				],
				license: "MIT",
			},
		},
		version: 1,
	},
	id: 51,
};
