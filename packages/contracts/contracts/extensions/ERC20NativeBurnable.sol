// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/ERC20Burnable.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../ERC20Native.sol";

/**
 * @dev Extension of {ERC20} that allows token holders to destroy both their own
 * tokens and those that they have an allowance for, in a way that can be
 * recognized off-chain (via event analysis).
 */
abstract contract ERC20Burnable is ERC20Native, Ownable {
    /**
     * @dev Destroys a `value` amount of tokens from the caller.
     * Require: caller has to be owner since the token factory only allows burn for denom owner
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 value) public virtual onlyOwner {
        _burn(_msgSender(), value);
    }
}
