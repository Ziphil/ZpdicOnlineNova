/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useHref} from "react-router-dom";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, GeneralIcon, Input, InputAddon, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary} from "/client-new/skeleton";
import {useChangeDictionaryParamName} from "./change-dictionary-param-name-form-hook";


export const ChangeDictionaryParamNameForm = create(
  require("./change-dictionary-name-form.scss"), "ChangeDictionaryParamNameForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingGeneralPart");

    const {form, handleSubmit} = useChangeDictionaryParamName(dictionary);
    const {register} = form;

    const prefix = location.host + useHref("/dictionary/");

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <Input styleName="input" placeholder={dictionary.number.toString()} {...register("paramName")}>
            <InputAddon styleName="prefix" position="left" hasGap={false}>{prefix}</InputAddon>
          </Input>
        </ControlContainer>
        <div>
          <Button onClick={handleSubmit} variant="light">
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans("button.change")}
          </Button>
        </div>
      </form>
    );

  }
);