//

import {BaseSyntheticEvent, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useRequest} from "/client/hook/request";
import {getDictionaryIdentifier} from "/client/util/dictionary";
import {switchResponse} from "/client/util/response";
import {Dictionary} from "/server/internal/skeleton";


export type QueueDownloadDictionarySpec = {
  handleSubmit: (event: BaseSyntheticEvent) => Promise<void>
};

export function useQueueDownloadDictionary(dictionary: Dictionary): QueueDownloadDictionarySpec {
  const request = useRequest();
  const navigate = useNavigate();
  const handleSubmit = useCallback(async function (event: BaseSyntheticEvent): Promise<void> {
    const response = await request("queueDownloadDictionary", {number: dictionary.number, format: "slime"});
    await switchResponse(response, async ({id}) => {
      navigate(`/dictionary/${getDictionaryIdentifier(dictionary)}/download/${id}`);
    });
  }, [dictionary, request, navigate]);
  return {handleSubmit};
}