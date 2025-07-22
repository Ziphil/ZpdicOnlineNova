//

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag, aria} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Variation, Word, WordWithExamples} from "/server/internal/skeleton";
import {WordCardVariationView} from "./word-card-variation-view";


export const WordCardVariationList = create(
  require("./word-card-variation-list.scss"), "WordCardVariationList",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const groupedVariations = useMemo(() => getGroupedVariations(word), [word]);

    return (groupedVariations.length > 0) ? (
      <div styleName="root" {...rest}>
        {groupedVariations.map(([, [title, variations]], index) => (
          <div styleName="item" key={index}>
            <span styleName="icon" {...aria({hidden: true})}>
              <FontAwesomeIcon icon={faAngleRight}/>
            </span>
            <MultiLineText styleName="text" is="span">
              {(!!title) && (
                <Tag styleName="tag" variant="light">{title}</Tag>
              )}
              {variations.map((variation, index) => (
                <WordCardVariationView key={index} dictionary={dictionary} variation={variation} index={index}/>
              ))}
            </MultiLineText>
          </div>
        ))}
      </div>
    ) : null;

  },
  {memo: true}
);


function getGroupedVariations(word: Word | WordWithExamples): Array<[string, [string, Array<Variation>]]> {
  const groupedVariations = new Map<string, [string, Array<Variation>]>();
  for (const variation of word.variations) {
    const title = variation.title;
    if (groupedVariations.get(title) === undefined) {
      groupedVariations.set(title, [title, []]);
    }
    groupedVariations.get(title)![1].push(variation);
  }
  return Array.from(groupedVariations);
}