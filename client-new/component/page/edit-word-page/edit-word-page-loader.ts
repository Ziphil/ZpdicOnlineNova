//

import {LoaderFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client-new/hook/request";
import {EnhancedDictionary} from "/client-new/skeleton";
import {Word} from "/client-new/skeleton";


export type EditWordPageLoaderData = {
  dictionary: EnhancedDictionary,
  word: Word | null
};

export async function loadEditWordPage({params}: LoaderFunctionArgs): Promise<EditWordPageLoaderData> {
  const {identifier, wordNumber} = params;;
  const [number, paramName] = (identifier!.match(/^\d+$/)) ? [+identifier!, undefined] : [undefined, identifier!];
  const dictionary = await fetchResponse("fetchDictionary", {number, paramName});
  const enhancedDictionary = EnhancedDictionary.enhance(dictionary);
  if (wordNumber !== undefined) {
    const word = await fetchResponse("fetchWord", {number: dictionary.number, wordNumber: +wordNumber});
    return {dictionary: enhancedDictionary, word};
  } else {
    return {dictionary: enhancedDictionary, word: null};
  }
}