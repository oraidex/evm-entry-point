// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../NativeERC20.sol";

contract ExampleNativeERC20 is NativeERC20 {
    constructor(
        string memory _fulldenom,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenDecimals
    ) NativeERC20(_fulldenom, _tokenName, _tokenSymbol, _tokenDecimals) {}
}
