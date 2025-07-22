/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, GeneralIcon, Input, useTrans} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {Dictionary} from "/server/internal/skeleton";
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
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <Input error={!!getFieldState("name").error} {...register("name")}/>
          <ControlErrorMessage name="name" form={form} trans={trans}/>
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