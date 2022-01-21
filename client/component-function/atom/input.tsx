//

import * as react from "react";
import {
  ChangeEvent,
  FocusEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Dropdown from "/client/component-function/atom/dropdown";
import {
  DropdownSpec
} from "/client/component-function/atom/dropdown";
import Label from "/client/component-function/atom/label";
import Tooltip from "/client/component-function/atom/tooltip";
import {
  create
} from "/client/component-function/create";
import {
  useDebounce
} from "/client/component-function/hook";
import {
  StyleNameUtil
} from "/client/util/style-name";


const Input = create(
  require("./input.scss"), "Input",
  function ({
    value = "",
    label,
    prefix,
    suffix,
    type = "text",
    validate,
    suggest,
    showRequired,
    showOptional,
    useTooltip = true,
    readOnly = false,
    disabled = false,
    onChange,
    onSet,
    className
  }: {
    value?: string,
    label?: string,
    prefix?: ReactNode,
    suffix?: ReactNode,
    type?: "text" | "password" | "flexible",
    validate?: (value: string) => string | null,
    suggest?: Suggest,
    showRequired?: boolean,
    showOptional?: boolean,
    useTooltip?: boolean,
    readOnly?: boolean,
    disabled?: boolean,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    onSet?: (value: string) => void,
    className?: string
  }): ReactElement {

    let [currentType, setCurrentType] = useState((type === "flexible") ? "password" : type);
    let [errorMessage, setErrorMessage] = useState<string | null>(null);
    let [dropdownSpecs, setDropdownSpecs] = useState<Array<DropdownSpec<string>>>([]);

    let updateValue = useCallback(function (value: string): void {
      if (validate !== undefined) {
        let errorMessage = validate(value);
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage(null);
      }
      onSet?.(value);
    }, [validate, onSet]);

    let updateSuggestions = useDebounce(async function (value: string): Promise<void> {
      if (suggest !== undefined) {
        let suggestionSpecs = await suggest(value);
        let dropdownSpecs = suggestionSpecs.map((suggestionSpec) => ({value: suggestionSpec.replacement, node: suggestionSpec.node}));
        setDropdownSpecs(dropdownSpecs);
      }
    }, 500, [suggest, setDropdownSpecs]);

    let handleChange = useCallback(function (event: ChangeEvent<HTMLInputElement>): void {
      let value = event.target.value;
      updateValue(value);
      updateSuggestions(value);
      onChange?.(event);
    }, [onChange, updateValue, updateSuggestions]);

    let handleFocus = useCallback(function (event: FocusEvent<HTMLInputElement>): void {
      let value = event.target.value;
      updateSuggestions(value);
    }, [updateSuggestions]);

    let toggleType = useCallback(function (): void {
      if (currentType === "text") {
        setCurrentType("password");
      } else {
        setCurrentType("text");
      }
    }, [currentType, setCurrentType]);

    let node = (
      <div styleName="root" className={className}>
        <Tooltip message={errorMessage}>
          <Dropdown specs={dropdownSpecs} onSet={updateValue}>
            <label styleName="label-wrapper">
              <Label
                text={label}
                style={(errorMessage === null) ? "normal" : "error"}
                showRequired={showRequired}
                showOptional={showOptional}
              />
              <InputInput {...{value, prefix, suffix, type, currentType, readOnly, disabled, errorMessage, handleChange, handleFocus, toggleType}}/>
            </label>
          </Dropdown>
        </Tooltip>
      </div>
    );
    return node;

  }
);


const InputInput = create(
  require("./input.scss"),
  function ({
    value,
    prefix,
    suffix,
    type,
    currentType,
    readOnly,
    disabled,
    errorMessage,
    handleChange,
    handleFocus,
    toggleType
  }: {
    value: string,
    prefix?: ReactNode,
    suffix?: ReactNode,
    type: "text" | "password" | "flexible",
    currentType: "text" | "password",
    readOnly: boolean,
    disabled: boolean,
    errorMessage: string | null,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
    handleFocus: (event: FocusEvent<HTMLInputElement>) => void,
    toggleType: () => void
  }): ReactElement {

    let styleName = StyleNameUtil.create(
      "input",
      {if: errorMessage !== null, true: "error"},
      {if: disabled, true: "disabled"}
    );
    let eyeStyleName = StyleNameUtil.create("eye", currentType);
    let eyeNode = (type === "flexible") && (
      <span styleName={eyeStyleName} onClick={toggleType}/>
    );
    let prefixNode = (prefix !== undefined) && (
      <div styleName="prefix">{prefix}</div>
    );
    let suffixNode = (suffix !== undefined || type === "flexible") && (
      <div styleName="suffix">
        {suffix}
        {eyeNode}
      </div>
    );
    let node = (
      <div styleName={styleName}>
        {prefixNode}
        <input
          styleName="input-inner"
          type={currentType}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        {suffixNode}
      </div>
    );
    return node;

  }
);


export type SuggestionSpec = {replacement: string, node: ReactNode};
export type Suggest = (pattern: string) => AsyncOrSync<Array<SuggestionSpec>>;

export default Input;