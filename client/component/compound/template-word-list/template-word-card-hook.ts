//

import {faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {useCallback} from "react";
import {useTrans} from "zographia";
import {useCommonAlert} from "/client/component/atom/common-alert";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary, TemplateWord} from "/client/skeleton";
import {switchResponse} from "/client/util/response";


export function useDiscardTemplateWord(dictionary: Dictionary, word: TemplateWord): () => void {
  const {trans} = useTrans("templateWordList");
  const request = useRequest();
  const openAlert = useCommonAlert();
  const {dispatchSuccessToast} = useToast();
  const doRequest = useCallback(async function (): Promise<void> {
    const number = dictionary.number;
    const id = word.id;
    const response = await request("discardDictionaryTemplateWord", {number, id});
    await switchResponse(response, async () => {
      await Promise.all([
        invalidateResponses("fetchDictionary", (query) => +query.identifier === dictionary.number || query.identifier === dictionary.paramName)
      ]);
      dispatchSuccessToast("discardDictionaryTemplateWord");
    });
  }, [dictionary.number, dictionary.paramName, word.id, request, dispatchSuccessToast]);
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