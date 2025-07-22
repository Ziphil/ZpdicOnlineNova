//

import {faSearch} from "@fortawesome/sharp-regular-svg-icons";
import merge from "lodash.merge";
import {Dispatch, ReactElement, SetStateAction, useCallback} from "react";
import {AdditionalProps, ControlGroup, GeneralIcon, Input, InputAddon} from "zographia";
import {OrderDirection, OrderDirectionSelect} from "/client/component/compound/order-direction-select";
import {OrderModeSelect} from "/client/component/compound/order-mode-select";
import {create} from "/client/component/create";
import {preventDefault} from "/client/util/form";
import {DICTIONARY_ORDER_MODES, DictionaryOrderMode, DictionaryParameter} from "/server/internal/skeleton";


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

    return (
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
              optionOrderModes={DICTIONARY_ORDER_MODES}
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

  }
);