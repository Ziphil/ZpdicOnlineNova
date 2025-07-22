//

import {faSearch} from "@fortawesome/sharp-regular-svg-icons";
import merge from "lodash.merge";
import {Dispatch, ReactElement, SetStateAction, useCallback} from "react";
import {DeepPartial} from "react-hook-form/dist/types/utils";
import {AdditionalProps, CheckableContainer, CheckableLabel, Checkbox, GeneralIcon, Input, InputAddon, useTrans} from "zographia";
import {ExampleModeSelect} from "/client/component/atom/example-mode-select";
import {ExampleTypeSelect} from "/client/component/atom/example-type-select";
import {create} from "/client/component/create";
import {preventDefault} from "/client/util/form";
import {ExampleModeUtil, ExampleParameter, ExampleTypeUtil, NormalExampleParameter} from "/server/internal/skeleton";


export const SearchExampleForm = create(
  require("./search-example-form.scss"), "SearchExampleForm",
  function ({
    parameter,
    onParameterSet,
    ...rest
  }: {
    parameter: ExampleParameter,
    onParameterSet?: Dispatch<SetStateAction<ExampleParameter>>,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("searchExampleForm");

    const actualParameter = ExampleParameter.toNormal(parameter);

    const handleSet = useCallback(function (parameter: DeepPartial<NormalExampleParameter>): void {
      onParameterSet?.((prevParameter) => {
        const prevNormalParameter = ExampleParameter.toNormal(prevParameter);
        const nextParameter = merge({}, prevNormalParameter, parameter, {options: {shuffleSeed: null}});
        return nextParameter;
      });
    }, [onParameterSet]);

    const handleTextSet = useCallback(function (text: string): void {
      handleSet({text});
    }, [handleSet]);

    const handleModeSet = useCallback(function (mode: string): void {
      handleSet({mode: ExampleModeUtil.cast(mode)});
    }, [handleSet]);

    const handleTypeSet = useCallback(function (type: string): void {
      handleSet({type: ExampleTypeUtil.cast(type)});
    }, [handleSet]);

    const handleIgnoreCaseSet = useCallback(function (ignoreCase: boolean): void {
      handleSet({options: {ignore: {case: ignoreCase}}});
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
          <ExampleModeSelect optionModes={FORM_EXAMPLE_MODES} kind="flexible" mode={actualParameter.mode} onSet={handleModeSet}/>
          <ExampleTypeSelect optionTypes={FORM_EXAMPLE_TYPES} kind="flexible" type={actualParameter.type} onSet={handleTypeSet}/>
        </div>
        <div styleName="row">
          <CheckableContainer>
            <Checkbox checked={actualParameter.options.ignore.case} onSet={handleIgnoreCaseSet}/>
            <CheckableLabel>{trans("label.ignoreCase")}</CheckableLabel>
          </CheckableContainer>
        </div>
      </form>
    );

  }
);


const FORM_EXAMPLE_MODES = ["both", "sentence", "translation", "tag", "content"] as const;
const FORM_EXAMPLE_TYPES = ["prefix", "part", "exact", "regular"] as const;
