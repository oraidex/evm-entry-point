// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../NativeERC20.sol";

contract ExampleNativeERC20 is NativeERC20 {
    constructor(
        string memory _tokenFactoryAddress,
        string memory _subdenom,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenDecimals
    )
        NativeERC20(
            _tokenFactoryAddress,
            _subdenom,
            _tokenName,
            _tokenSymbol,
            _tokenDecimals
        )
    {}
}
