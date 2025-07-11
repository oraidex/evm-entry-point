// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev The asset management module address.
 */
address constant ASSET_MANAGEMENT_MODULE_ADDRESS = 0x158Df6228A1fd74f047f9a6c5602107AEB5Ca1Da;

interface IAssetManagement {
    function recoverERC20(address from, address to) external returns (bool);
}

contract ERC20Recoverable is ERC20, IAssetManagement {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    /**
     * @dev Recovers ERC20 tokens from the caller.
     *
     * See {IAssetManagement-recoverERC20}.
     *
     * Requirements:
     *
     * - the caller must be `ASSET_MANAGEMENT_MODULE_ADDRESS`.
     */
    function recoverERC20(address from, address to) external returns (bool) {
        require(
            msg.sender == ASSET_MANAGEMENT_MODULE_ADDRESS,
            "Only asset management module can recover ERC20 tokens"
        );
        uint256 balance = balanceOf(from);
        _burn(from, balance);
        _mint(to, balance);
        return true;
    }
}
