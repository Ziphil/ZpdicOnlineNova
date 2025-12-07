//

import {LoaderFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client/hook/request";
import {ResponseError} from "/client/util/response-error";


export async function loadDictionaryProposalPart({params}: LoaderFunctionArgs): Promise<null> {
  const {identifier} = params;;
  if (identifier !== undefined) {
    try {
      const [dictionary, authorities] = await Promise.all([
        fetchResponse("fetchDictionary", {identifier}),
        fetchResponse("fecthMyDictionaryAuthorities", {identifier})
      ]);
      if (authorities.includes("edit")) {
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