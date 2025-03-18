// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ExampleERC20Native.sol";

contract A {
    constructor() {}

    function test(
        string memory tokenFactoryAddr,
        address to,
        uint256 amount
    ) external {
        // deploy erc20 first

        ExampleERC20Native token = new ExampleERC20Native(
            tokenFactoryAddr,
            "test",
            "test",
            18,
            10 ** 27
        );
        // transfer to other account
        require(token.transfer(to, amount), "transfer failed");
        require(token.transfer(to, amount), "transfer failed");
        require(token.transfer(to, amount), "transfer failed");
    }
}
