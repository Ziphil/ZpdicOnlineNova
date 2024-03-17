//

import {LoaderFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client/hook/request";
import {ResponseError} from "/client/util/error";


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
  if (ResponseError.isResponseError(error)) {
    if (error.type === "noSuchDictionary") {
      return new Response(JSON.stringify(error), {status: 404});
    } else {
      return error;
    }
  } else {
    return error;
  }
}