//

import {faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {useCallback} from "react";
import {useTrans} from "zographia";
import {useCommonAlert} from "/client/component/atom/common-alert";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {Dictionary, User} from "/server/internal/skeleton";


export function useDiscardDictionaryAuthorizedUser(dictionary: Dictionary, user: User): () => void {
  const {trans} = useTrans("dictionaryAuthorizedUserList");
  const request = useRequest();
  const openAlert = useCommonAlert();
  const {dispatchSuccessToast} = useToast();
  const doRequest = useCallback(async function (): Promise<void> {
    const number = dictionary.number;
    const id = user.id;
    const response = await request("discardDictionaryAuthorizedUser", {number, id});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchDictionaryAuthorizedUsers", (query) => query.number === dictionary.number);
      dispatchSuccessToast("discardDictionaryAuthorizedUser");
    });
  }, [dictionary.number, user.id, request, dispatchSuccessToast]);
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