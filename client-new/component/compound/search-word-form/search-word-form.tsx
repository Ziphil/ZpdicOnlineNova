//

import {faSearch, faShuffle} from "@fortawesome/sharp-regular-svg-icons";
import merge from "lodash-es/merge";
import {Dispatch, ReactElement, SetStateAction, useCallback} from "react";
import {DeepPartial} from "ts-essentials";
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
  Radio,
  RadioGroup,
  useTrans
} from "zographia";
import {OrderDirection, OrderDirectionSelect} from "/client-new/component/compound/order-direction-select";
import {OrderModeSelect} from "/client-new/component/compound/order-mode-select";
import {create} from "/client-new/component/create";
import {NormalWordParameter, WordModeUtil, WordOrderMode, WordParameter, WordTypeUtil} from "/client-new/skeleton";
import {preventDefault} from "/client-new/util/form";


export const SearchWordForm = create(
  require("./search-word-form.scss"), "SearchWordForm",
  function ({
    parameter,
    onParameterSet,
    ...rest
  }: {
    parameter: WordParameter,
    onParameterSet?: Dispatch<SetStateAction<WordParameter>>,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("searchWordForm");

    const actualParameter = WordParameter.toNormal(parameter);

    const handleSet = useCallback(function (parameter: DeepPartial<NormalWordParameter>): void {
      onParameterSet?.((prevParameter) => {
        const prevNormalParameter = WordParameter.toNormal(prevParameter);
        if (parameter.options?.shuffleSeed !== undefined) {
          const nextParameter = merge({}, prevNormalParameter, parameter);
          return nextParameter;
        } else {
          const nextParameter = merge({}, prevNormalParameter, parameter, {options: {shuffleSeed: null}});
          return nextParameter;
        }
      });
    }, [onParameterSet]);

    const handleTextSet = useCallback(function (text: string): void {
      handleSet({text});
    }, [handleSet]);

    const handleModeSet = useCallback(function (mode: string): void {
      handleSet({mode: WordModeUtil.cast(mode)});
    }, [handleSet]);

    const handleTypeSet = useCallback(function (type: string): void {
      handleSet({type: WordTypeUtil.cast(type)});
    }, [handleSet]);

    const handleIgnoreCaseSet = useCallback(function (ignoreCase: boolean): void {
      handleSet({options: {ignore: {case: ignoreCase}}});
    }, [handleSet]);

    const handleEnableSuggestionsSet = useCallback(function (enableSuggestions: boolean): void {
      handleSet({options: {enableSuggestions}});
    }, [handleSet]);

    const handleOrderModeSet = useCallback(function (orderMode: WordOrderMode): void {
      handleSet({order: {mode: orderMode}});
    }, [handleSet]);

    const handleOrderDirectionSet = useCallback(function (orderDirection: OrderDirection): void {
      handleSet({order: {direction: orderDirection}});
    }, [handleSet]);

    const shuffleResult = useCallback(function (): void {
      handleSet({options: {shuffleSeed: Date.now().toString()}});
    }, [handleSet]);

    const node = (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <Input
          styleName="input"
          type="search"
          value={actualParameter.text}
          onSet={handleTextSet}
        >
          <InputAddon position="left">
            <GeneralIcon styleName="icon" icon={faSearch}/>
          </InputAddon>
        </Input>
        <div styleName="radio-group">
          <RadioGroup name="mode" value={actualParameter.mode} onSet={handleModeSet}>
            {FORM_WORD_MODES.map((mode) => (
              <CheckableContainer key={mode}>
                <Radio value={mode}/>
                <CheckableLabel>{trans(`mode.${mode}`)}</CheckableLabel>
              </CheckableContainer>
            ))}
          </RadioGroup>
        </div>
        <div styleName="radio-group">
          <RadioGroup name="type" value={actualParameter.type} onSet={handleTypeSet}>
            {FORM_WORD_TYPES.map((type) => (
              <CheckableContainer key={type}>
                <Radio value={type}/>
                <CheckableLabel>{trans(`type.${type}`)}</CheckableLabel>
              </CheckableContainer>
            ))}
          </RadioGroup>
        </div>
        <div styleName="radio-group">
          <CheckableContainer>
            <Checkbox checked={actualParameter.options.ignore.case} onSet={handleIgnoreCaseSet}/>
            <CheckableLabel>{trans("ignoreCase")}</CheckableLabel>
          </CheckableContainer>
        </div>
        <div styleName="radio-group">
          <CheckableContainer>
            <Checkbox checked={actualParameter.options.enableSuggestions} onSet={handleEnableSuggestionsSet}/>
            <CheckableLabel>{trans("enableSuggestions")}</CheckableLabel>
          </CheckableContainer>
        </div>
        <div styleName="row">
          <ControlGroup>
            <OrderModeSelect
              orderModeOptions={FORM_WORD_ORDER_MODES}
              orderMode={actualParameter.order.mode}
              unicodeAlt="wordName"
              onSet={handleOrderModeSet}
            />
            <OrderDirectionSelect
              orderDirection={actualParameter.order.direction}
              onSet={handleOrderDirectionSet}
            />
          </ControlGroup>
        </div>
        <div styleName="row">
          <Button scheme="secondary" variant="underline" onClick={shuffleResult}>
            <ButtonIconbag><GeneralIcon icon={faShuffle}/></ButtonIconbag>
            {trans("shuffleResult")}
          </Button>
        </div>
      </form>
    );
    return node;

  }
);


const FORM_WORD_MODES = ["both", "name", "equivalent", "tag", "content"] as const;
const FORM_WORD_TYPES = ["prefix", "part", "exact", "regular"] as const;
const FORM_WORD_ORDER_MODES = ["unicode", "updatedDate", "createdDate"] as const;