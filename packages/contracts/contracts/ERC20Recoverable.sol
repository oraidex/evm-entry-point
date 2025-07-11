// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @dev The asset management module address.
 */
address constant ASSET_MANAGEMENT_MODULE_ADDRESS = 0x158Df6228A1fd74f047f9a6c5602107AEB5Ca1Da;

interface IAssetManagement {
    function recoverERC20(address from, address to) external returns (bool);
}

contract ERC20Recoverable is
    Context,
    ERC20,
    ERC20Burnable,
    ERC20Pausable,
    AccessControlEnumerable,
    IAssetManagement
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant RECOVER_ROLE = keccak256("RECOVER_ROLE");
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MINTER_ROLE, _msgSender());
        _grantRole(PAUSER_ROLE, _msgSender());
        _grantRole(BURNER_ROLE, _msgSender());
        _grantRole(RECOVER_ROLE, ASSET_MANAGEMENT_MODULE_ADDRESS);
        _setupDecimals(decimals_);
    }

    /**
     * @dev Sets `_decimals` as `decimals_` once at deployment
     */
    function _setupDecimals(uint8 decimals_) internal {
        _decimals = decimals_;
    }

    /**
     * @dev Overrides the `decimals()` method with custom `_decimals`
     */
    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Creates `amount` new tokens for `to`.
     *
     * See {ERC20-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the `MINTER_ROLE`.
     */
    function mint(
        address to,
        uint256 amount
    ) public virtual onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     *
     * Requirements:
     *
     * - the caller must have the `BURNER_ROLE`.
     */
    function burn(
        uint256 amount
    ) public virtual override onlyRole(BURNER_ROLE) {
        _burn(_msgSender(), amount);
    }

    /**
     * @dev Pauses all token transfers.
     *
     * See {ERC20Pausable-_pause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function pause() public virtual onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpauses all token transfers.
     *
     * See {ERC20Pausable-_unpause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function unpause() public virtual onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Recovers ERC20 tokens from the caller.
     *
     * See {IAssetManagement-recoverERC20}.
     *
     * Requirements:
     *
     * - the caller must have the `RECOVER_ROLE`.
     */
    function recoverERC20(
        address from,
        address to
    ) external onlyRole(RECOVER_ROLE) returns (bool) {
        uint256 balance = balanceOf(from);
        _burn(from, balance);
        _mint(to, balance);
        return true;
    }

    /**
     * @dev Override required by Solidity due to multiple inheritance.
     * Combines the logic from ERC20 and ERC20Pausable.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
