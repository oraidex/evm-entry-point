import { Route } from './IRouter';

export type OsorSmartRouteResponse = {
  swapAmount: string;
  returnAmount: string;
  routes: Route[];
};
