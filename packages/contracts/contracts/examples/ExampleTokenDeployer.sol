// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./ExampleERC20Native.sol";

contract ExampleTokenDeployer is Initializable, UUPSUpgradeable {
    mapping(address => address) public tokenDeployer;

    /// @custom:oz-upgrades-unsafe-allow constructor delegatecall
    constructor() {
        _disableInitializers();
    }

    function _authorizeUpgrade(address newImplementation) internal override {}

    function initialize() external initializer {}

    function createToken(
        string memory _tokenFactoryAddress,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenDecimals,
        uint256 _initTotalSupply
    ) external payable {
        ExampleERC20Native token = new ExampleERC20Native(
            _tokenFactoryAddress,
            _tokenName,
            _tokenSymbol,
            _tokenDecimals,
            _initTotalSupply
        );
        token.transfer(msg.sender, _initTotalSupply);
        tokenDeployer[msg.sender] = address(token);
    }
}
