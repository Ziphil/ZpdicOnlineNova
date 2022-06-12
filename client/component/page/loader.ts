//

import {
  DefaultGenerics,
  RouteMatch
} from "@tanstack/react-location";
import {
  prefetchQuery
} from "/client/component/hook";
import {
  LANGUAGES
} from "/client/language";


export async function loadTopPage(): Promise<{}> {
  const promises = [
    prefetchQuery("fetchNotifications", {offset: 0, size: 1}),
    prefetchQuery("fetchOverallAggregation", {})
  ];
  await Promise.all(promises);
  return {};
}

export async function loadDashboardPage(): Promise<{}> {
  const promises = [
    prefetchQuery("fetchDictionaries", {}),
    prefetchQuery("fetchInvitations", {type: "edit"}),
    prefetchQuery("fetchInvitations", {type: "transfer"})
  ];
  await Promise.all(promises);
  return {};
}

export async function loadDocumentPage(routeMatch: RouteMatch<DefaultGenerics>): Promise<{}> {
  const {firstPath, secondPath} = routeMatch.params;
  const path = ((firstPath) ? firstPath : "") + ((secondPath) ? "/" + secondPath : "");
  const promises = LANGUAGES.map(({locale}) => prefetchQuery("fetchDocument", {path, locale}));
  await Promise.all(promises);
  return {};
}