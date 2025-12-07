import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { celoAlfajores } from 'viem/chains';
import { 
    GEO_CHARITY_POOL_ADDRESS, 
    CUSD_TOKEN_ADDRESS, 
    GEO_CHARITY_POOL_ABI, 
    ERC20_ABI 
} from '../constants/contract-config';

// 1. Configure the public client (for reading data)
const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
});

// NOTE: For the wallet client, you'll need the user's connected wallet (via WalletConnect/Wagmi)
// The actual wallet client instantiation will happen in App.js upon connection.

/**
 * @notice Approves the GeoCharityPool contract to spend a certain amount of cUSD.
 * @param walletClient The client connected to the user's wallet.
 * @param userAddress The public address of the user.
 * @param amountInCUSD The amount of cUSD to approve (e.g., "10.0").
 */
export async function approveCUSD(walletClient, userAddress, amountInCUSD) {
    try {
        // Convert the human-readable amount to the smallest unit (wei/swei)
        // Assume cUSD has 18 decimals, similar to ETH/CELO
        const amountWei = parseEther(amountInCUSD); 

        const { request } = await publicClient.simulateContract({
            address: CUSD_TOKEN_ADDRESS,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [GEO_CHARITY_POOL_ADDRESS, amountWei],
            account: userAddress,
        });

        // Send the transaction to the user's wallet for signing
        const hash = await walletClient.writeContract(request);
        console.log(`Approval Transaction Hash: ${hash}`);
        return hash;

    } catch (error) {
        console.error("CUSD Approval Failed:", error);
        throw new Error(`Approval failed: ${error.message}`);
    }
}

/**
 * @notice Sends a donation to the GeoCharityPool contract.
 * @dev This should be called only after a successful cUSD approval.
 * @param walletClient The client connected to the user's wallet.
 * @param userAddress The public address of the user.
 * @param charityIdBytes32 The unique ID of the charity zone (bytes32).
 * @param amountInCUSD The amount of cUSD to donate (e.g., "0.5").
 */
export async function donate(walletClient, userAddress, charityIdBytes32, amountInCUSD) {
    try {
        const amountWei = parseEther(amountInCUSD);

        const { request } = await publicClient.simulateContract({
            address: GEO_CHARITY_POOL_ADDRESS,
            abi: GEO_CHARITY_POOL_ABI,
            functionName: 'donate',
            args: [charityIdBytes32, amountWei],
            account: userAddress,
        });

        // Send the transaction to the user's wallet for signing
        const hash = await walletClient.writeContract(request);
        console.log(`Donation Transaction Hash: ${hash}`);
        return hash;

    } catch (error) {
        console.error("Donation Transaction Failed:", error);
        throw new Error(`Donation failed: ${error.message}`);
    }
}
