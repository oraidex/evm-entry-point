// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IWasmd, WASMD_PRECOMPILE_ADDRESS} from "./precompiles/IWasmd.sol";
import {IJson, JSON_PRECOMPILE_ADDRESS} from "./precompiles/IJson.sol";
import {IAddr, ADDR_PRECOMPILE_ADDRESS} from "./precompiles/IAddr.sol";
import {IBank, BANK_PRECOMPILE_ADDRESS} from "./precompiles/IBank.sol";
import "./libraries/Payload.sol";

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

    function getConfig() public view returns (bytes memory) {
        string memory req = '{"config":{}}';
        bytes memory response = WasmdPrecompile.query(
            oraiswapFactory,
            bytes(req)
        );
        return response;
    }

    function getPairByCosmosToken(
        string memory token1,
        string memory token2
    ) public view returns (bytes memory) {
        // string memory asset1Json = denomToAssetInfo(token1);
        // string memory asset2Json = denomToAssetInfo(token2);

        // string memory req = string(
        //     abi.encodePacked('{"pair":[', asset1Json, ",", asset2Json, "]}")
        // );

        // bytes memory response = WasmdPrecompile.query(
        //     oraiswapFactory,
        //     bytes(req)
        // );
        // return response;
    }
}
