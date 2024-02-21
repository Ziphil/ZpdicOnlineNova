/* eslint-disable no-useless-computed-key */

import {ReactElement, useCallback} from "react";
import {AsyncSelect} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary, NormalWordParameter, Word} from "/client-new/skeleton";
import {request} from "/client-new/util/request";
import {switchResponse} from "/client-new/util/response";
import {RelationWordSelectOption} from "./relation-word-select-option";


export const RelationWordSelect = create(
  require("./relation-word-select.scss"), "RelationWordSelect",
  function ({
    dictionary,
    word,
    onSet,
    ...rest
  }: {
    dictionary: Dictionary,
    word: RelationWord | Word | null,
    onSet: (word: RelationWord | Word) => unknown,
    className?: string
  }): ReactElement {

    const loadOptions = useCallback(async function (pattern: string): Promise<Array<Word>> {
      const number = dictionary.number;
      const parameter = {...NormalWordParameter.EMPTY, text: pattern, mode: "name"};
      const response = await request("searchWord", {number, parameter, offset: 0, size: 20}, {ignoreError: true});
      return switchResponse(response, (data) => {
        const {words: [hitWords]} = data;
        return hitWords;
      }, (error) => {
        return [];
      });
    }, [dictionary.number]);

    return (
      <AsyncSelect
        styleName="root"
        value={word}
        onSet={onSet}
        loadOptions={loadOptions}
        renderLabel={(word) => word.name}
        {...rest}
      >
        {(word) => <RelationWordSelectOption key={word.number} dictionary={dictionary} word={word}/>}
      </AsyncSelect>
    );

  }
);


export type RelationWord = {
  number: number,
  name: string
};