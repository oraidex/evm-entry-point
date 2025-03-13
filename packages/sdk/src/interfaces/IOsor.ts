import { ActionRoute } from "./IRouter";

export type RouteResponse = {
  swapAmount: string;
  returnAmount: string;
  paths: {
    chainId: string;
    tokenIn: string;
    tokenInAmount: string;
    tokenOut: string;
    tokenOutAmount: string;
    tokenOutChainId: string;
    actions: ActionRoute[];
  }[];
};

export type SmartRouteResponse = {
  swapAmount: string;
  returnAmount: string;
  routes: RouteResponse[];
};


  