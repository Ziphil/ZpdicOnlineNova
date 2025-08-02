/* eslint-disable react/jsx-closing-bracket-location */

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandPointRight} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag, aria} from "zographia";
import {Link} from "/client/component/atom/link";
import {WordPopover} from "/client/component/compound/word-popover";
import {create} from "/client/component/create";
import {getWordHref} from "/client/util/dictionary";
import {DictionaryWithExecutors, Relation, Section} from "/server/internal/skeleton";


export const WordCardRelationList = create(
  require("./word-card-relation-list.scss"), "WordCardRelationList",
  function ({
    dictionary,
    section,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    section: Section,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const groupedRelations = useMemo(() => getGroupedRelations(section), [section]);

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
              {relations.map((relation, index) => ("name" in relation) && (
                <Fragment key={index}>
                  {(index > 0) && <span styleName="punctuation">, </span>}
                  <WordPopover dictionary={dictionary} word={relation} trigger={(
                    <span>
                      <Link href={getWordHref(dictionary, relation.number)} scheme="secondary" variant="underline">
                        {relation.name}
                      </Link>
                    </span>
                  )}/>
                </Fragment>
              ))}
            </MultiLineText>
          </div>
        ))}
      </div>
    ) : null;

  },
  {memo: true}
);


function getGroupedRelations(section: Section): Array<[string, [Array<string>, Array<Relation>]]> {
  const groupedRelations = new Map<string, [Array<string>, Array<Relation>]>();
  for (const relation of section.relations) {
    const titles = relation.titles;
    const titleString = titles.join("\n");
    if (groupedRelations.get(titleString) === undefined) {
      groupedRelations.set(titleString, [titles, []]);
    }
    groupedRelations.get(titleString)![1].push(relation);
  }
  return Array.from(groupedRelations);
}