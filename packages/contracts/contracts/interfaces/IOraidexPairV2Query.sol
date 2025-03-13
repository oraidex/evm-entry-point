// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface OraidexPairV2Query {
    function pair() external view returns (bytes memory pairResponse);

    // function pool() external view returns (bytes memory poolRespone);
    //
    // function admin() external view returns (bytes memory admin);
    //
    // function operator() external view returns (bytes memory operator);
    //
    // function simulation(
    //     bytes memory offer_asset
    // ) external view returns (bytes memory simulation);
    //
    // function traderIsWhitlisted(
    //     bytes memory trader
    // ) external view returns (bytes memory simulation);
    //
    // function reverseSimulation(
    //     bytes memory askAsset
    // ) external view returns (bytes memory simulation);
}
