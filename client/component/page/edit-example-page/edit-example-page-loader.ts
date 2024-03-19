//

import {LoaderFunctionArgs} from "react-router-dom";
import rison from "rison";
import {EditExampleInitialData} from "/client/component/compound/edit-example-form";
import {fetchResponse} from "/client/hook/request";
import {DetailedDictionary} from "/client/skeleton";
import {ResponseError} from "/client/util/error";


export type EditExamplePageLoaderData = {
  dictionary: DetailedDictionary,
  initialData: EditExampleInitialData | null
};

export async function loadEditWordPage({params, request}: LoaderFunctionArgs): Promise<EditExamplePageLoaderData> {
  const {identifier, exampleNumber} = params;;
  const encodedValue = new URL(request.url).searchParams.get("value");
  const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
  try {
    const dictionary = await fetchResponse("fetchDictionary", {number, paramName});
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