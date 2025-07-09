// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.17;

/**
 * @dev The ERC20 Factory contract's address.
 */
address constant ERC20_FACTORY_PRECOMPILE_ADDRESS = 0x0000000000000000000000000000000000000900;

/**
 * @dev The ERC20 Factory contract's instance.
 */
IERC20Factory constant ERC20_FACTORY_CONTRACT = IERC20Factory(
    ERC20_FACTORY_PRECOMPILE_ADDRESS
);

interface IERC20Factory {
    /**
     * @dev The account information.
     */
    struct AccountInfo {
        // hex_address is the hex address of the account
        string hexAddress;
        // bech32_address is the bech32 address of the account
        string bech32Address;
    }

    /**
     * @dev The asset information.
     */
    struct Asset {
        // contract_address is the evm contract address of the asset
        string contractAddress;
        // denom is the cosmos coin denom of the asset
        string cosmosDenom;
        // owner is the owner of the asset
        AccountInfo owner;
        // whitelisted_accounts is the whitelisted accounts of the asset
        // these accounts can mint, burn asset
        AccountInfo[] whitelistedAccounts;
        // is_paused is the paused status of the asset
        bool isPaused;
    }

    /**
     * @dev Emitted when a new ERC20 token is created.
     * @param tokenAddress The address of the ERC20 token.
     * @param tokenPairType The type of token pair.
     * @param salt The salt used for deployment.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     * @param decimals The decimals of the token.
     */
    event Create(
        address indexed tokenAddress,
        uint8 tokenPairType,
        bytes32 salt,
        string name,
        string symbol,
        uint8 decimals
    );

    /**
     * @dev Emitted when a new ERC20 token is minted.
     * @param tokenAddress The address of the ERC20 token.
     * @param minter The address of the minter.
     * @param mintTo The address of the minted token.
     * @param amount The amount of tokens minted.
     */
    event Mint(
        address indexed tokenAddress,
        address indexed minter,
        address indexed mintTo,
        uint256 amount
    );

    /**
     * @dev Emitted when a new ERC20 token is burned.
     * @param tokenAddress The address of the ERC20 token.
     * @param burner The address of the burner.
     * @param burnFrom The address of the burned token.
     * @param amount The amount of tokens burned.
     */
    event Burn(
        address indexed tokenAddress,
        address indexed burner,
        address indexed burnFrom,
        uint256 amount
    );

    /**
     * @dev Defines a method for creating an ERC20 token.
     * @param tokenPairType Token Pair type
     * @param salt Salt used for deployment
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     * @param decimals the decimals of the token.
     * @return tokenAddress The ERC20 token address.
     */
    function create(
        uint8 tokenPairType,
        bytes32 salt,
        string memory name,
        string memory symbol,
        uint8 decimals
    ) external returns (address tokenAddress);

    /**
     * @dev Mints a new ERC20 token.
     * @param tokenAddress The address of the ERC20 token.
     * @param mintTo The address of the minted token.
     * @param amount The amount of tokens minted.
     */
    function mint(
        address tokenAddress,
        address mintTo,
        uint256 amount
    ) external returns (bool success);

    /**
     * @dev Burns a new ERC20 token.
     * @param tokenAddress The address of the ERC20 token.
     * @param burnFrom The address of the burned token.
     * @param amount The amount of tokens burned.
     */
    function burn(
        address tokenAddress,
        address burnFrom,
        uint256 amount
    ) external returns (bool success);

    /**
     * @dev Pauses a new ERC20 token.
     * @param tokenAddress The address of the ERC20 token.
     */
    function pause(address tokenAddress) external returns (bool success);

    /**
     * @dev Unpauses a new ERC20 token.
     * @param tokenAddress The address of the ERC20 token.
     */
    function unpause(address tokenAddress) external returns (bool success);

    /**
     * @dev Updates the owner of a new token.
     * @param tokenAddress The address of the ERC20 token.
     * @param newOwner The address of the new owner.
     * @return success Whether the update was successful.
     */
    function updateOwner(
        address tokenAddress,
        address newOwner
    ) external returns (bool success);

    /**
     * @dev Updates the whitelisted addresses for a new token.
     * @param tokenAddress The address of the ERC20 token.
     * @param addresses The addresses of the whitelisted addresses.
     * @return success Whether the update was successful.
     */
    function updateWhitelistedAddresses(
        address tokenAddress,
        address[] calldata addresses
    ) external returns (bool success);

    /**
     * @dev Calculates the deterministic address for a new token.
     * @param tokenPairType Token Pair type
     * @param salt Salt used for deployment
     * @return tokenAddress The calculated ERC20 token address.
     */
    function calculateAddress(
        uint8 tokenPairType,
        bytes32 salt
    ) external view returns (address tokenAddress);

    /**
     * @dev Gets the asset information.
     * @param contractAddress The address of the asset.
     * @return asset The asset information.
     */
    function getAsset(
        string memory contractAddress
    ) external view returns (Asset memory asset);

    /**
     * @dev Gets all the asset information.
     * @return assets The asset information.
     */
    function getAllAssets() external view returns (Asset[] memory assets);
}
