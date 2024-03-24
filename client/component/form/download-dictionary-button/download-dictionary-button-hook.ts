//

import downloadFile from "js-file-download";
import {BaseSyntheticEvent, MutableRefObject, useCallback, useRef, useState} from "react";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary} from "/client/skeleton";
import {switchResponse} from "/client/util/response";
import {listenSocket, requestSocket} from "/client/util/socket";


export type DownloadDictionarySpec = {
  status: DownloadDictionaryStatus,
  keyRef: MutableRefObject<string>,
  handleSubmit: (event: BaseSyntheticEvent, onSubmit?: () => unknown) => Promise<void>
};
export type DownloadDictionaryFileSpec = {
  handleSubmit: (event: BaseSyntheticEvent, onSubmit?: () => unknown) => Promise<void>
};
export type DownloadDictionaryStatus = "before" | "loading" | "success" | "error";

export function useDownloadDictionary(dictionary: Dictionary): DownloadDictionarySpec {
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const [status, setStatus] = useState<DownloadDictionaryStatus>("before");
  const keyRef = useRef("");
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent, onSubmit?: () => unknown): Promise<void> {
    setStatus("loading");
    await requestSocket("listenDownloadDictionary", {number: dictionary.number});
    listenSocket("succeedDownloadDictionary", () => setStatus("success"));
    listenSocket("failDownloadDictionary", () => setStatus("error"));
    const response = await request("downloadDictionary", {number: dictionary.number});
    await switchResponse(response, async ({key}) => {
      keyRef.current = key;
      await onSubmit?.();
    });
  }, [dictionary.number, request]);
  return {status, keyRef, handleSubmit};
}

export function useDownloadDictionaryFile(keyRef: MutableRefObject<string>): DownloadDictionaryFileSpec {
  const request = useRequest();
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent, onSubmit?: () => unknown): Promise<void> {
    const key = keyRef.current;
    const response = await request("downloadDictionaryFile", {key});
    await switchResponse(response, async (data) => {
      const disposition = response.headers["content-disposition"];
      const fileName = getFileName(disposition);
      await onSubmit?.();
      downloadFile(data, fileName);
    });
  }, [request, keyRef]);
  return {handleSubmit};
}

function getFileName(disposition: string): string {
  const match = disposition.match(/filename="(.+)"/);
  const encodedMatch = disposition.match(/filename\*=UTF-8''(.+)$/);
  if (encodedMatch !== null) {
    return decodeURIComponent(encodedMatch[1]).replace(/\+/g, " ");
  } else if (match !== null) {
    return match[1];
  } else {
    return "dictionary.json";
  }
}