//

import {useMemo} from "react";
import {useParams} from "react-router-dom";
import {useSuspenseResponse} from "/client/hook/request";
import {EnhancedDictionary} from "/client/skeleton";


export function useDictionary(): EnhancedDictionary {
  const {identifier} = useParams();
  const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
  const [dictionary] = useSuspenseResponse("fetchDictionary", {number, paramName}, {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false});
  const enhancedDictionary = useMemo(() => EnhancedDictionary.enhance(dictionary), [dictionary]);
  return enhancedDictionary;
}