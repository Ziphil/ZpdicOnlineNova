//

import {LoaderFunctionArgs} from "react-router-dom";
import rison from "rison";
import {EditWordInitialData} from "/client/component/compound/edit-word-form";
import {fetchResponse} from "/client/hook/request";
import {EnhancedDictionary} from "/client/skeleton";
import {ResponseError} from "/client/util/error";


export type EditWordPageLoaderData = {
  dictionary: EnhancedDictionary,
  initialData: EditWordInitialData | null
};

export async function loadEditWordPage({params, request}: LoaderFunctionArgs): Promise<EditWordPageLoaderData> {
  const {identifier, wordNumber} = params;
  const encodedValue = new URL(request.url).searchParams.get("value");
  const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
  try {
    const dictionary = await fetchResponse("fetchDictionary", {number, paramName});
    const enhancedDictionary = EnhancedDictionary.enhance(dictionary);
    if (encodedValue !== null) {
      try {
        const value = rison.decode<any>(encodedValue);
        return {dictionary: enhancedDictionary, initialData: {type: "form", value}};
      } catch (error) {
        return {dictionary: enhancedDictionary, initialData: null};
      }
    } else {
      if (wordNumber !== undefined) {
        const word = await fetchResponse("fetchWord", {number: dictionary.number, wordNumber: +wordNumber});
        return {dictionary: enhancedDictionary, initialData: {type: "word", word}};
      } else {
        return {dictionary: enhancedDictionary, initialData: null};
      }
    }
  } catch (error) {
    throw convertError(error);
  }
}

function convertError(error: unknown): unknown {
  if (ResponseError.isResponseError(error)) {
    if (error.type === "noSuchDictionary" || error.type === "noSuchWord") {
      return new Response(JSON.stringify(error), {status: 404});
    } else {
      return error;
    }
  } else {
    return error;
  }
}