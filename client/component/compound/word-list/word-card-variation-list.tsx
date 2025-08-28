//

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag, aria} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Section, Variation} from "/server/internal/skeleton";
import {WordCardVariationView} from "./word-card-variation-view";


export const WordCardVariationList = create(
  require("./word-card-variation-list.scss"), "WordCardVariationList",
  function ({
    dictionary,
    section,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    section: Section,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const groupedVariations = useMemo(() => getGroupedVariations(section), [section]);

    return (groupedVariations.length > 0) ? (
      <div styleName="root" {...rest}>
        {groupedVariations.map(([, [title, variations]], index) => (
          <div styleName="item" key={index}>
            <span styleName="icon" {...aria({hidden: true})}>
              <FontAwesomeIcon icon={faAngleRight}/>
            </span>
            <MultiLineText styleName="text" is="span">
              {(!!title) && (
                <Tag styleName="tag" variant="light" scheme="gray">{title}</Tag>
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


function getGroupedVariations(section: Section): Array<[string, [string, Array<Variation>]]> {
  const groupedVariations = new Map<string, [string, Array<Variation>]>();
  for (const variation of section.variations) {
    const title = variation.title;
    if (groupedVariations.get(title) === undefined) {
      groupedVariations.set(title, [title, []]);
    }
    groupedVariations.get(title)![1].push(variation);
  }
  return Array.from(groupedVariations);
}