//

import {LoaderFunctionArgs, ShouldRevalidateFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client/hook/request";
import {ResponseError} from "/client/util/error";


export async function loadDictionaryPage({params}: LoaderFunctionArgs): Promise<null> {
  const {identifier} = params;;
  const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
  try {
    const dictionary = await fetchResponse("fetchDictionary", {number, paramName});
    return null;
  } catch (error) {
    throw convertError(error);
  }
}

export function shouldRevalidateDictionaryPage({currentUrl, nextUrl}: ShouldRevalidateFunctionArgs): boolean {
  return currentUrl.pathname !== nextUrl.pathname;
}

function convertError(error: unknown): unknown {
  if (ResponseError.isResponseError(error)) {
    if (error.type === "noSuchDictionaryNumber" || error.type === "noSuchDictionaryParamName") {
      return new Response(JSON.stringify(error), {status: 404});
    } else {
      return error;
    }
  } else {
    return error;
  }
}