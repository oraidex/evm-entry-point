// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Payload {
    function formatPayload(string memory key, string memory value) internal pure returns (string memory) {
        return join(doubleQuotes(key), value, ":");
    }

    function curlyBrace(string memory s) internal pure returns (string memory) {
        return string.concat("{", string.concat(s, "}"));
    }

    function doubleQuotes(string memory s) internal pure returns (string memory) {
        return string.concat('"', string.concat(s, '"'));
    }

    function join(string memory a, string memory b, string memory separator) internal pure returns (string memory) {
        return string.concat(a, string.concat(separator, b));
    }
}
