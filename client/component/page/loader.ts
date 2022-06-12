//

import {
  prefetchQuery
} from "/client/component/hook";


export async function loadDashboardPage(): Promise<{}> {
  await Promise.all([
    prefetchQuery("fetchDictionaries", {}),
    prefetchQuery("fetchInvitations", {type: "edit"}),
    prefetchQuery("fetchInvitations", {type: "transfer"})
  ]);
  return {};
}