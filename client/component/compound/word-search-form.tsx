//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useRef,
  useState
} from "react";
import {
  DeepPartial
} from "ts-essentials";
import Button from "/client/component/atom/button";
import Checkbox from "/client/component/atom/checkbox";
import DropdownItem from "/client/component/atom/dropdown-item";
import Icon from "/client/component/atom/icon";
import Input from "/client/component/atom/input";
import Radio from "/client/component/atom/radio";
import RadioGroup from "/client/component/atom/radio-group";
import Selection from "/client/component/atom/selection-beta";
import AdvancedWordSearchForm from "/client/component/compound/advanced-word-search-form";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useHotkey,
  useIntl
} from "/client/component/hook";
import {
  Dictionary,
  NormalWordParameter,
  WORD_ORDER_DIRECTIONS,
  WordParameter
} from "/client/skeleton/dictionary";


const WordSearchForm = create(
  require("./word-search-form.scss"), "WordSearchForm",
  function ({
    dictionary,
    parameter = NormalWordParameter.createEmpty(),
    showOrder = false,
    showAdvancedSearch = false,
    enableHotkeys = false,
    onParameterSet,
    styles
  }: {
    dictionary: Dictionary,
    parameter?: WordParameter,
    showOrder?: boolean,
    showAdvancedSearch?: boolean,
    enableHotkeys?: boolean,
    onParameterSet?: (parameter: WordParameter) => void,
    styles?: StylesRecord
  }): ReactElement {

    const [searchFormOpen, setSearchFormOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [, {trans}] = useIntl();

    const handleParameterSet = useCallback(function (nextParameter: DeepPartial<NormalWordParameter>): void {
      if (onParameterSet) {
        const oldParameter = WordParameter.getNormal(parameter);
        const text = nextParameter.text ?? oldParameter.text;
        const mode = nextParameter.mode ?? oldParameter.mode;
        const type = nextParameter.type ?? oldParameter.type;
        const order = {
          mode: nextParameter.order?.mode ?? oldParameter.order.mode,
          direction: nextParameter.order?.direction ?? oldParameter.order.direction
        };
        const options = {
          ignore: {case: nextParameter.options?.ignore?.case ?? oldParameter.options.ignore.case},
          shuffleSeed: nextParameter.options?.shuffleSeed ?? null,
          enableSuggestions: nextParameter.options?.enableSuggestions ?? oldParameter.options.enableSuggestions
        };
        const actualParameter = NormalWordParameter.createEmpty({text, mode, type, order, options});
        onParameterSet(actualParameter);
      }
    }, [parameter, onParameterSet]);

    const handleAdvancedSearchConfirm = useCallback(function (parameter: WordParameter): void {
      onParameterSet?.(parameter);
    }, [onParameterSet]);

    useHotkey("focusSearch", (event) => {
      inputRef.current?.focus();
      event.preventDefault();
    }, [inputRef], enableHotkeys);
    useHotkey("changeSearchModeToBoth", () => {
      handleParameterSet({mode: "both"});
    }, [handleParameterSet], enableHotkeys);
    useHotkey("changeSearchModeToName", () => {
      handleParameterSet({mode: "name"});
    }, [handleParameterSet], enableHotkeys);
    useHotkey("changeSearchModeToEquivalent", () => {
      handleParameterSet({mode: "equivalent"});
    }, [handleParameterSet], enableHotkeys);
    useHotkey("changeSearchModeToContent", () => {
      handleParameterSet({mode: "content"});
    }, [handleParameterSet], enableHotkeys);
    useHotkey("changeSearchTypeToPrefix", () => {
      handleParameterSet({type: "prefix"});
    }, [handleParameterSet], enableHotkeys);
    useHotkey("changeSearchTypeToPart", () => {
      handleParameterSet({type: "part"});
    }, [handleParameterSet], enableHotkeys);
    useHotkey("changeSearchTypeToExact", () => {
      handleParameterSet({type: "exact"});
    }, [handleParameterSet], enableHotkeys);
    useHotkey("changeSearchTypeToRegular", () => {
      handleParameterSet({type: "regular"});
    }, [handleParameterSet], enableHotkeys);

    const modes = ["both", "name", "equivalent", "content"] as const;
    const types = ["prefix", "part", "exact", "regular"] as const;
    const orderMode = ["unicode", "updatedDate", "createdDate"] as const;
    const actualParameter = WordParameter.getNormal(parameter);
    const node = (
      <Fragment>
        <form styleName="root" onSubmit={(event) => event.preventDefault()}>
          <Input value={actualParameter.text} prefix={<Icon className={styles!["icon"]} name="search"/>} nativeRef={inputRef} onSet={(text) => handleParameterSet({text})}/>
          <div styleName="radio-container">
            <RadioGroup name="mode" value={actualParameter.mode} onSet={(mode) => handleParameterSet({mode})}>
              {modes.map((mode) => <Radio key={mode} value={mode} label={trans(`wordSearchForm.${mode}`)}/>)}
            </RadioGroup>
          </div>
          <div styleName="radio-container">
            <RadioGroup name="type" value={actualParameter.type} onSet={(type) => handleParameterSet({type})}>
              {types.map((type) => <Radio key={type} value={type} label={trans(`wordSearchForm.${type}`)}/>)}
            </RadioGroup>
          </div>
          {(showOrder) && (
            <div styleName="selection-container">
              <Checkbox
                name="ignoreCase"
                value="true"
                label={trans("wordSearchForm.ignoreCase")}
                checked={actualParameter.options.ignore.case}
                onSet={(ignoreCase) => handleParameterSet({options: {ignore: {case: ignoreCase}}})}
              />
              <Checkbox
                name="enableSuggestions"
                value="true"
                label={trans("wordSearchForm.enableSuggestions")}
                checked={actualParameter.options.enableSuggestions}
                onSet={(enableSuggestions) => handleParameterSet({options: {enableSuggestions}})}
              />
            </div>
          )}
          {(showOrder) && (
            <div styleName="selection-container">
              <Selection
                className={styles!["order-mode"]}
                value={actualParameter.order.mode}
                onSet={(orderMode) => handleParameterSet({order: {mode: orderMode}})}
              >
                {orderMode.map((orderMode) => (
                  <DropdownItem key={orderMode} value={orderMode}>
                    {trans(`wordSearchForm.${orderMode}`)}
                  </DropdownItem>
                ))}
              </Selection>
              <Selection
                className={styles!["order-direction"]}
                value={actualParameter.order.direction}
                onSet={(orderDirection) => handleParameterSet({order: {direction: orderDirection}})}
              >
                {WORD_ORDER_DIRECTIONS.map((orderDirection) => (
                  <DropdownItem key={orderDirection} value={orderDirection}>
                    <div>
                      <Icon className={styles!["order-direction-icon"]} name={(orderDirection === "ascending") ? "arrow-down-a-z" : "arrow-down-z-a"}/>
                      {trans(`wordSearchForm.${orderDirection}`)}
                    </div>
                  </DropdownItem>
                ))}
              </Selection>
            </div>
          )}
          {(showOrder || showAdvancedSearch) && (
            <div styleName="selection-container">
              {(showOrder) && (
                <Button
                  label={trans("wordSearchForm.shuffleResult")}
                  iconName="shuffle"
                  variant="simple"
                  onClick={() => handleParameterSet({options: {shuffleSeed: Date.now().toString()}})}
                />
              )}
              {(showAdvancedSearch) && <Button label={trans("wordSearchForm.advancedSearch")} iconName="search-plus" variant="simple" onClick={() => setSearchFormOpen(true)}/>}
            </div>
          )}
        </form>
        {(showAdvancedSearch) && (
          <AdvancedWordSearchForm
            dictionary={dictionary}
            defaultParameter={parameter}
            open={searchFormOpen}
            onConfirm={handleAdvancedSearchConfirm}
            onClose={() => setSearchFormOpen(false)}
          />
        )}
      </Fragment>
    );
    return node;

  }
);


export default WordSearchForm;