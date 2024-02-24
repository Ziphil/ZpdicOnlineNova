//

import {LoaderFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client-new/hook/request";
import {QueryError} from "/client-new/util/error";


export async function loadDictionarySettingPart({params}: LoaderFunctionArgs): Promise<null> {
  const {identifier} = params;;
  const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
  try {
    const dictionary = await fetchResponse("fetchDictionary", {number, paramName});
    const canOwn = await fetchResponse("fetchDictionaryAuthorization", {number: dictionary.number, authority: "own"});
    if (canOwn) {
      return null;
    } else {
      throw new Response(null, {status: 403});
    }
  } catch (error) {
    throw convertError(error);
  }
}

function convertError(error: unknown): unknown {
  if (QueryError.isQueryError(error)) {
    if (error.type === "noSuchDictionaryNumber" || error.type === "noSuchDictionaryParamName") {
      return new Response(JSON.stringify(error), {status: 404});
    } else {
      return error;
    }
  } else {
    return error;
  }
}