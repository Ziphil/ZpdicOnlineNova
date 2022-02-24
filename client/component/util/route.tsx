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


export function createRoute(path: string, importModule: () => Promise<FunctionComponentModule>, options: RouteOptions, childRoutes?: Array<Route>): Route {
  let innerRoute = {
    path: "/",
    caseSensitive: true,
    element: async () => {
      let module = await importModule();
      return <Authenticator type={options.type} redirect={options.redirect} node={createElement(module.default)}/>;
    }
  } as Route;
  if (path === "/") {
    return innerRoute;
  } else if (path === "*") {
    return {...innerRoute, path: "*"};
  } else {
    return {path, children: [innerRoute, ...(childRoutes ?? [])]};
  }
}

type FunctionComponentModule = {default: FunctionComponent<unknown>};
type RouteOptions = {
  type: "private" | "guest" | "none",
  redirect?: string
};