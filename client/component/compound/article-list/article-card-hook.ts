//

import {faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {useCallback} from "react";
import {useTrans} from "zographia";
import {useCommonAlert} from "/client/component/atom/common-alert";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Article, Dictionary} from "/client/skeleton";
import {switchResponse} from "/client/util/response";


export function useDiscardArticle(dictionary: Dictionary, article: Article): () => void {
  const {trans} = useTrans("articleList");
  const request = useRequest();
  const openAlert = useCommonAlert();
  const {dispatchSuccessToast} = useToast();
  const doRequest = useCallback(async function (): Promise<void> {
    const number = dictionary.number;
    const articleNumber = article.number;
    const response = await request("discardArticle", {number, articleNumber});
    await switchResponse(response, async () => {
      await invalidateResponses("searchArticles", (query) => query.number === dictionary.number);
      dispatchSuccessToast("discardArticle");
    });
  }, [dictionary.number, article.number, request, dispatchSuccessToast]);
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