//

import downloadFile from "js-file-download";
import {BaseSyntheticEvent, useCallback, useState} from "react";
import {usePolling} from "/client/hook/polling";
import {useRequest} from "/client/hook/request";
import {switchResponse} from "/client/util/response";


export type DownloadDictionarySpec = {
  status: "processing" | "success" | "error",
  handleSubmit: (event: BaseSyntheticEvent, onSubmit?: () => unknown) => Promise<void>
};

export function useDownloadDictionary(id: string): DownloadDictionarySpec {
  const request = useRequest();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const poll = useCallback(async () => {
    const response = await request("fetchDownloadDictionaryProgress", {id}, {timeout: 2000});
    return await switchResponse(response, async ({status}) => {
      setStatus(status);
      return status !== "processing";
    }, async (error) => {
      setStatus("error");
      return true;
    });
  }, [id, request]);
  usePolling(poll, 5000);
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent, onSubmit?: () => unknown): Promise<void> {
    const response = await request("downloadDictionaryFile", {id}, {responseType: "blob"});
    await switchResponse(response, async (data) => {
      const disposition = response.headers["content-disposition"];
      const fileName = getFileName(disposition);
      await onSubmit?.();
      downloadFile(data, fileName);
    });
  }, [id, request]);
  return {status, handleSubmit};
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