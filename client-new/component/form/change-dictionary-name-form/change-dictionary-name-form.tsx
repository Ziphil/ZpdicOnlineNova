/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, GeneralIcon, Input, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary} from "/client-new/skeleton";
import {useChangeDictionaryName} from "./change-dictionary-name-form-hook";


export const ChangeDictionaryNameForm = create(
  require("../common.scss"), "ChangeDictionaryNameForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionaryNameForm");

    const {form, handleSubmit} = useChangeDictionaryName(dictionary);
    const {register} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <Input {...register("name")}/>
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