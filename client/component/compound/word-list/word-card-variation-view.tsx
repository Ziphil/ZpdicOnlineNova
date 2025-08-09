//

import {Fragment, ReactElement, useMemo} from "react";
import {AdditionalProps} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Variation} from "/server/internal/skeleton";


export const WordCardVariationView = create(
  require("./word-card-variation-view.scss"), "WordCardVariationView",
  function ({
    dictionary,
    variation,
    index,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    variation: Variation,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const pronunciation = useMemo(() => getPronunciation(dictionary, variation), [dictionary, variation]);

    return (
      <Fragment>
        {(index > 0) && <span styleName="punctuation">, </span>}
        <span>
          <span>{variation.spelling}</span>
          {(!!pronunciation) && (
            <span styleName="pronunciation">{pronunciation}</span>
          )}
        </span>
      </Fragment>
    );

  },
  {memo: true}
);


function getPronunciation(dictionary: DictionaryWithExecutors, variation: Variation): string | undefined {
  if (!!variation.pronunciation) {
    if (variation.pronunciation.match(/^(\/.+\/|\[.+\])$/)) {
      return variation.pronunciation.trim();
    } else {
      return "/" + variation.pronunciation.trim() + "/";
    }
  } else {
    if (dictionary.akrantiain !== null) {
      try {
        const pronunciation = dictionary.akrantiain.convert(variation.spelling);
        return "/" + pronunciation.trim() + "/";
      } catch (error) {
        console.error(error);
        return undefined;
      }
    } else {
      return undefined;
    }
  }
}