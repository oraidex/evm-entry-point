// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "../lib/forge-std/src/Test.sol";
import {Multicall} from "../contracts/Multicall.sol";

contract MulticallTest is Test {
    Multicall multicall;

    function setUp() public {
        multicall = new Multicall();
    }

    function test_GetBlockNumber() public view {
        uint256 blockNumber = multicall.getBlockNumber();
        assertEq(blockNumber, block.number);
    }

    function test_GetCurrentBlockTimestamp() public view {
        uint256 timestamp = multicall.getCurrentBlockTimestamp();
        assertEq(timestamp, block.timestamp);
    }

    function test_GetLastBlockHash() public {
        // Mine a block to ensure we have a previous block
        vm.roll(block.number + 1);

        bytes32 lastBlockHash = multicall.getLastBlockHash();
        assertEq(lastBlockHash, blockhash(block.number - 1));
    }

    function test_Aggregate() public {
        // Create test calls
        Multicall.Call[] memory calls = new Multicall.Call[](3);

        // Call 1: getBlockNumber
        calls[0] = Multicall.Call({
            target: address(multicall),
            callData: abi.encodeWithSignature("getBlockNumber()")
        });

        // Call 2: getCurrentBlockTimestamp
        calls[1] = Multicall.Call({
            target: address(multicall),
            callData: abi.encodeWithSignature("getCurrentBlockTimestamp()")
        });

        // Call 3: getLastBlockHash
        calls[2] = Multicall.Call({
            target: address(multicall),
            callData: abi.encodeWithSignature("getLastBlockHash()")
        });

        // Execute multicall
        (uint256 blockNumber, bytes[] memory returnData) = multicall.aggregate(
            calls
        );

        // Verify block number
        assertEq(blockNumber, block.number);

        // Verify return data length
        assertEq(returnData.length, 3);

        // Decode and verify individual results
        uint256 decodedBlockNumber = abi.decode(returnData[0], (uint256));
        uint256 decodedTimestamp = abi.decode(returnData[1], (uint256));
        bytes32 decodedBlockHash = abi.decode(returnData[2], (bytes32));

        assertEq(decodedBlockNumber, block.number);
        assertEq(decodedTimestamp, block.timestamp);
        assertEq(decodedBlockHash, blockhash(block.number - 1));
    }

    function testRevert_AggregateFailedCall() public {
        Multicall.Call[] memory calls = new Multicall.Call[](1);

        // Create a call to a contract that will definitely fail
        // Use the test contract itself with invalid function signature
        calls[0] = Multicall.Call({
            target: address(this),
            callData: hex"12345678" // Invalid function signature for this contract
        });

        // The call should revert with "Multicall: call failed"
        vm.expectRevert(bytes("Multicall: call failed"));
        multicall.aggregate(calls);
    }
}
