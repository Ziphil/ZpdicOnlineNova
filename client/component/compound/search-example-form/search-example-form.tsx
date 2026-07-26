/* eslint-disable react/jsx-closing-bracket-location */

import {faSearch} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller} from "react-hook-form";
import {AdditionalProps, CheckableContainer, CheckableLabel, Checkbox, GeneralIcon, Input, InputAddon, useTrans} from "zographia";
import {ExampleModeSelect} from "/client/component/atom/example-mode-select";
import {ExampleTypeSelect} from "/client/component/atom/example-type-select";
import {create} from "/client/component/create";
import {useSearchForm} from "/client/hook/search-form";
import {preventDefault} from "/client/util/form";
import {ExampleMode, ExampleParameter, ExampleType, NormalExampleParameter} from "/server/internal/skeleton";


export const SearchExampleForm = create(
  require("./search-example-form.scss"), "SearchExampleForm",
  function ({
    parameter,
    onParameterCommit,
    ...rest
  }: {
    parameter: ExampleParameter,
    onParameterCommit: (parameter: ExampleParameter) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("searchExampleForm");

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
            <ExampleModeSelect optionModes={FORM_EXAMPLE_MODES} kind="flexible" mode={field.value} onSet={field.onChange}/>
          )}/>
          <Controller name="type" control={control} render={({field}) => (
            <ExampleTypeSelect optionTypes={FORM_EXAMPLE_TYPES} kind="flexible" type={field.value} onSet={field.onChange}/>
          )}/>
        </div>
        <div styleName="row">
          <CheckableContainer>
            <Controller name="ignoreCase" control={control} render={({field}) => (
              <Checkbox checked={field.value} onSet={field.onChange}/>
            )}/>
            <CheckableLabel>{trans("label.ignoreCase")}</CheckableLabel>
          </CheckableContainer>
        </div>
      </form>
    );

  }
);


const FORM_EXAMPLE_MODES = ["both", "sentence", "translation", "tag", "content"] as const;
const FORM_EXAMPLE_TYPES = ["prefix", "part", "exact", "regular"] as const;

function toFormValue(parameter: ExampleParameter): SearchExampleFormValue {
  const normalParameter = ExampleParameter.toNormal(parameter);
  const value = {
    text: normalParameter.text,
    mode: normalParameter.mode,
    type: normalParameter.type,
    ignoreCase: normalParameter.options.ignore.case
  } satisfies SearchExampleFormValue;
  return value;
}

function fromFormValue(value: SearchExampleFormValue): NormalExampleParameter {
  const parameter = {
    kind: "normal",
    text: value.text,
    mode: value.mode,
    type: value.type,
    options: {
      ignore: {case: value.ignoreCase}
    }
  } satisfies NormalExampleParameter;
  return parameter;
}

type SearchExampleFormValue = {
  text: string,
  mode: ExampleMode,
  type: ExampleType,
  ignoreCase: boolean
};
