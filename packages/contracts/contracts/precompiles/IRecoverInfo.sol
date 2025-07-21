// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.8.17;

/**
 * @dev The Recover Info contract's address.
 */
address constant RECOVER_INFO_PRECOMPILE_ADDRESS = 0x0000000000000000000000000000000000000901;

/**
 * @dev The Recover Info contract's instance.
 */
IRecoverInfo constant RECOVER_INFO_CONTRACT = IRecoverInfo(
    RECOVER_INFO_PRECOMPILE_ADDRESS
);

interface IRecoverInfo {
    /**
     * @dev The recover info.
     */
    struct RecoverInfo {
        // old_account_hex_address is the hex address of the old account
        string oldAccountHexAddress;
        // new_account_hex_address is the hex address of the new account
        string newAccountHexAddress;
        // proof is the proof of the recover operation
        string proof;
        // public_signals is the public signals of the recover operation
        string publicSignals;
    }

    /**
     * @dev Emitted when a new recover info is added.
     * @param oldAccount The old account address.
     * @param newAccount The new account address.
     * @param proof The proof of the recover info.
     * @param publicSignals The public signals of the recover info.
     */
    event AddRecoverInfo(
        address indexed oldAccount,
        address indexed newAccount,
        string proof,
        string publicSignals
    );

    /**
     * @dev Emitted when a recover info is removed.
     * @param account The account address.
     */
    event RemoveRecoverInfo(address indexed account);

    /**
     * @dev Adds a new recover info.
     * @param oldAccount The old account address.
     * @param newAccount The new account address.
     * @param proof The proof of the recover info.
     * @param publicSignals The public signals of the recover info.
     * @return success Whether the recover info is added successfully.
     */
    function addRecoverInfo(
        address oldAccount,
        address newAccount,
        string memory proof,
        string memory publicSignals
    ) external returns (bool);

    /**
     * @dev Removes a recover info.
     * @param account The account address.
     * @return success Whether the recover info is removed successfully.
     */
    function removeRecoverInfo(address account) external returns (bool);

    /**
     * @dev Gets the recover info.
     * @param account The account address.
     * @return recoverInfo The recover info.
     */
    function getRecoverInfo(
        address account
    ) external view returns (RecoverInfo memory recoverInfo);

    /**
     * @dev Gets all the recover infos.
     * @return recoverInfos The recover infos.
     */
    function getAllRecoverInfos()
        external
        view
        returns (RecoverInfo[] memory recoverInfos);
}
