//

import {Fragment, ReactElement, useMemo} from "react";
import {AdditionalProps, data} from "zographia";
import {create} from "/client/component/create";
import {Dictionary, DictionaryWithExecutors, Variation} from "/server/internal/skeleton";


export const WordCardVariationView = create(
  require("./word-card-variation-view.scss"), "WordCardVariationView",
  function ({
    dictionary,
    variation,
    index,
    ...rest
  }: {
    dictionary: Dictionary | DictionaryWithExecutors,
    variation: Variation,
    index: number,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const pronunciation = useMemo(() => (dictionary.settings.showVariationPronunciation) ? getPronunciation(dictionary, variation) : undefined, [dictionary, variation]);

    return (
      <Fragment>
        {(index > 0) && <span styleName="punctuation">, </span>}
        <span>
          <span>
            <span className="dictionary-custom-font" {...data({target: "variation"})}>{variation.spelling}</span>
          </span>
          {(dictionary.settings.showVariationPronunciation && !!pronunciation) && (
            <span styleName="pronunciation">{pronunciation}</span>
          )}
        </span>
      </Fragment>
    );

  },
  {memo: true}
);


function getPronunciation(dictionary: Dictionary | DictionaryWithExecutors, variation: Variation): string | undefined {
  const akrantiain = ("akrantiain" in dictionary) ? dictionary.akrantiain : null;
  if (!!variation.pronunciation) {
    if (variation.pronunciation.match(/^(\/.+\/|\[.+\])$/)) {
      return variation.pronunciation.trim();
    } else {
      return "/" + variation.pronunciation.trim() + "/";
    }
  } else {
    if (akrantiain !== null) {
      try {
        const pronunciation = akrantiain.convert(variation.spelling);
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