// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title GeoCharityPool
 * @notice Smart contract for managing location-based micro-donations using cUSD on Celo.
 */
contract GeoCharityPool {
    // Address of the cUSD ERC-20 token on Celo.
    // NOTE: This address should be verified for the specific Celo network (Mainnet, Alfajores, etc.)
    // For demonstration, a placeholder is used. Replace with the actual address.
    address immutable cUSD_TOKEN_ADDRESS;

    // Structure to hold information about a registered charity.
    struct Charity {
        address payable wallet; // The wallet receiving the funds
        string name;            // Name of the charity/zone
        uint256 totalCollected; // Total cUSD collected through this contract
        bool isRegistered;      // Flag to check if the address is a valid charity
    }

    // Mapping from the unique Charity ID (a bytes32 hash of the name/location info) to the Charity struct.
    mapping(bytes32 => Charity) public charities;
    
    // Mapping from the charity wallet address to its ID for quick lookups.
    mapping(address => bytes32) public charityWalletToId;

    // Event emitted when a new charity is successfully registered.
    event CharityRegistered(bytes32 indexed charityId, address indexed wallet, string name);
    // Event emitted when a donation is successfully processed.
    event DonationProcessed(bytes32 indexed charityId, address indexed donor, uint256 amount);
    // Event emitted when a charity successfully withdraws funds.
    event FundsWithdrawn(bytes32 indexed charityId, uint256 amount);

    // Modifier to restrict access to the contract owner.
    address public owner;

    constructor(address _cUSDTicker) {
        owner = msg.sender;
        cUSD_TOKEN_ADDRESS = _cUSDTicker;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    /**
     * @notice Allows the contract owner to register a new charity.
     * @param _wallet The wallet address of the charity.
     * @param _name The name of the charity or the Geo-Zone it represents.
     * @return The unique ID generated for the charity.
     */
    function registerCharity(address payable _wallet, string memory _name) public onlyOwner returns (bytes32) {
        bytes32 charityId = keccak256(abi.encodePacked(_wallet, _name));
        
        require(!charities[charityId].isRegistered, "Charity already registered.");
        require(charityWalletToId[_wallet] == bytes32(0), "Wallet is already associated with an ID.");

        charities[charityId] = Charity({
            wallet: _wallet,
            name: _name,
            totalCollected: 0,
            isRegistered: true
        });

        charityWalletToId[_wallet] = charityId;

        emit CharityRegistered(charityId, _wallet, _name);
        return charityId;
    }

    /**
     * @notice Allows a user to donate cUSD to a specific charity.
     * @dev The user must have approved this contract to spend the cUSD amount prior to calling this function.
     * @param _charityId The unique ID of the charity zone.
     * @param _amount The amount of cUSD (in base units) to donate.
     */
    function donate(bytes32 _charityId, uint256 _amount) public {
        require(charities[_charityId].isRegistered, "Charity ID is invalid.");
        require(_amount > 0, "Donation amount must be greater than zero.");

        // ERC-20 TransferFrom call to move tokens from the user's wallet to this contract.
        // Interface for the cUSD token
        (bool success, bytes memory data) = cUSD_TOKEN_ADDRESS.call(
            abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, address(this), _amount)
        );

        // Check if the cUSD token transfer was successful.
        if (!success || abi.decode(data, (bool)) == false) {
             revert("cUSD transfer failed. Check allowance.");
        }

        // Update total collected for the charity.
        charities[_charityId].totalCollected += _amount;

        emit DonationProcessed(_charityId, msg.sender, _amount);
    }

    /**
     * @notice Allows the registered charity wallet to withdraw the collected cUSD funds.
     */
    function withdrawFunds() public {
        bytes32 charityId = charityWalletToId[msg.sender];
        require(charities[charityId].isRegistered, "Caller is not a registered charity.");

        uint256 amountToWithdraw = charities[charityId].totalCollected;
        require(amountToWithdraw > 0, "No funds available for withdrawal.");

        // Reset the collected amount *before* the transfer to prevent reentrancy attacks.
        charities[charityId].totalCollected = 0;

        // ERC-20 Transfer call to move tokens from this contract to the charity's wallet.
        (bool success, bytes memory data) = cUSD_TOKEN_ADDRESS.call(
            abi.encodeWithSignature("transfer(address,uint256)", msg.sender, amountToWithdraw)
        );
        
        // Check if the cUSD token transfer was successful.
        if (!success || abi.decode(data, (bool)) == false) {
            // If transfer fails, attempt to refund the amount to the stored variable (optional but safer).
            charities[charityId].totalCollected = amountToWithdraw; 
            revert("cUSD withdrawal failed.");
        }

        emit FundsWithdrawn(charityId, amountToWithdraw);
    }

    /**
     * @notice Fallback function to prevent accidental sending of native CELO to the contract.
     */
    receive() external payable {
        revert("Sending native CELO is not allowed.");
    }
}
