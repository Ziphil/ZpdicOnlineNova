//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useRef,
  useState
} from "react";
import Button from "/client/component/atom/button";
import Checkbox from "/client/component/atom/checkbox";
import Icon from "/client/component/atom/icon";
import Input from "/client/component/atom/input";
import RadioGroup from "/client/component/atom/radio-group";
import Selection from "/client/component/atom/selection";
import AdvancedSearchForm from "/client/component/compound/advanced-search-form";
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
  WordMode,
  WordOrderDirection,
  WordOrderMode,
  WordParameter,
  WordType
} from "/client/skeleton/dictionary";


const SearchForm = create(
  require("./search-form.scss"), "SearchForm",
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

    let [searchFormOpen, setSearchFormOpen] = useState(false);
    let inputRef = useRef<HTMLInputElement>(null);
    let [, {trans}] = useIntl();

    let handleParameterSet = useCallback(function (nextParameter: PartialWordParameter): void {
      if (onParameterSet) {
        let oldParameter = WordParameter.getNormal(parameter);
        let text = nextParameter.text ?? oldParameter.text;
        let mode = nextParameter.mode ?? oldParameter.mode;
        let type = nextParameter.type ?? oldParameter.type;
        let orderMode = nextParameter.orderMode ?? oldParameter.order.mode;
        let orderDirection = nextParameter.orderDirection ?? oldParameter.order.direction;
        let order = {mode: orderMode, direction: orderDirection};
        let ignoreCase = nextParameter.ignoreCase ?? oldParameter.ignoreOptions.case;
        let ignoreOptions = {case: ignoreCase};
        let enableSuggestions = nextParameter.enableSuggestions;
        let actualParameter = NormalWordParameter.createEmpty({text, mode, type, order, ignoreOptions, enableSuggestions});
        onParameterSet(actualParameter);
      }
    }, [parameter, onParameterSet]);

    let handleAdvancedSearchConfirm = useCallback(function (parameter: WordParameter): void {
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

    let modes = ["both", "name", "equivalent", "content"] as const;
    let types = ["prefix", "part", "exact", "regular"] as const;
    let orderMode = ["unicode", "updatedDate", "createdDate"] as const;
    let modeSpecs = modes.map((mode) => ({value: mode, label: trans(`searchForm.${mode}`)}));
    let typeSpecs = types.map((type) => ({value: type, label: trans(`searchForm.${type}`)}));
    let orderModeSpecs = orderMode.map((orderMode) => ({value: orderMode, node: trans(`searchForm.${orderMode}`)}));
    let orderDirectionSpecs = WORD_ORDER_DIRECTIONS.map((orderDirection) => ({value: orderDirection, node: <SearchFormOrderModeDropdownNode orderDirection={orderDirection}/>}));
    let actualParameter = WordParameter.getNormal(parameter);
    let orderNode = (showOrder) && (
      <Fragment>
        <div styleName="selection-wrapper">
          <Checkbox name="ignoreCase" value="true" label={trans("searchForm.ignoreCase")} checked={actualParameter.ignoreOptions.case} onSet={(ignoreCase) => handleParameterSet({ignoreCase})}/>
          <Checkbox name="enableSuggestions" value="true" label={trans("searchForm.enableSuggestions")} checked={actualParameter.enableSuggestions} onSet={(enableSuggestions) => handleParameterSet({enableSuggestions})}/>
        </div>
        <div styleName="selection-wrapper">
          <Selection className={styles!["order-mode"]} value={actualParameter.order.mode} specs={orderModeSpecs} onSet={(orderMode) => handleParameterSet({orderMode})}/>
          <Selection className={styles!["order-direction"]} value={actualParameter.order.direction} specs={orderDirectionSpecs} onSet={(orderDirection) => handleParameterSet({orderDirection})}/>
        </div>
      </Fragment>
    );
    let advancedSearchButton = (showAdvancedSearch) && (
      <div styleName="radio-wrapper">
        <Button label={trans("searchForm.advancedSearch")} iconName="search-plus" variant="simple" onClick={() => setSearchFormOpen(true)}/>
      </div>
    );
    let advancedSearchNode = (showAdvancedSearch) && (
      <AdvancedSearchForm
        dictionary={dictionary}
        defaultParameter={parameter}
        open={searchFormOpen}
        onConfirm={handleAdvancedSearchConfirm}
        onClose={() => setSearchFormOpen(false)}
      />
    );
    let iconNode = (searching) ? <Icon className={styles!["icon"]} name="spinner" pulse={true}/> : <Icon className={styles!["icon"]} name="search"/>;
    let node = (
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
  require("./search-form.scss"),
  function ({
    orderDirection
  }: {
    orderDirection: "ascending" | "descending"
  }): ReactElement {

    let [, {trans}] = useIntl();

    let node = (
      <div>
        <span styleName="order-direction-icon">
          <Icon name={(orderDirection === "ascending") ? "arrow-down-a-z" : "arrow-down-z-a"}/>
        </span>
        {trans(`searchForm.${orderDirection}`)}
      </div>
    );
    return node;

  }
);


type PartialWordParameter = {
  text?: string,
  mode?: WordMode,
  type?: WordType,
  orderMode?: WordOrderMode,
  orderDirection?: WordOrderDirection,
  ignoreCase?: boolean,
  enableSuggestions?: boolean
};

export default SearchForm;