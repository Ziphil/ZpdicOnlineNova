//

import {useCallback} from "react";
import {useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {switchResponse} from "/client-new/util/response";


export function useIssueMyActivateToken(): () => Promise<void> {
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const execute = useCallback(async function (): Promise<void> {
    const response = await request("issueUserActivateToken", {}, {useRecaptcha: true});
    await switchResponse(response, async (body) => {
      dispatchSuccessToast("issueMyActivateToken");
    });
  }, [request, dispatchSuccessToast]);
  return execute;
}