//

import {ReactElement, useMemo} from "react";
import {AsyncSelectOption, MultiLineText, SingleLineText} from "zographia";
import {create} from "/client/component/create";
import {Dictionary, Word} from "/server/internal/skeleton";
import {RelationWord} from "./relation-word-select";


export const RelationWordSelectOption = create(
  require("./relation-word-select-option.scss"), "RelationWordSelectOption",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: Dictionary,
    word: RelationWord | Word,
    className?: string
  }): ReactElement {

    const equivalentString = useMemo(() => getEquivalentString(word), [word]);

    return (
      <AsyncSelectOption styleName="root" {...rest}>
        <SingleLineText styleName="name">
          {word.name}
        </SingleLineText>
        {(!!equivalentString) && (
          <MultiLineText styleName="equivalent">
            {equivalentString}
          </MultiLineText>
        )}
      </AsyncSelectOption>
    );

  }
);


function getEquivalentString(word: RelationWord | Word): string | null {
  if ("sections" in word) {
    return word.sections.flatMap((section) => section.equivalents.map((equivalent) => equivalent.names)).join(", ");
  } else {
    return null;
  }
}