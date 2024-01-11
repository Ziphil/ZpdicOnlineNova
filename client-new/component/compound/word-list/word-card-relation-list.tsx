//

import {Fragment, ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag} from "zographia";
import {DetailedWord, Relation, Word} from "/client/skeleton/dictionary";
import {Link} from "/client-new/component/atom/link";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";


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
          <MultiLineText styleName="text" key={index} is="div">
            {titles.map((title, index) => (!!title) && (
              <Tag key={index} styleName="tag" variant="light">{title}</Tag>
            ))}
            {relations.map((relation, index) => (
              <Fragment key={index}>
                {(index > 0) && ", "}
                <Link href={`/dictionary/${dictionary.number}?text=${encodeURIComponent(relation.name)}&mode=name&type=exact&page=0`} scheme="secondary">
                  {relation.name}
                </Link>
              </Fragment>
            ))}
          </MultiLineText>
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