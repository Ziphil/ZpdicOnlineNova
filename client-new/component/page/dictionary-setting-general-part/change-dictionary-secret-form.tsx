/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, CheckableContainer, CheckableLabel, ControlContainer, GeneralIcon, Radio, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary} from "/client-new/skeleton";
import {useChangeDictionarySecret} from "./change-dictionary-secret-form-hook";


export const ChangeDictionarySecretForm = create(
  require("./change-dictionary-name-form.scss"), "ChangeDictionarySecretForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingGeneralPart");

    const {form, handleSubmit} = useChangeDictionarySecret(dictionary);
    const {register} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <div styleName="radio-group">
            <CheckableContainer>
              <Radio value="false" {...register("secret")}/>
              <CheckableLabel>{trans("label.public")}</CheckableLabel>
            </CheckableContainer>
            <CheckableContainer>
              <Radio value="true" {...register("secret")}/>
              <CheckableLabel>{trans("label.secret")}</CheckableLabel>
            </CheckableContainer>
          </div>
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