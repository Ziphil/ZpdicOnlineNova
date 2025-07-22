//

import {faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {useCallback} from "react";
import {useTrans} from "zographia";
import {useCommonAlert} from "/client/component/atom/common-alert";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {Dictionary, Example} from "/server/internal/skeleton";


export function useDiscardExample(dictionary: Dictionary, example: Example): () => void {
  const {trans} = useTrans("exampleList");
  const request = useRequest();
  const openAlert = useCommonAlert();
  const {dispatchSuccessToast} = useToast();
  const doRequest = useCallback(async function (): Promise<void> {
    const number = dictionary.number;
    const exampleNumber = example.number;
    const response = await request("discardExample", {number, exampleNumber});
    await switchResponse(response, async () => {
      await Promise.all([
        invalidateResponses("searchExamples", (query) => query.number === dictionary.number),
        invalidateResponses("fetchDictionarySizes", (query) => query.number === dictionary.number)
      ]);
      dispatchSuccessToast("discardExample");
    });
  }, [dictionary.number, example.number, request, dispatchSuccessToast]);
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