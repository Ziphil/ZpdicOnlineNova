/* eslint-disable react/jsx-closing-bracket-location */

import {faMagnifyingGlassPlus, faSearch, faShuffle} from "@fortawesome/sharp-regular-svg-icons";
import merge from "lodash.merge";
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
  useTrans
} from "zographia";
import {WordModeSelect} from "/client/component/atom/word-mode-select";
import {WordTypeSelect} from "/client/component/atom/word-type-select";
import {OrderDirection, OrderDirectionSelect} from "/client/component/compound/order-direction-select";
import {OrderModeSelect} from "/client/component/compound/order-mode-select";
import {SearchWordAdvancedDialog} from "/client/component/compound/search-word-advanced-dialog";
import {create} from "/client/component/create";
import {preventDefault} from "/client/util/form";
import {NormalWordParameter, WordModeUtil, WordOrderMode, WordParameter, WordTypeUtil} from "/server/internal/skeleton";


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
          <WordModeSelect optionModes={FORM_WORD_MODES} kind="flexible" mode={actualParameter.mode} onSet={handleModeSet}/>
          <WordTypeSelect optionTypes={FORM_WORD_TYPES} kind="flexible" type={actualParameter.type} onSet={handleTypeSet}/>
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
              optionOrderModes={FORM_WORD_ORDER_MODES}
              unicodeAlt="wordName"
              orderMode={actualParameter.order.mode}
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
        <div styleName="row">
          <SearchWordAdvancedDialog parameter={parameter} onParameterSet={onParameterSet} trigger={(
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


const FORM_WORD_MODES = ["both", "name", "equivalent", "tag", "content"] as const;
const FORM_WORD_TYPES = ["prefix", "part", "exact", "regular"] as const;
const FORM_WORD_ORDER_MODES = ["unicode", "updatedDate", "createdDate"] as const;