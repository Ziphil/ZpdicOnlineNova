//

import {LoaderFunctionArgs} from "react-router-dom";
import rison from "rison";
import {EditExampleInitialData} from "/client/component/compound/edit-example-form";
import {fetchResponse} from "/client/hook/request";
import {ResponseError} from "/client/util/response-error";
import {DictionaryWithUser} from "/server/internal/skeleton";


export type EditExamplePageLoaderData = {
  dictionary: DictionaryWithUser,
  initialData: EditExampleInitialData | null
};

export async function loadEditWordPage({params, request}: LoaderFunctionArgs): Promise<EditExamplePageLoaderData> {
  const {identifier, exampleNumber} = params;;
  const encodedValue = new URL(request.url).searchParams.get("value");
  if (identifier !== undefined) {
    try {
      const dictionary = await fetchResponse("fetchDictionary", {identifier});
      if (encodedValue !== null) {
        try {
          const value = rison.decode<any>(encodedValue);
          return {dictionary, initialData: {type: "form", value}};
        } catch (error) {
          return {dictionary, initialData: null};
        }
      } else {
        if (exampleNumber !== undefined) {
          const example = await fetchResponse("fetchExample", {number: dictionary.number, exampleNumber: +exampleNumber});
          return {dictionary, initialData: {type: "example", example}};
        } else {
          return {dictionary, initialData: null};
        }
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
    if (error.type === "noSuchDictionary" || error.type === "noSuchExample") {
      return new Response(JSON.stringify(error), {status: 404});
    } else {
      return error;
    }
  } else {
    return error;
  }
}