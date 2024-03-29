/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, CheckableContainer, CheckableLabel, ControlContainer, GeneralIcon, Radio, useTrans} from "zographia";
import {create} from "/client/component/create";
import {Dictionary} from "/client/skeleton";
import {useChangeDictionarySecret} from "./change-dictionary-secret-form-hook";


export const ChangeDictionarySecretForm = create(
  require("../common.scss"), "ChangeDictionarySecretForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionarySecretForm");

    const {form, handleSubmit} = useChangeDictionarySecret(dictionary);
    const {register} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <div styleName="radio-group">
            <CheckableContainer>
              <Radio value="false" {...register("secret")}/>
              <CheckableLabel>{trans("label.false")}</CheckableLabel>
            </CheckableContainer>
            <CheckableContainer>
              <Radio value="true" {...register("secret")}/>
              <CheckableLabel>{trans("label.true")}</CheckableLabel>
            </CheckableContainer>
          </div>
        </ControlContainer>
        <div>
          <Button variant="light" type="submit" onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans(":commonForm.button.change")}
          </Button>
        </div>
      </form>
    );

  }
);