//

import {LoaderFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client/hook/request";
import {ResponseError} from "/client/util/error";


export async function loadDictionarySettingPart({params}: LoaderFunctionArgs): Promise<null> {
  const {identifier} = params;;
  if (identifier !== undefined) {
    try {
      const [dictionary, canOwn] = await Promise.all([
        fetchResponse("fetchDictionary", {identifier}),
        fetchResponse("fetchDictionaryAuthorization", {identifier, authority: "own"})
      ]);
      if (canOwn) {
        return null;
      } else {
        throw new Response(null, {status: 403});
      }
    } catch (error) {
      throw convertError(error);
    }
  } else {
    throw new Response(null, {status: 404});
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