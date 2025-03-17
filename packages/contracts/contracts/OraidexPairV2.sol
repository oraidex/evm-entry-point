// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./interfaces/IOraidexPairV2Query.sol";
import {IWasmd} from "./precompiles/IWasmd.sol";
import "./libraries/Payload.sol";

contract OraidexPairV2 is OraidexPairV2Query {
    address constant WASMD_PRECOMPILE_ADDRESS =
        0x9000000000000000000000000000000000000001;

    IWasmd public WasmdPrecompile;
    string public pairAddress;

    constructor(string memory pairAddress_) {
        WasmdPrecompile = IWasmd(WASMD_PRECOMPILE_ADDRESS);
        pairAddress = pairAddress_;
    }

    function pair() external view override returns (bytes memory pairResponse) {
        string memory req = curlyBrace(formatPayload("pair", "{}"));
        bytes memory response = WasmdPrecompile.query(pairAddress, bytes(req));
        return response;
    }

    // function pool() external pure override returns (bytes memory poolRespone) {}
    //
    // function admin()
    //     external
    //     pure
    //     override
    //     returns (bytes memory adminResponse)
    // {}
    //
    // function operator()
    //     external
    //     pure
    //     override
    //     returns (bytes memory operatorResponse)
    // {}
    //
    // function simulation(
    //     bytes memory offer_asset
    // ) external pure override returns (bytes memory simulationResponse) {}
    //
    // function traderIsWhitlisted(
    //     bytes memory trader
    // ) external pure override returns (bytes memory simulationResponse) {}
    //
    // function reverseSimulation(
    //     bytes memory askAsset
    // ) external pure override returns (bytes memory simulationResponse) {}
}
