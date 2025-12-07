// Centralized configuration for smart contract addresses and IDs
// All addresses should match the network where the contract is deployed (e.g., Celo Mainnet or Alfajores).

// 1. Deployed GeoCharityPool Contract Address (CA)
export const GEO_CHARITY_POOL_ADDRESS = "0x765de816845861e75a25fca122bb6898b8b1282a";

// 2. cUSD Token Address
// NOTE: This is the official cUSD address on the Celo Alfajores Testnet.
export const CUSD_TOKEN_ADDRESS = "0x874069fa1cE44d71Fdb3660E3d106E644dAAf9a2"; 

// 3. WalletConnect Project ID (from user's saved information)
export const WALLET_CONNECT_PROJECT_ID = "a5f9260bc9bca570190d3b01f477fc45";

// 4. ABI (Application Binary Interface) for the GeoCharityPool Contract
// NOTE: This should be generated after compilation, but a minimal structure is provided here.
export const GEO_CHARITY_POOL_ABI = [
    // Function: donate(bytes32 _charityId, uint256 _amount)
    {
        "inputs": [
            { "internalType": "bytes32", "name": "_charityId", "type": "bytes32" },
            { "internalType": "uint256", "name": "_amount", "type": "uint256" }
        ],
        "name": "donate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // Add other function ABIs (registerCharity, withdrawFunds, etc.) here
];

// 5. Minimal ERC-20 ABI for Approval
export const ERC20_ABI = [
    // Function: approve(address spender, uint256 amount)
    {
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // Function: decimals()
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            { "internalType": "uint8", "name": "", "type": "uint8" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
