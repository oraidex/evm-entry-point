// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Multicall {
    struct Call {
        address target;
        bytes callData;
    }

    function aggregate(
        Call[] memory calls
    ) public returns (uint256 blockNumber, bytes[] memory returnData) {
        blockNumber = block.number;
        returnData = new bytes[](calls.length);

        for (uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory ret) = calls[i].target.call(
                calls[i].callData
            );
            require(success, "Multicall: call failed");
            returnData[i] = ret;
        }
    }

    function getBlockNumber() public view returns (uint256 blockNumber) {
        blockNumber = block.number;
    }

    function getCurrentBlockTimestamp()
        public
        view
        returns (uint256 timestamp)
    {
        timestamp = block.timestamp;
    }

    function getLastBlockHash() public view returns (bytes32 blockHash) {
        blockHash = blockhash(block.number - 1);
    }
}
