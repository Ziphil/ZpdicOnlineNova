//

import {LoaderFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client/hook/request";
import {ResponseError} from "/client/util/error";


export async function loadUserPage({params}: LoaderFunctionArgs): Promise<null> {
  const {name} = params;;
  try {
    const user = await fetchResponse("fetchOtherUser", {name: name!});
    return null;
  } catch (error) {
    throw convertError(error);
  }
}

function convertError(error: unknown): unknown {
  if (ResponseError.isResponseError(error)) {
    if (error.type === "noSuchUser") {
      return new Response(JSON.stringify(error), {status: 404});
    } else {
      return error;
    }
  } else {
    return error;
  }
}