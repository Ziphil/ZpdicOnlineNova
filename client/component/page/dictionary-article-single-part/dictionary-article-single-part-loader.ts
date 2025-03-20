//

import {LoaderFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client/hook/request";
import {ResponseError} from "/client/util/response-error";


export async function loadDictionaryArticleSinglePart({params}: LoaderFunctionArgs): Promise<null> {
  const {identifier, articleNumber} = params;;
  if (identifier !== undefined && articleNumber !== undefined) {
    try {
      const dictionary = await fetchResponse("fetchDictionary", {identifier});
      const article = await fetchResponse("fetchArticle", {number: dictionary.number, articleNumber: +articleNumber});
      return null;
    } catch (error) {
      throw convertError(error);
    }
  } else {
    throw new Response(null, {status: 404});
  }
}

function convertError(error: unknown): unknown {
  if (ResponseError.isResponseError(error)) {
    if (error.type === "noSuchDictionary" || error.type === "noSuchArticle") {
      return new Response(JSON.stringify(error), {status: 404});
    } else {
      return error;
    }
  } else {
    return error;
  }
}