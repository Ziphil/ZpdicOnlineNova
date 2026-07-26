/* eslint-disable react/jsx-closing-bracket-location */

import {faSearch} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller} from "react-hook-form";
import {AdditionalProps, ControlGroup, GeneralIcon, Input, InputAddon} from "zographia";
import {OrderDirectionSelect} from "/client/component/compound/order-direction-select";
import {OrderModeSelect} from "/client/component/compound/order-mode-select";
import {create} from "/client/component/create";
import {useSearchForm} from "/client/hook/search-form";
import {preventDefault} from "/client/util/form";
import {DICTIONARY_ORDER_MODES, DictionaryOrderDirection, DictionaryOrderMode, DictionaryParameter} from "/server/internal/skeleton";


export const SearchDictionaryForm = create(
  require("./search-dictionary-form.scss"), "SearchDictionaryForm",
  function ({
    parameter,
    onParameterCommit,
    ...rest
  }: {
    parameter: DictionaryParameter,
    onParameterCommit: (parameter: DictionaryParameter) => void,
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
        <div styleName="row">
          <ControlGroup>
            <Controller name="orderMode" control={control} render={({field}) => (
              <OrderModeSelect optionOrderModes={DICTIONARY_ORDER_MODES} unicodeAlt="dictionaryName" orderMode={field.value} onSet={field.onChange}/>
            )}/>
            <Controller name="orderDirection" control={control} render={({field}) => (
              <OrderDirectionSelect orderDirection={field.value} onSet={field.onChange}/>
            )}/>
          </ControlGroup>
        </div>
      </form>
    );

  }
);


function toFormValue(parameter: DictionaryParameter): SearchDictionaryFormValue {
  const value = {
    text: parameter.text,
    userName: parameter.userName,
    orderMode: parameter.order.mode,
    orderDirection: parameter.order.direction
  } satisfies SearchDictionaryFormValue;
  return value;
}

function fromFormValue(value: SearchDictionaryFormValue): DictionaryParameter {
  const parameter = {
    kind: "normal",
    text: value.text,
    userName: value.userName,
    order: {mode: value.orderMode, direction: value.orderDirection}
  } satisfies DictionaryParameter;
  return parameter;
}

type SearchDictionaryFormValue = {
  text: string,
  userName: string | null,
  orderMode: DictionaryOrderMode,
  orderDirection: DictionaryOrderDirection
};
