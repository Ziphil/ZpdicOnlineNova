//

import {useCallback, useState} from "react";
import {usePolling} from "/client/hook/polling";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {switchResponse} from "/client/util/response";


export type UploadDictionaryFormSpec = {
  status: "processing" | "success" | "error"
};

export function useUploadDictionaryForm(id: string, identifier: string): UploadDictionaryFormSpec {
  const request = useRequest();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const poll = useCallback(async () => {
    const response = await request("fetchUploadDictionaryProgress", {id}, {timeout: 2000});
    return await switchResponse(response, async ({status}) => {
      setStatus(status);
      if (status === "success") {
        await invalidateResponses("fetchDictionary", (query) => query.identifier === identifier || +query.identifier === +identifier);
      }
      return status !== "processing";
    }, async (error) => {
      setStatus("error");
      return true;
    });
  }, [id, identifier, request]);
  usePolling(poll, 5000);
  return {status};
}
