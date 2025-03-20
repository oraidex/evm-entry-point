import { RouteResponse } from './IRouter';

export type OsorSmartRouteResponse = {
  swapAmount: string;
  returnAmount: string;
  routes: RouteResponse[];
};
