//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component-function/atom/button";
import Input from "/client/component-function/atom/input";
import {
  Suggest,
  SuggestionSpec
} from "/client/component-function/atom/input";
import Overlay from "/client/component-function/atom/overlay";
import Selection from "/client/component-function/atom/selection";
import {
  StylesRecord,
  create
} from "/client/component-function/create";
import {
  useIntl,
  useRequest
} from "/client/component-function/hook";
import {
  ADVANCED_WORD_MODES,
  AdvancedWordParameter,
  AdvancedWordParameterElement,
  Dictionary,
  WORD_TYPES,
  WordParameter
} from "/client/skeleton/dictionary";
import {
  deleteAt
} from "/client/util/misc";


const AdvancedSearchForm = create(
  require("./advanced-search-form.scss"), "AdvancedSearchForm",
  function ({
    dictionary,
    defaultParameter,
    open,
    onClose,
    onConfirm,
    styles
  }: {
    dictionary: Dictionary,
    defaultParameter: WordParameter,
    open: boolean
    onClose?: (event: MouseEvent<HTMLElement>) => void,
    onConfirm?: (parameter: WordParameter, event: MouseEvent<HTMLButtonElement>) => void,
    styles?: StylesRecord
  }): ReactElement {

    let [parameter, setParameter] = useState((defaultParameter instanceof AdvancedWordParameter) ? defaultParameter : AdvancedWordParameter.createEmpty());
    let [, {trans}] = useIntl();
    let {request} = useRequest();

    let mutateParameter = useCallback(function <T extends Array<unknown>>(setter: (parameter: AdvancedWordParameter, ...args: T) => void): (...args: T) => void {
      let wrapper = function (...args: T): void {
        setParameter((parameter) => {
          setter(parameter, ...args);
          return Object.assign(AdvancedWordParameter.createEmpty(), parameter);
        });
      };
      return wrapper;
    }, []);

    let handleClose = useCallback(function (event: MouseEvent<HTMLElement>): void {
      onClose?.(event);
    }, [onClose]);

    let confirmParameter = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      onClose?.(event);
      onConfirm?.(parameter, event);
    }, [parameter, onClose, onConfirm]);

    let createSuggest = useCallback(function (propertyName: string): Suggest {
      let number = dictionary.number;
      let suggest = async function (pattern: string): Promise<Array<SuggestionSpec>> {
        let response = await request("suggestDictionaryTitles", {number, propertyName, pattern}, {ignoreError: true});
        if (response.status === 200 && !("error" in response.data)) {
          let titles = response.data;
          let suggestions = titles.map((title) => ({replacement: title, node: title}));
          return suggestions;
        } else {
          return [];
        }
      };
      return suggest;
    }, [dictionary.number, request]);

    let elements = parameter.elements;
    let modeSpecs = ADVANCED_WORD_MODES.map((mode) => ({value: mode, text: trans(`advancedSearchForm.${mode}`)}));
    let typeSpecs = WORD_TYPES.map((type) => ({value: type, text: trans(`advancedSearchForm.${type}`)}));
    let searchNodes = elements.map((element, index) => {
      let modeLabel = (index === 0) ? trans("advancedSearchForm.mode") : undefined;
      let typeLabel = (index === 0) ? trans("advancedSearchForm.type") : undefined;
      let titleLabel = (index === 0) ? trans("advancedSearchForm.title") : undefined;
      let searchLabel = (index === 0) ? trans("advancedSearchForm.search") : undefined;
      let titleDisabled = element.mode !== "equivalent" && element.mode !== "information";
      let deleteDisabled = elements.length <= 1;
      let suggest = (titleDisabled) ? undefined : createSuggest(element.mode);
      let searchNode = (
        <div styleName="inner" key={index}>
          <div styleName="form left">
            <Selection className={styles!["selection"]} value={element.mode} label={modeLabel} specs={modeSpecs} onSet={mutateParameter((parameter, mode) => elements[index].mode = mode)}/>
            <Selection className={styles!["selection"]} value={element.type} label={typeLabel} specs={typeSpecs} onSet={mutateParameter((parameter, type) => elements[index].type = type)}/>
          </div>
          <div styleName="form right">
            <Input className={styles!["title"]} value={element.title} label={titleLabel} suggest={suggest} disabled={titleDisabled} onSet={mutateParameter((parameter, title) => elements[index].title = title)}/>
            <Input className={styles!["search"]} value={element.search} label={searchLabel} onSet={mutateParameter((parameter, search) => elements[index].search = search)}/>
          </div>
          <div styleName="control-button">
            <Button iconLabel="&#xF068;" disabled={deleteDisabled} onClick={mutateParameter((parameter) => deleteAt(elements, index))}/>
          </div>
        </div>
      );
      return searchNode;
    });
    let node = (
      <Overlay size="large" title={trans("advancedSearchForm.overlayTitle")} open={open} onClose={handleClose}>
        {searchNodes}
        <div styleName="plus">
          <Button iconLabel="&#xF067;" onClick={mutateParameter((parameter) => elements.push(AdvancedWordParameterElement.createEmpty()))}/>
        </div>
        <div styleName="confirm-button">
          <Button label={trans("advancedSearchForm.confirm")} iconLabel="&#xF00C;" style="information" onClick={confirmParameter}/>
        </div>
      </Overlay>
    );
    return node;

  }
);


export default AdvancedSearchForm;