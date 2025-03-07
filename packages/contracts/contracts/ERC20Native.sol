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

contract ERC20Native is IERC20, Ownable {
    using Strings for *;
    address constant WASMD_PRECOMPILE_ADDRESS =
        0x9000000000000000000000000000000000000001;
    address constant JSON_PRECOMPILE_ADDRESS =
        0x9000000000000000000000000000000000000002;
    address constant ADDR_PRECOMPILE_ADDRESS =
        0x9000000000000000000000000000000000000003;
    address constant BANK_PRECOMPILE_ADDRESS =
        0x9000000000000000000000000000000000000004;
    address constant AUTHZ_PRECOMPILE_ADDRESS =
        0x9000000000000000000000000000000000000005;
    IWasmd public WasmdPrecompile;
    IJson public JsonPrecompile;
    IBank public BankPrecompile;
    IAddr public AddrPrecompile;
    IAuthz public AuthzPrecompile;
    string public tokenFactoryAddress;
    string public fulldenom;
    string public name;
    string public symbol;
    uint256 public decimals;
    string public subdenom;

    constructor(
        string memory _tokenFactoryAddress,
        string memory _name,
        string memory _symbol,
        uint256 _decimals,
        uint256 _totalSupply
    ) Ownable(msg.sender) {
        WasmdPrecompile = IWasmd(WASMD_PRECOMPILE_ADDRESS);
        JsonPrecompile = IJson(JSON_PRECOMPILE_ADDRESS);
        BankPrecompile = IBank(BANK_PRECOMPILE_ADDRESS);
        AddrPrecompile = IAddr(ADDR_PRECOMPILE_ADDRESS);
        AuthzPrecompile = IAuthz(AUTHZ_PRECOMPILE_ADDRESS);
        tokenFactoryAddress = _tokenFactoryAddress;
        subdenom = address(this).toHexString();
        fulldenom = string(
            abi.encodePacked("factory/", _tokenFactoryAddress, "/", subdenom)
        );
        decimals = _decimals;
        name = _name;
        symbol = _symbol;
        _createDenom();
        _mint(msg.sender, _totalSupply);
    }

    function _mint(address _receiver, uint256 _amount) internal {
        string memory encodeDenom = formatPayload(
            "denom",
            doubleQuotes(fulldenom)
        );
        string memory encodeAmount = formatPayload(
            "amount",
            doubleQuotes(_amount.toString())
        );
        string memory encodeReceiver = formatPayload(
            "mint_to_address",
            doubleQuotes(AddrPrecompile.getCosmosAddr(_receiver))
        );
        string memory req = curlyBrace(
            formatPayload(
                "mint_tokens",
                curlyBrace(
                    join(
                        join(encodeDenom, encodeAmount, ","),
                        encodeReceiver,
                        ","
                    )
                )
            )
        );
        _execute(req, "[]");
    }

    function _createDenom() internal {
        string memory encodeName = formatPayload("name", doubleQuotes(name));
        string memory encodeSymbol = formatPayload(
            "symbol",
            doubleQuotes(symbol)
        );
        string memory encodeDisplay = formatPayload(
            "display",
            doubleQuotes(string(abi.encodePacked("erc20.", symbol)))
        );
        string memory encodeBase = formatPayload(
            "base",
            doubleQuotes(fulldenom)
        );
        string memory denomUnitBase = curlyBrace(
            join(
                join(
                    formatPayload("denom", doubleQuotes(fulldenom)),
                    formatPayload("exponent", 0.toString()),
                    ","
                ),
                formatPayload("aliases", "[]"),
                ","
            )
        );
        string memory denomDisplay = curlyBrace(
            join(
                join(
                    formatPayload(
                        "denom",
                        doubleQuotes(string(abi.encodePacked("erc20.", symbol)))
                    ),
                    formatPayload("exponent", decimals.toString()),
                    ","
                ),
                formatPayload("aliases", "[]"),
                ","
            )
        );
        string memory denomUnit = formatPayload(
            "denom_units",
            squareBrace(join(denomUnitBase, denomDisplay, ","))
        );
        string memory metadata = curlyBrace(
            join(
                join(
                    join(
                        join(encodeName, encodeSymbol, ","),
                        encodeDisplay,
                        ","
                    ),
                    encodeBase,
                    ","
                ),
                denomUnit,
                ","
            )
        );
        string memory encodeMetadata = formatPayload("metadata", metadata);
        string memory encodeSubdenom = formatPayload(
            "subdenom",
            doubleQuotes(subdenom)
        );
        string memory req = curlyBrace(
            formatPayload(
                "create_denom",
                curlyBrace(join(encodeMetadata, encodeSubdenom, ","))
            )
        );
        string memory coins = squareBrace(
            curlyBrace(
                join(
                    formatPayload("denom", doubleQuotes("orai")),
                    formatPayload("amount", 1.toString()),
                    ","
                )
            )
        );
        _execute(req, coins);
    }

    function balanceOf(address owner) public view override returns (uint256) {
        require(
            owner != address(0),
            "ERC20: balance query for the zero address"
        );
        return BankPrecompile.balance(owner, fulldenom);
    }

    function totalSupply() public view override returns (uint256) {
        return BankPrecompile.supply(fulldenom);
    }

    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(to != address(0), "ERC20: transfer to the zero address");
        (bool success, ) = BANK_PRECOMPILE_ADDRESS.delegatecall(
            abi.encodeWithSignature(
                "send(address,string,uint256)",
                to,
                fulldenom,
                amount
            )
        );
        return success;
    }

    function allowance(
        address owner,
        address spender
    ) public view override returns (uint256) {
        require(
            owner != address(0),
            "ERC20: allowance query for the zero address"
        );
        return AuthzPrecompile.grant(owner, spender, fulldenom);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        AuthzPrecompile.execGrant(from, to, fulldenom, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
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

    function _execute(
        string memory req,
        string memory coins
    ) internal returns (bytes memory) {
        (bool success, bytes memory ret) = WASMD_PRECOMPILE_ADDRESS
            .delegatecall(
                abi.encodeWithSignature(
                    "execute(string,bytes,bytes)",
                    tokenFactoryAddress,
                    bytes(req),
                    bytes(coins)
                )
            );
        require(
            success,
            string.concat(
                "CosmWasm execute failed. CosmWasm instruction: ",
                req
            )
        );
        return ret;
    }
}
