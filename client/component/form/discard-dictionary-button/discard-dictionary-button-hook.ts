//

import {faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {useCallback} from "react";
import {useNavigate} from "react-router";
import {useTrans} from "zographia";
import {useCommonAlert} from "/client/component/atom/common-alert";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {DetailedDictionary} from "/client/skeleton";
import {switchResponse} from "/client/util/response";


export function useDiscardDictionary(dictionary: DetailedDictionary): () => void {
  const {trans} = useTrans("discardDictionaryButton");
  const request = useRequest();
  const openAlert = useCommonAlert();
  const {dispatchSuccessToast} = useToast();
  const navigate = useNavigate();
  const doRequest = useCallback(async function (): Promise<void> {
    const number = dictionary.number;
    const response = await request("discardDictionary", {number});
    await switchResponse(response, async () => {
      await Promise.all([
        invalidateResponses("fetchUserDictionaries", (query) => query.name === dictionary.user.name),
        invalidateResponses("searchDictionary")
      ]);
      navigate(`/user/${dictionary.user.name}`);
      dispatchSuccessToast("discardDictionary");
    });
  }, [dictionary.number, dictionary.user.name, request, navigate, dispatchSuccessToast]);
  const execute = useCallback(function (): void {
    openAlert({
      message: trans("dialog.message"),
      confirmLabel: trans("dialog.confirm"),
      confirmIcon: faTrashAlt,
      onConfirm: doRequest
    });
  }, [doRequest, openAlert, trans]);
  return execute;
}