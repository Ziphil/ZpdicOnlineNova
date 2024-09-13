//

import {useMemo} from "react";
import {useResponse} from "/client/hook/request";
import {Dictionary, Example} from "/client/skeleton";


/** 与えられた例文オブジェクトに紐づけられている単語の綴りを全て取得して、それらの綴りを格納した例文オブジェクトを返します。 */
export function useFilledExample(dictionary: Dictionary, example: Example): Example {
  const number = dictionary.number;
  const wordNumbers = example.words.map((word) => word.number);
  const [wordNameSpec] = useResponse("fetchWordNames", {number, wordNumbers}, {ignoreError: true});
  const filledExample = useMemo(() => {
    const words = example.words.map((word) => ({
      ...word,
      name: (wordNameSpec === undefined) ? undefined : wordNameSpec.names[word.number] ?? null
    }));
    return {...example, words};
  }, [example, wordNameSpec]);
  return filledExample;
}