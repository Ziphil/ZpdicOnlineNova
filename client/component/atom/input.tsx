//

import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  ReactElement,
  ReactNode,
  Ref,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Dropdown from "/client/component/atom/dropdown";
import DropdownItem from "/client/component/atom/dropdown-item";
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
  data
} from "/client/util/data";
import {
  mergeRefs
} from "/client/util/ref";


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
    readOnly = false,
    disabled = false,
    onChange,
    onSet,
    className,
    nativeRef,
    rootRef
  }: {
    value?: string,
    label?: string,
    prefix?: ReactNode,
    suffix?: ReactNode,
    type?: "text" | "password" | "flexible",
    validate?: Validate,
    suggest?: Suggest,
    showRequired?: boolean,
    showOptional?: boolean,
    readOnly?: boolean,
    disabled?: boolean,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    onSet?: (value: string) => void,
    className?: string,
    nativeRef?: Ref<HTMLInputElement>,
    rootRef?: Ref<HTMLDivElement>
  }): ReactElement {

    const [currentType, setCurrentType] = useState((type === "flexible") ? "password" : type);
    const [validationSpec, setValidationSpec] = useState<ValidationSpec | null>(null);
    const [dropdownSpecs, setDropdownSpecs] = useState<Array<DropdownSpec>>([]);
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
    const [autoElement, setAutoElement] = useState<HTMLInputElement | null>(null);

    const updateValue = useCallback(function (value: string): void {
      onSet?.(value);
    }, [onSet]);

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

    const validateValue = useCallback(async function (): Promise<void> {
      if (validate !== undefined) {
        const validationSpec = await validate(value);
        setValidationSpec(validationSpec);
      } else {
        setValidationSpec(null);
      }
    }, [value, validate]);

    useEffect(() => {
      validateValue();
    }, [validateValue]);

    const node = (
      <div styleName="root" className={className} ref={rootRef}>
        <label styleName="label-container">
          <Label
            text={label}
            variant={(validationSpec === null) ? "normal" : "error"}
            showRequired={showRequired}
            showOptional={showOptional}
          />
          <InputInput {...{value, prefix, suffix, type, currentType, readOnly, disabled, validationSpec, handleChange, handleFocus, setCurrentType, setReferenceElement, setAutoElement, nativeRef}}/>
        </label>
        <Dropdown fillWidth={true} restrictHeight={true} autoMode="focus" referenceElement={referenceElement} autoElement={autoElement} onSet={updateValue}>
          {dropdownSpecs.map(({value, node}) => <DropdownItem key={value} value={value}>{node}</DropdownItem>)}
        </Dropdown>
        <Tooltip showArrow={true} fillWidth={true} scheme={validationSpec?.scheme} autoMode="focus" referenceElement={referenceElement} autoElement={autoElement}>
          {validationSpec?.message}
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
    validationSpec,
    handleChange,
    handleFocus,
    setCurrentType,
    setReferenceElement,
    setAutoElement,
    nativeRef
  }: {
    value: string,
    prefix?: ReactNode,
    suffix?: ReactNode,
    type: "text" | "password" | "flexible",
    currentType: "text" | "password",
    readOnly: boolean,
    disabled: boolean,
    validationSpec: ValidationSpec | null,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
    handleFocus: (event: FocusEvent<HTMLInputElement>) => void,
    setCurrentType: Dispatch<SetStateAction<"text" | "password">>,
    setReferenceElement: (referenceElement: HTMLDivElement | null) => void,
    setAutoElement: (autoElement: HTMLInputElement | null) => void,
    nativeRef?: Ref<HTMLInputElement>
  }): ReactElement {

    const toggleType = useCallback(function (): void {
      setCurrentType((currentType) => (currentType === "text") ? "password" : "text");
    }, [setCurrentType]);

    const scheme = validationSpec?.scheme ?? "primary";
    const hasSuffix = suffix !== undefined || (validationSpec !== null && validationSpec.iconName !== undefined) || type === "flexible";
    const node = (
      <div styleName="input" ref={setReferenceElement} {...data({scheme, disabled})}>
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
          ref={(nativeRef !== undefined) ? mergeRefs([nativeRef, setAutoElement]) : setAutoElement}
        />
        {(hasSuffix) && (
          <div styleName="suffix">
            {suffix}
            {(validationSpec !== null && validationSpec.iconName !== undefined) && (
              <div styleName="validation">
                <Icon name={validationSpec.iconName}/>
              </div>
            )}
            {(type === "flexible") && (
              <button styleName="eye" type="button" onClick={toggleType} {...data({currentType})}>
                <Icon name={(currentType === "password") ? "eye" : "eye-slash"}/>
              </button>
            )}
          </div>
        )}
      </div>
    );
    return node;

  }
);


type DropdownSpec = {value: string, node: ReactNode};

export type ValidationSpec = {scheme: "primary" | "red" | "blue", iconName?: string, message: string};
export type Validate = (value: string) => AsyncOrSync<ValidationSpec | null>;

export type SuggestionSpec = {replacement: string, node: ReactNode};
export type Suggest = (pattern: string) => AsyncOrSync<Array<SuggestionSpec>>;

export default Input;