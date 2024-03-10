//

import {LoaderFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client/hook/request";
import {EnhancedDictionary, Example} from "/client/skeleton";
import {ResponseError} from "/client/util/error";


export type EditExamplePageLoaderData = {
  dictionary: EnhancedDictionary,
  example: Example | null
};

export async function loadEditWordPage({params}: LoaderFunctionArgs): Promise<EditExamplePageLoaderData> {
  const {identifier, exampleNumber} = params;;
  const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
  try {
    const dictionary = await fetchResponse("fetchDictionary", {number, paramName});
    const enhancedDictionary = EnhancedDictionary.enhance(dictionary);
    if (exampleNumber !== undefined) {
      const example = await fetchResponse("fetchExample", {number: dictionary.number, exampleNumber: +exampleNumber});
      return {dictionary: enhancedDictionary, example};
    } else {
      return {dictionary: enhancedDictionary, example: null};
    }
  } catch (error) {
    throw convertError(error);
  }
}

function convertError(error: unknown): unknown {
  if (ResponseError.isResponseError(error)) {
    if (error.type === "noSuchDictionaryNumber" || error.type === "noSuchDictionaryParamName" || error.type === "noSuchExampleNumber") {
      return new Response(JSON.stringify(error), {status: 404});
    } else {
      return error;
    }
  } else {
    return error;
  }
}