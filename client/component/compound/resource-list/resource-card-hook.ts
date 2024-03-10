//

import {faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {useCallback} from "react";
import {useTrans} from "zographia";
import {useCommonAlert} from "/client/component/atom/common-alert";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary} from "/client/skeleton";
import {switchResponse} from "/client/util/response";


export function useDiscardResource(dictionary: Dictionary, resource: string): () => void {
  const {trans} = useTrans("resourceList");
  const request = useRequest();
  const openAlert = useCommonAlert();
  const {dispatchSuccessToast} = useToast();
  const doRequest = useCallback(async function (): Promise<void> {
    const number = dictionary.number;
    const response = await request("discardResource", {number, name: resource});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchResources", (query) => query.number === dictionary.number);
      dispatchSuccessToast("discardResource");
    });
  }, [dictionary.number, resource, request, dispatchSuccessToast]);
  const execute = useCallback(function (): void {
    openAlert({
      message: trans("dialog.discard.message"),
      confirmLabel: trans("dialog.discard.confirm"),
      confirmIcon: faTrashAlt,
      onConfirm: doRequest
    });
  }, [doRequest, openAlert, trans]);
  return execute;
}