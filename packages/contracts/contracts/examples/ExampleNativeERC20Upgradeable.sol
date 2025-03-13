// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../NativeERC20Upgradeable.sol";

contract ExampleNativeERC20Upgradeable is
    Initializable,
    NativeERC20Upgradeable,
    UUPSUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor delegatecall
    constructor() {
        _disableInitializers();
    }

    function _authorizeUpgrade(address newImplementation) internal override {}

    function initialize(
        string memory _tokenFactoryAddress,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenDecimals
    ) public initializer {
        __NativeERC20__init(
            _tokenFactoryAddress,
            _tokenName,
            _tokenSymbol,
            _tokenDecimals
        );
    }
}
