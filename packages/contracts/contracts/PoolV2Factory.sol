// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IWasmd} from "./precompiles/IWasmd.sol";
import {IJson} from "./precompiles/IJson.sol";
import {IAddr} from "./precompiles/IAddr.sol";
import {IBank} from "./precompiles/IBank.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./libraries/Payload.sol";
import "./libraries/Constants.sol";

contract PoolV2Factory {
    // Precompile entry points
    IWasmd public WasmdPrecompile;
    IJson public JsonPrecompile;
    IAddr public AddrPrecompile;
    IBank public BankPrecompile;

    // Factory address
    string public oraiswapFactory;

    constructor(string memory oraiswapFactory_) {
        WasmdPrecompile = IWasmd(WASMD_PRECOMPILE_ADDRESS);
        JsonPrecompile = IJson(JSON_PRECOMPILE_ADDRESS);
        AddrPrecompile = IAddr(ADDR_PRECOMPILE_ADDRESS);
        BankPrecompile = IBank(BANK_PRECOMPILE_ADDRESS);
        oraiswapFactory = oraiswapFactory_;
    }

    // === Query Functions ===

    // Query the factory configuration
    function getConfig() public view returns (bytes memory) {
        string memory req = '{"config":{}}';
        bytes memory response = WasmdPrecompile.query(
            oraiswapFactory,
            bytes(req)
        );
        return response;
    }

    // Query a pair by asset infos
    function getPair(
        string memory assetInfo1Json,
        string memory assetInfo2Json
    ) public view returns (bytes memory) {
        string memory req = string.concat(
            '{"pair": [',
            assetInfo1Json,
            ",",
            assetInfo2Json,
            "]}"
        );
        bytes memory response = WasmdPrecompile.query(
            oraiswapFactory,
            bytes(req)
        );
        return response;
    }

    // Query multiple pairs with pagination
    function getPairs(
        string memory startAfterJson,
        uint32 limit
    ) public view returns (bytes memory) {
        string memory limitStr = Strings.toString(limit);
        string memory req;
        if (Strings.equal(startAfterJson, "")) {
            req = string.concat('{"pairs": {"limit": ', limitStr, "}}");
        } else {
            req = string.concat(
                '{"pairs": {"start_after": ',
                startAfterJson,
                ', "limit": ',
                limitStr,
                "}}"
            );
        }
        bytes memory response = WasmdPrecompile.query(
            oraiswapFactory,
            bytes(req)
        );
        return response;
    }

    // Query restricted assets
    function getRestrictedAssets() public view returns (bytes memory) {
        string memory req = '{"restricted_assets":{}}';
        bytes memory response = WasmdPrecompile.query(
            oraiswapFactory,
            bytes(req)
        );
        return response;
    }

    // Query list of creators
    function getCreators() public view returns (bytes memory) {
        string memory req = '{"get_creators":{}}';
        bytes memory response = WasmdPrecompile.query(
            oraiswapFactory,
            bytes(req)
        );
        return response;
    }

    // === Execute Functions ===

    // Update factory configuration (owner only)
    function updateConfig(
        string memory owner,
        uint64 tokenCodeId,
        uint64 pairCodeId
    ) public returns (bytes memory) {
        string memory req = string.concat(
            '{"update_config": {',
            formatPayload("owner", doubleQuotes(owner)),
            ",",
            formatPayload("token_code_id", Strings.toString(tokenCodeId)),
            ",",
            formatPayload("pair_code_id", Strings.toString(pairCodeId)),
            "}}"
        );
        return _execute(req);
    }

    // Create a new pair
    function createPair(
        string memory assetInfo1Json,
        string memory assetInfo2Json,
        string memory pairAdmin,
        string memory operator,
        bool provideLiquidity_
    ) public returns (bytes memory) {
        string memory req = string.concat(
            '{"create_pair": {',
            '"asset_infos": [',
            assetInfo1Json,
            ",",
            assetInfo2Json,
            "],",
            formatPayload("pair_admin", doubleQuotes(pairAdmin)),
            ",",
            formatPayload("operator", doubleQuotes(operator)),
            ",",
            formatPayload(
                "provide_liquidity",
                provideLiquidity_ ? "true" : "false"
            ),
            "}}"
        );
        return _execute(req);
    }

    // Add a pair manually
    function addPair(
        string memory assetInfo1Json,
        string memory assetInfo2Json,
        string memory contractAddr,
        string memory liquidityToken,
        string memory oracleAddr,
        string memory commissionRate,
        string memory operatorFee
    ) public returns (bytes memory) {
        string memory pairInfo = string.concat(
            "{",
            '"asset_infos": [',
            assetInfo1Json,
            ",",
            assetInfo2Json,
            "],",
            formatPayload("contract_addr", doubleQuotes(contractAddr)),
            ",",
            formatPayload("liquidity_token", doubleQuotes(liquidityToken)),
            ",",
            formatPayload("oracle_addr", doubleQuotes(oracleAddr)),
            ",",
            formatPayload("commission_rate", doubleQuotes(commissionRate)),
            ",",
            formatPayload("operator_fee", doubleQuotes(operatorFee)),
            "}"
        );
        string memory req = string.concat(
            '{"add_pair": {"pair_info": ',
            pairInfo,
            "}}"
        );
        return _execute(req);
    }

    // Provide liquidity to a pair
    function provideLiquidity(
        string memory asset1Json,
        string memory asset2Json,
        string memory receiver
    ) public returns (bytes memory) {
        string memory assets = string.concat(
            "[",
            asset1Json,
            ",",
            asset2Json,
            "]"
        );
        string memory req;
        if (Strings.equal(receiver, "")) {
            req = string.concat(
                '{"provide_liquidity": {"assets": ',
                assets,
                "}}"
            );
        } else {
            req = string.concat(
                '{"provide_liquidity": {',
                '"assets": ',
                assets,
                ",",
                formatPayload("receiver", doubleQuotes(receiver)),
                "}}"
            );
        }
        return _execute(req);
    }

    // Restrict an asset by prefix
    function restrictAsset(string memory prefix) public returns (bytes memory) {
        string memory req = string.concat(
            '{"restrict_asset": {',
            formatPayload("prefix", doubleQuotes(prefix)),
            "}}"
        );
        return _execute(req);
    }

    // Add a creator
    function addCreator(string memory address_) public returns (bytes memory) {
        string memory req = string.concat(
            '{"add_creator": {',
            formatPayload("address", doubleQuotes(address_)),
            "}}"
        );
        return _execute(req);
    }

    // Remove a creator
    function removeCreator(
        string memory address_
    ) public returns (bytes memory) {
        string memory req = string.concat(
            '{"remove_creator": {',
            formatPayload("address", doubleQuotes(address_)),
            "}}"
        );
        return _execute(req);
    }

    // === Helper Functions ===

    // Format AssetInfo for Token
    function formatTokenAssetInfo(
        string memory contractAddr
    ) public pure returns (string memory) {
        return
            string.concat(
                '{"token": {',
                formatPayload("contract_addr", doubleQuotes(contractAddr)),
                "}}"
            );
    }

    // Format AssetInfo for NativeToken
    function formatNativeTokenAssetInfo(
        string memory denom
    ) public pure returns (string memory) {
        return
            string.concat(
                '{"native_token": {',
                formatPayload("denom", doubleQuotes(denom)),
                "}}"
            );
    }

    // Format Asset
    function formatAsset(
        string memory assetInfoJson,
        uint128 amount
    ) public pure returns (string memory) {
        return
            string.concat(
                "{",
                formatPayload("info", assetInfoJson),
                ",",
                formatPayload("amount", doubleQuotes(Strings.toString(amount))),
                "}"
            );
    }

    // Internal execute function
    function _execute(string memory req) internal returns (bytes memory) {
        (bool success, bytes memory ret) = WASMD_PRECOMPILE_ADDRESS
            .delegatecall(
                abi.encodeWithSignature(
                    "execute(string,bytes,bytes)",
                    oraiswapFactory,
                    bytes(req),
                    bytes("[]") // No coins sent by default
                )
            );
        require(success, "CosmWasm execute failed");
        return ret;
    }
}
