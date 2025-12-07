import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { approveCUSD, donate } from './utils/celo-interactions';

// This is a placeholder component. In a real mobile app, location and charityId would be dynamic.
const MOCK_CHARITY_ID = "0x4368617269747941494400000000000000000000000000000000000000000000"; // Example bytes32 hash
const DONATION_AMOUNT = "0.5"; // 0.5 cUSD

function App() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const [status, setStatus] = useState("Disconnected");
    const [walletClient, setWalletClient] = useState(null); // Actual viem wallet client

    // --- Wallet Connection Logic (Simplified) ---
    const handleConnect = () => {
        if (!isConnected) {
            connect({ connector: injected() }); // Use injected for simplicity, replace with WalletConnect later
        }
    };

    // --- Transaction Logic ---
    const handleDonate = async () => {
        if (!walletClient || !address) {
            setStatus("Please connect your wallet first.");
            return;
        }

        try {
            setStatus(`Starting approval for ${DONATION_AMOUNT} cUSD...`);
            // Step 1: Approve the contract to spend the donation amount
            await approveCUSD(walletClient, address, DONATION_AMOUNT);
            setStatus("Approval successful. Initiating donation...");

            // Step 2: Donate to the charity pool
            const hash = await donate(walletClient, address, MOCK_CHARITY_ID, DONATION_AMOUNT);
            setStatus(`Donation transaction sent! Hash: ${hash}`);
            
            // NOTE: In a production dApp, you would track the hash completion here.

        } catch (error) {
            setStatus(`Transaction Error: ${error.message}`);
            console.error(error);
        }
    };

    useEffect(() => {
        if (isConnected) {
            setStatus(`Connected: ${address.substring(0, 6)}...`);
            // Initialize viem wallet client here after successful wagmi connection
            // For a complete setup, you would use viem's getWalletClient() from a wagmi store.
            // Simplified for demonstration:
            // setWalletClient(getWalletClient()); 
        } else {
            setStatus("Disconnected");
        }
    }, [isConnected, address]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Celo Geo-Donation dApp</h2>
            <p>Status: <strong>{status}</strong></p>

            {!isConnected ? (
                <button onClick={handleConnect} style={{ padding: '10px', fontSize: '16px' }}>
                    Connect Wallet (using WalletConnect)
                </button>
            ) : (
                <>
                    <p>Charity Zone ID: {MOCK_CHARITY_ID.substring(0, 10)}...</p>
                    <p>Donation Amount: {DONATION_AMOUNT} cUSD</p>
                    <button onClick={handleDonate} style={{ padding: '10px', fontSize: '16px', backgroundColor: 'lightgreen', border: 'none' }}>
                        TRIGGER DONATION! (Geo-Fenced)
                    </button>
                </>
            )}
            <p style={{ marginTop: '20px', fontSize: 'small' }}>
                Contract Address: 0x765de816845861e75a25fca122bb6898b8b1282a
            </p>
        </div>
    );
}

export default App;
