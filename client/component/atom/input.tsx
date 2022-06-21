//

import * as react from "react";
import {
  ChangeEvent,
  FocusEvent,
  ReactElement,
  ReactNode,
  Ref,
  useCallback,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Dropdown from "/client/component/atom/dropdown";
import {
  DropdownSpec
} from "/client/component/atom/dropdown";
import Icon from "/client/component/atom/icon";
import Label from "/client/component/atom/label";
import Tooltip from "/client/component/atom/tooltip";
import {
  create
} from "/client/component/create";
import {
  useDebounce
} from "/client/component/hook";
import {
  DataUtil
} from "/client/util/data";


export const Input = create(
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
    className,
    nativeRef
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
    className?: string,
    nativeRef?: Ref<HTMLInputElement>
  }): ReactElement {

    const [currentType, setCurrentType] = useState((type === "flexible") ? "password" : type);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [dropdownSpecs, setDropdownSpecs] = useState<Array<DropdownSpec<string>>>([]);

    const updateValue = useCallback(function (value: string): void {
      if (validate !== undefined) {
        const errorMessage = validate(value);
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage(null);
      }
      onSet?.(value);
    }, [validate, onSet]);

    const updateSuggestions = useDebounce(async function (value: string): Promise<void> {
      if (suggest !== undefined) {
        const suggestionSpecs = await suggest(value);
        const dropdownSpecs = suggestionSpecs.map((suggestionSpec) => ({value: suggestionSpec.replacement, node: suggestionSpec.node}));
        setDropdownSpecs(dropdownSpecs);
      }
    }, 500, [suggest]);

    const handleChange = useCallback(function (event: ChangeEvent<HTMLInputElement>): void {
      const value = event.target.value;
      updateValue(value);
      updateSuggestions(value);
      onChange?.(event);
    }, [onChange, updateValue, updateSuggestions]);

    const handleFocus = useCallback(function (event: FocusEvent<HTMLInputElement>): void {
      const value = event.target.value;
      updateSuggestions(value);
    }, [updateSuggestions]);

    const toggleType = useCallback(function (): void {
      if (currentType === "text") {
        setCurrentType("password");
      } else {
        setCurrentType("text");
      }
    }, [currentType]);

    const node = (
      <div styleName="root" className={className}>
        <Tooltip message={errorMessage}>
          <Dropdown specs={dropdownSpecs} onSet={updateValue}>
            <label styleName="label-container">
              <Label
                text={label}
                variant={(errorMessage === null) ? "normal" : "error"}
                showRequired={showRequired}
                showOptional={showOptional}
              />
              <InputInput {...{value, prefix, suffix, type, currentType, readOnly, disabled, errorMessage, handleChange, handleFocus, toggleType, nativeRef}}/>
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
    toggleType,
    nativeRef
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
    toggleType: () => void,
    nativeRef?: Ref<HTMLInputElement>
  }): ReactElement {

    const data = DataUtil.create({
      error: errorMessage !== null,
      disabled
    });
    const eyeData = DataUtil.create({currentType});
    const node = (
      <div styleName="input" {...data}>
        {(prefix !== undefined) && (
          <div styleName="prefix">{prefix}</div>
        )}
        <input
          styleName="input-inner"
          type={currentType}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          ref={nativeRef}
        />
        {(suffix !== undefined || type === "flexible") && (
          <div styleName="suffix">
            {suffix}
            {(type === "flexible") && (
              <span styleName="eye" onClick={toggleType} {...eyeData}>
                <Icon name={(currentType === "password") ? "eye" : "eye-slash"}/>
              </span>
            )}
          </div>
        )}
      </div>
    );
    return node;

  }
);


export type SuggestionSpec = {replacement: string, node: ReactNode};
export type Suggest = (pattern: string) => AsyncOrSync<Array<SuggestionSpec>>;

export default Input;