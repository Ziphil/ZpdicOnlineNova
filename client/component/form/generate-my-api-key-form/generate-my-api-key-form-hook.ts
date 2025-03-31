//

import {BaseSyntheticEvent, useCallback, useState} from "react";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";


export type GenerateMyApiKeySpec = {
  apiKey: string | null,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useGenerateMyApiKey(): GenerateMyApiKeySpec {
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const handleSubmit = useCallback(async () => {
    const response = await request("generateMyApiKey", {});
    await switchResponse(response, async (body) => {
      setApiKey(body.apiKey);
      dispatchSuccessToast("generateMyApiKey");
    });
  }, [request, dispatchSuccessToast]);
  return {apiKey, handleSubmit};
}