//

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandPointRight} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag, aria} from "zographia";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";
import {DetailedWord, EnhancedDictionary, Relation, Word} from "/client/skeleton";


export const WordCardRelationList = create(
  require("./word-card-relation-list.scss"), "WordCardRelationList",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const groupedRelations = useMemo(() => getGroupedRelations(word), [word]);

    return (groupedRelations.length > 0) ? (
      <div styleName="root" {...rest}>
        {groupedRelations.map(([, [titles, relations]], index) => (
          <div styleName="item" key={index}>
            <span styleName="icon" {...aria({hidden: true})}>
              <FontAwesomeIcon icon={faHandPointRight}/>
            </span>
            <MultiLineText styleName="text" is="span">
              {titles.map((title, index) => (!!title) && (
                <Tag key={index} styleName="tag" variant="light">{title}</Tag>
              ))}
              {relations.map((relation, index) => (
                <Fragment key={index}>
                  {(index > 0) && <span styleName="punctuation">, </span>}
                  <Link href={`/dictionary/${dictionary.number}?text=${encodeURIComponent(relation.name)}&mode=name&type=exact&page=0`} scheme="secondary" variant="underline">
                    {relation.name}
                  </Link>
                </Fragment>
              ))}
            </MultiLineText>
          </div>
        ))}
      </div>
    ) : null;

  }
);


function getGroupedRelations(word: Word | DetailedWord): Array<[string, [Array<string>, Array<Relation>]]> {
  const groupedRelations = new Map<string, [Array<string>, Array<Relation>]>();
  for (const relation of word.relations) {
    const titles = relation.titles;
    const titleString = titles.join("\n");
    if (groupedRelations.get(titleString) === undefined) {
      groupedRelations.set(titleString, [titles, []]);
    }
    groupedRelations.get(titleString)![1].push(relation);
  }
  return Array.from(groupedRelations);
}