// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IBank} from "../precompiles/IBank.sol";
import "../libraries/Constants.sol";

contract NativeTokenSender {
    IBank public BankPrecompile;

    constructor() {
        BankPrecompile = IBank(BANK_PRECOMPILE_ADDRESS);
    }

    /**
     * @notice Sends native tokens to a receiver using IBANK precompile
     * @param receiver The address that will receive the tokens
     */
    function sendNativeTokens(
        address receiver,
        uint256 amount
    ) external payable {
        require(msg.value > 0, "Must send some tokens");
        require(receiver != address(0), "Cannot send to zero address");

        // Use BANK precompile to send the native tokens
        // We use delegatecall here to maintain msg.value context
        require(
            BankPrecompile.send(receiver, "orai", amount),
            "Failed to send native tokens"
        );
    }

    /**
     * @notice View function to check the balance of an address
     * @param account The address to check balance for
     * @return The balance of native tokens for the account
     */
    function getNativeBalance(address account) external view returns (uint256) {
        return BankPrecompile.balance(account, "orai");
    }
}
