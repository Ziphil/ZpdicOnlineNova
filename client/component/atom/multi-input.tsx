//

import {
  ChangeEvent,
  Dispatch,
  FocusEvent,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  Ref,
  SetStateAction,
  useCallback,
  useEffect,
  useId,
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
  deleteAt
} from "/client/util/misc";
import {
  mergeRefs
} from "/client/util/ref";


export const MultiInput = create(
  require("./multi-input.scss"), "Input",
  function ({
    values = [],
    label,
    prefix,
    suffix,
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
    values?: Array<string>,
    label?: string,
    prefix?: ReactNode,
    suffix?: ReactNode,
    validate?: Validate,
    suggest?: Suggest,
    showRequired?: boolean,
    showOptional?: boolean,
    readOnly?: boolean,
    disabled?: boolean,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    onSet?: (values: Array<string>) => void,
    className?: string,
    nativeRef?: Ref<HTMLInputElement>,
    rootRef?: Ref<HTMLDivElement>
  }): ReactElement {

    const [validationSpec, setValidationSpec] = useState<ValidationSpec | null>(null);
    const [dropdownSpecs, setDropdownSpecs] = useState<Array<DropdownSpec>>([]);
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
    const [autoElement, setAutoElement] = useState<HTMLInputElement | null>(null);
    const labelId = useId();

    const handleDropdownSet = useCallback(function (value: string): void {
      onSet?.([...values, value]);
    }, [values, onSet]);

    const node = (
      <div styleName="root" className={className} ref={rootRef}>
        <label styleName="label-container" htmlFor={labelId}>
          <Label
            text={label}
            scheme={validationSpec?.scheme ?? "primary"}
            showRequired={showRequired}
            showOptional={showOptional}
          />
          <MultiInputInput {...{values, prefix, suffix, validate, suggest, readOnly, disabled, labelId, validationSpec, setValidationSpec, setDropdownSpecs, setReferenceElement, setAutoElement, onChange, onSet, nativeRef}}/>
        </label>
        <Dropdown fillWidth={true} restrictHeight={true} autoMode="focus" referenceElement={referenceElement} autoElement={autoElement} onSet={handleDropdownSet}>
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


const MultiInputInput = create(
  require("./multi-input.scss"),
  function ({
    values,
    prefix,
    suffix,
    validate,
    suggest,
    readOnly,
    disabled,
    labelId,
    validationSpec,
    setValidationSpec,
    setDropdownSpecs,
    setReferenceElement,
    setAutoElement,
    onChange,
    onSet,
    nativeRef
  }: {
    values: Array<string>,
    prefix?: ReactNode,
    suffix?: ReactNode,
    validate?: Validate,
    suggest?: Suggest,
    readOnly: boolean,
    disabled: boolean,
    labelId: string,
    validationSpec: ValidationSpec | null,
    setValidationSpec: Dispatch<SetStateAction<ValidationSpec | null>>,
    setDropdownSpecs: Dispatch<SetStateAction<Array<DropdownSpec>>>,
    setReferenceElement: (referenceElement: HTMLDivElement | null) => void,
    setAutoElement: (autoElement: HTMLInputElement | null) => void,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
    onSet?: (values: Array<string>) => void,
    nativeRef?: Ref<HTMLInputElement>
  }): ReactElement {

    const [inputValue, setInputValue] = useState("");

    const updateValidation = useDebounce(async function (values: Array<string>): Promise<void> {
      if (validate !== undefined) {
        const validationSpec = await validate(values);
        setValidationSpec(validationSpec);
      } else {
        setValidationSpec(null);
      }
    }, 500, [validate]);

    const updateSuggestions = useDebounce(async function (value: string): Promise<void> {
      if (suggest !== undefined) {
        const suggestionSpecs = await suggest(value);
        const dropdownSpecs = suggestionSpecs.map((suggestionSpec) => ({value: suggestionSpec.replacement, node: suggestionSpec.node}));
        setDropdownSpecs(dropdownSpecs);
      }
    }, 500, [suggest]);

    const handleChange = useCallback(function (event: ChangeEvent<HTMLInputElement>): void {
      const inputValue = event.target.value;
      setInputValue(inputValue);
      updateSuggestions(inputValue);
      onChange?.(event);
    }, [onChange, setInputValue, updateSuggestions]);

    const handleFocus = useCallback(function (event: FocusEvent<HTMLInputElement>): void {
      const inputValue = event.target.value;
      updateSuggestions(inputValue);
    }, [updateSuggestions]);

    const handleBlur = useCallback(function (event: FocusEvent<HTMLInputElement>): void {
      onSet?.([...values, inputValue]);
      setInputValue("");
    }, [values, inputValue, onSet]);

    const handleKeyDown = useCallback(function (event: KeyboardEvent<HTMLInputElement>): void {
      if (event.key === "Enter") {
        if (!event.nativeEvent.isComposing) {
          event.preventDefault();
          onSet?.([...values, inputValue]);
          setInputValue("");
        }
      } else if (event.key === "Backspace") {
        const target = event.currentTarget;
        const selectionPos = (target.selectionDirection === "forward") ? target.selectionEnd : target.selectionStart;
        if (selectionPos === 0) {
          onSet?.(values.slice(0, -1));
        }
      }
    }, [values, inputValue, onSet]);

    useEffect(() => {
      updateValidation(values);
    }, [values, updateValidation]);

    const scheme = validationSpec?.scheme ?? "primary";
    const hasSuffix = suffix !== undefined || (validationSpec !== null && validationSpec.iconName !== undefined);
    const node = (
      <div styleName="input" ref={setReferenceElement} {...data({scheme, disabled})}>
        {(prefix !== undefined) && (
          <div styleName="prefix">{prefix}</div>
        )}
        <div styleName="value-list">
          {values.map((value, index) => (
            <div styleName="value" key={`${value}-${index}`}>
              {value}
              <button styleName="value-button" type="button" onClick={() => onSet?.(deleteAt([...values], index))}>
                <Icon name="times"/>
              </button>
            </div>
          ))}
          <input
            styleName="input-inner"
            id={labelId}
            value={inputValue}
            readOnly={readOnly}
            disabled={disabled}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            ref={(nativeRef !== undefined) ? mergeRefs([nativeRef, setAutoElement]) : setAutoElement}
          />
        </div>
        {(hasSuffix) && (
          <div styleName="suffix">
            {suffix}
            {(validationSpec !== null && validationSpec.iconName !== undefined) && (
              <div styleName="validation">
                <Icon name={validationSpec.iconName}/>
              </div>
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
export type Validate = (values: Array<string>) => AsyncOrSync<ValidationSpec | null>;

export type SuggestionSpec = {replacement: string, node: ReactNode};
export type Suggest = (pattern: string) => AsyncOrSync<Array<SuggestionSpec>>;

export default MultiInput;