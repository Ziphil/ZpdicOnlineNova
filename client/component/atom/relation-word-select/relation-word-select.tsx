//

import {faTriangleExclamation} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {AsyncSelect, GeneralIcon, LoadingIcon} from "zographia";
import {create} from "/client/component/create";
import {Dictionary, NormalWordParameter, Word} from "/client/skeleton";
import {request} from "/client/util/request";
import {switchResponse} from "/client/util/response";
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
    word: RelationWord | null,
    onSet: (word: Word) => unknown,
    className?: string
  }): ReactElement {

    const loadOptions = useCallback(async function (pattern: string): Promise<Array<Word>> {
      const number = dictionary.number;
      const parameter = {...NormalWordParameter.EMPTY, text: pattern, mode: "both", type: "part"} as NormalWordParameter;
      const response = await request("searchWords", {number, parameter, offset: 0, size: 20}, {ignoreError: true});
      return switchResponse(response, ({words: [hitWords]}) => {
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
        renderLabel={(word) => (word.name === undefined) ? <LoadingIcon/> : (word.name === null) ? <GeneralIcon icon={faTriangleExclamation}/> : word.name}
        {...rest}
      >
        {(word) => <RelationWordSelectOption key={word.number} dictionary={dictionary} word={word}/>}
      </AsyncSelect>
    );

  }
);


export type RelationWord = {
  number: number,
  name?: string | null
};