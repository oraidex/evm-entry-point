/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  OraidexPairV2Query,
  OraidexPairV2QueryInterface,
} from "../../../../contracts/interfaces/IOraidexPairV2Query.sol/OraidexPairV2Query";

const _abi = [
  {
    inputs: [],
    name: "pair",
    outputs: [
      {
        internalType: "bytes",
        name: "pairResponse",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class OraidexPairV2Query__factory {
  static readonly abi = _abi;
  static createInterface(): OraidexPairV2QueryInterface {
    return new Interface(_abi) as OraidexPairV2QueryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): OraidexPairV2Query {
    return new Contract(address, _abi, runner) as unknown as OraidexPairV2Query;
  }
}
