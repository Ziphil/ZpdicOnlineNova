//

import {ReactElement, useMemo} from "react";
import {AsyncSelectOption, MultiLineText, SingleLineText} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary, Word} from "/client-new/skeleton";
import {RelationWord} from "./relation-word-select";


export const RelationWordSelectOption = create(
  require("./relation-word-select-option.scss"), "RelationWordSelectOption",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: Dictionary,
    word: Word,
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
  if ("equivalents" in word) {
    return word.equivalents.map((equivalent) => equivalent.names.join(", ")).join(", ");
  } else {
    return null;
  }
}