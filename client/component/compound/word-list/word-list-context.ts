//

import {createContext, useContext} from "react";
import {DictionaryWithExecutors} from "/server/internal/skeleton";


export const WordListDictionaryContext = createContext<DictionaryWithExecutors | null>(null);

export function useWordListDictionary(): DictionaryWithExecutors {
  const dictionary = useContext(WordListDictionaryContext);
  if (dictionary !== null) {
    return dictionary;
  } else {
    throw new Error("WordListDictionaryContext is not provided");
  }
}
