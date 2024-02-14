/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, GeneralIcon, Textarea, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary} from "/client-new/skeleton";
import {useChangeDictionaryExplanation} from "./change-dictionary-explanation-form-hook";


export const ChangeDictionaryExplanationForm = create(
  require("../common.scss"), "ChangeDictionaryExplanationForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionaryExplanationForm");

    const {form, handleSubmit} = useChangeDictionaryExplanation(dictionary);
    const {register} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <Textarea styleName="textarea" {...register("explanation")}/>
        </ControlContainer>
        <div>
          <Button onClick={handleSubmit} variant="light">
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans(":commonForm.button.change")}
          </Button>
        </div>
      </form>
    );

  }
);