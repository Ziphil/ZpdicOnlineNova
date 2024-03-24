//

import {useMemo} from "react";
import {useParams} from "react-router-dom";
import {useSuspenseResponse} from "/client/hook/request";
import {EnhancedDictionary} from "/client/skeleton";


export function useDictionary(): EnhancedDictionary {
  const {identifier} = useParams();
  const [dictionary] = useSuspenseResponse("fetchDictionary", {identifier: identifier ?? ""});
  const akrantiain = useMemo(() => EnhancedDictionary.getAkrantiain(dictionary), [dictionary]);
  const zatlin = useMemo(() => EnhancedDictionary.getZatlin(dictionary), [dictionary]);
  const enhancedDictionary = useMemo(() => ({...dictionary, akrantiain, zatlin}), [dictionary, akrantiain, zatlin]);
  return enhancedDictionary;
}