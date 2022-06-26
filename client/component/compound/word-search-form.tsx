//

import merge from "lodash-es/merge";
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
import Icon from "/client/component/atom/icon";
import Input from "/client/component/atom/input";
import RadioGroup from "/client/component/atom/radio-group";
import Selection from "/client/component/atom/selection";
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
    searching = false,
    showOrder = false,
    showAdvancedSearch = false,
    enableHotkeys = false,
    onParameterSet,
    styles
  }: {
    dictionary: Dictionary,
    parameter?: WordParameter,
    searching?: boolean,
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
        const {text, mode, type, order, options} = merge(oldParameter, nextParameter);
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
    const modeSpecs = modes.map((mode) => ({value: mode, label: trans(`wordSearchForm.${mode}`)}));
    const typeSpecs = types.map((type) => ({value: type, label: trans(`wordSearchForm.${type}`)}));
    const orderModeSpecs = orderMode.map((orderMode) => ({value: orderMode, node: trans(`wordSearchForm.${orderMode}`)}));
    const orderDirectionSpecs = WORD_ORDER_DIRECTIONS.map((orderDirection) => ({value: orderDirection, node: <SearchFormOrderModeDropdownNode orderDirection={orderDirection}/>}));
    const actualParameter = WordParameter.getNormal(parameter);
    const orderNode = (showOrder) && (
      <Fragment>
        <div styleName="selection-wrapper">
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
        <div styleName="selection-wrapper">
          <Selection
            className={styles!["order-mode"]}
            value={actualParameter.order.mode}
            specs={orderModeSpecs}
            onSet={(orderMode) => handleParameterSet({order: {mode: orderMode}})}
          />
          <Selection
            className={styles!["order-direction"]}
            value={actualParameter.order.direction}
            specs={orderDirectionSpecs}
            onSet={(orderDirection) => handleParameterSet({order: {direction: orderDirection}})}
          />
        </div>
      </Fragment>
    );
    const advancedSearchButton = (showAdvancedSearch) && (
      <div styleName="radio-wrapper">
        <Button label={trans("wordSearchForm.advancedSearch")} iconName="search-plus" variant="simple" onClick={() => setSearchFormOpen(true)}/>
      </div>
    );
    const advancedSearchNode = (showAdvancedSearch) && (
      <AdvancedWordSearchForm
        dictionary={dictionary}
        defaultParameter={parameter}
        open={searchFormOpen}
        onConfirm={handleAdvancedSearchConfirm}
        onClose={() => setSearchFormOpen(false)}
      />
    );
    const iconNode = (searching) ? <Icon className={styles!["icon"]} name="circle-notch" spin={true}/> : <Icon className={styles!["icon"]} name="search"/>;
    const node = (
      <Fragment>
        <form styleName="root" onSubmit={(event) => event.preventDefault()}>
          <Input value={actualParameter.text} prefix={iconNode} nativeRef={inputRef} onSet={(text) => handleParameterSet({text})}/>
          <div styleName="radio-wrapper">
            <RadioGroup name="mode" value={actualParameter.mode} specs={modeSpecs} onSet={(mode) => handleParameterSet({mode})}/>
          </div>
          <div styleName="radio-wrapper">
            <RadioGroup name="type" value={actualParameter.type} specs={typeSpecs} onSet={(type) => handleParameterSet({type})}/>
          </div>
          {orderNode}
          {advancedSearchButton}
        </form>
        {advancedSearchNode}
      </Fragment>
    );
    return node;

  }
);


const SearchFormOrderModeDropdownNode = create(
  require("./word-search-form.scss"),
  function ({
    orderDirection
  }: {
    orderDirection: "ascending" | "descending"
  }): ReactElement {

    const [, {trans}] = useIntl();

    const node = (
      <div>
        <span styleName="order-direction-icon">
          <Icon name={(orderDirection === "ascending") ? "arrow-down-a-z" : "arrow-down-z-a"}/>
        </span>
        {trans(`wordSearchForm.${orderDirection}`)}
      </div>
    );
    return node;

  }
);


export default WordSearchForm;