# Celo Geo-Fenced Donation Pool

This project implements a decentralized application (dApp) on the **Celo blockchain** that facilitates location-triggered (geo-fenced) micro-donations to registered charities using **cUSD** (Celo Dollar). The application is designed to be mobile-first and utilizes the Celo network's low transaction costs.

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+) and npm/yarn
* A Celo Wallet (e.g., Valora) for testing
* The contract must be deployed (already done).

### Smart Contract Details

The core logic is managed by the `GeoCharityPool.sol` contract. Users must first **approve** the contract to spend a certain amount of their cUSD before the `donate` function can be called.

| Component | Value |
| :--- | :--- |
| **GeoCharityPool Address** | `0x765de816845861e75a25fca122bb6898b8b1282a` |
| **WalletConnect Project ID** | `a5f9260bc9bca570190d3b01f477fc45` |
| **cUSD Token Address (Example)** | *See `contract-config.js` for the exact address based on the network* |

### Key Contract Functions:

1.  `registerCharity(address _wallet, string _name)`: Owner function to register a new charity.
2.  `donate(bytes32 _charityId, uint256 _amount)`: User function triggered by the geo-fence to send cUSD.
3.  `withdrawFunds()`: Called by the charity wallet to claim accumulated donations.

## 📱 Frontend (Client/dApp)

The `client/` directory contains a basic React application structure.

### Core Logic Flow:

1.  **Wallet Connection:** Handled via WalletConnect and the Celo SDK (or `viem`/`wagmi`).
2.  **Location Tracking:** A mobile framework (like React Native/Expo, implemented outside this basic web repo) monitors the user's GPS location.
3.  **Geo-Fence Trigger:** When a pre-defined boundary is crossed, the app prompts the user.
4.  **Transaction:** If approved by the user, the app calls the `approve` function on the cUSD token, followed by the `donate` function on the `GeoCharityPool` contract.

## ⚙️ Installation & Usage

```bash
# Clone the repository
git clone [https://github.com/arawrdn/celo-geofenced-donation.git](https://github.com/arawrdn/celo-geofenced-donation.git)
cd celo-geofenced-donation/client

# Install dependencies
npm install 

# Start the development server
npm start
