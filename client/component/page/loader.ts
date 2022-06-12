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

export async function loadDictionarySettingPage({params}: RouteMatch<DefaultGenerics>): Promise<{}> {
  const number = +params.number;
  const promises = [
    prefetchQuery("fetchDictionary", {number}),
    prefetchQuery("fetchCommissions", {number, offset: 0, size: 30}),
    prefetchQuery("checkDictionaryAuthorization", {number, authority: "own"})
  ];
  await Promise.all(promises);
  return {};
}

export async function loadDocumentPage({params}: RouteMatch<DefaultGenerics>): Promise<{}> {
  const path = ((params.firstPath) ? params.firstPath : "") + ((params.secondPath) ? "/" + params.secondPath : "");
  const promises = LANGUAGES.map(({locale}) => prefetchQuery("fetchDocument", {path, locale}));
  await Promise.all(promises);
  return {};
}