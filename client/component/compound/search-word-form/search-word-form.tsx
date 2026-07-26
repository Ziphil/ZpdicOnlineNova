/* eslint-disable react/jsx-closing-bracket-location */

import {faMagnifyingGlassPlus, faSearch, faShuffle} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
import {Controller} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  CheckableContainer,
  CheckableLabel,
  Checkbox,
  ControlGroup,
  GeneralIcon,
  Input,
  InputAddon,
  useTrans
} from "zographia";
import {WordModeSelect} from "/client/component/atom/word-mode-select";
import {WordTypeSelect} from "/client/component/atom/word-type-select";
import {OrderDirectionSelect} from "/client/component/compound/order-direction-select";
import {OrderModeSelect} from "/client/component/compound/order-mode-select";
import {SearchWordAdvancedDialog} from "/client/component/compound/search-word-advanced-dialog";
import {create} from "/client/component/create";
import {UseFormReturn} from "/client/hook/form";
import {useSearchForm} from "/client/hook/search-form";
import {preventDefault} from "/client/util/form";
import {resolveStateAction} from "/client/util/misc";
import {
  NormalWordParameter,
  WordMode,
  WordOrderDirection,
  WordOrderMode,
  WordParameter,
  WordType
} from "/server/internal/skeleton";


export const SearchWordForm = create(
  require("./search-word-form.scss"), "SearchWordForm",
  function ({
    parameter,
    onParameterCommit,
    ...rest
  }: {
    parameter: WordParameter,
    onParameterCommit: (parameter: WordParameter) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("searchWordForm");

    const {form, commit} = useSearchForm({parameter, debouncedNames: ["text"], toFormValue, fromFormValue, onCommit: onParameterCommit, onChange: resetShuffleSeed});
    const {register, control, setValue} = form;

    const shuffle = useCallback(function (): void {
      setValue("shuffleSeed", Date.now().toString());
      commit();
    }, [setValue, commit]);

    const handleAdvancedSet = useCallback(function (action: WordParameter | ((prevParameter: WordParameter) => WordParameter)): void {
      onParameterCommit(resolveStateAction(action, parameter));
    }, [onParameterCommit, parameter]);

    return (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <Input styleName="input" type="search" {...register("text")}>
          <InputAddon position="left">
            <GeneralIcon styleName="icon" icon={faSearch}/>
          </InputAddon>
        </Input>
        <div styleName="select-group">
          <Controller name="mode" control={control} render={({field}) => (
            <WordModeSelect optionModes={FORM_WORD_MODES} kind="flexible" mode={field.value} onSet={field.onChange}/>
          )}/>
          <Controller name="type" control={control} render={({field}) => (
            <WordTypeSelect optionTypes={FORM_WORD_TYPES} kind="flexible" type={field.value} onSet={field.onChange}/>
          )}/>
        </div>
        <div styleName="row">
          <CheckableContainer>
            <Controller name="ignoreCase" control={control} render={({field}) => (
              <Checkbox checked={field.value} onSet={field.onChange}/>
            )}/>
            <CheckableLabel>{trans("label.ignoreCase")}</CheckableLabel>
          </CheckableContainer>
        </div>
        <div styleName="row">
          <ControlGroup>
            <Controller name="orderMode" control={control} render={({field}) => (
              <OrderModeSelect optionOrderModes={FORM_WORD_ORDER_MODES} unicodeAlt="wordName" orderMode={field.value} onSet={field.onChange}/>
            )}/>
            <Controller name="orderDirection" control={control} render={({field}) => (
              <OrderDirectionSelect orderDirection={field.value} onSet={field.onChange}/>
            )}/>
          </ControlGroup>
        </div>
        <div styleName="row">
          <Button scheme="secondary" variant="underline" onClick={shuffle}>
            <ButtonIconbag><GeneralIcon icon={faShuffle}/></ButtonIconbag>
            {trans("button.shuffleResult")}
          </Button>
        </div>
        <div styleName="row">
          <SearchWordAdvancedDialog parameter={parameter} onParameterSet={handleAdvancedSet} trigger={(
            <Button scheme="secondary" variant="underline">
              <ButtonIconbag><GeneralIcon icon={faMagnifyingGlassPlus}/></ButtonIconbag>
              {trans("button.advancedSearch")}
            </Button>
          )}/>
        </div>
      </form>
    );

  }
);


const FORM_WORD_MODES = ["both", "spelling", "term", "tag", "content"] as const;
const FORM_WORD_TYPES = ["prefix", "part", "exact", "regular"] as const;
const FORM_WORD_ORDER_MODES = ["unicode", "updatedDate", "createdDate"] as const;

function resetShuffleSeed(form: UseFormReturn<SearchWordFormValue>, name: string | undefined): void {
  if (name !== "shuffleSeed" && form.getValues("shuffleSeed") !== null) {
    form.setValue("shuffleSeed", null);
  }
}

function toFormValue(parameter: WordParameter): SearchWordFormValue {
  const normalParameter = WordParameter.toNormal(parameter);
  const value = {
    text: normalParameter.text,
    mode: normalParameter.mode,
    type: normalParameter.type,
    ignoreCase: normalParameter.options.ignore.case,
    orderMode: normalParameter.order.mode,
    orderDirection: normalParameter.order.direction,
    shuffleSeed: normalParameter.options.shuffleSeed,
    enableSuggestions: normalParameter.options.enableSuggestions
  } satisfies SearchWordFormValue;
  return value;
}

function fromFormValue(value: SearchWordFormValue): NormalWordParameter {
  const parameter = {
    kind: "normal",
    text: value.text,
    mode: value.mode,
    type: value.type,
    order: {mode: value.orderMode, direction: value.orderDirection},
    options: {
      ignore: {case: value.ignoreCase},
      shuffleSeed: value.shuffleSeed,
      enableSuggestions: value.enableSuggestions
    }
  } satisfies NormalWordParameter;
  return parameter;
}

type SearchWordFormValue = {
  text: string,
  mode: WordMode,
  type: WordType,
  ignoreCase: boolean,
  orderMode: WordOrderMode,
  orderDirection: WordOrderDirection,
  shuffleSeed: string | null,
  enableSuggestions: boolean
};
