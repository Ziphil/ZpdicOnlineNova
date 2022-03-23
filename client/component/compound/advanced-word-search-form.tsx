//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import {
  Suggest,
  SuggestionSpec
} from "/client/component/atom/input";
import Overlay from "/client/component/atom/overlay";
import Selection from "/client/component/atom/selection";
import {
  StylesRecord,
  create
} from "/client/component/create";
import {
  useIntl,
  useRequest
} from "/client/component/hook";
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


const AdvancedWordSearchForm = create(
  require("./advanced-word-search-form.scss"), "AdvancedWordSearchForm",
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
    let modeSpecs = ADVANCED_WORD_MODES.map((mode) => ({value: mode, node: trans(`advancedWordSearchForm.${mode}`)}));
    let typeSpecs = WORD_TYPES.map((type) => ({value: type, node: trans(`advancedWordSearchForm.${type}`)}));
    let searchNodes = elements.map((element, index) => {
      let modeLabel = (index === 0) ? trans("advancedWordSearchForm.mode") : undefined;
      let typeLabel = (index === 0) ? trans("advancedWordSearchForm.type") : undefined;
      let titleLabel = (index === 0) ? trans("advancedWordSearchForm.title") : undefined;
      let textLabel = (index === 0) ? trans("advancedWordSearchForm.text") : undefined;
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
            <Input className={styles!["text"]} value={element.text} label={textLabel} onSet={mutateParameter((parameter, text) => elements[index].text = text)}/>
          </div>
          <div styleName="control-button">
            <Button iconName="minus" disabled={deleteDisabled} onClick={mutateParameter((parameter) => deleteAt(elements, index))}/>
          </div>
        </div>
      );
      return searchNode;
    });
    let node = (
      <Overlay size="large" title={trans("advancedWordSearchForm.overlayTitle")} open={open} onClose={handleClose}>
        {searchNodes}
        <div styleName="plus">
          <Button iconName="plus" onClick={mutateParameter((parameter) => elements.push(AdvancedWordParameterElement.createEmpty()))}/>
        </div>
        <div styleName="confirm-button">
          <Button label={trans("advancedWordSearchForm.confirm")} iconName="check" variant="information" onClick={confirmParameter}/>
        </div>
      </Overlay>
    );
    return node;

  }
);


export default AdvancedWordSearchForm;