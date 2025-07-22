//

import {useMemo} from "react";
import {useParams} from "react-router-dom";
import {useSuspenseResponse} from "/client/hook/request";
import {Dictionary, DictionaryWithExecutors} from "/server/internal/skeleton";


export function useDictionary(): DictionaryWithExecutors {
  const {identifier} = useParams();
  const [dictionary] = useSuspenseResponse("fetchDictionary", {identifier: identifier ?? ""});
  const akrantiain = useMemo(() => Dictionary.getAkrantiain(dictionary), [dictionary]);
  const zatlin = useMemo(() => Dictionary.getZatlin(dictionary), [dictionary]);
  const enhancedDictionary = useMemo(() => ({...dictionary, akrantiain, zatlin}), [dictionary, akrantiain, zatlin]);
  return enhancedDictionary;
}