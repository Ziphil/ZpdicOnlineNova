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
  useResponsiveDevice,
  useTrans
} from "zographia";
import {WordModeSelect} from "/client-new/component/atom/word-mode-select";
import {WordTypeSelect} from "/client-new/component/atom/word-type-select";
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

    const device = useResponsiveDevice();

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

    return (
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
        <div styleName="select-group">
          <WordModeSelect mode={actualParameter.mode} onSet={handleModeSet} kind="flexible" optionModes={FORM_WORD_MODES}/>
          <WordTypeSelect type={actualParameter.type} onSet={handleTypeSet} kind="flexible" optionTypes={FORM_WORD_TYPES}/>
        </div>
        <div styleName="row">
          <CheckableContainer>
            <Checkbox checked={actualParameter.options.ignore.case} onSet={handleIgnoreCaseSet}/>
            <CheckableLabel>{trans("label.ignoreCase")}</CheckableLabel>
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
            {trans("button.shuffleResult")}
          </Button>
        </div>
      </form>
    );

  }
);


const FORM_WORD_MODES = ["both", "name", "equivalent", "tag", "content"] as const;
const FORM_WORD_TYPES = ["prefix", "part", "exact", "regular"] as const;
const FORM_WORD_ORDER_MODES = ["unicode", "updatedDate", "createdDate"] as const;