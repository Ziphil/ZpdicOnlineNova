//

import {useCallback, useState} from "react";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {ApiCredential} from "/server/internal/skeleton";


export type GenerateMyApiCredentialSpec = {
  credential: ApiCredential | null,
  handleSubmit: () => Promise<void>
};

export function useGenerateMyApiCredential(): GenerateMyApiCredentialSpec {
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const [credential, setCredential] = useState<ApiCredential | null>(null);
  const handleSubmit = useCallback(async function (): Promise<void> {
    const response = await request("generateMyApiCredential", {});
    await switchResponse(response, async (body) => {
      setCredential(body);
      await invalidateResponses("fetchMyApiCredentials");
      dispatchSuccessToast("generateMyApiCredential");
    });
  }, [request, dispatchSuccessToast]);
  return {credential, handleSubmit};
}
