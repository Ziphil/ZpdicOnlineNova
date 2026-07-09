//

import {ReactElement, ReactNode, createContext, useContext} from "react";
import {DictionaryWithExecutors} from "/server/internal/skeleton";


const wordListDictionaryContext = createContext<DictionaryWithExecutors | null>(null);
const WordListDictionaryContextProvider = wordListDictionaryContext["Provider"];

export const WordListDictionaryContext = function ({
  dictionary,
  children
}: {
  dictionary: DictionaryWithExecutors,
  children: ReactNode
}): ReactElement {
  return (
    <WordListDictionaryContextProvider value={dictionary}>
      {children}
    </WordListDictionaryContextProvider>
  );
};

export function useWordListDictionary(): DictionaryWithExecutors {
  const dictionary = useContext(wordListDictionaryContext);
  if (dictionary !== null) {
    return dictionary;
  } else {
    throw new Error("WordListDictionaryContext is not provided");
  }
}
