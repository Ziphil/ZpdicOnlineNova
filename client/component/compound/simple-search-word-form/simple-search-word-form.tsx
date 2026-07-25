/* eslint-disable react/jsx-closing-bracket-location */

import {faSearch} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller} from "react-hook-form";
import {AdditionalProps, GeneralIcon, Input, InputAddon} from "zographia";
import {WordModeSelect} from "/client/component/atom/word-mode-select";
import {WordTypeSelect} from "/client/component/atom/word-type-select";
import {create} from "/client/component/create";
import {useSearchForm} from "/client/hook/search-form";
import {preventDefault} from "/client/util/form";
import {NormalWordParameter, WordMode, WordParameter, WordType} from "/server/internal/skeleton";


export const SimpleSearchWordForm = create(
  require("./simple-search-word-form.scss"), "SimpleSearchWordForm",
  function ({
    parameter,
    onParameterCommit,
    ...rest
  }: {
    parameter: WordParameter,
    onParameterCommit: (parameter: WordParameter) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {form} = useSearchForm({parameter, debouncedNames: ["text"], toFormValue, fromFormValue, onCommit: onParameterCommit});
    const {register, control} = form;

    return (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <Input styleName="input" type="search" {...register("text")}>
          <InputAddon position="left">
            <GeneralIcon styleName="icon" icon={faSearch}/>
          </InputAddon>
        </Input>
        <div styleName="select-group">
          <Controller name="mode" control={control} render={({field}) => (
            <WordModeSelect optionModes={FORM_WORD_MODES} kind="flexible" mode={field.value} onSet={field.onChange}/>
          )}/>
          <Controller name="type" control={control} render={({field}) => (
            <WordTypeSelect optionTypes={FORM_WORD_TYPES} kind="flexible" type={field.value} onSet={field.onChange}/>
          )}/>
        </div>
      </form>
    );

  }
);


const FORM_WORD_MODES = ["both", "spelling", "term"] as const;
const FORM_WORD_TYPES = ["prefix", "exact"] as const;

function toFormValue(parameter: WordParameter): SimpleSearchWordFormValue {
  const normalParameter = WordParameter.toNormal(parameter);
  const mode = ((FORM_WORD_MODES as ReadonlyArray<WordMode>).includes(normalParameter.mode)) ? normalParameter.mode : "both";
  const type = ((FORM_WORD_TYPES as ReadonlyArray<WordType>).includes(normalParameter.type)) ? normalParameter.type : "prefix";
  const value = {
    text: normalParameter.text,
    mode,
    type
  } satisfies SimpleSearchWordFormValue;
  return value;
}

function fromFormValue(value: SimpleSearchWordFormValue): NormalWordParameter {
  const parameter = {
    kind: "normal",
    text: value.text,
    mode: value.mode,
    type: value.type,
    order: {mode: "unicode", direction: "ascending"},
    options: {
      ignore: {case: false},
      shuffleSeed: null,
      enableSuggestions: false
    }
  } satisfies NormalWordParameter;
  return parameter;
}

type SimpleSearchWordFormValue = {
  text: string,
  mode: WordMode,
  type: WordType
};
