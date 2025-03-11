// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20Native.sol";

contract ExampleERC20Native is ERC20Native {
    constructor(
        string memory _tokenFactoryAddress,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenDecimals,
        uint256 _initTotalSupply
    )
        ERC20Native(
            _tokenFactoryAddress,
            _tokenName,
            _tokenSymbol,
            _tokenDecimals,
            _initTotalSupply
        )
    {}
}
