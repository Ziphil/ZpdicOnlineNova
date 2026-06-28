//

import {faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {useCallback} from "react";
import {useTrans} from "zographia";
import {useCommonAlert} from "/client/component/atom/common-alert";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {ApiCredential} from "/server/internal/skeleton";


export function useDiscardApiCredential(credential: ApiCredential): () => void {
  const {trans} = useTrans("apiCredentialList");
  const request = useRequest();
  const openAlert = useCommonAlert();
  const {dispatchSuccessToast} = useToast();
  const doRequest = useCallback(async function (): Promise<void> {
    const id = credential.id;
    const response = await request("discardMyApiCredential", {id});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchMyApiCredentials");
      dispatchSuccessToast("discardMyApiCredential");
    });
  }, [credential.id, request, dispatchSuccessToast]);
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
