//

import {BaseSyntheticEvent, useCallback, useState} from "react";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";


export type GenerateMyApiCredentialSpec = {
  apiKey: string | null,
  handleSubmit: (event: BaseSyntheticEvent) => void
};

export function useGenerateMyApiCredential(): GenerateMyApiCredentialSpec {
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const handleSubmit = useCallback(async () => {
    const response = await request("generateMyApiCredential", {});
    await switchResponse(response, async (body) => {
      setApiKey(body.key ?? null);
      dispatchSuccessToast("generateMyApiCredential");
    });
  }, [request, dispatchSuccessToast]);
  return {apiKey, handleSubmit};
}