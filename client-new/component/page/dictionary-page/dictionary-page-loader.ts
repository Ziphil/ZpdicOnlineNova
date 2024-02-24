//

import {LoaderFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client-new/hook/request";
import {QueryError} from "/client-new/util/error";


export async function loadDictionaryPage({params}: LoaderFunctionArgs): Promise<null> {
  const {identifier} = params;;
  const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
  try {
    const dictionary = await fetchResponse("fetchDictionary", {number, paramName});
    return null;
  } catch (error) {
    if (QueryError.isQueryError(error)) {
      if (error.type === "noSuchDictionaryNumber" || error.type === "noSuchDictionaryParamName") {
        throw new Response(JSON.stringify(error), {status: 404});
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
}