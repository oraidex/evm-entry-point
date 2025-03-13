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
import "./libraries/Constants.sol";

contract CW20ERC20Token is IERC20, Ownable {
    IWasmd public WasmdPrecompile;
    IJson public JsonPrecompile;
    IAddr public AddrPrecompile;
    IBank public BankPrecompile;
    string public cw20Address;

    constructor(string memory cw20Address_, address _owner) Ownable(_owner) {
        WasmdPrecompile = IWasmd(WASMD_PRECOMPILE_ADDRESS);
        JsonPrecompile = IJson(JSON_PRECOMPILE_ADDRESS);
        AddrPrecompile = IAddr(ADDR_PRECOMPILE_ADDRESS);
        BankPrecompile = IBank(BANK_PRECOMPILE_ADDRESS);
        cw20Address = cw20Address_;
    }

    function mint(address account, uint256 amount) external onlyOwner {
        require(account != address(0), "ERC20: mint to the zero address");
        string memory recipient = formatPayload(
            "recipient",
            doubleQuotes(AddrPrecompile.getCosmosAddr(account))
        );
        string memory amt = formatPayload(
            "amount",
            doubleQuotes(Strings.toString(amount))
        );
        string memory req = curlyBrace(
            formatPayload("mint", curlyBrace(join(recipient, amt, ",")))
        );
        _execute(req);
    }

    function name() public view returns (string memory) {
        string memory req = curlyBrace(formatPayload("token_info", "{}"));
        bytes memory response = WasmdPrecompile.query(cw20Address, bytes(req));
        return string(JsonPrecompile.extractAsBytes(response, "name"));
    }

    function symbol() public view returns (string memory) {
        string memory req = curlyBrace(formatPayload("token_info", "{}"));
        bytes memory response = WasmdPrecompile.query(cw20Address, bytes(req));
        return string(JsonPrecompile.extractAsBytes(response, "symbol"));
    }

    function decimals() public view returns (uint8) {
        string memory req = curlyBrace(formatPayload("token_info", "{}"));
        bytes memory response = WasmdPrecompile.query(cw20Address, bytes(req));
        return uint8(JsonPrecompile.extractAsUint256(response, "decimals"));
    }

    function balanceOf(address owner) public view override returns (uint256) {
        require(
            owner != address(0),
            "ERC20: balance query for the zero address"
        );
        string memory ownerAddr = formatPayload(
            "address",
            doubleQuotes(AddrPrecompile.getCosmosAddr(owner))
        );
        string memory req = curlyBrace(
            formatPayload("balance", curlyBrace(ownerAddr))
        );
        bytes memory response = WasmdPrecompile.query(cw20Address, bytes(req));
        return JsonPrecompile.extractAsUint256(response, "balance");
    }

    function totalSupply() public view override returns (uint256) {
        string memory req = curlyBrace(formatPayload("token_info", "{}"));
        bytes memory response = WasmdPrecompile.query(cw20Address, bytes(req));
        return JsonPrecompile.extractAsUint256(response, "total_supply");
    }

    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(to != address(0), "ERC20: transfer to the zero address");
        string memory recipient = formatPayload(
            "recipient",
            doubleQuotes(AddrPrecompile.getCosmosAddr(to))
        );
        string memory amt = formatPayload(
            "amount",
            doubleQuotes(Strings.toString(amount))
        );
        string memory req = curlyBrace(
            formatPayload("transfer", curlyBrace(join(recipient, amt, ",")))
        );
        _execute(req);
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) public view override returns (uint256) {
        require(
            owner != address(0),
            "ERC20: allowance query for the zero address"
        );
        string memory ownerAddr = formatPayload(
            "owner",
            doubleQuotes(AddrPrecompile.getCosmosAddr(owner))
        );
        string memory spenderAddr = formatPayload(
            "spender",
            doubleQuotes(AddrPrecompile.getCosmosAddr(spender))
        );
        string memory req = curlyBrace(
            formatPayload(
                "allowance",
                curlyBrace(join(ownerAddr, spenderAddr, ","))
            )
        );
        bytes memory response = WasmdPrecompile.query(cw20Address, bytes(req));
        return JsonPrecompile.extractAsUint256(response, "allowance");
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        string memory fromAddr = formatPayload(
            "owner",
            doubleQuotes(AddrPrecompile.getCosmosAddr(from))
        );
        string memory toAddr = formatPayload(
            "recipient",
            doubleQuotes(AddrPrecompile.getCosmosAddr(to))
        );
        string memory amt = formatPayload(
            "amount",
            doubleQuotes(Strings.toString(amount))
        );
        string memory req = curlyBrace(
            formatPayload(
                "transfer_from",
                curlyBrace(join(fromAddr, join(toAddr, amt, ","), ","))
            )
        );
        _execute(req);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        address owner = _msgSender();
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        string memory spenderAddr = formatPayload(
            "spender",
            doubleQuotes(AddrPrecompile.getCosmosAddr(spender))
        );

        // reset allowance to zero
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance > 0) {
            string memory amtDecrease = formatPayload(
                "amount",
                doubleQuotes(Strings.toString(currentAllowance))
            );
            string memory decreaseAllowanceReq = curlyBrace(
                formatPayload(
                    "decrease_allowance",
                    curlyBrace(join(spenderAddr, amtDecrease, ","))
                )
            );
            _execute(decreaseAllowanceReq);
        }

        string memory amt = formatPayload(
            "amount",
            doubleQuotes(Strings.toString(amount))
        );
        string memory req = curlyBrace(
            formatPayload(
                "increase_allowance",
                curlyBrace(join(spenderAddr, amt, ","))
            )
        );
        _execute(req);

        emit Approval(owner, spender, amount);
        return true;
    }

    function _execute(string memory req) internal returns (bytes memory) {
        (bool success, bytes memory ret) = WASMD_PRECOMPILE_ADDRESS
            .delegatecall(
                abi.encodeWithSignature(
                    "execute(string,bytes,bytes)",
                    cw20Address,
                    bytes(req),
                    bytes("[]")
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

    function _send(
        address to,
        string memory denom,
        uint256 amount
    ) internal returns (bytes memory) {
        (bool success, bytes memory ret) = BANK_PRECOMPILE_ADDRESS.delegatecall(
            abi.encodeWithSignature(
                "send(address,string,uint256)",
                to,
                denom,
                amount
            )
        );
        require(success, "Could not send ORAI to destination");
        return ret;
    }

    function _associatePubKey(
        string memory pubKeyHex
    ) internal returns (bytes memory) {
        (bool success, bytes memory ret) = ADDR_PRECOMPILE_ADDRESS.delegatecall(
            abi.encodeWithSignature("associatePubKey(string)", pubKeyHex)
        );
        require(success, "Could not send ORAI to destination");
        return ret;
    }
}
