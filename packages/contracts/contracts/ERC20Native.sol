// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {IWasmd} from "./precompiles/IWasmd.sol";
import {IJson} from "./precompiles/IJson.sol";
import {IAddr} from "./precompiles/IAddr.sol";
import {IBank} from "./precompiles/IBank.sol";
import "./libraries/Payload.sol";

contract NativeERC20Token is IERC20, Ownable {
    using Strings for uint256;
    address constant WASMD_PRECOMPILE_ADDRESS = 0x9000000000000000000000000000000000000001;
    address constant JSON_PRECOMPILE_ADDRESS = 0x9000000000000000000000000000000000000002;
    address constant BANK_PRECOMPILE_ADDRESS = 0x9000000000000000000000000000000000000004;
    address constant ADDR_PRECOMPILE_ADDRESS = 0x9000000000000000000000000000000000000005;
    IWasmd public WasmdPrecompile;
    IJson public JsonPrecompile;
    IBank public BankPrecompile;
    IAuthz public AuthzPrecompile;
    string public tokenFactoryAddress;
    string public fullDenom;
    string public name;
    string public symbol;
    uint256 public decimals;

    constructor(string memory _tokenFactoryAddress, string memory _name, string memory _symbol, uint256 _decimals, uint256 _totalSupply) Ownable(_owner) {
      WasmdPrecompile = IWasmd(WASMD_PRECOMPILE_ADDRESS);
      JsonPrecompile = IJson(JSON_PRECOMPILE_ADDRESS);
      BankPrecompile = IBank(BANK_PRECOMPILE_ADDRESS);
      AuthzPrecompile = IAuthz(AUTHZ_PRECOMPILE_ADDRESS);
      fullDenom = string(abi.encodePacked("factory/", _tokenFactoryAddress, "/", _subdenom));
      decimals = _decimals;
      name = _name;
      symbol = _symbol;
      string memory metadata = buildMetadata();
      string memory encodeMetadata = formatPayload("metadata", metadata);
      string memory encodeSubdenom = formatPayload("subdenom", doubleQuotes(_subdenom));
      string memory req = curlyBrace(formatPayload("create_denom", curlyBrace(join(encodeMetadata, encodeSubdenom, ","))));
      _execute(req);
    }

    function buildMetadata() internal pure returns(string memory) {
      string memory encodeName = formatPayload("name", doubleQuotes(name));
      string memory encodeSymbol = formatPayload("symbol", doubleQuotes(symbol));
      string memory encodeDisplay = formatPayload("display", string(abi.encodePacked("erc20.", symbol)));
      string memory encodeBase = formatPayload("base", string(abi.encodePacked("u", symbol)));
      string memory denomUnitBase = curlyBrace(
        join(
          join(
            formatPayload("denom", doubleQuotes(fullDenom)), 
            formatPayload("exponent", doubleQuotes(0.toString())),
            ","
          ),
          formatPayload("aliases", "[]"),
        )
      );
      string memory denomDisplay = curlyBrace(
        join(
          join(
            formatPayload("denom", doubleQuotes(fullDenom)), 
            formatPayload("exponent", doubleQuotes(decimals.toString())),
            ","
          ),
          formatPayload("aliases", "[]"),
        )
      );
      string memory denomUnit = formatPayload("denom_units", [
        curlyBrace(denomUnitBase),
        curlyBrace(denomDisplay)
      ]);
      string memory metadata = curlyBrace(
        curlyBrace(
          join(
            join(
              join(
                join(
                  encodeName,
                  encodeSymbol,
                  ","
                ),
                encodeDisplay,
                ","
              ),
              encodeBase,
              ","
            ),
            denomUnit,
            ","
          ),
        )
      );
      return metadata;
    }

    function balanceOf(address owner) public view override returns (uint256) {
        require(owner != address(0), "ERC20: balance query for the zero address");
        return BankPrecompile.balance(owner, fullDenom);
    }

    function totalSupply() public view override returns (uint256) {
        return BankPrecompile.supply(fullDenom);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        require(to != address(0), "ERC20: transfer to the zero address");
        return BankPrecompile.send(to, fullDenom, amount);
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        require(owner != address(0), "ERC20: allowance query for the zero address");
        return AuthzPrecompile.grants(owner, spender, fullDenom);
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        AuthzPrecompile.execGrant(from, to, fullDenom, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        address owner = _msgSender();
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        AuthzPrecompile.setGrant(owner, spender, fullDenom, amount);
        emit Approval(owner, spender, amount);
        return true;
    }

    function _execute(string memory req) internal returns (bytes memory) {
        (bool success, bytes memory ret) = WASMD_PRECOMPILE_ADDRESS.delegatecall(
            abi.encodeWithSignature("execute(string,bytes,bytes)", cw20Address, bytes(req), bytes("[]"))
        );
        require(success, string.concat("CosmWasm execute failed. CosmWasm instruction: ", req));
        return ret;
    }
}