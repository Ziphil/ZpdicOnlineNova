//

import {
  ReactElement,
  useCallback,
  useRef
} from "react";
import {
  DeepPartial
} from "ts-essentials";
import DropdownItem from "/client/component/atom/dropdown-item";
import Icon from "/client/component/atom/icon";
import Input from "/client/component/atom/input";
import Selection from "/client/component/atom/selection";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useHotkey,
  useTrans
} from "/client/component/hook";
import {
  DICTIONARY_ORDER_DIRECTIONS,
  DictionaryParameter,
  NormalDictionaryParameter
} from "/client/skeleton/dictionary";


const DictionarySearchForm = create(
  require("./dictionary-search-form.scss"), "DictionarySearchForm",
  function ({
    parameter = NormalDictionaryParameter.createEmpty(),
    showOrder = false,
    enableHotkeys = false,
    onParameterSet,
    styles
  }: {
    parameter?: DictionaryParameter,
    showOrder?: boolean,
    enableHotkeys?: boolean,
    onParameterSet?: (parameter: DictionaryParameter) => void,
    styles?: StylesRecord
  }): ReactElement {

    const inputRef = useRef<HTMLInputElement>(null);
    const {trans} = useTrans("dictionarySearchForm");

    const handleParameterSet = useCallback(function (nextParameter: DeepPartial<NormalDictionaryParameter>): void {
      if (onParameterSet) {
        const oldParameter = {...parameter} as NormalDictionaryParameter;
        const text = nextParameter.text ?? oldParameter.text;
        const order = {
          mode: nextParameter.order?.mode ?? oldParameter.order.mode,
          direction: nextParameter.order?.direction ?? oldParameter.order.direction
        };
        const actualParameter = NormalDictionaryParameter.createEmpty({text, order});
        onParameterSet(actualParameter);
      }
    }, [parameter, onParameterSet]);

    useHotkey("focusSearch", (event) => {
      inputRef.current?.focus();
      event.preventDefault();
    }, [inputRef], enableHotkeys);

    const orderMode = ["updatedDate", "createdDate"] as const;
    const actualParameter = parameter as NormalDictionaryParameter;
    const node = (
      <form styleName="root" onSubmit={(event) => event.preventDefault()}>
        <Input value={actualParameter.text} prefix={<Icon className={styles!["icon"]} name="search"/>} nativeRef={inputRef} onSet={(text) => handleParameterSet({text})}/>
        {(showOrder) && (
          <div styleName="selection-container">
            <Selection
              className={styles!["order-mode"]}
              value={actualParameter.order.mode}
              onSet={(orderMode) => handleParameterSet({order: {mode: orderMode}})}
            >
              {orderMode.map((orderMode) => (
                <DropdownItem key={orderMode} value={orderMode}>
                  {trans(orderMode)}
                </DropdownItem>
              ))}
            </Selection>
            <Selection
              className={styles!["order-direction"]}
              value={actualParameter.order.direction}
              onSet={(orderDirection) => handleParameterSet({order: {direction: orderDirection}})}
            >
              {DICTIONARY_ORDER_DIRECTIONS.map((orderDirection) => (
                <DropdownItem key={orderDirection} value={orderDirection}>
                  <div>
                    <Icon className={styles!["order-direction-icon"]} name={(orderDirection === "ascending") ? "arrow-down-a-z" : "arrow-down-z-a"}/>
                    {trans(orderDirection)}
                  </div>
                </DropdownItem>
              ))}
            </Selection>
          </div>
        )}
      </form>
    );
    return node;

  }
);


export default DictionarySearchForm;