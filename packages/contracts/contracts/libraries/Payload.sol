// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

function formatPayload(
    string memory key,
    string memory value
) pure returns (string memory) {
    return join(doubleQuotes(key), value, ":");
}

function curlyBrace(string memory s) pure returns (string memory) {
    return string.concat("{", string.concat(s, "}"));
}

function squareBrace(string memory s) pure returns (string memory) {
    return string.concat("[", string.concat(s, "]"));
}

function doubleQuotes(string memory s) pure returns (string memory) {
    return string.concat('"', string.concat(s, '"'));
}

function join(
    string memory a,
    string memory b,
    string memory separator
) pure returns (string memory) {
    return string.concat(a, string.concat(separator, b));
}
