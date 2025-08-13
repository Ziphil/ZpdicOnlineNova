//

import {useMemo} from "react";
import {useResponse} from "/client/hook/request";
import {Dictionary, Example} from "/server/internal/skeleton";


/** 与えられた例文オブジェクトに紐づけられている単語の綴りを全て取得して、それらの綴りを格納した例文オブジェクトを返します。 */
export function useFilledExample(dictionary: Dictionary, example: Example): Example {
  const number = dictionary.number;
  const wordNumbers = example.words.map((word) => word.number);
  const [spellingSpec] = useResponse("fetchWordSpellings", {number, wordNumbers}, {ignoreError: true});
  const spellings = spellingSpec?.spellings;
  const filledExample = useMemo(() => {
    const words = example.words.map((word) => ({
      ...word,
      spelling: (spellings === undefined) ? undefined : spellings[word.number] ?? null
    }));
    return {...example, words};
  }, [example, spellings]);
  return filledExample;
}