//

import {useCallback} from "react";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";


export function useIssueMyActivateToken(): () => Promise<void> {
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const execute = useCallback(async function (): Promise<void> {
    const response = await request("issueMyActivateToken", {}, {useRecaptcha: true});
    await switchResponse(response, async () => {
      dispatchSuccessToast("issueMyActivateToken");
    });
  }, [request, dispatchSuccessToast]);
  return execute;
}