//

import {useMemo} from "react";
import {useResponse} from "/client-new/hook/request";
import {Dictionary, Example} from "/client-new/skeleton";


/** 与えられた例文オブジェクトに紐づけられている単語の綴りを全て取得して、それらの綴りを格納した例文オブジェクトを返します。 */
export function useFilledExample(dictionary: Dictionary, example: Example): Example {
  const number = dictionary.number;
  const wordNumbers = example.words.map((word) => word.number);
  const [wordNameSpec] = useResponse("fetchWordNames", {number, wordNumbers}, {ignoreError: true});
  const filledExample = useMemo(() => {
    const words = example.words.map((word) => ({...word, name: wordNameSpec?.names[word.number] ?? undefined}));
    return {...example, words};
  }, [example, wordNameSpec?.names]);
  return filledExample;
}