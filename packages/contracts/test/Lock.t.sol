//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "../lib/forge-std/src/Test.sol";

contract Lock is Test {
    uint256 testNumber;

    function setUp() public {
        testNumber = 42;
    }

    function test_NumberIs42() public {
        assertEq(testNumber, 42);
    }

    /// forge-config: default.allow_internal_expect_revert = true
    function testRevert_Subtract43() public {
        vm.expectRevert();
        testNumber -= 43;
    }
}
