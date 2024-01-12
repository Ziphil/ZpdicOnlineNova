//

import {faSearch} from "@fortawesome/sharp-regular-svg-icons";
import merge from "lodash-es/merge";
import {Dispatch, ReactElement, SetStateAction, useCallback} from "react";
import {AdditionalProps, CheckableContainer, CheckableLabel, Checkbox, GeneralIcon, Input, InputAddon, Radio, RadioGroup, useTrans} from "zographia";
import {OrderDirection, OrderDirectionSelect} from "/client-new/component/compound/order-direction-select";
import {OrderModeSelect} from "/client-new/component/compound/order-mode-select";
import {create} from "/client-new/component/create";
import {WORD_ORDER_MODES, WordOrderMode, WordParameter} from "/client-new/skeleton";
import {preventDefault} from "/client-new/util/form";


export const SearchWordForm = create(
  require("./search-word-form.scss"), "SearchWordForm",
  function ({
    parameter,
    onParameterSet,
    ...rest
  }: {
    parameter: WordParameter,
    onParameterSet?: Dispatch<SetStateAction<WordParameter>>,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("searchWordForm");

    const actualParameter = WordParameter.toNormal(parameter);

    const handleOrderModeSet = useCallback(function (orderMode: WordOrderMode): void {
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
        >
          <InputAddon position="left">
            <GeneralIcon styleName="icon" icon={faSearch}/>
          </InputAddon>
        </Input>
        <div styleName="radio-group">
          <RadioGroup>
            {FORM_WORD_MODES.map((mode) => (
              <CheckableContainer key={mode}>
                <Radio/>
                <CheckableLabel>{trans(`mode.${mode}`)}</CheckableLabel>
              </CheckableContainer>
            ))}
          </RadioGroup>
        </div>
        <div styleName="radio-group">
          <RadioGroup>
            {FORM_WORD_TYPES.map((type) => (
              <CheckableContainer key={type}>
                <Radio/>
                <CheckableLabel>{trans(`type.${type}`)}</CheckableLabel>
              </CheckableContainer>
            ))}
          </RadioGroup>
        </div>
        <div styleName="radio-group">
          <CheckableContainer>
            <Checkbox/>
            <CheckableLabel>{trans("ignoreCase")}</CheckableLabel>
          </CheckableContainer>
          <CheckableContainer>
            <Checkbox/>
            <CheckableLabel>{trans("enableSuggestions")}</CheckableLabel>
          </CheckableContainer>
        </div>
        <div styleName="row">
          <OrderModeSelect
            orderModeOptions={WORD_ORDER_MODES}
            orderMode={actualParameter.order.mode}
            onSet={handleOrderModeSet}
          />
          <OrderDirectionSelect
            orderDirection={actualParameter.order.direction}
            onSet={handleOrderDirectionSet}
          />
        </div>
      </form>
    );
    return node;

  }
);


const FORM_WORD_MODES = ["both", "name", "equivalent", "tag", "content"] as const;
const FORM_WORD_TYPES = ["prefix", "part", "exact", "regular"] as const;