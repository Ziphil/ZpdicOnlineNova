/* eslint-disable no-useless-computed-key */

import {ReactElement, useCallback} from "react";
import {AsyncSelect, AsyncSelectOption} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary, NormalWordParameter} from "/client-new/skeleton";
import {request} from "/client-new/util/request";


export const RelationWordSelect = create(
  require("./relation-word-select.scss"), "RelationWordSelect",
  function ({
    dictionary,
    word,
    onSet,
    ...rest
  }: {
    dictionary: Dictionary,
    word: RelationWord | null,
    onSet: (word: RelationWord) => unknown,
    className?: string
  }): ReactElement {

    const loadOptions = useCallback(async function (pattern: string): Promise<Array<RelationWord>> {
      const number = dictionary.number;
      const parameter = {...NormalWordParameter.EMPTY, text: pattern, mode: "name"};
      const response = await request("searchWord", {number, parameter, offset: 0, size: 20}, {ignoreError: true});
      if (response.status === 200 && !("error" in response.data)) {
        const {words: [hitWords]} = response.data;
        return hitWords;
      } else {
        return [];
      }
    }, [dictionary.number]);

    return (
      <AsyncSelect styleName="root" value={word} onSet={onSet} loadOptions={loadOptions} {...rest}>
        {(word) => (
          <AsyncSelectOption>
            {word.name}
          </AsyncSelectOption>
        )}
      </AsyncSelect>
    );

  }
);


export type RelationWord = {
  number: number,
  name: string
};