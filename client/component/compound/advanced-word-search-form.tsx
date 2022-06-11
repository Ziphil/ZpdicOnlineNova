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

    const [parameter, setParameter] = useState((defaultParameter instanceof AdvancedWordParameter) ? defaultParameter : AdvancedWordParameter.createEmpty());
    const [, {trans}] = useIntl();
    const {request} = useRequest();

    const mutateParameter = useCallback(function <T extends Array<unknown>>(setter: (parameter: AdvancedWordParameter, ...args: T) => void): (...args: T) => void {
      const wrapper = function (...args: T): void {
        setParameter((parameter) => {
          setter(parameter, ...args);
          return Object.assign(AdvancedWordParameter.createEmpty(), parameter);
        });
      };
      return wrapper;
    }, []);

    const handleClose = useCallback(function (event: MouseEvent<HTMLElement>): void {
      onClose?.(event);
    }, [onClose]);

    const confirmParameter = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      onClose?.(event);
      onConfirm?.(parameter, event);
    }, [parameter, onClose, onConfirm]);

    const createSuggest = useCallback(function (propertyName: string): Suggest {
      const number = dictionary.number;
      const suggest = async function (pattern: string): Promise<Array<SuggestionSpec>> {
        const response = await request("suggestDictionaryTitles", {number, propertyName, pattern}, {ignoreError: true});
        if (response.status === 200 && !("error" in response.data)) {
          const titles = response.data;
          const suggestions = titles.map((title) => ({replacement: title, node: title}));
          return suggestions;
        } else {
          return [];
        }
      };
      return suggest;
    }, [dictionary.number, request]);

    const elements = parameter.elements;
    const modeSpecs = ADVANCED_WORD_MODES.map((mode) => ({value: mode, node: trans(`advancedWordSearchForm.${mode}`)}));
    const typeSpecs = WORD_TYPES.map((type) => ({value: type, node: trans(`advancedWordSearchForm.${type}`)}));
    const searchNodes = elements.map((element, index) => {
      const modeLabel = (index === 0) ? trans("advancedWordSearchForm.mode") : undefined;
      const typeLabel = (index === 0) ? trans("advancedWordSearchForm.type") : undefined;
      const titleLabel = (index === 0) ? trans("advancedWordSearchForm.title") : undefined;
      const textLabel = (index === 0) ? trans("advancedWordSearchForm.text") : undefined;
      const titleDisabled = element.mode !== "equivalent" && element.mode !== "information";
      const deleteDisabled = elements.length <= 1;
      const suggest = (titleDisabled) ? undefined : createSuggest(element.mode);
      const searchNode = (
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
    const node = (
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