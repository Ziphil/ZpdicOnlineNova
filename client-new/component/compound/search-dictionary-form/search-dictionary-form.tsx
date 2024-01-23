//

import {faSearch} from "@fortawesome/sharp-regular-svg-icons";
import merge from "lodash-es/merge";
import {Dispatch, ReactElement, SetStateAction, useCallback} from "react";
import {AdditionalProps, ControlGroup, GeneralIcon, Input, InputAddon} from "zographia";
import {OrderDirection, OrderDirectionSelect} from "/client-new/component/compound/order-direction-select";
import {OrderModeSelect} from "/client-new/component/compound/order-mode-select";
import {create} from "/client-new/component/create";
import {DICTIONARY_ORDER_MODES, DictionaryOrderMode, DictionaryParameter} from "/client-new/skeleton";
import {preventDefault} from "/client-new/util/form";


export const SearchDictionaryForm = create(
  require("./search-dictionary-form.scss"), "SearchDictionaryForm",
  function ({
    parameter,
    onParameterSet,
    ...rest
  }: {
    parameter: DictionaryParameter,
    onParameterSet?: Dispatch<SetStateAction<DictionaryParameter>>,
    className?: string
  } & AdditionalProps): ReactElement {

    const handleTextSet = useCallback(function (text: string): void {
      onParameterSet?.((prevParameter) => merge({}, prevParameter, {text}));
    }, [onParameterSet]);

    const handleOrderModeSet = useCallback(function (orderMode: DictionaryOrderMode): void {
      onParameterSet?.((prevParameter) => merge({}, prevParameter, {order: {mode: orderMode}}));
    }, [onParameterSet]);

    const handleOrderDirectionSet = useCallback(function (orderDirection: OrderDirection): void {
      onParameterSet?.((prevParameter) => merge({}, prevParameter, {order: {direction: orderDirection}}));
    }, [onParameterSet]);

    const node = (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <Input
          styleName="input"
          type="search"
          value={parameter.text}
          onSet={handleTextSet}
        >
          <InputAddon position="left">
            <GeneralIcon styleName="icon" icon={faSearch}/>
          </InputAddon>
        </Input>
        <div styleName="row">
          <ControlGroup>
            <OrderModeSelect
              orderModeOptions={DICTIONARY_ORDER_MODES}
              orderMode={parameter.order.mode}
              unicodeAlt="dictionaryName"
              onSet={handleOrderModeSet}
            />
            <OrderDirectionSelect
              orderDirection={parameter.order.direction}
              onSet={handleOrderDirectionSet}
            />
          </ControlGroup>
        </div>
      </form>
    );
    return node;

  }
);