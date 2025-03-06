// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {IWasmd} from "./precompiles/IWasmd.sol";
import {IJson} from "./precompiles/IJson.sol";
import {IAddr} from "./precompiles/IAddr.sol";
import {IBank} from "./precompiles/IBank.sol";
import {IAuthz} from "./precompiles/IAuthz.sol";
import "./libraries/Payload.sol";

contract NativeERC20 is IERC20 {
    address constant WASMD_PRECOMPILE_ADDRESS =
        0x9000000000000000000000000000000000000001;
    address constant JSON_PRECOMPILE_ADDRESS =
        0x9000000000000000000000000000000000000002;
    address constant BANK_PRECOMPILE_ADDRESS =
        0x9000000000000000000000000000000000000004;
    address constant AUTHZ_PRECOMPILE_ADDRESS =
        0x9000000000000000000000000000000000000005;
    IJson public JsonPrecompile;
    IBank public BankPrecompile;
    IWasmd public WasmdPrecompile;
    IAuthz public AuthzPrecompile;
    string public tokenFactoryAddress;
    string public fullDenom;
    string public name;
    string public symbol;
    uint256 public decimals;

    constructor(
        string memory _tokenFactoryAddress,
        string memory _subdenom,
        string memory _name,
        string memory _symbol,
        uint256 _decimals
    ) {
        WasmdPrecompile = IWasmd(WASMD_PRECOMPILE_ADDRESS);
        JsonPrecompile = IJson(JSON_PRECOMPILE_ADDRESS);
        BankPrecompile = IBank(BANK_PRECOMPILE_ADDRESS);
        AuthzPrecompile = IAuthz(AUTHZ_PRECOMPILE_ADDRESS);
        fullDenom = string(
            abi.encodePacked("factory/", _tokenFactoryAddress, "/", _subdenom)
        );
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function balanceOf(address owner) public view override returns (uint256) {
        require(
            owner != address(0),
            "ERC20: balance query for the zero address"
        );
        return BankPrecompile.balance(owner, fullDenom);
    }

    function totalSupply() public view override returns (uint256) {
        return BankPrecompile.supply(fullDenom);
    }

    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(to != address(0), "ERC20: transfer to the zero address");
        return BankPrecompile.send(to, fullDenom, amount);
    }

    function allowance(
        address owner,
        address spender
    ) public view override returns (uint256) {
        require(
            owner != address(0),
            "ERC20: allowance query for the zero address"
        );
        return AuthzPrecompile.grant(owner, spender, fullDenom);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        AuthzPrecompile.execGrant(from, to, fullDenom, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        address owner = msg.sender;
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        AuthzPrecompile.setGrant(spender, fullDenom, amount);
        emit Approval(owner, spender, amount);
        return true;
    }
}
