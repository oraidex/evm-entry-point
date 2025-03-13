// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/access/Ownable.sol";

import "../ERC20Native.sol";

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

    // function mint(address to, uint256 amount) public onlyOwner {
    //     _mint(to, amount);
    // }

    // function burn(uint256 amount) public {
    //     _burn(_msgSender(), amount);
    // }
}
