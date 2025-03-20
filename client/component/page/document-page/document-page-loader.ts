//

import {LoaderFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client/hook/request";
import {ResponseError} from "/client/util/response-error";


export async function loadDocumentPage({params}: LoaderFunctionArgs): Promise<null> {
  const path = params["*"] || "";
  const locale = localStorage.getItem("zp-locale") ?? "ja";
  try {
    const document = await fetchResponse("fetchDocument", {path, locale});
    return null;
  } catch (error) {
    throw convertError(error);
  }
}

function convertError(error: unknown): unknown {
  if (ResponseError.isResponseError(error)) {
    if (error.type === "noSuchDocument") {
      return new Response(JSON.stringify(error), {status: 404});
    } else {
      return error;
    }
  } else {
    return error;
  }
}