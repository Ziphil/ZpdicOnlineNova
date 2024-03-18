//

import {useMemo} from "react";
import {useParams} from "react-router-dom";
import {useSuspenseResponse} from "/client/hook/request";
import {EnhancedDictionary} from "/client/skeleton";


export function useDictionary(): EnhancedDictionary {
  const {identifier} = useParams();
  const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
  const [dictionary] = useSuspenseResponse("fetchDictionary", {number, paramName});
  const akrantiain = useMemo(() => EnhancedDictionary.getAkrantiain(dictionary), [dictionary]);
  const zatlin = useMemo(() => EnhancedDictionary.getZatlin(dictionary), [dictionary]);
  const enhancedDictionary = useMemo(() => ({...dictionary, akrantiain, zatlin}), [dictionary, akrantiain, zatlin]);
  return enhancedDictionary;
}