//

import {LoaderFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client/hook/request";
import {EnhancedDictionary} from "/client/skeleton";
import {Word} from "/client/skeleton";
import {ResponseError} from "/client/util/error";


export type EditWordPageLoaderData = {
  dictionary: EnhancedDictionary,
  word: Word | null
};

export async function loadEditWordPage({params}: LoaderFunctionArgs): Promise<EditWordPageLoaderData> {
  const {identifier, wordNumber} = params;;
  const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
  try {
    const dictionary = await fetchResponse("fetchDictionary", {number, paramName});
    const enhancedDictionary = EnhancedDictionary.enhance(dictionary);
    if (wordNumber !== undefined) {
      const word = await fetchResponse("fetchWord", {number: dictionary.number, wordNumber: +wordNumber});
      return {dictionary: enhancedDictionary, word};
    } else {
      return {dictionary: enhancedDictionary, word: null};
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