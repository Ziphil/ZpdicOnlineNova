//

import {
  DefaultGenerics,
  LoaderFnOptions,
  Route,
  RouteMatch
} from "@tanstack/react-location";
import {
  FunctionComponent,
  createElement
} from "react";
import Authenticator from "./authenticator";


export function createRoute(path: string, importModule: () => Promise<FunctionComponentModule>, options: RouteOptions, childRoutes?: Array<Route>): Array<Route> {
  const innerRoutes = [{
    path: "/",
    element: () => importModule().then((module) => <Authenticator type={options.type} redirect={options.redirect} node={createElement(module.default)}/>),
    loader: options.loader
  }, {
    path: "*",
    element: () => import("/client/component/page/not-found-page").then((module) => {
      return createElement(module.default);
    })
  }];
  if (path === "/") {
    return innerRoutes;
  } else {
    return [{path, children: [...innerRoutes, ...(childRoutes ?? [])]}];
  }
}

type FunctionComponentModule = {default: FunctionComponent<any>};
type RouteOptions = {
  type: "private" | "guest" | "none",
  redirect?: string,
  loader?: (routeMatch: RouteMatch<DefaultGenerics>, options: LoaderFnOptions<DefaultGenerics>) => Promise<{}>
};