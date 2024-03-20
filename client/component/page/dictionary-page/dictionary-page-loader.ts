//

import {LoaderFunctionArgs, ShouldRevalidateFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client/hook/request";
import {ResponseError} from "/client/util/error";


export async function loadDictionaryPage({params}: LoaderFunctionArgs): Promise<null> {
  const {identifier} = params;;
  if (identifier !== undefined) {
    try {
      const dictionary = await fetchResponse("fetchDictionary", {identifier});
      return null;
    } catch (error) {
      throw convertError(error);
    }
  } else {
    throw new Response(null, {status: 404});
  }
}

export function shouldRevalidateDictionaryPage({currentUrl, nextUrl}: ShouldRevalidateFunctionArgs): boolean {
  return currentUrl.pathname !== nextUrl.pathname;
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