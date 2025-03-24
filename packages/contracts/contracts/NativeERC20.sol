// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {IWasmd} from "./precompiles/IWasmd.sol";
import {IJson} from "./precompiles/IJson.sol";
import {IAddr} from "./precompiles/IAddr.sol";
import {IBank} from "./precompiles/IBank.sol";
import {IAuthz} from "./precompiles/IAuthz.sol";
import "./libraries/Payload.sol";
import "./libraries/Constants.sol";

abstract contract NativeERC20 is IERC20, Context {
    IJson public JsonPrecompile;
    IBank public BankPrecompile;
    IWasmd public WasmdPrecompile;
    IAuthz public AuthzPrecompile;
    string public tokenFactoryAddress;
    string public fulldenom;
    string internal _name;
    string internal _symbol;
    uint256 internal _decimals;

    constructor(
        string memory _fullDenom,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenDecimals
    ) {
        WasmdPrecompile = IWasmd(WASMD_PRECOMPILE_ADDRESS);
        JsonPrecompile = IJson(JSON_PRECOMPILE_ADDRESS);
        BankPrecompile = IBank(BANK_PRECOMPILE_ADDRESS);
        AuthzPrecompile = IAuthz(AUTHZ_PRECOMPILE_ADDRESS);
        fulldenom = _fullDenom;
        _name = _tokenName;
        _symbol = _tokenSymbol;
        _decimals = _tokenDecimals;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual returns (uint256) {
        return uint256(_decimals);
    }

    function balanceOf(address owner) public view virtual returns (uint256) {
        require(
            owner != address(0),
            "ERC20: balance query for the zero address"
        );
        return BankPrecompile.balance(owner, fulldenom);
    }

    function totalSupply() public view virtual returns (uint256) {
        return BankPrecompile.supply(fulldenom);
    }

    /**
     * @custom:oz-upgrades-unsafe-allow-reachable delegatecall
     */
    function transfer(
        address to,
        uint256 amount
    ) public virtual returns (bool) {
        require(to != address(0), "ERC20: transfer to the zero address");
        (bool success, ) = BANK_PRECOMPILE_ADDRESS.delegatecall(
            abi.encodeWithSignature(
                "send(address,string,uint256)",
                to,
                fulldenom,
                amount
            )
        );
        if (success) {
            emit Transfer(msg.sender, to, amount);
        }
        return success;
    }

    function allowance(
        address owner,
        address spender
    ) public view virtual returns (uint256) {
        require(
            owner != address(0),
            "ERC20: allowance query for the zero address"
        );
        return AuthzPrecompile.grant(owner, spender, fulldenom);
    }

    /**
     * @custom:oz-upgrades-unsafe-allow-reachable delegatecall
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual returns (bool) {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        (bool success, ) = AUTHZ_PRECOMPILE_ADDRESS.delegatecall(
            abi.encodeWithSignature(
                "execGrant(address,address,string,uint256)",
                from,
                to,
                fulldenom,
                amount
            )
        );
        if (success) {
            emit Transfer(from, to, amount);
        }
        return success;
    }

    /**
     * @custom:oz-upgrades-unsafe-allow-reachable delegatecall
     */
    function approve(
        address spender,
        uint256 amount
    ) public virtual returns (bool) {
        address owner = _msgSender();
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        (bool success, ) = AUTHZ_PRECOMPILE_ADDRESS.delegatecall(
            abi.encodeWithSignature(
                "setGrant(address,string,uint256)",
                spender,
                fulldenom,
                amount
            )
        );
        require(success, "ERC20: approve failed");
        emit Approval(owner, spender, amount);
        return true;
    }
}
