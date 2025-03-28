/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface PoolV2FactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "AddrPrecompile"
      | "BankPrecompile"
      | "JsonPrecompile"
      | "WasmdPrecompile"
      | "addCreator"
      | "addPair"
      | "createPair"
      | "formatAsset"
      | "formatNativeTokenAssetInfo"
      | "formatTokenAssetInfo"
      | "getConfig"
      | "getCreators"
      | "getPair"
      | "getPairs"
      | "getRestrictedAssets"
      | "oraiswapFactory"
      | "provideLiquidity"
      | "removeCreator"
      | "restrictAsset"
      | "updateConfig"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "AddrPrecompile",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "BankPrecompile",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "JsonPrecompile",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "WasmdPrecompile",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "addCreator", values: [string]): string;
  encodeFunctionData(
    functionFragment: "addPair",
    values: [string, string, string, string, string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "createPair",
    values: [string, string, string, string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "formatAsset",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "formatNativeTokenAssetInfo",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "formatTokenAssetInfo",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getConfig", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getCreators",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPair",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPairs",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRestrictedAssets",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "oraiswapFactory",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "provideLiquidity",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "removeCreator",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "restrictAsset",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "updateConfig",
    values: [string, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "AddrPrecompile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "BankPrecompile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "JsonPrecompile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "WasmdPrecompile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addCreator", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addPair", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "createPair", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "formatAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "formatNativeTokenAssetInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "formatTokenAssetInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCreators",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPair", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getPairs", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRestrictedAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "oraiswapFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "provideLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeCreator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "restrictAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateConfig",
    data: BytesLike
  ): Result;
}

export interface PoolV2Factory extends BaseContract {
  connect(runner?: ContractRunner | null): PoolV2Factory;
  waitForDeployment(): Promise<this>;

  interface: PoolV2FactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  AddrPrecompile: TypedContractMethod<[], [string], "view">;

  BankPrecompile: TypedContractMethod<[], [string], "view">;

  JsonPrecompile: TypedContractMethod<[], [string], "view">;

  WasmdPrecompile: TypedContractMethod<[], [string], "view">;

  addCreator: TypedContractMethod<[address_: string], [string], "nonpayable">;

  addPair: TypedContractMethod<
    [
      assetInfo1Json: string,
      assetInfo2Json: string,
      contractAddr: string,
      liquidityToken: string,
      oracleAddr: string,
      commissionRate: string,
      operatorFee: string
    ],
    [string],
    "nonpayable"
  >;

  createPair: TypedContractMethod<
    [
      assetInfo1Json: string,
      assetInfo2Json: string,
      pairAdmin: string,
      operator: string,
      provideLiquidity_: boolean
    ],
    [string],
    "nonpayable"
  >;

  formatAsset: TypedContractMethod<
    [assetInfoJson: string, amount: BigNumberish],
    [string],
    "view"
  >;

  formatNativeTokenAssetInfo: TypedContractMethod<
    [denom: string],
    [string],
    "view"
  >;

  formatTokenAssetInfo: TypedContractMethod<
    [contractAddr: string],
    [string],
    "view"
  >;

  getConfig: TypedContractMethod<[], [string], "view">;

  getCreators: TypedContractMethod<[], [string], "view">;

  getPair: TypedContractMethod<
    [assetInfo1Json: string, assetInfo2Json: string],
    [string],
    "view"
  >;

  getPairs: TypedContractMethod<
    [startAfterJson: string, limit: BigNumberish],
    [string],
    "view"
  >;

  getRestrictedAssets: TypedContractMethod<[], [string], "view">;

  oraiswapFactory: TypedContractMethod<[], [string], "view">;

  provideLiquidity: TypedContractMethod<
    [asset1Json: string, asset2Json: string, receiver: string],
    [string],
    "nonpayable"
  >;

  removeCreator: TypedContractMethod<
    [address_: string],
    [string],
    "nonpayable"
  >;

  restrictAsset: TypedContractMethod<[prefix: string], [string], "nonpayable">;

  updateConfig: TypedContractMethod<
    [owner: string, tokenCodeId: BigNumberish, pairCodeId: BigNumberish],
    [string],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "AddrPrecompile"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "BankPrecompile"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "JsonPrecompile"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "WasmdPrecompile"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "addCreator"
  ): TypedContractMethod<[address_: string], [string], "nonpayable">;
  getFunction(
    nameOrSignature: "addPair"
  ): TypedContractMethod<
    [
      assetInfo1Json: string,
      assetInfo2Json: string,
      contractAddr: string,
      liquidityToken: string,
      oracleAddr: string,
      commissionRate: string,
      operatorFee: string
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "createPair"
  ): TypedContractMethod<
    [
      assetInfo1Json: string,
      assetInfo2Json: string,
      pairAdmin: string,
      operator: string,
      provideLiquidity_: boolean
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "formatAsset"
  ): TypedContractMethod<
    [assetInfoJson: string, amount: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "formatNativeTokenAssetInfo"
  ): TypedContractMethod<[denom: string], [string], "view">;
  getFunction(
    nameOrSignature: "formatTokenAssetInfo"
  ): TypedContractMethod<[contractAddr: string], [string], "view">;
  getFunction(
    nameOrSignature: "getConfig"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getCreators"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getPair"
  ): TypedContractMethod<
    [assetInfo1Json: string, assetInfo2Json: string],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "getPairs"
  ): TypedContractMethod<
    [startAfterJson: string, limit: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRestrictedAssets"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "oraiswapFactory"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "provideLiquidity"
  ): TypedContractMethod<
    [asset1Json: string, asset2Json: string, receiver: string],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "removeCreator"
  ): TypedContractMethod<[address_: string], [string], "nonpayable">;
  getFunction(
    nameOrSignature: "restrictAsset"
  ): TypedContractMethod<[prefix: string], [string], "nonpayable">;
  getFunction(
    nameOrSignature: "updateConfig"
  ): TypedContractMethod<
    [owner: string, tokenCodeId: BigNumberish, pairCodeId: BigNumberish],
    [string],
    "nonpayable"
  >;

  filters: {};
}
