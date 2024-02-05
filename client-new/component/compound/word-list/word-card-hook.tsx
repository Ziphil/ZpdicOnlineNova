//

import {useCallback} from "react";
import {useHref} from "react-router-dom";
import {invalidateResponses, useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {Dictionary, Word} from "/client-new/skeleton";
import {switchResponse} from "/client-new/util/response";


export function useStartEditWord(dictionary: Dictionary, word: Word): () => void {
  const editWordPageUrl = useHref(`/dictionary/${dictionary.number}/word/${word.number}`);
  const execute = useCallback(function (): void {
    window.open(editWordPageUrl);
  }, [editWordPageUrl]);
  return execute;
}

export function useDiscardWord(dictionary: Dictionary, word: Word): () => Promise<void> {
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const execute = useCallback(async function (): Promise<void> {
    const number = dictionary.number;
    const wordNumber = word.number;
    if (wordNumber !== undefined) {
      const response = await request("discardWord", {number, wordNumber});
      await switchResponse(response, async () => {
        dispatchSuccessToast("discardWord");
        await invalidateResponses("searchWord", (query) => query.number === dictionary.number);
      });
    }
  }, [dictionary.number, word.number, request, dispatchSuccessToast]);
  return execute;
}