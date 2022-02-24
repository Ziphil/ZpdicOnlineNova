//

import {
  Route
} from "@tanstack/react-location";
import * as react from "react";
import {
  FunctionComponent,
  createElement
} from "react";
import Authenticator from "./authenticator";


export function createRoute(path: string, importModule: () => Promise<{default: FunctionComponent<unknown>}>, options: {type: "private" | "guest" | "none", redirect?: string}, childRoutes?: Array<Route>): Route {
  let innerRoute = {
    path: "/",
    caseSensitive: true,
    element: () => importModule().then((module) => <Authenticator type={options.type} redirect={options.redirect} node={createElement(module.default)}/>)
  } as Route;
  if (path === "") {
    return innerRoute;
  } else if (path === "*") {
    return {...innerRoute, path: "*"};
  } else {
    let route = {
      path,
      children: [innerRoute, ...(childRoutes ?? [])]
    };
    return route;
  }
}