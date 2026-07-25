/* eslint-disable react/jsx-closing-bracket-location */

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHandPointRight} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag, aria, data} from "zographia";
import {Link} from "/client/component/atom/link";
import {WordPopover} from "/client/component/compound/word-popover";
import {create} from "/client/component/create";
import {getWordHref} from "/client/util/dictionary";
import {Dictionary, DictionaryWithExecutors, Relation, Section, Word} from "/server/internal/skeleton";


export const WordCardRelationList = create(
  require("./word-card-relation-list.scss"), "WordCardRelationList",
  function ({
    dictionary,
    section,
    showPopover = true,
    ...rest
  }: {
    dictionary: Dictionary | DictionaryWithExecutors,
    section: Section,
    showPopover?: boolean,
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
                <Tag key={index} styleName="tag" variant="light" scheme="gray">{title}</Tag>
              ))}
              {relations.map((relation, index) => ("spelling" in relation) && (
                <Fragment key={index}>
                  {(index > 0) && <span styleName="punctuation">, </span>}
                  <WordPopoverIfPossible
                    dictionary={(showPopover && "akrantiain" in dictionary) ? dictionary : null}
                    word={relation}
                    trigger={(
                      <span>
                        <Link href={getWordHref(dictionary, relation.number)} scheme="secondary" variant="underline">
                          <span className="dictionary-custom-font" {...data({target: "relation"})}>{relation.spelling}</span>
                        </Link>
                      </span>
                    )}
                  />
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


const WordPopoverIfPossible = create(
  null, "WordPopoverIfPossible",
  function ({
    dictionary,
    word,
    trigger
  }: {
    dictionary: DictionaryWithExecutors | null,
    word: Word | {number: number} | null,
    trigger: ReactElement
  }): ReactElement {

    return (dictionary !== null && word !== null) ? (
      <WordPopover dictionary={dictionary} word={word} trigger={trigger}/>
    ) : (
      trigger
    );

  }
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