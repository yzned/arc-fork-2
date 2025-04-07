import MultipoolFactory from "@/lib/abi/MultipoolFactory";
import {
	ARBITRUM_CHAIN_ID,
	ARCANUM_POOL_FACTORY_ADDRESS,
} from "@/lib/constants";
import { encodePacked, getContractAddress, keccak256, toBytes } from "viem";

const generateNonce = () => {
	const array = new Uint32Array(2);
	crypto.getRandomValues(array);
	return (BigInt(array[0]) << 32n) | BigInt(array[1]);
};

export const getMultipoolContractAddress = () => {
	const nonce = generateNonce();

	const bytecodeHash = keccak256(toBytes(MultipoolFactory.bytecode.object));

	const contractAddress = getContractAddress({
		from: ARCANUM_POOL_FACTORY_ADDRESS,
		opcode: "CREATE2",
		salt: keccak256(
			encodePacked(
				["uint256", "uint256"],
				[BigInt(ARBITRUM_CHAIN_ID), BigInt(nonce)],
			),
		),
		bytecode: MultipoolFactory.bytecode.object,
		bytecodeHash,
	});

	return contractAddress;
};
