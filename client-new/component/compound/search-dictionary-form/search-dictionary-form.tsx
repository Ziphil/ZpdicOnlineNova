//

import {faSearch} from "@fortawesome/sharp-regular-svg-icons";
import merge from "lodash-es/merge";
import {ReactElement, useCallback} from "react";
import {DeepPartial} from "ts-essentials";
import {AdditionalProps, GeneralIcon, Input, InputAddon} from "zographia";
import {OrderDirectionSelect} from "/client-new/component/compound/order-direction-select";
import {OrderModeSelect} from "/client-new/component/compound/order-mode-select";
import {create} from "/client-new/component/create";
import {DictionaryParameter, NormalDictionaryParameter} from "/client-new/skeleton";
import {preventDefault} from "/client-new/util/form";


export const SearchDictionaryForm = create(
  require("./search-dictionary-form.scss"), "SearchDictionaryForm",
  function ({
    parameter,
    onParameterSet,
    ...rest
  }: {
    parameter: DictionaryParameter,
    onParameterSet?: (parameter: DictionaryParameter) => unknown,
    className?: string
  } & AdditionalProps): ReactElement {

    const handleParameterSet = useCallback(function (partialParameter: DeepPartial<NormalDictionaryParameter>): void {
      if (onParameterSet !== undefined) {
        const nextParameter = merge(parameter, partialParameter);
        onParameterSet(nextParameter);
      }
    }, [parameter, onParameterSet]);

    const node = (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <Input
          styleName="input"
          type="search"
          value={parameter.text}
          onSet={(text) => handleParameterSet({text})}
        >
          <InputAddon position="left">
            <GeneralIcon styleName="icon" icon={faSearch}/>
          </InputAddon>
        </Input>
        <div styleName="row">
          <OrderModeSelect
            orderModeOptions={["createdDate", "updatedDate"]}
            orderMode={parameter.order.mode}
            onSet={(orderMode) => handleParameterSet({order: {mode: orderMode}})}
          />
          <OrderDirectionSelect
            orderDirection={parameter.order.direction}
            onSet={(orderDirection) => handleParameterSet({order: {direction: orderDirection}})}
          />
        </div>
      </form>
    );
    return node;

  }
);